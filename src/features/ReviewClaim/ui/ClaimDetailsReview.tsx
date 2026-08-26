import type { ClaimDictionaryItem, ClaimFlaw } from 'src/entities/Claim';
import styles from './ReviewStep.module.scss';

type ClaimDetailsReviewProps = {
  reason?: ClaimDictionaryItem;
  demand?: ClaimDictionaryItem;
  flaw?: ClaimFlaw;
  description: string;
};

export const ClaimDetailsReview = ({
  reason,
  demand,
  flaw,
  description,
}: ClaimDetailsReviewProps) => (
  <dl className={styles.reviewDetails}>
    <div>
      <dt>Причина</dt>
      <dd>{reason?.name ?? 'Не выбрана'}</dd>
    </div>
    <div>
      <dt>Недостаток</dt>
      <dd>{flaw?.name ?? 'Не выбран'}</dd>
    </div>
    <div>
      <dt>Требование клиента</dt>
      <dd>{demand?.name ?? 'Не выбрано'}</dd>
    </div>
    <div>
      <dt>Суть претензии</dt>
      <dd>{description}</dd>
    </div>
  </dl>
);
