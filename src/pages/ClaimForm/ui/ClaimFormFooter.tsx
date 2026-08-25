import { Button } from 'src/shared/ui/Button';
import s from './ClaimFormPage.module.scss';
import type { ClaimStep } from '../model/claimForm';

type ClaimFormFooterProps = {
  isCreatingClaim: boolean;
  onBack: () => void;
  onNext: () => void;
  step: ClaimStep;
};

export const ClaimFormFooter = ({
  isCreatingClaim,
  onBack,
  onNext,
  step,
}: ClaimFormFooterProps) => {
  const buttonText = isCreatingClaim
    ? 'Отправляем…'
    : step === 3
      ? 'Отправить претензию'
      : 'Продолжить';

  return (
    <footer className={s.actionBar} data-overlay-boundary="bottom">
      <div className={s.actionBarInner}>
        {step > 0 && (
          <Button type="button" variant="secondary" disabled={isCreatingClaim} onClick={onBack}>
            Назад
          </Button>
        )}
        <Button className={s.nextButton} type="button" disabled={isCreatingClaim} onClick={onNext}>
          {buttonText}
        </Button>
      </div>
    </footer>
  );
};
