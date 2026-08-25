import type { TextareaHTMLAttributes } from 'react';
import styles from './Textarea.module.scss';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = ({ className, ...props }: TextareaProps) => (
  <textarea className={[styles.textarea, className].filter(Boolean).join(' ')} {...props} />
);
