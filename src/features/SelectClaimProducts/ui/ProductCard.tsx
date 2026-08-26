import type { DocumentDetail } from 'src/entities/Document';
import { Checkbox } from 'src/shared/ui/Checkbox';
import { FieldError } from 'src/shared/ui/FieldError';
import styles from './ProductStep.module.scss';

type ProductCardProps = {
  amount?: number;
  product: DocumentDetail;
  showErrors: boolean;
  onAmountChange: (product: DocumentDetail, amount: number) => void;
  onToggle: (product: DocumentDetail) => void;
};

export const ProductCard = ({
  amount,
  product,
  showErrors,
  onAmountChange,
  onToggle,
}: ProductCardProps) => {
  const isSelected = amount !== undefined;
  const maxAmount = Math.max(0, Math.floor(product.amount));
  const hasAmountError =
    isSelected && (!Number.isInteger(amount) || amount < 1 || amount > maxAmount);

  return (
    <article className={`${styles.productCard} ${isSelected ? styles.productCardSelected : ''}`}>
      <label className={styles.productChoice}>
        <Checkbox
          checked={isSelected}
          disabled={maxAmount === 0}
          onChange={() => onToggle(product)}
        />
        <span className={styles.productInfo}>
          <strong>{product.productName}</strong>
          <span>{maxAmount > 0 ? `Доступно: ${maxAmount} шт.` : 'Недоступно для возврата'}</span>
        </span>
      </label>
      {isSelected && (
        <div className={styles.quantityBlock}>
          <span className={styles.quantityLabel}>Количество для претензии</span>
          <div className={styles.quantityControl}>
            <button
              type="button"
              aria-label={`Уменьшить количество ${product.productName}`}
              disabled={amount <= 1}
              onClick={() => onAmountChange(product, amount - 1)}
            >
              −
            </button>
            <input
              aria-label={`Количество ${product.productName}`}
              aria-invalid={hasAmountError}
              inputMode="numeric"
              min={1}
              max={maxAmount}
              step={1}
              type="number"
              value={amount}
              onChange={(event) => onAmountChange(product, Number(event.target.value))}
              onBlur={() => hasAmountError && onAmountChange(product, 1)}
            />
            <button
              type="button"
              aria-label={`Увеличить количество ${product.productName}`}
              disabled={amount >= maxAmount}
              onClick={() => onAmountChange(product, amount + 1)}
            >
              +
            </button>
          </div>
          {showErrors && hasAmountError && (
            <FieldError>Укажите целое число от 1 до {maxAmount}.</FieldError>
          )}
        </div>
      )}
    </article>
  );
};
