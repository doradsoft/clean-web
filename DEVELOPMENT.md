# Clean Web - Development Setup

## Project Structure

This project uses a **Vite-based build system** with **separated business logic** as requested.

### Architecture Overview

```
src/
├── business-logic/          # Core business logic (separated from UI)
│   ├── ImageClassifier.ts   # Image analysis and classification
│   ├── ImageDetector.ts     # DOM image detection with mutation observer
│   ├── ImageFilter.ts       # Image filtering and blocking
│   ├── CleanWebCore.ts      # Main orchestrator
│   └── index.ts             # Business logic exports
├── components/              # React UI components
│   ├── App.tsx              # Main application component
│   └── index.ts             # Component exports
├── extension/               # Chrome extension files
│   ├── content.ts           # Content script with mutation observer
│   ├── background.ts        # Service worker
│   ├── popup.ts             # Popup script
│   ├── popup.html           # Popup UI
│   └── manifest.json        # Extension manifest
├── types/                   # TypeScript type definitions
│   └── index.ts             # Shared types
├── main.tsx                 # React entry point
└── styles.css               # Application styles
```

### Key Features

- **Separated Business Logic**: All core functionality is isolated in the `business-logic` directory
- **Vite Build System**: Modern, fast build tooling with TypeScript support
- **Chrome Extension Ready**: Content script and manifest for browser extension
- **Type Safety**: Full TypeScript implementation with proper type definitions
- **Modular Architecture**: Clean separation of concerns across modules
- **Comprehensive Image Detection**: Enhanced mutation observer for complete image detection

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build extension (builds JS and copies manifest/HTML)
npm run build:extension

# Preview production build
npm run preview
```

## Business Logic Separation

The business logic is completely separated from the UI:

1. **ImageClassifier**: Handles image analysis and nudity detection
2. **ImageDetector**: Enhanced mutation observer for comprehensive image detection
3. **ImageFilter**: Manages blocking/allowing of images based on analysis
4. **CleanWebCore**: Main orchestrator that coordinates all components

### Enhanced Image Detection Features

The `ImageDetector` now includes:
- **IMG Element Detection**: Finds `<img>` elements and extracts `src`, `data-src`, and `data-lazy-src`
- **Background Image Detection**: Parses CSS `background-image` properties from computed styles
- **Video Poster Detection**: Detects poster images on video elements
- **Mutation Observer**: Real-time monitoring for dynamically added content
- **Attribute Monitoring**: Tracks changes to `src`, `style`, and `class` attributes
- **Visual Indicators**: Optional red borders for debugging detected images

This architecture allows the same business logic to be used in:
- Web applications (React UI)
- Chrome extensions (content scripts)
- Node.js environments (server-side processing)
- Any other JavaScript environment

## Extension Installation

1. Build the extension: `npm run build:extension`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `extension/` directory
5. The extension will now be active on all websites

## Testing

Use `test-standalone.html` to test the extension functionality:
- Open the file in Chrome with the extension installed
- Images should be automatically detected and bordered in red
- Click the extension icon to view detection statistics
- Use the test buttons to add dynamic content and verify mutation observer works

## Getting Started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open http://localhost:5173 to see the application
5. Run `npm run build:extension` to create the Chrome extension