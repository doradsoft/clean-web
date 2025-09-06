# clean-web

Goal is to block problematic images from rendering in HTML pages (mostly as Chrome extension but the infrastructure is generic).

## Features

- Hides all image elements (img or any other with bg image or even videos) by default
- Fetches their underlying image  
- Classifies it's level of nudity (women receives automatically higher nudity level, then the more part of the body are there the higher the level etc). Also whether the intention of the figure is sexual it receives high level etc.
- Block / allow accordingly

## Development

### Testing Infrastructure

This project includes comprehensive testing infrastructure using platform-independent tools:

- **Unit Tests**: Jest framework for testing individual modules
- **E2E Tests**: Playwright for cross-browser end-to-end testing
- **Test Coverage**: Automated coverage reporting

#### Quick Start

```bash
# Install dependencies
npm install

# Run unit tests
npm run test:unit

# Install browsers for E2E testing
npm run install:playwright

# Run E2E tests
npm run test:e2e

# Run all tests
npm test
```

#### Available Scripts

- `npm run test:unit` - Run unit tests only
- `npm run test:e2e` - Run end-to-end tests (requires browser installation)
- `npm run test:unit:watch` - Run unit tests in watch mode
- `npm run test:e2e:headed` - Run E2E tests with visible browser
- `npm run install:playwright` - Install Playwright browsers

For detailed testing documentation, see [docs/testing.md](docs/testing.md).

### Project Structure

```
src/                 # Source code
tests/
├── unit/           # Unit tests (Jest)
├── e2e/            # End-to-end tests (Playwright)  
└── fixtures/       # Test data and HTML files
docs/               # Documentation
```
