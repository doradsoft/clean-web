const BaseClassifier = require('./BaseClassifier');

/**
 * Mock classifier for testing purposes
 * Can be configured to always block or always allow
 */
class MockClassifier extends BaseClassifier {
  /**
   * Create a mock classifier
   * @param {boolean} alwaysBlock - If true, always blocks images. If false, always allows.
   */
  constructor(alwaysBlock = true) {
    super();
    this.alwaysBlock = alwaysBlock;
  }

  /**
   * Classify an image (mock implementation)
   * @param {Buffer|Uint8Array} imageBuffer - The image binary data
   * @returns {Promise<{isBlocked: boolean, confidence: number, reason?: string}>} Classification result
   */
  async classify(imageBuffer) {
    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error('Invalid image buffer provided');
    }

    return {
      isBlocked: this.alwaysBlock,
      confidence: 1.0,
      reason: this.alwaysBlock ? 'Mock classifier configured to always block' : 'Mock classifier configured to always allow'
    };
  }

  /**
   * Get classifier name
   * @returns {string} The classifier name
   */
  getName() {
    return `MockClassifier(alwaysBlock=${this.alwaysBlock})`;
  }
}

module.exports = MockClassifier;