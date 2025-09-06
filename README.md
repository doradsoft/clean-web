# clean-web
goal is to block problematic images from rendering in html pages (mostly as chrome extension but the infrastructure is generic)
- hides all images elems (img or any other with bg image or even videos) by default
- fetches their underlying image
- classify it's level of nudity (women receives automitaclly higher nudity level, then the more part of the body are there the higher the level etc). also whther the intention of the figure is sexual it receives hight level etc.
- block / allow accordingly

## Image Classification Feature

This repository now includes a generic image classification system with:
- **Mock classifiers** for testing (always block/allow)
- **NSFW classifier** for real content detection
- **Extensible architecture** for adding custom classifiers

### Quick Start
```javascript
const { ImageClassificationService } = require('./src');
const service = ImageClassificationService.createDefault();
const result = await service.classifyImage(imageBuffer);
```

### Documentation
- [Full API Documentation](docs/image-classification.md)
- Run `node example.js` for a live demonstration
- Run `npm test` to validate functionality
