import { Fragment, type Key, type ReactNode } from 'react';

export type ListProps<T> = {
  items: readonly T[];
  getKey: (item: T, index: number) => Key;
  renderItem: (item: T, index: number) => ReactNode;
};

export const List = <T,>({ items, getKey, renderItem }: ListProps<T>) => (
  <>
    {items.map((item, index) => (
      <Fragment key={getKey(item, index)}>{renderItem(item, index)}</Fragment>
    ))}
  </>
);
