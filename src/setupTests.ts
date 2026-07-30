import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-nodejs-modules -- Jest needs the Node encoder polyfill.
import { TextDecoder, TextEncoder } from 'util';

Object.assign(globalThis, { TextDecoder, TextEncoder });
Object.assign(globalThis, {
  fetch: jest.fn(() => Promise.reject(new Error('Unexpected request in test'))),
});
