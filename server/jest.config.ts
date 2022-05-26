export default {
  clearMocks: true,
  verbose: false,
  collectCoverage: false,
  forceExit: true,
  testEnvironment: 'node',
  globalSetup: './src/test/global-setup.js',
  globalTeardown: './src/test/global-teardown.js',
  notifyMode: 'change',
  moduleNameMapper: {
    '^/(.*)$': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  preset: 'ts-jest',
};
