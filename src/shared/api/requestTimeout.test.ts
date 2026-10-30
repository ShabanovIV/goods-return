/** @jest-environment node */
import type { BaseQueryApi } from '@reduxjs/toolkit/query';
import { baseQuery } from './baseQuery';

jest.mock('src/shared/lib/auth', () => ({ redirectToLogin: jest.fn() }));

test('aborts a pending upload and returns TIMEOUT_ERROR', async () => {
  const fetchMock = jest.mocked(globalThis.fetch);
  fetchMock.mockImplementationOnce(
    (input) =>
      new Promise((_resolve, reject) => {
        const request = input as Request;
        request.signal.addEventListener('abort', () => reject(request.signal.reason), {
          once: true,
        });
      }),
  );
  const result = await baseQuery(
    {
      url: 'https://example.test/claim/create',
      method: 'POST',
      body: new FormData(),
      timeout: 20,
    },
    { signal: new AbortController().signal } as BaseQueryApi,
    {},
  );
  expect(result.error).toMatchObject({ status: 'TIMEOUT_ERROR' });
  expect(fetchMock).toHaveBeenCalledTimes(1);
});
