# clean-web
goal is to block problematic images from rendering in html pages (mostly as chrome extension but the infrastructure is generic)
- hides all images elems (img or any other with bg image or even videos) by default
- fetches their underlying image
- classify it's level of nudity (women receives automitaclly higher nudity level, then the more part of the body are there the higher the level etc). also whther the intention of the figure is sexual it receives hight level etc.
- block / allow accordingly

## Features Implemented

### Mutation Observer for Image Detection
- ✅ Detects IMG elements and extracts src attributes
- ✅ Detects background-image CSS properties on all elements
- ✅ Processes existing images on page load
- ✅ Monitors for dynamic content changes
- ✅ Handles lazy-loaded images (data-src attributes)
- ✅ Chrome extension infrastructure

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this directory
4. The Clean Web extension should now be installed

## Testing

1. Install the extension as described above
2. Open `test.html` in your browser
3. Open the browser console (F12) to see detected images
4. Click the extension icon to see the popup with stats
5. Use the test buttons to add dynamic content and verify detection

## Files

- `manifest.json` - Chrome extension manifest
- `content.js` - Main content script with mutation observer
- `background.js` - Service worker for Chrome extension
- `popup.html` & `popup.js` - Extension popup UI
- `test.html` - Test page for debugging the image detection

## How it Works

The `ImageDetector` class in `content.js`:
1. Scans existing images when the page loads
2. Uses MutationObserver to detect new/changed content
3. Extracts image URLs from both img elements and CSS background-image properties
4. Logs detected images and marks elements for future processing
5. Provides stats through the extension popup
