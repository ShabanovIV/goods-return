import { fireEvent, render, screen } from '@testing-library/react';
import { AttachmentInput } from './AttachmentInput';

test('passes the entire selection before resetting the input, including repeated selections', () => {
  const files = [new File(['a'], 'one.jpg'), new File(['b'], 'two.jpg')];
  const events: string[] = [];
  const onFilesSelected = jest.fn(() => events.push('selection'));
  render(
    <AttachmentInput ariaLabel="Фото" className="" multiple onFilesSelected={onFilesSelected}>
      Добавить
    </AttachmentInput>,
  );
  const input = screen.getByLabelText('Фото');
  Object.defineProperty(input, 'value', {
    configurable: true,
    get: () => '',
    set: () => events.push('reset'),
  });
  fireEvent.change(input, { target: { files } });
  fireEvent.change(input, { target: { files } });
  expect(events).toEqual(['selection', 'reset', 'selection', 'reset']);
  expect(onFilesSelected).toHaveBeenCalledTimes(2);
  expect(onFilesSelected).toHaveBeenNthCalledWith(1, files);
  expect(onFilesSelected).toHaveBeenNthCalledWith(2, files);
  fireEvent.change(input, { target: { files: [] } });
  expect(onFilesSelected).toHaveBeenCalledTimes(2);
});
