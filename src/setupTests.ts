/// <reference types="node" />

import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';
// eslint-disable-next-line import-x/no-nodejs-modules -- Jest needs the Node encoder polyfill.
import { TextDecoder, TextEncoder } from 'util';

const cloneForIndexedDb = <T>(value: T): T => {
  if (value instanceof File) {
    return new File([value], value.name, {
      type: value.type,
      lastModified: value.lastModified,
    }) as T;
  }
  if (value instanceof Blob) return value.slice(0, value.size, value.type) as T;
  if (value instanceof Date) return new Date(value) as T;
  if (Array.isArray(value)) return value.map(cloneForIndexedDb) as T;
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, cloneForIndexedDb(item)]),
    ) as T;
  }
  return value;
};

Object.assign(globalThis, { TextDecoder, TextEncoder });
Object.assign(globalThis, { structuredClone: cloneForIndexedDb });
Object.assign(globalThis, {
  __API_URL__: '/',
  __DEVELOPMENT_TOKEN__: undefined,
});
Object.assign(globalThis, {
  fetch: jest.fn(() => Promise.reject(new Error('Unexpected request in test'))),
});
