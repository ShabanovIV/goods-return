import type { ReactNode } from 'react';
import type { ClaimAttachment, ClaimDictionaryItem, ClaimFlaw } from 'src/entities/Claim';
import type { DocumentDetail } from 'src/entities/Document';
import { Button } from 'src/shared/ui/Button';
import { FormStep } from 'src/shared/ui/FormStep';
import { List } from 'src/shared/ui/List';
import styles from './ReviewStep.module.scss';
import type { ReviewSection } from '../types/reviewClaim';

type ReviewStepProps = {
  products: DocumentDetail[];
  selectedLines: Record<string, number>;
  reason?: ClaimDictionaryItem;
  demand?: ClaimDictionaryItem;
  flaws: ClaimFlaw[];
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
  flaws,
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
        </ReviewCard>
        <ReviewCard title="Обращение" onEdit={() => onEdit('details')}>
          <dl className={styles.reviewDetails}>
            <div>
              <dt>Причина</dt>
              <dd>{reason?.name ?? 'Не выбрана'}</dd>
            </div>
            <div>
              <dt>Ожидаемое решение</dt>
              <dd>{demand?.name ?? 'Не выбрано'}</dd>
            </div>
            <div>
              <dt>Недостатки</dt>
              <dd>{flaws.map((flaw) => flaw.name).join(', ') || 'Не выбраны'}</dd>
            </div>
          </dl>
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
      <p className={styles.consentNote}>
        Нажимая «Отправить претензию», вы подтверждаете правильность указанных данных.
      </p>
    </FormStep>
  );
};
