import type { TFunction } from 'i18next';

export type TranslateFn = TFunction;

export type PostFile = {
  id: string;
  file: File | null;
  previewUrl: string;
  status: 'compressing' | 'ready' | 'error';
};
