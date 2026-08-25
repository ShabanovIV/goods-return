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
  ).toBe('Претензия ещё в работе');
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
  ).toBe('Object CreateClaimRequestDto is not valid.');
});
