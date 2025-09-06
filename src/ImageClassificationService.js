const MockClassifier = require('./classifiers/MockClassifier');
const NSFWClassifier = require('./classifiers/NSFWClassifier');

/**
 * Main image classification service
 * Provides a unified interface for image classification using different classifiers
 */
class ImageClassificationService {
  constructor() {
    this.classifiers = new Map();
    this.defaultClassifier = null;
  }

  /**
   * Register a classifier
   * @param {string} name - Classifier name
   * @param {BaseClassifier} classifier - Classifier instance
   */
  registerClassifier(name, classifier) {
    this.classifiers.set(name, classifier);
    if (!this.defaultClassifier) {
      this.defaultClassifier = name;
    }
  }

  /**
   * Set the default classifier
   * @param {string} name - Classifier name
   */
  setDefaultClassifier(name) {
    if (!this.classifiers.has(name)) {
      throw new Error(`Classifier '${name}' not found`);
    }
    this.defaultClassifier = name;
  }

  /**
   * Get available classifiers
   * @returns {Array<string>} List of available classifier names
   */
  getAvailableClassifiers() {
    return Array.from(this.classifiers.keys());
  }

  /**
   * Classify an image using the specified or default classifier
   * @param {Buffer|Uint8Array} imageBuffer - The image binary data
   * @param {string} classifierName - Optional classifier name, uses default if not specified
   * @returns {Promise<{isBlocked: boolean, confidence: number, reason?: string, classifier: string}>} Classification result
   */
  async classifyImage(imageBuffer, classifierName = null) {
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
   * @returns {ImageClassificationService} Configured service instance
   */
  static createDefault() {
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

module.exports = ImageClassificationService;