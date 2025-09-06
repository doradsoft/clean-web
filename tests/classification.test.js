const { describe, it } = require('node:test');
const assert = require('node:assert');
const { ImageClassificationService, MockClassifier, NSFWClassifier } = require('../src/index');

// Create a simple mock image buffer for testing
const createMockImageBuffer = () => Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]); // JPEG header

describe('ImageClassificationService', () => {
  it('should create default service with classifiers', () => {
    const service = ImageClassificationService.createDefault();
    const classifiers = service.getAvailableClassifiers();
    
    assert.ok(classifiers.includes('mock-block'));
    assert.ok(classifiers.includes('mock-allow'));
    assert.ok(classifiers.includes('nsfw'));
  });

  it('should classify image with default classifier', async () => {
    const service = ImageClassificationService.createDefault();
    const imageBuffer = createMockImageBuffer();
    
    const result = await service.classifyImage(imageBuffer);
    
    assert.ok(typeof result.isBlocked === 'boolean');
    assert.ok(typeof result.confidence === 'number');
    assert.ok(typeof result.reason === 'string');
    assert.ok(typeof result.classifier === 'string');
  });

  it('should classify image with specific classifier', async () => {
    const service = ImageClassificationService.createDefault();
    const imageBuffer = createMockImageBuffer();
    
    const result = await service.classifyImage(imageBuffer, 'mock-block');
    
    assert.strictEqual(result.isBlocked, true);
    assert.strictEqual(result.confidence, 1.0);
    assert.strictEqual(result.classifier, 'mock-block');
  });
});

describe('MockClassifier', () => {
  it('should always block when configured to block', async () => {
    const classifier = new MockClassifier(true);
    const imageBuffer = createMockImageBuffer();
    
    const result = await classifier.classify(imageBuffer);
    
    assert.strictEqual(result.isBlocked, true);
    assert.strictEqual(result.confidence, 1.0);
    assert.ok(result.reason.includes('always block'));
  });

  it('should always allow when configured to allow', async () => {
    const classifier = new MockClassifier(false);
    const imageBuffer = createMockImageBuffer();
    
    const result = await classifier.classify(imageBuffer);
    
    assert.strictEqual(result.isBlocked, false);
    assert.strictEqual(result.confidence, 1.0);
    assert.ok(result.reason.includes('always allow'));
  });

  it('should throw error for invalid image buffer', async () => {
    const classifier = new MockClassifier(true);
    
    await assert.rejects(
      async () => await classifier.classify(null),
      { message: 'Invalid image buffer provided' }
    );
  });
});

describe('NSFWClassifier', () => {
  it('should classify image without throwing error', async () => {
    const classifier = new NSFWClassifier(0.5);
    const imageBuffer = createMockImageBuffer();
    
    const result = await classifier.classify(imageBuffer);
    
    assert.ok(typeof result.isBlocked === 'boolean');
    assert.ok(typeof result.confidence === 'number');
    assert.ok(typeof result.reason === 'string');
  });

  it('should handle different thresholds', async () => {
    const strictClassifier = new NSFWClassifier(0.1); // Lower threshold = more strict
    const lenientClassifier = new NSFWClassifier(0.9); // Higher threshold = more lenient
    const imageBuffer = createMockImageBuffer();
    
    const strictResult = await strictClassifier.classify(imageBuffer);
    const lenientResult = await lenientClassifier.classify(imageBuffer);
    
    // Both should complete successfully
    assert.ok(typeof strictResult.isBlocked === 'boolean');
    assert.ok(typeof lenientResult.isBlocked === 'boolean');
  });
});