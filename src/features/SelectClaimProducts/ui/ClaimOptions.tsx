import { Switch } from 'src/shared/ui/Switch';
import styles from './ProductStep.module.scss';

type ClaimOptionsProps = {
  isLeftAddress: boolean;
  isOpenClient: boolean;
  onLeftAddressChange: (checked: boolean) => void;
  onOpenClientChange: (checked: boolean) => void;
};

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
