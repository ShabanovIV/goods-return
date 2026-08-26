import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import styles from './Switch.module.scss';

type SwitchProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'> & {
  description?: ReactNode;
  label: ReactNode;
};

export const Switch = ({ className, description, label, ...inputProps }: SwitchProps) => (
  <label className={[styles.root, className].filter(Boolean).join(' ')}>
    <span className={styles.content}>
      <span className={styles.label}>{label}</span>
      {description && <span className={styles.description}>{description}</span>}
    </span>
    <span className={styles.control}>
      <input {...inputProps} className={styles.input} role="switch" type="checkbox" />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
    </span>
  </label>
);
