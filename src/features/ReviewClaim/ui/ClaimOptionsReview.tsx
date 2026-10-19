import styles from './ReviewStep.module.scss';

type ClaimOptionsReviewProps = {
  isLeftAddress: boolean | null;
  isOpenClient: boolean | null;
};

export const ClaimOptionsReview = ({ isLeftAddress, isOpenClient }: ClaimOptionsReviewProps) => (
  <dl className={`${styles.reviewDetails} ${styles.claimOptionsReview}`}>
    <div>
      <dt>Товар оставлен на адресе</dt>
      <dd>{isLeftAddress === null ? 'Не выбрано' : isLeftAddress ? 'Да' : 'Нет'}</dd>
    </div>
    <div>
      <dt>Упаковка вскрыта в присутствии клиента</dt>
      <dd>{isOpenClient === null ? 'Не выбрано' : isOpenClient ? 'Да' : 'Нет'}</dd>
    </div>
  </dl>
);
