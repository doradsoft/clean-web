import '@testing-library/jest-dom';

// Mock Chrome APIs for testing
const mockChrome = {
  storage: {
    sync: {
      get: jest.fn().mockImplementation((keys, callback) => {
        callback({});
      }),
      set: jest.fn().mockImplementation((data, callback) => {
        if (callback) callback();
      }),
    },
    local: {
      get: jest.fn().mockImplementation((keys, callback) => {
        callback({});
      }),
      set: jest.fn().mockImplementation((data, callback) => {
        if (callback) callback();
      }),
    },
  },
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
    },
  },
  tabs: {
    query: jest.fn(),
  },
};

(global as any).chrome = mockChrome;

// Mock TensorFlow.js and NSFWJS for testing
jest.mock('@tensorflow/tfjs', () => ({
  loadLayersModel: jest.fn().mockResolvedValue({
    predict: jest.fn().mockReturnValue({
      dataSync: jest.fn().mockReturnValue(new Float32Array([0.1, 0.2, 0.3, 0.4])),
      dispose: jest.fn(),
    }),
  }),
  tensor: jest.fn().mockReturnValue({
    dispose: jest.fn(),
  }),
  browser: {
    fromPixels: jest.fn().mockReturnValue({
      expandDims: jest.fn().mockReturnValue({
        div: jest.fn().mockReturnValue({
          dispose: jest.fn(),
        }),
      }),
    }),
  },
}));

jest.mock('nsfwjs', () => ({
  load: jest.fn().mockResolvedValue({
    classify: jest.fn().mockResolvedValue([
      { className: 'Neutral', probability: 0.7 },
      { className: 'Drawing', probability: 0.2 },
      { className: 'Sexy', probability: 0.1 },
    ]),
  }),
}));

// Mock DOM methods
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock console methods to reduce test output noise
global.console = {
  ...console,
  debug: jest.fn(),
  info: jest.fn(),
};