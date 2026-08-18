import type { ReactNode } from 'react';
import type { ClaimDictionaryItem, ClaimFlaw } from 'src/entities/Claim';
import type { DocumentDetail } from 'src/entities/Document';
import { List } from 'src/shared/ui/List';
import s from './ClaimFormPage.module.scss';
import type { ClaimAttachment, ClaimStep } from '../model/claimForm';

type ReviewStepProps = {
  products: DocumentDetail[];
  selectedLines: Record<string, number>;
  reason?: ClaimDictionaryItem;
  demand?: ClaimDictionaryItem;
  flaws: ClaimFlaw[];
  attachments: ClaimAttachment[];
  onEdit: (step: ClaimStep) => void;
};

type ReviewCardProps = {
  title: string;
  step: ClaimStep;
  onEdit: (step: ClaimStep) => void;
  children: ReactNode;
};

const ReviewCard = ({ title, step, onEdit, children }: ReviewCardProps) => (
  <section className={s.reviewCard}>
    <div className={s.reviewCardHeading}>
      <h2>{title}</h2>
      <button type="button" onClick={() => onEdit(step)}>
        Изменить
      </button>
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
  const readyAttachments = attachments.filter((attachment) => attachment.status !== 'needs-file');

  return (
    <section className={s.stepSection} aria-labelledby="review-title">
      <div className={s.sectionHeading}>
        <p className={s.eyebrow}>Шаг 4 из 4</p>
        <h1 id="review-title">Проверьте обращение</h1>
        <p>После отправки мы зарегистрируем претензию и покажем её номер.</p>
      </div>

      <div className={s.reviewList}>
        <ReviewCard title="Товары" step={0} onEdit={onEdit}>
          <ul className={s.reviewItems}>
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

        <ReviewCard title="Обращение" step={1} onEdit={onEdit}>
          <dl className={s.reviewDetails}>
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

        <ReviewCard title="Вложения" step={2} onEdit={onEdit}>
          {readyAttachments.length ? (
            <ul className={s.reviewItems}>
              <List
                items={readyAttachments}
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
            <p className={s.reviewEmpty}>Вложения не добавлены.</p>
          )}
        </ReviewCard>
      </div>

      <p className={s.consentNote}>
        Нажимая «Отправить претензию», вы подтверждаете правильность указанных данных.
      </p>
    </section>
  );
};
