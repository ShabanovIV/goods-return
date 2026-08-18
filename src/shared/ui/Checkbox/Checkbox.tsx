import type { ComponentPropsWithoutRef } from 'react';
import styles from './Checkbox.module.scss';

export type CheckboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'>;

export const Checkbox = ({ checked, className, ...inputProps }: CheckboxProps) => (
  <span className={styles.control}>
    <input
      {...inputProps}
      className={[styles.input, className].filter(Boolean).join(' ')}
      checked={checked}
      type="checkbox"
    />
    <span className={styles.indicator} aria-hidden="true">
      {checked ? '✓' : ''}
    </span>
  </span>
);
