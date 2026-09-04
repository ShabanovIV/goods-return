import type { DocumentDetail } from 'src/entities/Document';
import { Alert } from 'src/shared/ui/Alert';
import { FormStep } from 'src/shared/ui/FormStep';
import { List } from 'src/shared/ui/List';
import { ProductCard } from './ProductCard';
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
      title="Товары"
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
          renderItem={(product) => (
            <ProductCard
              amount={selectedLines[product.lineId]}
              product={product}
              showErrors={showErrors}
              onAmountChange={onAmountChange}
              onToggle={onToggle}
            />
          )}
        />
      </div>
    </FormStep>
  );
};
