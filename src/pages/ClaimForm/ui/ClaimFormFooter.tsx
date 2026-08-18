import { Button } from 'src/shared/ui/Button';
import s from './ClaimFormPage.module.scss';
import type { ClaimStep } from '../model/claimForm';

type ClaimFormFooterProps = {
  isCreatingClaim: boolean;
  isUploadingAttachments: boolean;
  onBack: () => void;
  onNext: () => void;
  step: ClaimStep;
};

export const ClaimFormFooter = ({
  isCreatingClaim,
  isUploadingAttachments,
  onBack,
  onNext,
  step,
}: ClaimFormFooterProps) => {
  const isLoading = isCreatingClaim || isUploadingAttachments;
  const buttonText = isUploadingAttachments
    ? 'Загружаем файлы…'
    : isCreatingClaim
      ? 'Отправляем…'
      : step === 3
        ? 'Отправить претензию'
        : 'Продолжить';

  return (
    <footer className={s.actionBar}>
      <div className={s.actionBarInner}>
        {step > 0 && (
          <Button type="button" variant="secondary" disabled={isLoading} onClick={onBack}>
            Назад
          </Button>
        )}
        <Button className={s.nextButton} type="button" disabled={isLoading} onClick={onNext}>
          {buttonText}
        </Button>
      </div>
    </footer>
  );
};
