import styles from './ReviewStep.module.scss';

type ClaimOptionsReviewProps = {
  isLeftAddress: boolean;
  isOpenClient: boolean;
};

export const ClaimOptionsReview = ({ isLeftAddress, isOpenClient }: ClaimOptionsReviewProps) => (
  <dl className={`${styles.reviewDetails} ${styles.claimOptionsReview}`}>
    <div>
      <dt>Товар оставлен на адресе</dt>
      <dd>{isLeftAddress ? 'Да' : 'Нет'}</dd>
    </div>
    <div>
      <dt>Упаковка вскрыта в присутствии клиента</dt>
      <dd>{isOpenClient ? 'Да' : 'Нет'}</dd>
    </div>
  </dl>
);
