import { Button } from 'src/shared/ui/buttons/Button';
import s from './ClaimFormPage.module.scss';

export const MissingDocument = () => (
  <main className={s.statePage}>
    <section className={s.stateCard}>
      <span className={s.stateIcon} aria-hidden="true">
        !
      </span>
      <h1>Не указан документ</h1>
      <p>Откройте ссылку на возврат из заказа или сообщения от Askona.</p>
    </section>
  </main>
);

export const LoadingDocument = () => (
  <main className={s.statePage} aria-busy="true">
    <section className={s.loadingCard}>
      <div className={s.logoMark} aria-hidden="true">
        a
      </div>
      <div className={s.spinner} />
      <h1>Открываем документ</h1>
      <p>Это займёт несколько секунд.</p>
    </section>
  </main>
);

type DocumentErrorProps = {
  message: string;
  onRetry: () => void;
};

export const DocumentError = ({ message, onRetry }: DocumentErrorProps) => (
  <main className={s.statePage}>
    <section className={s.stateCard}>
      <span className={s.stateIcon} aria-hidden="true">
        !
      </span>
      <h1>Не удалось открыть документ</h1>
      <p>{message}</p>
      <Button type="button" onClick={onRetry}>
        Попробовать снова
      </Button>
    </section>
  </main>
);
