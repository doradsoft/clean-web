import { BaseClassifier } from './BaseClassifier';
import { ClassificationResult, ImageBuffer } from '../types';

/**
 * Mock classifier for testing purposes
 * Can be configured to always block or always allow
 */
export class MockClassifier extends BaseClassifier {
  private alwaysBlock: boolean;

  /**
   * Create a mock classifier
   * @param alwaysBlock - If true, always blocks images. If false, always allows.
   */
  constructor(alwaysBlock: boolean = true) {
    super();
    this.alwaysBlock = alwaysBlock;
  }

  /**
   * Classify an image (mock implementation)
   * @param imageBuffer - The image binary data
   * @returns Classification result
   */
  async classify(imageBuffer: ImageBuffer): Promise<ClassificationResult> {
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
   * @returns The classifier name
   */
  getName(): string {
    return `MockClassifier(alwaysBlock=${this.alwaysBlock})`;
  }
}