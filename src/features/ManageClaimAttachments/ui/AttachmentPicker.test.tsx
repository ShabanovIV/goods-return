import { fireEvent, render } from '@testing-library/react';
import { AttachmentPicker } from './AttachmentPicker';

test('copies selected files before clearing the file input', () => {
  const onFilesSelected = jest.fn();
  const file = new File(['photo'], 'damage.jpg', { type: 'image/jpeg' });

  const { container } = render(
    <AttachmentPicker
      attachmentTypes={[]}
      isTypesLoading={false}
      onFilesSelected={onFilesSelected}
      onRetryTypes={jest.fn()}
      onTypeChange={jest.fn()}
      selectedType=""
    />,
  );

  const input = container.querySelector<HTMLInputElement>('input[type="file"]');
  expect(input).not.toBeNull();
  if (!input) throw new Error('File input was not rendered.');

  fireEvent.change(input, {
    target: { files: [file] },
  });

  expect(onFilesSelected).toHaveBeenCalledWith([file]);
  expect(Array.isArray(onFilesSelected.mock.calls[0][0])).toBe(true);
});
