# Clean Web

Block problematic images from rendering in web pages (Chrome extension and generic web infrastructure)

- Hides all images elements (img or any other with bg image or even videos) by default
- Fetches their underlying image
- Classify its level of nudity using real machine learning models 
- Block / allow accordingly

## Real NSFW Detection with TensorFlow.js

This repository now includes a **real machine learning-powered** image classification system with:

- **Real NSFW Detection** using TensorFlow.js and nsfwjs libraries
- **TypeScript Architecture** with full type safety and modern development experience  
- **Business Logic Separation** organized in clean, testable modules
- **React-based UI** for configuration and monitoring
- **Chrome Extension Ready** build system and structure

### Key Features

- **Real ML Classification**: Uses TensorFlow.js (@tensorflow/tfjs ^4.22.0) and nsfwjs (^4.2.1) for actual content analysis
- **Smart Confidence Scoring**: Weighted classification categories (Porn: 1.0, Hentai: 0.9, Sexy: 0.6, etc.)
- **Graceful Error Handling**: Falls back to URL pattern analysis if ML model fails
- **Memory Management**: Proper TensorFlow tensor cleanup to prevent memory leaks
- **Configurable Thresholds**: Adjustable nudity detection sensitivity (0-10 scale)
- **Allow/Block Lists**: URL pattern-based overrides for trusted/blocked domains

### Quick Start

```bash
npm install
npm run build
```

### Architecture

```
src/
├── business-logic/          # Core classification and filtering logic
│   ├── ImageClassifier.ts   # Real TensorFlow.js + nsfwjs implementation
│   ├── ImageDetector.ts     # DOM image element detection
│   ├── ImageFilter.ts       # Image hiding/showing logic
│   └── CleanWebCore.ts      # Main orchestration class
├── components/              # React UI components
├── types/                   # TypeScript type definitions
└── main.tsx                # Application entry point
```

### Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:extension` - Build Chrome extension
- `npm test` - Validate extension build

### Real NSFW Classification

The system uses actual machine learning models for content detection:

```typescript
import { ImageClassifier } from '@/business-logic';

const classifier = new ImageClassifier(false, 5); // strictMode=false, threshold=5
const analysis = await classifier.analyzeImage('https://example.com/image.jpg');

console.log(analysis);
// {
//   nudityLevel: 2,           // 0-10 scale
//   isProblematic: false,     // threshold comparison result  
//   confidence: 0.23,         // ML model confidence
//   reasons: ['Neutral: 77.0%', 'Drawing: 23.0%']
// }
```
