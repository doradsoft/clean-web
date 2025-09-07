# clean-web
goal is to block problematic images from rendering in html pages (mostly as chrome extension but the infrastructure is generic)
- hides all images elems (img or any other with bg image or even videos) by default
- fetches their underlying image
- classify it's level of nudity (women receives automitaclly higher nudity level, then the more part of the body are there the higher the level etc). also whther the intention of the figure is sexual it receives hight level etc.
- block / allow accordingly

## Image Classification Feature

This repository now includes a **TypeScript-based** generic image classification system with:
- **Type-safe architecture** with full TypeScript support
- **Mock classifiers** for testing (always block/allow)
- **NSFW classifier** for real content detection  
- **Extensible architecture** for adding custom classifiers

### Quick Start
```typescript
import { ImageClassificationService } from './dist';
const service = ImageClassificationService.createDefault();
const result = await service.classifyImage(imageBuffer);
```

### Development
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode for development
- `npm test` - Run tests
- `npm start` - Build and run the demo

### Documentation
- [Full API Documentation](docs/image-classification.md)
- Run `node dist/example.js` for a live demonstration
- All TypeScript definitions included for IDE support
