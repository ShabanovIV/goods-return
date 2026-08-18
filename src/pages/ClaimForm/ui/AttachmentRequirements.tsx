import type { AttachmentType, ClaimAttachment } from 'src/entities/Claim';
import { List } from 'src/shared/ui/List';
import s from './ClaimFormPage.module.scss';

type AttachmentRequirementsProps = {
  attachmentTypes: AttachmentType[];
  attachments: ClaimAttachment[];
  showErrors: boolean;
};

export const AttachmentRequirements = ({
  attachmentTypes,
  attachments,
  showErrors,
}: AttachmentRequirementsProps) => {
  const requiredTypes = attachmentTypes.filter((type) => type.minAmount > 0);
  const countFor = (order: number) =>
    attachments.filter(
      (attachment) =>
        attachment.status !== 'needs-file' && attachment.attachmentTypeOrder === order,
    ).length;
  const hasMissing = requiredTypes.some((type) => countFor(type.order) < type.minAmount);

  return (
    <>
      {showErrors && hasMissing && (
        <div className={s.fieldError} role="alert">
          Добавьте обязательные вложения, указанные ниже.
        </div>
      )}
      {requiredTypes.length > 0 && (
        <div className={s.requirements}>
          <strong>Обязательные материалы</strong>
          <ul>
            <List
              items={requiredTypes}
              getKey={(type) => type.order}
              renderItem={(type) => (
                <li>
                  {type.name}: {countFor(type.order)} из {type.minAmount}
                </li>
              )}
            />
          </ul>
        </div>
      )}
    </>
  );
};
