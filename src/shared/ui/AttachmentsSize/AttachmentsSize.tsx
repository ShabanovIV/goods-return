import { formatAttachmentsSize, getAttachmentsLimitMessage } from 'src/shared/lib/attachmentSize';
import { Alert } from '../Alert';

export const AttachmentsSize = ({ bytes }: { bytes: number }) => (
  <div>
    <p>
      Общий размер вложений: {formatAttachmentsSize(bytes)} из{' '}
      {formatAttachmentsSize(__MAX_ATTACHMENTS_SIZE_BYTES__)}
    </p>
    {bytes > __MAX_ATTACHMENTS_SIZE_BYTES__ && <Alert>{getAttachmentsLimitMessage()}</Alert>}
  </div>
);
