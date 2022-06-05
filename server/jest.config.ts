/** @type {import('ts-jest').InitialOptionsTsJest} */
export default {
  verbose: true,
  forceExit: true,
  testEnvironment: 'node',
  globalSetup: './src/test/global-setup.js',
  globalTeardown: './src/test/global-teardown.js',
  moduleNameMapper: {
    '^/(.*)$': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      isolatedModules: true,
      diagnostics: false,
    },
  },
};
