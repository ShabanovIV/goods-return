import { getRequestErrorMessage } from './getRequestErrorMessage';

test('returns the Claim/Create error message from an unsuccessful response', () => {
  expect(
    getRequestErrorMessage({
      status: 400,
      data: {
        code: 'wrong_argument',
        reason: 'Request is not valid!',
        message: 'Претензия ещё в работе',
      },
    }),
  ).toMatchObject({ source: 'api', message: 'Претензия ещё в работе' });
});

test('returns an error from the legacy PascalCase response', () => {
  expect(
    getRequestErrorMessage({
      status: 'CUSTOM_ERROR',
      data: {
        Success: false,
        Error: 'Object CreateClaimRequestDto is not valid.',
      },
    }),
  ).toMatchObject({ source: 'api', message: 'Object CreateClaimRequestDto is not valid.' });
});

test('keeps an unknown server message in the general request category', () => {
  expect(getRequestErrorMessage({ status: 503, data: { message: 'Сервис занят' } })).toMatchObject({
    source: 'request',
    message: 'Сервис занят',
  });
});

test.each([
  {
    status: 'PARSING_ERROR',
    originalStatus: 502,
    data: '<html>Bad gateway</html>',
    error: 'SyntaxError: Unexpected token',
  },
  { status: 'FETCH_ERROR', error: 'TypeError: Failed to fetch' },
  { status: 'TIMEOUT_ERROR', error: 'TimeoutError' },
])('preserves technical diagnostics for $status', (error) => {
  const result = getRequestErrorMessage(error);
  expect(result.source).toBe('request');
  expect(result.details).toContain(error.error);
  if ('data' in error) expect(result.details).toContain(error.data);
  expect(result.message).not.toContain('<html>');
});

test('preserves response identifiers and original status', () => {
  const result = getRequestErrorMessage({
    status: 400,
    data: { Success: false, Error: 'Ошибка', TraceId: 'trace-123' },
  });
  expect(result.details).toContain('trace-123');
  expect(result.details).toContain('400');
});
