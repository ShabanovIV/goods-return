import { Button } from 'src/shared/ui/buttons/Button';
import s from './ClaimFormPage.module.scss';

type DictionaryErrorProps = {
  message: string;
  onRetry: () => void;
};

export const DictionaryError = ({ message, onRetry }: DictionaryErrorProps) => (
  <div className={s.dictionaryError} role="alert">
    <span>{message}</span>
    <Button type="button" variant="secondary" onClick={onRetry}>
      Повторить
    </Button>
  </div>
);
