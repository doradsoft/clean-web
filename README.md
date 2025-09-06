# clean-web
goal is to block problematic images from rendering in html pages (mostly as chrome extension but the infrastructure is generic)
- hides all images elems (img or any other with bg image or even videos) by default
- fetches their underlying image
- classify it's level of nudity (women receives automitaclly higher nudity level, then the more part of the body are there the higher the level etc). also whther the intention of the figure is sexual it receives hight level etc.
- block / allow accordingly

## Development

### Project Structure
```
src/
├── manifest.json       # Chrome extension manifest
├── background.js       # Service worker script
├── content.js         # Content script (runs on web pages)
├── popup.html         # Extension popup UI
└── popup.js           # Popup logic
```

### Build System
The project uses a custom build script that processes the source files and creates Chrome extension-compatible IIFE (Immediately Invoked Function Expression) format:

- `background.js` and `popup.js` are wrapped in IIFE for extension compatibility
- `content.js` is already written as IIFE
- Static files (`manifest.json`, `popup.html`) are copied as-is

### Building
```bash
npm install
npm run build
```

The built extension will be in the `dist/` directory, ready to load in Chrome's developer mode.

### Testing & Validation
```bash
npm test          # Build and validate extension
npm run validate  # Validate existing build
```

### Loading the Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `dist/` directory
4. Test with `test-page.html` to see the image blocking in action

### Features Implemented
- **Image Hiding**: Automatically hides all `<img>` elements and elements with background images
- **Mutation Observer**: Watches for dynamically added images
- **Settings UI**: Popup interface for configuring nudity threshold and behavior
- **Chrome Extension Manifest V3**: Uses latest extension format with service worker
- **IIFE Format**: All scripts properly wrapped for Chrome extension compatibility

### Future Enhancements
- Integrate with AI service for actual image classification
- Add whitelist/blacklist functionality
- Implement user feedback system for classification accuracy
- Add keyboard shortcuts for quick enable/disable
