/**
 * Base classifier interface for image classification
 * All classifiers should extend this class
 */
class BaseClassifier {
  /**
   * Classify an image binary
   * @param {Buffer|Uint8Array} imageBuffer - The image binary data
   * @returns {Promise<{isBlocked: boolean, confidence: number, reason?: string}>} Classification result
   */
  async classify(imageBuffer) {
    throw new Error('classify method must be implemented by subclass');
  }

  /**
   * Get classifier name/type
   * @returns {string} The classifier name
   */
  getName() {
    throw new Error('getName method must be implemented by subclass');
  }
}

module.exports = BaseClassifier;