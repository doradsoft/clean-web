# Image Classification Feature

This module provides a **TypeScript-based** generic image classification system for the clean-web project, designed to classify images and determine whether they should be blocked or allowed.

## Features

- **Type-Safe Architecture**: Full TypeScript support with interfaces and type definitions
- **Generic Interface**: Extensible base classifier that can be implemented for different classification algorithms
- **Mock Classifiers**: Testing utilities that always block or always allow images
- **NSFW Classifier**: Real classifier for detecting inappropriate content
- **Service Layer**: Unified interface for managing and using multiple classifiers

## Quick Start

```typescript
import { ImageClassificationService } from './dist';

// Create service with default classifiers
const service = ImageClassificationService.createDefault();

// Classify an image (returns Promise)
const result = await service.classifyImage(imageBuffer);
console.log(result);
// Output: { 
//   isBlocked: true/false, 
//   confidence: 0.85, 
//   reason: "NSFW content detected...",
//   classifier: "nsfw" 
// }
```

## Available Classifiers

### MockClassifier
Perfect for testing and development:
- `mock-block`: Always blocks images (useful for testing block behavior)
- `mock-allow`: Always allows images (useful for testing allow behavior)

### NSFWClassifier
Real classifier for inappropriate content detection:
- Uses configurable threshold (default: 0.5)
- Returns confidence score based on NSFW detection
- Gracefully handles errors by defaulting to allow

## API Reference

### ImageClassificationService

Main service class that manages classifiers.

#### Methods

- `createDefault()` - Creates pre-configured service with all classifiers
- `registerClassifier(name, classifier)` - Register a new classifier
- `classifyImage(imageBuffer, classifierName?)` - Classify image with specified or default classifier
- `getAvailableClassifiers()` - Get list of registered classifier names
- `setDefaultClassifier(name)` - Set the default classifier

### BaseClassifier

Abstract base class for all classifiers.

#### Methods to implement:
- `classify(imageBuffer)` - Classify image and return result
- `getName()` - Return classifier name

#### Classification Result Format:
```typescript
interface ClassificationResult {
  isBlocked: boolean;    // Whether image should be blocked
  confidence: number;    // Confidence score (0-1)
  reason?: string;       // Optional explanation
}

interface ExtendedClassificationResult extends ClassificationResult {
  classifier: string;    // Name of classifier used
}
```

## Usage Examples

### Basic Usage
```typescript
import { ImageClassificationService } from './dist';

const service = ImageClassificationService.createDefault();
const result = await service.classifyImage(imageBuffer);
if (result.isBlocked) {
  console.log('Image blocked:', result.reason);
}
```

### Using Specific Classifier
```typescript
// Use mock classifier for testing
const mockResult = await service.classifyImage(imageBuffer, 'mock-block');

// Use NSFW classifier explicitly
const nsfwResult = await service.classifyImage(imageBuffer, 'nsfw');
```

### Custom Classifier
```typescript
import { BaseClassifier, ClassificationResult, ImageBuffer } from './dist';

class CustomClassifier extends BaseClassifier {
  async classify(imageBuffer: ImageBuffer): Promise<ClassificationResult> {
    // Your classification logic here
    return {
      isBlocked: false,
      confidence: 0.1,
      reason: 'Custom classification result'
    };
  }
  
  getName(): string {
    return 'custom';
  }
}

service.registerClassifier('custom', new CustomClassifier());
```

## Development

Build the project:
```bash
npm run build     # Build TypeScript to JavaScript
npm run dev       # Watch mode for development
```

## Testing

Run the test suite:
```bash
npm test
```

Run the example demonstration:
```bash
node dist/example.js
```

## Integration Notes

This classification system is designed to integrate with:
- Chrome extension content scripts
- Web service APIs
- Image processing pipelines
- Browser-based applications

The binary image data can come from:
- Fetch API responses
- File inputs
- Canvas image data
- Blob/ArrayBuffer sources

## Architecture

```
ImageClassificationService
├── MockClassifier (always block/allow)
├── NSFWClassifier (real NSFW detection)
└── BaseClassifier (extensible interface)
```

The service acts as a registry and facade, allowing easy switching between different classification strategies while maintaining a consistent API.

## TypeScript Support

The library includes:
- Full type definitions (.d.ts files)
- Source maps for debugging
- Strict type checking
- Generic interfaces for extensibility