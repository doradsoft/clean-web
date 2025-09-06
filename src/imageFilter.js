/**
 * ImageFilter - Core module for the clean-web extension
 * Handles image detection, classification, and filtering
 */

class ImageFilter {
  constructor() {
    this.blockedImages = new Set();
    this.allowedImages = new Set();
  }

  /**
   * Check if an image should be blocked based on its src
   * @param {string} imageSrc - The image source URL
   * @returns {boolean} - True if image should be blocked
   */
  shouldBlockImage(imageSrc) {
    if (!imageSrc || typeof imageSrc !== 'string') {
      return false;
    }

    // Simple demonstration logic - can be extended with ML classification
    if (this.blockedImages.has(imageSrc)) {
      return true;
    }

    if (this.allowedImages.has(imageSrc)) {
      return false;
    }

    // Default behavior - for demo purposes
    return false;
  }

  /**
   * Add an image to the blocked list
   * @param {string} imageSrc - The image source URL to block
   */
  blockImage(imageSrc) {
    if (imageSrc && typeof imageSrc === 'string') {
      this.blockedImages.add(imageSrc);
      this.allowedImages.delete(imageSrc);
    }
  }

  /**
   * Add an image to the allowed list
   * @param {string} imageSrc - The image source URL to allow
   */
  allowImage(imageSrc) {
    if (imageSrc && typeof imageSrc === 'string') {
      this.allowedImages.add(imageSrc);
      this.blockedImages.delete(imageSrc);
    }
  }

  /**
   * Get statistics about filtered images
   * @returns {Object} - Statistics object
   */
  getStats() {
    return {
      blocked: this.blockedImages.size,
      allowed: this.allowedImages.size,
      total: this.blockedImages.size + this.allowedImages.size
    };
  }

  /**
   * Reset all filters
   */
  reset() {
    this.blockedImages.clear();
    this.allowedImages.clear();
  }
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ImageFilter };
} else if (typeof window !== 'undefined') {
  window.ImageFilter = ImageFilter;
}