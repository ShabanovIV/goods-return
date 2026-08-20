import type { ReactNode } from 'react';
import styles from './AttachmentsStep.module.scss';

type AttachmentInputProps = {
  accept?: string;
  ariaLabel: string;
  capture?: 'environment' | 'user';
  children: ReactNode;
  className: string;
  multiple?: boolean;
  onFilesSelected: (files: readonly File[]) => void;
};

export const AttachmentInput = ({
  accept,
  ariaLabel,
  capture,
  children,
  className,
  multiple,
  onFilesSelected,
}: AttachmentInputProps) => (
  <label className={`${styles.fileAction} ${className}`}>
    {children}
    <input
      accept={accept}
      aria-label={ariaLabel}
      capture={capture}
      type="file"
      multiple={multiple}
      onChange={(event) => {
        const files = Array.from(event.currentTarget.files ?? []);
        event.currentTarget.value = '';
        if (files.length) onFilesSelected(files);
      }}
    />
  </label>
);
