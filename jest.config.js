/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: 'ts-jest',
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
  ],
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};