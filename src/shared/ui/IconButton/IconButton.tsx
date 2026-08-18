import type { ComponentPropsWithoutRef } from 'react';
import styles from './IconButton.module.scss';

export type IconButtonProps = ComponentPropsWithoutRef<'button'> & {
  'aria-label': string;
};

export const IconButton = ({
  className,
  children,
  type = 'button',
  ...buttonProps
}: IconButtonProps) => (
  <button
    {...buttonProps}
    className={[styles.button, className].filter(Boolean).join(' ')}
    type={type}
  >
    {children}
  </button>
);
