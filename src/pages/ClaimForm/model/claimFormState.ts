import type { ClaimFormState } from '../types/claimForm';

export const CLAIM_STEPS = ['Товары', 'Обращение', 'Вложения', 'Проверка'] as const;

export const createEmptyClaimForm = (): ClaimFormState => ({
  step: 0,
  selectedLines: {},
  reasonId: '',
  clientDemandId: '',
  flawId: '',
  description: '',
  isLeftAddress: true,
  isOpenClient: false,
  attachments: [],
});
