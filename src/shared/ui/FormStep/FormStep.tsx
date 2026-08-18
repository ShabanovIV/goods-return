import type { ReactNode } from 'react';
import styles from './FormStep.module.scss';

export type FormStepProps = {
  children: ReactNode;
  description: ReactNode;
  step: number;
  title: ReactNode;
  titleId: string;
  totalSteps?: number;
};

export const FormStep = ({
  children,
  description,
  step,
  title,
  titleId,
  totalSteps = 4,
}: FormStepProps) => (
  <section className={styles.step} aria-labelledby={titleId}>
    <div className={styles.heading}>
      <p className={styles.eyebrow}>
        Шаг {step} из {totalSteps}
      </p>
      <h1 id={titleId}>{title}</h1>
      <p>{description}</p>
    </div>
    {children}
  </section>
);
