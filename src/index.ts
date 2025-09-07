import { ImageClassificationService } from './ImageClassificationService';
import { BaseClassifier } from './classifiers/BaseClassifier';
import { MockClassifier } from './classifiers/MockClassifier';
import { NSFWClassifier } from './classifiers/NSFWClassifier';

export {
  ImageClassificationService,
  BaseClassifier,
  MockClassifier,
  NSFWClassifier
};

export * from './types';

// If running directly, show usage example
if (require.main === module) {
  console.log('Clean-Web Image Classification Service');
  console.log('=====================================');
  console.log('');
  console.log('Usage example:');
  console.log('');
  console.log('const { ImageClassificationService } = require("./dist");');
  console.log('const service = ImageClassificationService.createDefault();');
  console.log('');
  console.log('// Classify image with default classifier');
  console.log('const result = await service.classifyImage(imageBuffer);');
  console.log('console.log(result); // { isBlocked: true/false, confidence: 0-1, reason: "...", classifier: "nsfw" }');
  console.log('');
  console.log('// Use specific classifier');
  console.log('const mockResult = await service.classifyImage(imageBuffer, "mock-block");');
  console.log('');
  console.log('Available classifiers:');
  const service = ImageClassificationService.createDefault();
  service.getAvailableClassifiers().forEach(name => {
    console.log(`- ${name}`);
  });
}