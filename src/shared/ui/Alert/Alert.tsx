import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Alert.module.scss';

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  action?: ReactNode;
  tone?: 'error' | 'warning';
};

export const Alert = ({
  action,
  tone = 'error',
  className,
  children,
  role = 'alert',
  ...alertProps
}: AlertProps) => (
  <div
    {...alertProps}
    className={[styles.alert, styles[tone], className].filter(Boolean).join(' ')}
    role={role}
  >
    <span>{children}</span>
    {action && <div className={styles.action}>{action}</div>}
  </div>
);
