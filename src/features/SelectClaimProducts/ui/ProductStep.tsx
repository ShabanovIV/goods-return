import type { DocumentDetail } from 'src/entities/Document';
import { Alert } from 'src/shared/ui/Alert';
import { FormStep } from 'src/shared/ui/FormStep';
import { List } from 'src/shared/ui/List';
import { ClaimOptions } from './ClaimOptions';
import { ProductCard } from './ProductCard';
import styles from './ProductStep.module.scss';

type ProductStepProps = {
  products: DocumentDetail[];
  selectedLines: Record<string, number>;
  showErrors: boolean;
  isLeftAddress: boolean;
  isOpenClient: boolean;
  onToggle: (product: DocumentDetail) => void;
  onAmountChange: (product: DocumentDetail, amount: number) => void;
  onLeftAddressChange: (checked: boolean) => void;
  onOpenClientChange: (checked: boolean) => void;
};

export const ProductStep = ({
  products,
  selectedLines,
  showErrors,
  isLeftAddress,
  isOpenClient,
  onToggle,
  onAmountChange,
  onLeftAddressChange,
  onOpenClientChange,
}: ProductStepProps) => {
  const selectedCount = Object.keys(selectedLines).length;

  return (
    <FormStep
      description="Выберите одну или несколько позиций и укажите количество."
      step={1}
      title="Товары"
      titleId="products-title"
    >
      <ClaimOptions
        isLeftAddress={isLeftAddress}
        isOpenClient={isOpenClient}
        onLeftAddressChange={onLeftAddressChange}
        onOpenClientChange={onOpenClientChange}
      />
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
