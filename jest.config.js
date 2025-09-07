export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { 
      useESM: true,
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        moduleResolution: 'node',
      }
    }],
    '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['@babel/preset-env'] }]
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@tensorflow|nsfwjs)/)'
  ],
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.{js,ts}',
    '<rootDir>/tests/unit/**/*.spec.{js,ts}',
    '!<rootDir>/tests/unit/integration.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js}',
    '!src/**/*.test.{ts,tsx,js}',
    '!src/**/*.spec.{ts,tsx,js}',
    '!src/**/*.d.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
};