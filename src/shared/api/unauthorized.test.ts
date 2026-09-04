import type { BaseQueryApi } from '@reduxjs/toolkit/query';
import { redirectToLogin } from 'src/shared/lib/auth';
import { baseQuery } from './baseQuery';

const mockRawBaseQuery = jest.fn();

jest.mock('@reduxjs/toolkit/query', () => ({
  fetchBaseQuery:
    () =>
    (...args: unknown[]) =>
      mockRawBaseQuery(...args),
}));
jest.mock('src/shared/lib/auth', () => ({ redirectToLogin: jest.fn() }));

beforeEach(() => jest.clearAllMocks());

test.each([
  { error: { status: 401, data: { message: 'Unauthorized' } } },
  {
    error: { status: 'PARSING_ERROR', originalStatus: 401, data: '<html>Login</html>' },
    meta: { response: { status: 401 } },
  },
])('redirects on HTTP 401 and preserves the original query result %#', async (result) => {
  mockRawBaseQuery.mockResolvedValue(result);
  expect(await baseQuery('/document/getdocument', {} as BaseQueryApi, {})).toBe(result);
  expect(redirectToLogin).toHaveBeenCalledTimes(1);
});

test.each([
  { data: { success: true } },
  { error: { status: 400, data: 'Validation error' } },
  { error: { status: 403, data: 'Forbidden' } },
  { error: { status: 500, data: 'Internal server error' } },
  { error: { status: 'FETCH_ERROR', error: 'Failed to fetch' } },
])('does not redirect for a successful response or a non-401 error %#', async (result) => {
  mockRawBaseQuery.mockResolvedValue(result);
  expect(await baseQuery('/claim/create', {} as BaseQueryApi, {})).toBe(result);
  expect(redirectToLogin).not.toHaveBeenCalled();
});
