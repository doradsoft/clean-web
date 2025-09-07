import { BaseClassifier } from './classifiers/BaseClassifier';
import { MockClassifier } from './classifiers/MockClassifier';
import { NSFWClassifier } from './classifiers/NSFWClassifier';
import { ExtendedClassificationResult, ImageBuffer } from './types';

/**
 * Main image classification service
 * Provides a unified interface for image classification using different classifiers
 */
export class ImageClassificationService {
  private classifiers: Map<string, BaseClassifier> = new Map();
  private defaultClassifier: string | null = null;

  /**
   * Register a classifier
   * @param name - Classifier name
   * @param classifier - Classifier instance
   */
  registerClassifier(name: string, classifier: BaseClassifier): void {
    this.classifiers.set(name, classifier);
    if (!this.defaultClassifier) {
      this.defaultClassifier = name;
    }
  }

  /**
   * Set the default classifier
   * @param name - Classifier name
   */
  setDefaultClassifier(name: string): void {
    if (!this.classifiers.has(name)) {
      throw new Error(`Classifier '${name}' not found`);
    }
    this.defaultClassifier = name;
  }

  /**
   * Get available classifiers
   * @returns List of available classifier names
   */
  getAvailableClassifiers(): string[] {
    return Array.from(this.classifiers.keys());
  }

  /**
   * Classify an image using the specified or default classifier
   * @param imageBuffer - The image binary data
   * @param classifierName - Optional classifier name, uses default if not specified
   * @returns Classification result
   */
  async classifyImage(imageBuffer: ImageBuffer, classifierName?: string): Promise<ExtendedClassificationResult> {
    const name = classifierName || this.defaultClassifier;
    
    if (!name) {
      throw new Error('No classifier specified and no default classifier set');
    }

    const classifier = this.classifiers.get(name);
    if (!classifier) {
      throw new Error(`Classifier '${name}' not found`);
    }

    const result = await classifier.classify(imageBuffer);
    return {
      ...result,
      classifier: name
    };
  }

  /**
   * Create a pre-configured service with common classifiers
   * @returns Configured service instance
   */
  static createDefault(): ImageClassificationService {
    const service = new ImageClassificationService();
    
    // Register mock classifiers
    service.registerClassifier('mock-block', new MockClassifier(true));
    service.registerClassifier('mock-allow', new MockClassifier(false));
    
    // Register NSFW classifier
    service.registerClassifier('nsfw', new NSFWClassifier(0.5));
    
    // Set NSFW as default
    service.setDefaultClassifier('nsfw');
    
    return service;
  }
}