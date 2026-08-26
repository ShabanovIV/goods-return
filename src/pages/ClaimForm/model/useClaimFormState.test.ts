import { act, renderHook } from '@testing-library/react';
import { useClaimFormState } from './useClaimFormState';

test('scrolls to the page error every time it is shown', () => {
  const scrollTo = jest.spyOn(window, 'scrollTo').mockImplementation();
  const { result } = renderHook(() => useClaimFormState());

  act(() => result.current.setPageError('Файл уже добавлен.'));
  act(() => result.current.setPageError('Файл уже добавлен.'));

  expect(scrollTo).toHaveBeenCalledTimes(2);
  expect(scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: 'smooth' });
  scrollTo.mockRestore();
});
