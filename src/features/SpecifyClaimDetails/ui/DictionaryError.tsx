import { Alert } from 'src/shared/ui/Alert';
import { Button } from 'src/shared/ui/Button';
import { ErrorMessage, type ErrorNotice } from 'src/shared/ui/ErrorMessage';

type DictionaryErrorProps = {
  message: ErrorNotice | string;
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
    <ErrorMessage notice={message} />
  </Alert>
);
