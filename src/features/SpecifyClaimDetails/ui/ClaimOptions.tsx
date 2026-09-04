import { Switch } from 'src/shared/ui/Switch';
import styles from './ClaimOptions.module.scss';
import type { ClaimOptionsProps } from '../types/claimDetails';

export const ClaimOptions = ({
  isLeftAddress,
  isOpenClient,
  onLeftAddressChange,
  onOpenClientChange,
}: ClaimOptionsProps) => (
  <section className={styles.claimOptions} aria-label="Параметры претензии">
    <Switch
      checked={isLeftAddress}
      description="Товар находится по адресу клиента"
      label="Товар оставлен на адресе"
      onChange={(event) => onLeftAddressChange(event.target.checked)}
    />
    <Switch
      checked={isOpenClient}
      description="Упаковка была открыта при клиенте"
      label="Упаковка вскрыта в присутствии клиента"
      onChange={(event) => onOpenClientChange(event.target.checked)}
    />
  </section>
);
