import { render, screen } from '@testing-library/react';
import { List } from './List';

type Item = {
  id: string;
  name: string;
};

test('renders generic items without an additional wrapper', () => {
  const items: Item[] = [
    { id: 'first', name: 'Первый' },
    { id: 'second', name: 'Второй' },
  ];
  const getKey = jest.fn((item: Item) => item.id);

  render(
    <ul data-testid="items">
      <List items={items} getKey={getKey} renderItem={(item) => <li>{item.name}</li>} />
    </ul>,
  );

  expect(screen.getByTestId('items').children).toHaveLength(2);
  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  expect(getKey).toHaveBeenCalledTimes(2);
});
