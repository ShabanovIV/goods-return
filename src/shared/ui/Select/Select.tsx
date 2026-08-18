import type { ComponentPropsWithoutRef } from 'react';
import styles from './Select.module.scss';

export type SelectProps = ComponentPropsWithoutRef<'select'>;

export const Select = ({ className, children, ...selectProps }: SelectProps) => (
  <select {...selectProps} className={[styles.select, className].filter(Boolean).join(' ')}>
    {children}
  </select>
);
