import { Alert } from 'src/shared/ui/Alert';
import { Button } from 'src/shared/ui/Button';

type DictionaryErrorProps = {
  message: string;
  onRetry: () => void;
};

export const DictionaryError = ({ message, onRetry }: DictionaryErrorProps) => (
  <Alert
    action={
      <Button size="small" variant="secondary" onClick={onRetry}>
        Повторить
      </Button>
    }
  >
    {message}
  </Alert>
);
