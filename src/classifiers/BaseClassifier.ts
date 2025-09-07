import { ClassificationResult, ImageBuffer } from '../types';

/**
 * Base classifier interface for image classification
 * All classifiers should extend this class
 */
export abstract class BaseClassifier {
  /**
   * Classify an image binary
   * @param imageBuffer - The image binary data
   * @returns Classification result
   */
  abstract classify(imageBuffer: ImageBuffer): Promise<ClassificationResult>;

  /**
   * Get classifier name/type
   * @returns The classifier name
   */
  abstract getName(): string;
}