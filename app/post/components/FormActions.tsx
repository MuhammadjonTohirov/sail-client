"use client";

import type { TranslateFn } from './types';

interface FormActionsProps {
  t: TranslateFn;
  uploading: boolean;
  isEditMode: boolean;
  disabled: boolean;
  onSubmit: () => void;
  error: string;
}

export function FormActions({
  t,
  uploading,
  isEditMode,
  disabled,
  onSubmit,
  error,
}: FormActionsProps) {
  const label = uploading
    ? t('post.saving')
    : isEditMode
      ? t('post.saveChanges')
      : t('post.publish');

  return (
    <div className="form-actions">
      <button
        type="button"
        className="btn-accent"
        onClick={onSubmit}
        disabled={disabled}
      >
        {label}
      </button>
      {error && <span className="muted" style={{ marginLeft: 12 }}>{error}</span>}
    </div>
  );
}
