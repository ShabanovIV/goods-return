import { FormEvent, useState } from 'react';
import { useCallEndpointMutation } from 'src/entities/EndpointCall';
import { Button } from 'src/shared/ui/buttons/Button/Button';
import s from './EndpointRequestForm.module.scss';
import { formatResponse, isHttpUrl } from '../lib/requestHelpers';

export const EndpointRequestForm = () => {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts');
  const [validationError, setValidationError] = useState('');
  const [callEndpoint, { isLoading, data: response, error, isSuccess }] = useCallEndpointMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedUrl = url.trim();

    if (!isHttpUrl(normalizedUrl)) {
      setValidationError('Введите полный URL, начинающийся с http:// или https://');
      return;
    }

    setValidationError('');

    await callEndpoint({ url: normalizedUrl });
  };

  const requestError = error ? JSON.stringify(error, null, 2) : '';
  const requestResult =
    isSuccess && response !== undefined ? formatResponse(response) : requestError;

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      <div className={s.field}>
        <div className={s.labelRow}>
          <label className={s.label} htmlFor="endpoint-url">
            URL эндпоинта
          </label>
          <span className={s.method}>POST</span>
        </div>
        <input
          className={s.input}
          id="endpoint-url"
          name="endpoint-url"
          type="url"
          placeholder="https://api.example.com/webhook"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
            if (validationError) setValidationError('');
          }}
          aria-describedby={validationError ? 'url-error' : undefined}
          aria-invalid={Boolean(validationError)}
          autoComplete="url"
          required
        />
        {validationError && (
          <p className={s.error} id="url-error" role="alert">
            {validationError}
          </p>
        )}
      </div>

      <Button className={s.submit} type="submit" disabled={isLoading}>
        {isLoading ? 'Отправляем…' : 'Выполнить запрос'}
      </Button>

      <div className={s.divider} />

      <div className={s.field}>
        <div className={s.labelRow}>
          <label className={s.label} htmlFor="endpoint-response">
            Ответ
          </label>
          <span className={s.status} aria-live="polite">
            {isLoading
              ? 'Ожидание ответа'
              : requestError
                ? 'Ошибка'
                : isSuccess
                  ? 'Получено'
                  : 'Пока пусто'}
          </span>
        </div>
        <textarea
          className={s.response}
          id="endpoint-response"
          value={requestResult}
          placeholder="Здесь появится тело ответа сервера"
          readOnly
          aria-invalid={Boolean(requestError)}
        />
      </div>
    </form>
  );
};
