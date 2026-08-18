import React, { useMemo, useState } from 'react';
import InfoIcon from 'src/shared/assets/icons/info.svg';
import { Button } from 'src/shared/ui/Button';
import s from './Fallback.module.scss';

type FallbackProps = {
  error?: unknown;
  onRetry?: () => void;
  onGoHome?: () => void;
};

const Fallback: React.FC<FallbackProps> = ({ error, onRetry, onGoHome }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const details = useMemo(() => {
    if (!error) return null;

    if (error instanceof Error) {
      return error.stack ?? error.message;
    }

    return String(error);
  }, [error]);

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
      return;
    }

    window.location.reload();
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
      return;
    }

    window.location.assign('/');
  };

  return (
    <main className={s.root} role="alert" aria-live="polite" data-testid="app-error">
      <section className={s.card}>
        <div className={s.icon} aria-hidden="true">
          <InfoIcon />
        </div>

        <h1 className={s.title}>Что-то пошло не так</h1>
        <p className={s.subtitle}>
          Похоже, произошла ошибка на странице. Попробуйте обновить или вернуться на главную.
        </p>

        <div className={s.actions}>
          <Button variant="primary" type="button" onClick={handleRetry}>
            Повторить
          </Button>
          <Button variant="secondary" type="button" onClick={handleGoHome}>
            На главную
          </Button>
        </div>

        {details && (
          <details
            className={s.details}
            open={isDetailsOpen}
            onToggle={(e) => setIsDetailsOpen(e.currentTarget.open)}
          >
            <summary className={s.detailsToggle}>
              {isDetailsOpen ? 'Скрыть детали' : 'Показать детали'}
            </summary>
            <pre className={s.detailsBox}>{details}</pre>
          </details>
        )}
      </section>
    </main>
  );
};

export default Fallback;
