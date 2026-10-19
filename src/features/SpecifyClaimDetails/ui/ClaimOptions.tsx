import { FormField } from 'src/shared/ui/FormField';
import { Select } from 'src/shared/ui/Select';
import styles from './ClaimOptions.module.scss';
import type { ClaimOptionsProps } from '../types/claimDetails';

const options = [
  { label: 'Да', value: 'true' },
  { label: 'Нет', value: 'false' },
];

export const ClaimOptions = ({
  isLeftAddress,
  isOpenClient,
  onLeftAddressChange,
  onOpenClientChange,
  showErrors,
}: ClaimOptionsProps) => (
  <section className={styles.claimOptions} aria-label="Параметры претензии">
    {[
      {
        id: 'left-address',
        label: 'Товар оставлен на адресе',
        value: isLeftAddress,
        onChange: onLeftAddressChange,
      },
      {
        id: 'open-client',
        label: 'Упаковка вскрыта в присутствии клиента',
        value: isOpenClient,
        onChange: onOpenClientChange,
      },
    ].map(({ id, label, value, onChange }) => {
      const invalid = showErrors && value === null;
      return (
        <FormField
          key={id}
          htmlFor={id}
          label={label}
          error={invalid ? 'Выберите «Да» или «Нет».' : ''}
        >
          <Select
            id={id}
            value={value === null ? '' : String(value)}
            options={options}
            placeholder="Не выбрано"
            aria-invalid={invalid}
            aria-describedby={invalid ? `${id}-error` : undefined}
            onChange={(answer) => onChange(answer === '' ? null : answer === 'true')}
          />
        </FormField>
      );
    })}
  </section>
);
