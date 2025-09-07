# Testing Infrastructure Documentation

This project includes comprehensive testing infrastructure using platform-independent tools.

## Testing Tools

### Unit Testing - Jest
- **Framework**: Jest
- **Purpose**: Testing individual modules and functions
- **Configuration**: `jest.config.js`
- **Test Files**: `tests/unit/**/*.test.js`

### End-to-End Testing - Playwright
- **Framework**: Playwright
- **Purpose**: Testing complete user workflows in browsers
- **Configuration**: `playwright.config.js`
- **Test Files**: `tests/e2e/**/*.spec.js`

## Available Scripts

### Core Testing Commands
```bash
# Run all unit tests
npm run test:unit

# Run E2E tests (requires browser installation)
npm run test:e2e

# Run all tests (unit only by default)
npm test
```

### Development Commands
```bash
# Run unit tests in watch mode
npm run test:unit:watch

# Run E2E tests with visible browser
npm run test:e2e:headed

# Install Playwright browsers (required for E2E tests)
npm run install:playwright
```

## Setting Up E2E Tests

To run E2E tests, you need to install Playwright browsers first:

```bash
npm run install:playwright
```

This downloads the necessary browser binaries (Chromium, Firefox, and WebKit) for testing.

## Test Structure

### Unit Tests
Located in `tests/unit/`, these test individual modules:

- `imageFilter.test.js` - Tests core image filtering functionality
- Tests cover all public methods and edge cases
- Include tests for error handling and invalid inputs

### E2E Tests
Located in `tests/e2e/`, these test complete user workflows:

- `imageFilter.spec.js` - Tests the complete image filtering UI
- Uses `tests/fixtures/test-page.html` as test page
- Tests user interactions like clicking buttons and visual feedback

### Test Fixtures
Located in `tests/fixtures/`:

- `test-page.html` - Demo page for testing image filtering functionality
- Includes sample images and interactive controls

## Platform Independence

All testing tools are platform-independent:

- **Jest**: Runs on Node.js, works on Windows, macOS, and Linux
- **Playwright**: Supports all major browsers across platforms
- **Configuration**: Uses standard JavaScript/JSON configuration files

## Coverage Reports

Unit tests generate coverage reports:

```bash
# Coverage files are generated in coverage/ directory
# - HTML report: coverage/index.html
# - LCOV format: coverage/lcov.info
```

## Continuous Integration

The testing setup is CI-friendly:

- Tests run without GUI by default
- Playwright automatically detects CI environments
- Different retry strategies for local vs CI environments
- Configurable parallelization settings

## Test Organization

```
tests/
├── unit/           # Unit tests (Jest)
│   └── *.test.js
├── e2e/            # End-to-end tests (Playwright)
│   └── *.spec.js
└── fixtures/       # Test data and HTML files
    └── *.html
```

## Best Practices

1. **Unit Tests**: Focus on individual functions and modules
2. **E2E Tests**: Test complete user workflows
3. **Fixtures**: Use realistic test data
4. **Assertions**: Use descriptive test names and clear assertions
5. **Coverage**: Aim for high coverage of critical paths

## Troubleshooting

### Common Issues

1. **Playwright Browser Installation**: 
   - Run `npm run install:playwright` if E2E tests fail
   - Check network connectivity for browser downloads

2. **Test Timeouts**:
   - Increase timeout in test configuration if needed
   - Check for async operations in tests

3. **Path Issues**:
   - All paths are relative to project root
   - Use absolute paths for file operations

## Future Enhancements

- Add visual regression testing
- Integrate accessibility testing
- Add performance testing benchmarks
- Set up automated test reporting