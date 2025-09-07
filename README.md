# Clean Web

Block problematic images from rendering in web pages using AI-powered content analysis. Available as both a Chrome extension and a web application with separated business logic.

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
│   ├── ImageClassifier.ts   # AI image analysis
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

### Smart Image Analysis
- **AI-powered nudity detection** with configurable sensitivity (0-10 scale)
- **Strict mode** for enhanced filtering
- **Custom allow/block lists** with regex support
- **Real-time processing** of existing and dynamically added images

### Chrome Extension Capabilities
- **Automatic image hiding** on page load
- **Background service worker** for extension lifecycle management
- **React-based popup UI** for real-time settings adjustment
- **Chrome storage integration** for settings persistence
- **Manifest V3 compliance** with proper security permissions

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

## Business Logic Separation

The core image filtering logic is completely framework-agnostic and can be used in:

- ✅ **Chrome Extensions** (content scripts)
- ✅ **React Applications** (web UI)  
- ✅ **Node.js Services** (server-side processing)
- ✅ **Web Workers** (background processing)
- ✅ **Any JavaScript Environment**

### Core Classes

1. **`CleanWebCore`** - Main orchestrator that coordinates all components
2. **`ImageClassifier`** - Handles AI-powered image analysis and nudity detection
3. **`ImageDetector`** - Finds and monitors image elements in the DOM
4. **`ImageFilter`** - Manages blocking/allowing of images based on analysis

## Chrome Extension Installation

1. Run `npm run build:extension`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the `dist/extension` folder
5. The extension will appear in your extensions list

The extension will automatically:
- Hide images on page load
- Analyze images using AI classification
- Show/hide images based on your sensitivity settings
- Provide a popup UI for adjusting settings in real-time

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

- **TypeScript** - Type safety and better development experience
- **React** - UI components and state management
- **Vite** - Fast build tool and development server
- **Chrome Extension APIs** - Storage, runtime messaging, content scripts
- **Manifest V3** - Latest Chrome extension standard

## Future Enhancements

- Integration with external AI services (OpenAI, Google Vision, etc.)
- Local ML model support for offline processing
- Enhanced image classification beyond nudity detection
- Performance optimizations for large pages
- Advanced filtering rules and exceptions
