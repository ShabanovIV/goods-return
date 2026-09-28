import s from './ClaimFormPage.module.scss';
import { CLAIM_STEPS, type ClaimStep } from '../model/claimForm';

type ClaimFormHeaderProps = {
  draftMessage: string;
  step: ClaimStep;
};

export const ClaimFormHeader = ({ draftMessage, step }: ClaimFormHeaderProps) => (
  <header className={s.header}>
    <div className={s.headerInner}>
      <div className={s.brand} aria-label="Askona — возврат товаров">
        <span className={s.logoMark} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="m12 2 9 4.5-9 4.5-9-4.5L12 2Zm-7.5 8L12 13.75 19.5 10 21 11.5 12 16l-9-4.5L4.5 10Zm0 5L12 18.75 19.5 15l1.5 1.5L12 21l-9-4.5L4.5 15Z" />
          </svg>
        </span>
        <span>
          <strong>ASKONA</strong>
          <small>Претензия · {draftMessage}</small>
        </span>
      </div>
    </div>
    <nav className={s.progress} aria-label="Этапы оформления">
      {CLAIM_STEPS.map((label, index) => (
        <div
          className={`${s.progressStep} ${index <= step ? s.progressStepActive : ''}`}
          aria-current={index === step ? 'step' : undefined}
          key={label}
        >
          <span>{index + 1}</span>
          <small>{label}</small>
        </div>
      ))}
    </nav>
  </header>
);
