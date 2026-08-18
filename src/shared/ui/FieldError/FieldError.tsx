import type { ComponentPropsWithoutRef } from 'react';
import styles from './FieldError.module.scss';

export type FieldErrorProps = ComponentPropsWithoutRef<'span'>;

export const FieldError = ({ className, children, ...spanProps }: FieldErrorProps) => (
  <span {...spanProps} className={[styles.error, className].filter(Boolean).join(' ')}>
    {children}
  </span>
);
