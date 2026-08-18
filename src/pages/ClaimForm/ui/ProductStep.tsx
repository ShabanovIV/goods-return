import type { DocumentDetail } from 'src/entities/Document';
import s from './ClaimFormPage.module.scss';
import type { ClaimFormState } from '../model/claimForm';

type ProductStepProps = {
  products: DocumentDetail[];
  selectedLines: ClaimFormState['selectedLines'];
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
    <section className={s.stepSection} aria-labelledby="products-title">
      <div className={s.sectionHeading}>
        <p className={s.eyebrow}>Шаг 1 из 4</p>
        <h1 id="products-title">Какие товары вас беспокоят?</h1>
        <p>Выберите одну или несколько позиций и укажите количество.</p>
      </div>

      {showErrors && selectedCount === 0 && (
        <div className={s.fieldError} role="alert">
          Выберите хотя бы один товар.
        </div>
      )}

      <div className={s.productList}>
        {products.length === 0 && (
          <div className={s.emptyProducts}>
            <span aria-hidden="true">⌁</span>
            <strong>В документе нет товаров для возврата</strong>
            <p>Проверьте ссылку или обратитесь в поддержку.</p>
          </div>
        )}
        {products.map((product) => {
          const amount = selectedLines[product.lineId];
          const isSelected = amount !== undefined;
          const maxAmount = Math.max(0, Math.floor(product.amount));
          const hasAmountError =
            isSelected && (!Number.isInteger(amount) || amount < 1 || amount > maxAmount);

          return (
            <article
              className={`${s.productCard} ${isSelected ? s.productCardSelected : ''}`}
              key={product.lineId}
            >
              <label className={s.productChoice}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={maxAmount === 0}
                  onChange={() => onToggle(product)}
                />
                <span className={s.customCheckbox} aria-hidden="true">
                  {isSelected ? '✓' : ''}
                </span>
                <span className={s.productInfo}>
                  <strong>{product.productName}</strong>
                  <span>
                    {maxAmount > 0 ? `Доступно: ${maxAmount} шт.` : 'Недоступно для возврата'}
                  </span>
                </span>
              </label>

              {isSelected && (
                <div className={s.quantityBlock}>
                  <span className={s.quantityLabel}>Количество для претензии</span>
                  <div className={s.quantityControl}>
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
                      onBlur={() => {
                        if (hasAmountError) onAmountChange(product, 1);
                      }}
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
                    <span className={s.inputError}>Укажите целое число от 1 до {maxAmount}.</span>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};
