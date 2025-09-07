import { ImageClassifier, ImageDetector, ImageFilter } from '@/business-logic';
import { FilterSettings, ImageElement } from '@/types';

/**
 * Main orchestrator class that coordinates all business logic components
 * This is the main entry point for the clean-web functionality
 */
export class CleanWebCore {
  private classifier: ImageClassifier;
  private detector: ImageDetector;
  private filter: ImageFilter;
  private isRunning: boolean = false;

  constructor(settings: FilterSettings) {
    this.classifier = new ImageClassifier(settings.strictMode, settings.nudityThreshold);
    this.detector = new ImageDetector();
    this.filter = new ImageFilter(settings);
  }

  /**
   * Starts the clean-web system
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    // Process existing images
    await this.processExistingImages();

    // Start observing for new images
    this.detector.startObserving(async (newImages) => {
      await this.processImages(newImages);
    });
  }

  /**
   * Starts with immediate hiding (for "hide all before processing")
   */
  async startWithImmediateHiding(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    // Immediately hide all images first
    this.filter.hideAllImages();

    // Then process existing images
    await this.processExistingImages();

    // Start observing for new images
    this.detector.startObserving(async (newImages) => {
      // Hide new images immediately, then process them
      newImages.forEach(img => {
        this.filter.applyFilter(img, { 
          nudityLevel: 10, 
          isProblematic: true, 
          confidence: 1, 
          reasons: ['Hidden before processing'] 
        });
      });
      await this.processImages(newImages);
    });
  }

  /**
   * Stops the clean-web system
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    this.detector.stopObserving();
    this.filter.clearAll();
  }

  /**
   * Processes existing images in the DOM
   */
  private async processExistingImages(): Promise<void> {
    const images = this.detector.detectImages();
    await this.processImages(images);
  }

  /**
   * Processes a set of image elements
   */
  private async processImages(images: ImageElement[]): Promise<void> {
    const processingPromises = images.map(async (imageElement) => {
      try {
        const analysis = await this.classifier.analyzeImage(imageElement.src);
        this.filter.applyFilter(imageElement, analysis);
      } catch (error) {
        console.warn('Failed to process image:', imageElement.src, error);
      }
    });

    await Promise.all(processingPromises);
  }

  /**
   * Updates the system settings
   */
  updateSettings(newSettings: Partial<FilterSettings>): void {
    this.filter.updateSettings(newSettings);
    
    if (newSettings.strictMode !== undefined) {
      this.classifier.setStrictMode(newSettings.strictMode);
    }
    
    if (newSettings.nudityThreshold !== undefined) {
      this.classifier.setNudityThreshold(newSettings.nudityThreshold);
    }
  }

  /**
   * Gets current system settings
   */
  getSettings(): FilterSettings {
    return this.filter.getSettings();
  }

  /**
   * Gets system statistics
   */
  getStats() {
    return {
      ...this.filter.getStats(),
      isRunning: this.isRunning
    };
  }

  /**
   * Manually processes all images again (useful after settings changes)
   */
  async refresh(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    await this.processExistingImages();
  }
}