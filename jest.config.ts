import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  // ESM + TS
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },

  // alias src/*
  moduleNameMapper: {
    // CSS/SCSS modules + global scss
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',

    // svg as url (import x from './a.svg?url')
    '\\.svg\\?url$': '<rootDir>/src/__mocks__/fileMock.js',

    // svg as component/default (import { ReactComponent as Icon } from './a.svg')
    '\\.svg$': '<rootDir>/src/__mocks__/svgrMock.tsx',

    // images
    '\\.(png|jpe?g|gif|webp|avif|ico)$': '<rootDir>/src/__mocks__/fileMock.js',

    '^src/(.*)$': '<rootDir>/src/$1',
  },

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  testMatch: ['**/?(*.)+(spec|test).(ts|tsx)'],
};

export default config;
