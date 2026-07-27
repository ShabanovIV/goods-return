import type { ComponentPropsWithoutRef } from 'react';
import styles from './Button.module.scss';

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary';
};

export const Button = ({
  variant = 'primary',
  type = 'button',
  className,
  children,
  ...buttonProps
}: ButtonProps) => {
  const buttonClassName = [styles.button, styles[variant], className].filter(Boolean).join(' ');

  return (
    <button {...buttonProps} type={type} className={buttonClassName}>
      {children}
    </button>
  );
};
