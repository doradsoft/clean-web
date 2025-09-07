import * as tf from '@tensorflow/tfjs';
import * as nsfwjs from 'nsfwjs';
import { ImageAnalysis, ImageBuffer } from '@/types';

/**
 * Core business logic for image analysis and classification
 * This module handles the classification of images for nudity/inappropriate content using TensorFlow.js and NSFWJS
 */
export class ImageClassifier {
  private strictMode: boolean;
  private nudityThreshold: number;
  private nsfwModel: nsfwjs.NSFWJS | null = null;
  private modelLoading: Promise<void> | null = null;

  constructor(strictMode: boolean = false, nudityThreshold: number = 5) {
    this.strictMode = strictMode;
    this.nudityThreshold = nudityThreshold;
  }

  /**
   * Initialize the NSFW model (lazy loading)
   */
  private async initModel(): Promise<void> {
    if (this.nsfwModel) return;
    
    if (this.modelLoading) {
      await this.modelLoading;
      return;
    }

    this.modelLoading = this.loadModel();
    await this.modelLoading;
  }

  private async loadModel(): Promise<void> {
    try {
      console.log('Loading NSFWJS model...');
      this.nsfwModel = await nsfwjs.load();
      console.log('NSFWJS model loaded successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn('NSFW model initialization failed:', errorMessage);
      this.nsfwModel = null;
      throw error;
    }
  }

  /**
   * Analyzes an image and returns classification results
   * Uses TensorFlow.js and NSFWJS for real image analysis
   */
  async analyzeImage(imageSrc: string): Promise<ImageAnalysis>;
  async analyzeImage(imageBuffer: ImageBuffer): Promise<ImageAnalysis>;
  async analyzeImage(input: string | ImageBuffer): Promise<ImageAnalysis> {
    const analysis: ImageAnalysis = {
      nudityLevel: 0,
      isProblematic: false,
      confidence: 0.5,
      reasons: []
    };

    try {
      await this.initModel();

      if (!this.nsfwModel) {
        // Fallback analysis based on URL patterns if model isn't available
        if (typeof input === 'string') {
          return this.analyzeByUrl(input);
        } else {
          analysis.reasons = ['NSFW model not available, using fallback analysis'];
          return analysis;
        }
      }

      let imageElement: HTMLImageElement | tf.Tensor3D;

      if (typeof input === 'string') {
        // Load image from URL
        imageElement = await this.loadImageFromUrl(input);
      } else {
        // Convert buffer to tensor
        imageElement = await this.bufferToTensor(input);
      }

      // Classify the image
      const predictions = await this.nsfwModel.classify(imageElement);
      
      // Calculate NSFW score based on predictions
      const nsfwScore = this.calculateNSFWScore(predictions);
      
      // Convert 0-1 confidence to 0-10 nudity level
      analysis.nudityLevel = Math.round(nsfwScore * 10);
      analysis.confidence = nsfwScore;
      
      // Add reasons based on predictions
      const significantPredictions = predictions.filter(p => p.probability > 0.1);
      analysis.reasons = significantPredictions.map(p => 
        `${p.className}: ${(p.probability * 100).toFixed(1)}%`
      );

      // Apply strict mode adjustments
      if (this.strictMode) {
        analysis.nudityLevel = Math.min(10, analysis.nudityLevel + 2);
      }

      analysis.isProblematic = analysis.nudityLevel >= this.nudityThreshold;

      // Clean up tensors to prevent memory leaks
      if (imageElement instanceof tf.Tensor) {
        imageElement.dispose();
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Image analysis error:', error);
      analysis.reasons = [`Analysis error: ${errorMessage}`];
      
      // Fallback to URL analysis if available
      if (typeof input === 'string') {
        return this.analyzeByUrl(input);
      }
    }

    return analysis;
  }

  /**
   * Fallback analysis based on URL patterns
   */
  private analyzeByUrl(imageSrc: string): ImageAnalysis {
    const analysis: ImageAnalysis = {
      nudityLevel: 0,
      isProblematic: false,
      confidence: 0.5,
      reasons: []
    };

    // Simplified heuristic analysis based on URL patterns
    const suspiciousPatterns = [
      /adult/i,
      /nude/i,
      /nsfw/i,
      /explicit/i,
      /porn/i
    ];

    const foundPatterns = suspiciousPatterns.filter(pattern => pattern.test(imageSrc));
    
    if (foundPatterns.length > 0) {
      analysis.nudityLevel = Math.min(10, foundPatterns.length * 3);
      analysis.confidence = 0.7;
      analysis.reasons = ['Suspicious URL pattern detected'];
    }

    // Apply strict mode adjustments
    if (this.strictMode) {
      analysis.nudityLevel = Math.min(10, analysis.nudityLevel + 2);
    }

    analysis.isProblematic = analysis.nudityLevel >= this.nudityThreshold;

    return analysis;
  }

  /**
   * Load image from URL into HTMLImageElement
   */
  private async loadImageFromUrl(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(new Error(`Failed to load image from ${url}: ${err}`));
      img.src = url;
    });
  }

  /**
   * Convert image buffer to TensorFlow tensor
   */
  private async bufferToTensor(_buffer: ImageBuffer): Promise<tf.Tensor3D> {
    // This is a placeholder - in real implementation you'd need to decode
    // the image buffer (JPEG/PNG) into RGB values
    // For now, we'll throw an error to indicate this needs proper implementation
    throw new Error('Buffer to tensor conversion not implemented - please use URL-based analysis');
  }

  /**
   * Calculate NSFW score from predictions
   */
  private calculateNSFWScore(predictions: nsfwjs.PredictionType[]): number {
    // Weight different categories
    const weights = {
      'Porn': 1.0,
      'Hentai': 0.9,
      'Sexy': 0.6,
      'Drawing': 0.3,
      'Neutral': 0.0
    };

    let totalScore = 0;
    for (const prediction of predictions) {
      const weight = weights[prediction.className as keyof typeof weights] ?? 0.5;
      totalScore += prediction.probability * weight;
    }

    return Math.min(1.0, totalScore);
  }

  /**
   * Updates the nudity threshold
   */
  setNudityThreshold(threshold: number): void {
    this.nudityThreshold = Math.max(0, Math.min(10, threshold));
  }

  /**
   * Toggles strict mode
   */
  setStrictMode(enabled: boolean): void {
    this.strictMode = enabled;
  }

  /**
   * Dispose of the model and free up resources
   */
  dispose(): void {
    if (this.nsfwModel) {
      // Note: nsfwjs doesn't expose a dispose method, but TensorFlow models are garbage collected
      this.nsfwModel = null;
    }
  }
}