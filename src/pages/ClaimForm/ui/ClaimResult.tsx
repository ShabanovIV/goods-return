import { Button } from 'src/shared/ui/buttons/Button/Button';
import s from './ClaimFormPage.module.scss';

type ClaimResultProps = {
  claimNumber: string;
  onStartAgain: () => void;
};

export const ClaimResult = ({ claimNumber, onStartAgain }: ClaimResultProps) => (
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
      <Button type="button" variant="secondary" onClick={onStartAgain}>
        Вернуться к документу
      </Button>
    </section>
  </main>
);
