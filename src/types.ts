/**
 * Classification result interface
 */
export interface ClassificationResult {
  isBlocked: boolean;
  confidence: number;
  reason?: string;
}

/**
 * Extended classification result with classifier information
 */
export interface ExtendedClassificationResult extends ClassificationResult {
  classifier: string;
}

/**
 * Image buffer type - can be Buffer or Uint8Array
 */
export type ImageBuffer = Buffer | Uint8Array;