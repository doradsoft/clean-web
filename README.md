# Clean Web

Block problematic images from rendering in web pages using **real AI-powered content analysis**. Available as both a Chrome extension and a web application with completely separated business logic.

## Real Machine Learning Implementation

This repository includes a **real machine learning-powered** image classification system with:

- **Real NSFW Detection** using TensorFlow.js (@tensorflow/tfjs ^4.22.0) and nsfwjs (^4.2.1) libraries
- **TypeScript Architecture** with full type safety and modern development experience  
- **Separated Business Logic** organized in clean, testable, framework-agnostic modules
- **React-based UI** for both web application and Chrome extension popup
- **Chrome Extension Ready** build system with Manifest V3 compliance

### Key Features

- **Real ML Classification**: Actual TensorFlow.js and nsfwjs model integration, no mock implementations
- **Smart Confidence Scoring**: Weighted classification categories (Porn: 1.0, Hentai: 0.9, Sexy: 0.6, etc.)
- **Graceful Error Handling**: Falls back to URL pattern analysis if ML model fails
- **Memory Management**: Proper TensorFlow tensor cleanup to prevent memory leaks
- **Configurable Thresholds**: Adjustable nudity detection sensitivity (0-10 scale)
- **Allow/Block Lists**: URL pattern-based overrides for trusted/blocked domains

## Quick Start

### Chrome Extension
```bash
npm install
npm run build:extension
```
Then load the `dist/extension` folder in Chrome's developer mode.

### Web Application  
```bash
npm install
npm run build
npm run preview
```

## Architecture

This project uses a **TypeScript + React + Vite** setup with **completely separated business logic**:

```
src/
├── business-logic/          # Core AI-powered image filtering (framework-agnostic)
│   ├── CleanWebCore.ts      # Main orchestrator
│   ├── ImageClassifier.ts   # Real TensorFlow.js + nsfwjs implementation
│   ├── ImageDetector.ts     # DOM image detection  
│   ├── ImageFilter.ts       # Image blocking/allowing
│   └── index.ts             # Business logic exports
├── extension/               # Chrome Extension (uses business logic)
│   ├── content.ts           # Content script
│   ├── background.ts        # Service worker
│   ├── popup.tsx            # React-based settings popup
│   ├── popup.html           # Popup HTML
│   └── manifest.json        # Extension manifest
├── components/              # React UI components (for web app)
│   ├── App.tsx              # Main application
│   ├── CleanWebControls.tsx # Control panel
│   └── index.ts             # Component exports  
├── types/                   # TypeScript definitions
└── main.tsx                 # Web app entry point
```

## Features

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

### Smart Image Analysis
- **AI-powered nudity detection** with configurable sensitivity (0-10 scale)
- **Strict mode** for enhanced filtering
- **Custom allow/block lists** with regex support
- **Real-time processing** of existing and dynamically added images

### Chrome Extension Capabilities
- **"Hide all before processing" functionality** - immediately hides all images on page load
- **Automatic image hiding** on page load for all img, video, and background images
- **Background service worker** for extension lifecycle management
- **React-based popup UI** for real-time settings adjustment
- **Chrome storage integration** for settings persistence
- **Manifest V3 compliance** with proper security permissions
- **Dynamic content monitoring** - hides new images as they are added to the page

### Web Application
- **Full React UI** with the same business logic as the extension
- **Development server** with hot reload
- **Production builds** optimized for performance

## Development Commands

```bash
# Install dependencies
npm install

# Chrome Extension
npm run build:extension     # Build extension 
npm run validate            # Validate extension files
npm test                   # Build and validate extension

# Web Application
npm run dev                # Start development server
npm run build              # Build for production
npm run preview            # Preview production build

# Utilities
npm run clean              # Clean build directories
```

## Testing Infrastructure

This project includes comprehensive testing infrastructure using platform-independent tools:

- **Unit Tests**: Jest framework for testing TypeScript business logic and React components
- **E2E Tests**: Playwright for cross-browser end-to-end testing
- **Integration Tests**: Full workflow testing for complete image processing pipelines
- **Test Coverage**: Automated coverage reporting with HTML and LCOV output

### Testing Commands

```bash
# Unit testing
npm run test:unit           # Run Jest unit tests
npm run test:unit:watch     # Run unit tests in watch mode
npm run test:coverage       # Generate coverage reports

# E2E testing  
npm run install:playwright  # Install Playwright browsers (one-time setup)
npm run test:e2e           # Run Playwright E2E tests
npm run test:e2e:headed    # Run E2E tests with visible browser

# Integration testing
npm run test:integration   # Run integration workflow tests

# All tests
npm run test:all           # Run all test suites
```

### Test Structure

```
tests/
├── unit/           # Jest unit tests for TS/React components
│   ├── ImageFilter.test.js
│   ├── ImageClassifier.test.js
│   ├── CleanWebControls.test.js
│   └── integration.test.js
├── e2e/            # Playwright E2E and extension tests
│   ├── extension.spec.js
│   ├── web-app.spec.js
│   └── cross-browser.spec.js
├── fixtures/       # Interactive test data and demo pages
│   └── test-images/
└── setup.ts        # Test configuration and mocks
```

### Testing Features

- **Comprehensive Coverage**: Tests for ImageFilter, ImageClassifier, and React components
- **Mocked Dependencies**: TensorFlow.js, NSFWJS, and Chrome APIs mocked for reliable testing
- **Interactive Fixtures**: Demo HTML pages for manual testing and E2E automation
- **Chrome Extension Testing**: Specialized tests for extension functionality
- **Cross-Browser Testing**: Support for Chromium, Firefox, and WebKit
- **Platform Independence**: Works on Windows, macOS, and Linux

For detailed testing documentation, see [docs/testing.md](docs/testing.md).

## Chrome Extension "Hide All Before Processing" Implementation

The Chrome extension implements the specific "hide all before processing" functionality:

✅ **Implemented Features:**
- Immediately hides all `<img>` elements on page load
- Hides all `<video>` elements 
- Hides elements with CSS background images
- Monitors for dynamically added content and hides new images
- Provides popup interface to monitor hidden elements count
- Debug functionality to restore all hidden images
- Uses `CleanWebCore.startWithImmediateHiding()` method

## Business Logic Separation

The core image filtering logic is completely framework-agnostic and can be used in:

- ✅ **Chrome Extensions** (content scripts)
- ✅ **React Applications** (web UI)  
- ✅ **Node.js Services** (server-side processing)
- ✅ **Web Workers** (background processing)
- ✅ **Any JavaScript Environment**

### Core Classes

1. **`CleanWebCore`** - Main orchestrator that coordinates all components
2. **`ImageClassifier`** - Handles real TensorFlow.js-powered image analysis and nudity detection
3. **`ImageDetector`** - Finds and monitors image elements in the DOM
4. **`ImageFilter`** - Manages blocking/allowing of images based on analysis

## Chrome Extension Installation

1. Run `npm run build:extension`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the `dist/extension` folder
5. The extension will appear in your extensions list

The extension will automatically:
- Hide images on page load **before processing** (immediate hiding functionality)
- Analyze images using real TensorFlow.js AI classification
- Show/hide images based on your sensitivity settings
- Provide a popup UI for adjusting settings in real-time

## Testing

Open `test-page.html` in your browser to test the image hiding functionality. The extension should immediately hide all images, videos, and background images on the page.

## Configuration

### Extension Settings (via popup)
- **Nudity Threshold**: 0 (permissive) to 10 (strict)
- **Strict Mode**: Enhanced filtering rules
- **Allow List**: Domains/patterns to always allow
- **Block List**: Domains/patterns to always block

### Web App Settings (via UI controls)
- Same settings as extension but with full React UI
- Real-time statistics and monitoring
- Advanced debugging and development features

## Technology Stack

- **TensorFlow.js** - Real machine learning for image classification
- **NSFWJS** - Pre-trained NSFW detection model
- **TypeScript** - Type safety and better development experience
- **React** - UI components and state management
- **Vite** - Fast build tool and development server
- **Chrome Extension APIs** - Storage, runtime messaging, content scripts
- **Manifest V3** - Latest Chrome extension standard
- **Jest** - Unit testing framework with TypeScript support
- **Playwright** - Cross-browser end-to-end testing
- **React Testing Library** - React component testing utilities

## Implementation Details

- **Real Machine Learning**: Actual TensorFlow.js and nsfwjs model integration, no mock implementations
- **Master Branch Compatibility**: Full integration with existing master branch architecture and interfaces  
- **Memory Management**: Proper TensorFlow tensor cleanup to prevent memory leaks
- **TypeScript Architecture**: Full type safety with strongly typed interfaces and method signatures
- **Modern Build System**: Vite + React + TypeScript configuration matching master structure
- **Error Recovery**: Multiple fallback strategies ensure system reliability
- **Configurable Thresholds**: Adjustable sensitivity settings for different use cases
- **"Hide All Before Processing"**: Immediate image hiding on page load before any analysis
- **Integration with external AI services**: OpenAI, Google Vision, etc. compatibility
- **Local ML model support**: Offline processing capabilities
- **Enhanced image classification**: Beyond nudity detection for comprehensive filtering
- **Performance optimizations**: Optimized for large pages with many images
- **Advanced filtering rules**: Complex exceptions and rule-based systems
- **Comprehensive Test Coverage**: Jest and Playwright testing with 80%+ coverage thresholds