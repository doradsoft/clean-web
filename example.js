const { ImageClassificationService } = require('./src/index');

/**
 * Example demonstrating how to use the image classification service
 */
async function demonstrateClassification() {
  console.log('🖼️  Clean-Web Image Classification Demo');
  console.log('=====================================\n');

  // Create service with default classifiers
  const service = ImageClassificationService.createDefault();
  
  // Create mock image data for demonstration
  const mockImageBuffer = Buffer.from([
    0xFF, 0xD8, 0xFF, 0xE0, // JPEG header
    0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, // JFIF marker
    ...Array(100).fill(0x42) // Some mock image data
  ]);

  console.log('📋 Available classifiers:', service.getAvailableClassifiers().join(', '));
  console.log('🎯 Default classifier: nsfw\n');

  try {
    // Test with mock-block classifier
    console.log('🔴 Testing mock-block classifier:');
    const blockResult = await service.classifyImage(mockImageBuffer, 'mock-block');
    console.log(`   Result: ${blockResult.isBlocked ? '❌ BLOCKED' : '✅ ALLOWED'}`);
    console.log(`   Confidence: ${blockResult.confidence}`);
    console.log(`   Reason: ${blockResult.reason}`);
    console.log(`   Classifier: ${blockResult.classifier}\n`);

    // Test with mock-allow classifier
    console.log('🟢 Testing mock-allow classifier:');
    const allowResult = await service.classifyImage(mockImageBuffer, 'mock-allow');
    console.log(`   Result: ${allowResult.isBlocked ? '❌ BLOCKED' : '✅ ALLOWED'}`);
    console.log(`   Confidence: ${allowResult.confidence}`);
    console.log(`   Reason: ${allowResult.reason}`);
    console.log(`   Classifier: ${allowResult.classifier}\n`);

    // Test with NSFW classifier (default)
    console.log('🤖 Testing NSFW classifier (default):');
    const nsfwResult = await service.classifyImage(mockImageBuffer);
    console.log(`   Result: ${nsfwResult.isBlocked ? '❌ BLOCKED' : '✅ ALLOWED'}`);
    console.log(`   Confidence: ${nsfwResult.confidence}`);
    console.log(`   Reason: ${nsfwResult.reason}`);
    console.log(`   Classifier: ${nsfwResult.classifier}\n`);

    console.log('✨ All classifiers working correctly!');

  } catch (error) {
    console.error('❌ Error during classification:', error.message);
  }
}

// Run the demo
if (require.main === module) {
  demonstrateClassification().catch(console.error);
}

module.exports = { demonstrateClassification };