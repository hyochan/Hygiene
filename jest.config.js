/* eslint-disable @typescript-eslint/no-var-requires */
const expoPreset = require('jest-expo/jest-preset');
/* eslint-enable @typescript-eslint/no-var-requires */

module.exports = {
  preset: 'react-native',
  automock: false,
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'svg', 'png'],
  globals: {
    'ts-jest': {
      // babelConfig: true,
      tsConfig: {
        jsx: 'react',
      },
      diagnostics: false,
    },
  },
  modulePathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/node_modules/',
    '<rootDir>/.history/',
  ],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/__mocks__/svgMock.js',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'babel-jest',
  },
  setupFiles: [
    ...expoPreset.setupFiles,
    '<rootDir>/test/jestSetup.ts',
  ],
  /* eslint-disable */
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules-*|sentry-expo|native-base|dooboo-ui|@dooboo-ui)',
  ],
  cacheDirectory: '.jest/cache',
  /* eslint-enable */
  setupFilesAfterEnv: ['./test/setupTest.ts'],
  collectCoverageFrom: [
    'src/**/*.tsx',
    '!src/App.tsx',
    '!<rootDir>/**/tablet.tsx',
  ],
};
