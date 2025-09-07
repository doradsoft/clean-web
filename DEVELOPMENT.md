# Clean Web - Development Setup

## Project Structure

This project uses a **Vite-based build system** with **separated business logic** as requested.

### Architecture Overview

```
src/
├── business-logic/          # Core business logic (separated from UI)
│   ├── ImageClassifier.ts   # Image analysis and classification
│   ├── ImageDetector.ts     # DOM image detection
│   ├── ImageFilter.ts       # Image filtering and blocking
│   ├── CleanWebCore.ts      # Main orchestrator
│   └── index.ts             # Business logic exports
├── components/              # React UI components
│   ├── App.tsx              # Main application component
│   ├── CleanWebControls.tsx # Control panel UI
│   └── index.ts             # Component exports
├── extension/               # Chrome extension files
│   ├── content.ts           # Content script (TypeScript)
│   ├── popup.ts             # Popup script (TypeScript)
│   ├── popup.html           # Popup interface
│   ├── content.css          # Extension styles
│   ├── manifest.json        # Extension manifest
│   └── icons/              # Extension icons
├── types/                   # TypeScript type definitions
│   └── index.ts             # Shared types
├── utils/                   # Utility functions and helpers
├── main.tsx                 # React entry point
└── styles.css               # Application styles
```

### Key Features

- **Separated Business Logic**: All core functionality is isolated in the `business-logic` directory
- **Vite Build System**: Modern, fast build tooling with TypeScript support
- **Chrome Extension Ready**: Complete extension with TypeScript content and popup scripts
- **Type Safety**: Full TypeScript implementation with proper type definitions
- **Modular Architecture**: Clean separation of concerns across modules
- **"Hide All Before Processing"**: Implements the core requirement from issue #6

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (web app)
npm run dev

# Build web application
npm run build

# Build Chrome extension
npm run build:extension

# Preview production build
npm run preview
```

## Chrome Extension Build

The extension build creates a complete Chrome extension in the `dist-extension/` directory:

```bash
npm run build:extension
```

This will create:
- `dist-extension/content.js` - Content script (compiled from TypeScript)
- `dist-extension/popup.js` - Popup script (compiled from TypeScript)  
- `dist-extension/popup.html` - Popup interface
- `dist-extension/content.css` - Extension styles
- `dist-extension/manifest.json` - Extension manifest
- `dist-extension/icons/` - Extension icons

### Loading the Extension

1. Run `npm run build:extension` to build the extension
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist-extension/` directory
5. The extension will be active on all web pages

## Business Logic Separation

The business logic is completely separated from the UI:

1. **ImageClassifier**: Handles image analysis and nudity detection
2. **ImageDetector**: Finds and monitors image elements in the DOM
3. **ImageFilter**: Manages blocking/allowing of images based on analysis
4. **CleanWebCore**: Main orchestrator that coordinates all components

### "Hide All Before Processing" Implementation

The extension implements the core requirement by:
- Using `CleanWebCore.startWithImmediateHiding()` to hide all images immediately
- Running at `document_start` to prevent any images from showing
- Using `!important` CSS rules for reliable hiding
- Monitoring for dynamically added content

This architecture allows the same business logic to be used in:
- Web applications (React UI)
- Chrome extensions (content scripts)
- Node.js environments (server-side processing)
- Any other JavaScript environment

## Testing

1. Open `test.html` in your browser
2. Install the extension using the steps above
3. Reload the test page - all images should be hidden immediately
4. Use the extension popup to see hidden image count and debug functionality

## Getting Started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server (web app)
4. Run `npm run build:extension` to build the Chrome extension
5. Load the extension in Chrome for testing

## File Structure Changes

This implementation adapts the Chrome extension to the new master branch structure while maintaining all existing functionality. The key changes are:

- Extension files moved to `src/extension/`
- Converted JavaScript to TypeScript
- Integrated with separated business logic
- Added proper build configuration
- Maintained backward compatibility with existing features