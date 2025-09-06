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

### Loading the Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `dist/` directory
