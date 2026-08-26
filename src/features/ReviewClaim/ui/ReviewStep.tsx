import type { ReactNode } from 'react';
import type { ClaimAttachment, ClaimDictionaryItem, ClaimFlaw } from 'src/entities/Claim';
import type { DocumentDetail } from 'src/entities/Document';
import { Button } from 'src/shared/ui/Button';
import { FormStep } from 'src/shared/ui/FormStep';
import { List } from 'src/shared/ui/List';
import { ClaimDetailsReview } from './ClaimDetailsReview';
import { ClaimOptionsReview } from './ClaimOptionsReview';
import styles from './ReviewStep.module.scss';
import type { ReviewSection } from '../types/reviewClaim';

type ReviewStepProps = {
  products: DocumentDetail[];
  selectedLines: Record<string, number>;
  reason?: ClaimDictionaryItem;
  demand?: ClaimDictionaryItem;
  flaw?: ClaimFlaw;
  description: string;
  isLeftAddress: boolean;
  isOpenClient: boolean;
  attachments: ClaimAttachment[];
  onEdit: (section: ReviewSection) => void;
};

type ReviewCardProps = {
  children: ReactNode;
  onEdit: () => void;
  title: string;
};

const ReviewCard = ({ children, onEdit, title }: ReviewCardProps) => (
  <section className={styles.reviewCard}>
    <div className={styles.reviewCardHeading}>
      <h2>{title}</h2>
      <Button size="small" variant="text" onClick={onEdit}>
        Изменить
      </Button>
    </div>
    {children}
  </section>
);

export const ReviewStep = ({
  products,
  selectedLines,
  reason,
  demand,
  flaw,
  description,
  isLeftAddress,
  isOpenClient,
  attachments,
  onEdit,
}: ReviewStepProps) => {
  const selectedProducts = products.filter((product) => selectedLines[product.lineId]);
  return (
    <FormStep
      description="После отправки мы зарегистрируем претензию и покажем её номер."
      step={4}
      title="Проверьте обращение"
      titleId="review-title"
    >
      <div className={styles.reviewList}>
        <ReviewCard title="Товары" onEdit={() => onEdit('products')}>
          <ul className={styles.reviewItems}>
            <List
              items={selectedProducts}
              getKey={(product) => product.lineId}
              renderItem={(product) => (
                <li>
                  <strong>{product.productName}</strong>
                  <span>{selectedLines[product.lineId]} шт.</span>
                </li>
              )}
            />
          </ul>
          <ClaimOptionsReview isLeftAddress={isLeftAddress} isOpenClient={isOpenClient} />
        </ReviewCard>
        <ReviewCard title="Обращение" onEdit={() => onEdit('details')}>
          <ClaimDetailsReview
            reason={reason}
            demand={demand}
            flaw={flaw}
            description={description}
          />
        </ReviewCard>
        <ReviewCard title="Вложения" onEdit={() => onEdit('attachments')}>
          {attachments.length ? (
            <ul className={styles.reviewItems}>
              <List
                items={attachments}
                getKey={(attachment) => attachment.localId}
                renderItem={(attachment) => (
                  <li>
                    <strong>{attachment.fileName}</strong>
                    <span>{attachment.attachmentTypeName ?? 'Файл'}</span>
                  </li>
                )}
              />
            </ul>
          ) : (
            <p className={styles.reviewEmpty}>Вложения не добавлены.</p>
          )}
        </ReviewCard>
      </div>
    </FormStep>
  );
};
