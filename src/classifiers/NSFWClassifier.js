const BaseClassifier = require('./BaseClassifier');

/**
 * NSFW-based classifier using nsfwjs library
 * Classifies images for inappropriate content
 */
class NSFWClassifier extends BaseClassifier {
  /**
   * Create NSFW classifier
   * @param {number} threshold - Threshold for blocking (0-1, default 0.5)
   */
  constructor(threshold = 0.5) {
    super();
    this.threshold = threshold;
    this.nsfwModel = null;
  }

  /**
   * Initialize the NSFW model (lazy loading)
   */
  async initModel() {
    if (this.nsfwModel) return;
    
    try {
      // Note: nsfwjs requires browser environment or tfjs-node for server-side
      // For now, this is a placeholder implementation
      // In a real implementation, you'd load the actual model here
      this.nsfwModel = {
        classify: async (imageBuffer) => {
          // Mock implementation for demonstration
          // In real scenario, this would use actual NSFW detection
          return [
            { className: 'Neutral', probability: 0.7 },
            { className: 'Porn', probability: 0.2 },
            { className: 'Sexy', probability: 0.1 }
          ];
        }
      };
    } catch (error) {
      console.warn('NSFW model initialization failed, using mock classification:', error.message);
      this.nsfwModel = null;
    }
  }

  /**
   * Classify an image using NSFW detection
   * @param {Buffer|Uint8Array} imageBuffer - The image binary data
   * @returns {Promise<{isBlocked: boolean, confidence: number, reason?: string}>} Classification result
   */
  async classify(imageBuffer) {
    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error('Invalid image buffer provided');
    }

    await this.initModel();

    try {
      if (!this.nsfwModel) {
        // Fallback if model couldn't be loaded
        return {
          isBlocked: false,
          confidence: 0.0,
          reason: 'NSFW model not available, defaulting to allow'
        };
      }

      const predictions = await this.nsfwModel.classify(imageBuffer);
      
      // Calculate NSFW score (sum of non-neutral probabilities)
      const nsfwScore = predictions
        .filter(p => p.className !== 'Neutral')
        .reduce((sum, p) => sum + p.probability, 0);

      const isBlocked = nsfwScore > this.threshold;
      
      return {
        isBlocked,
        confidence: nsfwScore,
        reason: isBlocked 
          ? `NSFW content detected (score: ${nsfwScore.toFixed(3)} > ${this.threshold})` 
          : `Content appears safe (score: ${nsfwScore.toFixed(3)} <= ${this.threshold})`
      };
    } catch (error) {
      console.error('NSFW classification error:', error);
      // Default to allowing on error to avoid false positives
      return {
        isBlocked: false,
        confidence: 0.0,
        reason: `Classification error: ${error.message}`
      };
    }
  }

  /**
   * Get classifier name
   * @returns {string} The classifier name
   */
  getName() {
    return `NSFWClassifier(threshold=${this.threshold})`;
  }
}

module.exports = NSFWClassifier;