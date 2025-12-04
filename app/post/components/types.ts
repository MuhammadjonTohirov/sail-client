export type TranslateFn = (key: string, options?: Record<string, any>) => string;

export type PostFile = {
  id: string;
  file: File | null;
  previewUrl: string;
  status: 'compressing' | 'ready' | 'error';
};
