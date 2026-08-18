import type { DocumentDetail } from 'src/entities/Document';
import { Alert } from 'src/shared/ui/Alert';
import { Checkbox } from 'src/shared/ui/Checkbox';
import { FieldError } from 'src/shared/ui/FieldError';
import { FormStep } from 'src/shared/ui/FormStep';
import { List } from 'src/shared/ui/List';
import styles from './ProductStep.module.scss';

type ProductStepProps = {
  products: DocumentDetail[];
  selectedLines: Record<string, number>;
  showErrors: boolean;
  onToggle: (product: DocumentDetail) => void;
  onAmountChange: (product: DocumentDetail, amount: number) => void;
};

export const ProductStep = ({
  products,
  selectedLines,
  showErrors,
  onToggle,
  onAmountChange,
}: ProductStepProps) => {
  const selectedCount = Object.keys(selectedLines).length;

  return (
    <FormStep
      description="Выберите одну или несколько позиций и укажите количество."
      step={1}
      title="Какие товары вас беспокоят?"
      titleId="products-title"
    >
      {showErrors && selectedCount === 0 && <Alert>Выберите хотя бы один товар.</Alert>}
      <div className={styles.productList}>
        {products.length === 0 && (
          <div className={styles.emptyProducts}>
            <span aria-hidden="true">⌁</span>
            <strong>В документе нет товаров для возврата</strong>
            <p>Проверьте ссылку или обратитесь в поддержку.</p>
          </div>
        )}
        <List
          items={products}
          getKey={(product) => product.lineId}
          renderItem={(product) => {
            const amount = selectedLines[product.lineId];
            const isSelected = amount !== undefined;
            const maxAmount = Math.max(0, Math.floor(product.amount));
            const hasAmountError =
              isSelected && (!Number.isInteger(amount) || amount < 1 || amount > maxAmount);

            return (
              <article
                className={`${styles.productCard} ${isSelected ? styles.productCardSelected : ''}`}
              >
                <label className={styles.productChoice}>
                  <Checkbox
                    checked={isSelected}
                    disabled={maxAmount === 0}
                    onChange={() => onToggle(product)}
                  />
                  <span className={styles.productInfo}>
                    <strong>{product.productName}</strong>
                    <span>
                      {maxAmount > 0 ? `Доступно: ${maxAmount} шт.` : 'Недоступно для возврата'}
                    </span>
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
          }}
        />
      </div>
    </FormStep>
  );
};
