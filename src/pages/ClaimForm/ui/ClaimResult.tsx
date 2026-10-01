import { Alert } from 'src/shared/ui/Alert';
import { Button } from 'src/shared/ui/Button';
import s from './ClaimFormPage.module.scss';

type ClaimResultProps = {
  claimNumber: string;
  draftCleanupStatus: 'pending' | 'success' | 'error';
  onRetryDraftCleanup: () => void;
  onReturnToDocument: () => void;
};

export const ClaimResult = ({
  claimNumber,
  draftCleanupStatus,
  onRetryDraftCleanup,
  onReturnToDocument,
}: ClaimResultProps) => (
  <main className={s.resultPage}>
    <section className={s.resultCard}>
      <div className={s.successIcon} aria-hidden="true">
        ✓
      </div>
      <p className={s.eyebrow}>Готово</p>
      <h1>Претензия зарегистрирована</h1>
      <p>Мы проверим информацию и свяжемся с вами, если потребуются уточнения.</p>
      <div className={s.claimNumber}>
        <span>Номер претензии</span>
        <strong>{claimNumber}</strong>
      </div>
      {draftCleanupStatus === 'pending' && <p role="status">Удаляем черновик…</p>}
      {draftCleanupStatus === 'error' && (
        <Alert
          tone="warning"
          action={
            <Button type="button" variant="secondary" onClick={onRetryDraftCleanup}>
              Повторить удаление
            </Button>
          }
        >
          Претензия создана, но удалить черновик не удалось.
        </Alert>
      )}
      <Button
        type="button"
        variant="secondary"
        disabled={draftCleanupStatus === 'pending'}
        onClick={onReturnToDocument}
      >
        Вернуться к документу
      </Button>
    </section>
  </main>
);
