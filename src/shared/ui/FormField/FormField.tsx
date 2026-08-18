import type { ReactNode } from 'react';
import { FieldError } from 'src/shared/ui/FieldError';
import styles from './FormField.module.scss';

export type FormFieldProps = {
  children: ReactNode;
  className?: string;
  error?: ReactNode;
  htmlFor: string;
  label: ReactNode;
};

export const FormField = ({ children, className, error, htmlFor, label }: FormFieldProps) => (
  <div className={[styles.field, className].filter(Boolean).join(' ')}>
    <label htmlFor={htmlFor}>{label}</label>
    {children}
    {error && <FieldError id={`${htmlFor}-error`}>{error}</FieldError>}
  </div>
);
