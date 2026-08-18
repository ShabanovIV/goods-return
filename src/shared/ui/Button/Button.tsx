import type { ComponentPropsWithoutRef } from 'react';
import styles from './Button.module.scss';

export type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'text' | 'danger';
};

export const Button = ({
  size = 'medium',
  variant = 'primary',
  type = 'button',
  className,
  children,
  ...buttonProps
}: ButtonProps) => {
  const buttonClassName = [styles[variant], styles[size], className].filter(Boolean).join(' ');

  return (
    <button {...buttonProps} type={type} className={buttonClassName}>
      {children}
    </button>
  );
};
