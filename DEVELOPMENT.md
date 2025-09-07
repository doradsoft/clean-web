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
│   ├── content.ts           # Content script
│   └── manifest.json        # Extension manifest
├── types/                   # TypeScript type definitions
│   └── index.ts             # Shared types
├── utils/                   # Utility functions and helpers
├── main.tsx                 # React entry point
└── styles.css               # Application styles
```

### Key Features

- **Separated Business Logic**: All core functionality is isolated in the `business-logic` directory
- **Vite Build System**: Modern, fast build tooling with TypeScript support
- **Chrome Extension Ready**: Content script and manifest for browser extension
- **Type Safety**: Full TypeScript implementation with proper type definitions
- **Modular Architecture**: Clean separation of concerns across modules

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build extension
npm run build:extension

# Preview production build
npm run preview
```

## Business Logic Separation

The business logic is completely separated from the UI:

1. **ImageClassifier**: Handles image analysis and nudity detection
2. **ImageDetector**: Finds and monitors image elements in the DOM
3. **ImageFilter**: Manages blocking/allowing of images based on analysis
4. **CleanWebCore**: Main orchestrator that coordinates all components

This architecture allows the same business logic to be used in:
- Web applications (React UI)
- Chrome extensions (content scripts)
- Node.js environments (server-side processing)
- Any other JavaScript environment

## Getting Started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open http://localhost:5173 to see the application
5. Run `npm run build` to create production build