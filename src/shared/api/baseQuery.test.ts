import { getBusinessErrorMessage } from './baseQuery';

test.each([
  [{ success: false, error: 'Ошибка' }, 'Ошибка'],
  [{ Success: false, Error: 'Legacy error' }, 'Legacy error'],
])('recognizes unsuccessful API response %#', (response, expected) => {
  expect(getBusinessErrorMessage(response)).toBe(expected);
});

test('does not treat a successful response as an error', () => {
  expect(getBusinessErrorMessage({ Success: true })).toBeUndefined();
});
