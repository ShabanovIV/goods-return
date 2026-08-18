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
          a
        </span>
        <span>
          <strong>Возврат товаров</strong>
          <small>{draftMessage}</small>
        </span>
      </div>
      <span className={s.secureBadge}>
        <span aria-hidden="true">◇</span> Данные защищены
      </span>
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
