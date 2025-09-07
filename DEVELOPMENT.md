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
- **React + TypeScript**: Modern frontend stack for web application
- **AI-Powered Filtering**: Advanced image classification capabilities

## Development Commands

### Chrome Extension Development

```bash
# Build the extension for testing
npm run build:extension

# Validate extension structure
npm run validate

# Run all tests (build + validate)
npm test
```

The extension will automatically hide all images on page load using the `CleanWebCore.startWithImmediateHiding()` method.
