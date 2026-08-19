import type { AttachmentMediaType, AttachmentType } from 'src/entities/Claim';

const extensions: Record<Exclude<AttachmentMediaType, 'file'>, string[]> = {
  image: ['heic', 'heif', 'jpeg', 'jpg', 'png', 'webp'],
  video: ['3gp', 'm4v', 'mov', 'mp4', 'webm'],
};

export const getAttachmentMediaType = (attachmentType: AttachmentType): AttachmentMediaType => {
  if (attachmentType.mediaType) return attachmentType.mediaType;
  const normalizedName = attachmentType.name.toLocaleLowerCase('ru');
  if (normalizedName.includes('видео')) return 'video';
  if (/фото|изображ|снимок/.test(normalizedName)) return 'image';
  return 'file';
};

export const getMediaAccept = (mediaType: AttachmentMediaType) => {
  if (mediaType === 'image') return 'image/*';
  if (mediaType === 'video') return 'video/*';
  return undefined;
};

export const isFileAllowed = (file: File, mediaType: AttachmentMediaType) => {
  if (mediaType === 'file') return true;
  if (file.type.toLowerCase().startsWith(`${mediaType}/`)) return true;
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  return extensions[mediaType].includes(extension);
};
