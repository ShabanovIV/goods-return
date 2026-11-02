import styles from './ErrorMessage.module.scss';
export type ErrorNotice = {
  source: 'api' | 'request' | 'form';
  message: string;
  details?: string;
  origin?: 'attachmentSelection';
};
const titles = {
  api: 'Ответ сервиса',
  request: 'Ошибка обращения к серверу',
  form: 'Сообщение формы',
};
export const ErrorMessage = ({ notice }: { notice: ErrorNotice | string }) => {
  const value: ErrorNotice =
    typeof notice === 'string' ? { source: 'form', message: notice } : notice;
  return (
    <div className={styles.message}>
      <strong>{titles[value.source]}</strong>
      <div>{value.message}</div>
      {(value.source !== 'api' || __SHOW_API_ERROR_DETAILS__) && value.details && (
        <details>
          <summary>Технические подробности</summary>
          <pre>{value.details}</pre>
        </details>
      )}
    </div>
  );
};
