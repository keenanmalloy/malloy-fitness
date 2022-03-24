export default {
  clearMocks: true,
  verbose: true,
  moduleNameMapper: {
    "^/(.*)$": "<rootDir>/src/$1",
  },
  moduleDirectories: ["node_modules", "src"],
  testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/"],
  preset: "ts-jest",
};
