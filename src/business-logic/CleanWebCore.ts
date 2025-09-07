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
    console.log('CleanWebCore: Starting...');

    // Process existing images
    await this.processExistingImages();

    // Start observing for new images
    this.detector.startObserving(async (newImages) => {
      await this.processImages(newImages);
    });

    console.log('CleanWebCore: Started successfully');
  }

  /**
   * Stops the clean-web system
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    console.log('CleanWebCore: Stopping...');
    this.isRunning = false;
    this.detector.stopObserving();
    this.filter.clearAll();
    console.log('CleanWebCore: Stopped');
  }

  /**
   * Processes existing images in the DOM
   */
  private async processExistingImages(): Promise<void> {
    const images = this.detector.detectImages();
    console.log(`CleanWebCore: Found ${images.length} existing images`);
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
      ...this.detector.getStats(),
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

  /**
   * Add visual indicators to detected images (for debugging)
   */
  addVisualIndicators(): void {
    this.detector.addVisualIndicators();
  }
}