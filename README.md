# clean-web

A Chrome extension to block problematic images from rendering in HTML pages by hiding them before processing.

## Overview

The goal is to create a content filtering system that:
- Hides all image elements (img, background images, videos) by default **before processing**
- Fetches their underlying images for classification
- Classifies content levels (future feature)
- Blocks/allows content accordingly (future feature)

## Current Implementation

This version implements the **"hide all before processing"** functionality:

✅ **Implemented Features:**
- Immediately hides all `<img>` elements on page load
- Hides all `<video>` elements 
- Hides elements with CSS background images
- Monitors for dynamically added content and hides new images
- Provides popup interface to monitor hidden elements count
- Debug functionality to restore all hidden images

## Installation

1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the project directory
5. The extension will be active on all web pages

## Testing

Open `test.html` in your browser to test the image hiding functionality. The extension should immediately hide all images, videos, and background images on the page.

## Files Structure

- `manifest.json` - Chrome extension manifest
- `content.js` - Content script that hides images
- `content.css` - CSS styles for hiding elements  
- `popup.html` - Extension popup interface
- `popup.js` - Popup functionality
- `test.html` - Test page with various image types

## Future Development

- Image classification system
- Nudity/content level detection
- Smart allow/block decisions
- User preferences and whitelist
- Performance optimizations
