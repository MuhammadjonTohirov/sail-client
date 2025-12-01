"use client";

import type { ChangeEvent, DragEvent } from 'react';
import type { TranslateFn } from './types';
import { trustedImageUrl } from '@/config';

type ExistingMedia = { id: number; image?: string; imageUrl?: string };

interface PhotoSectionProps {
  t: TranslateFn;
  existingMedia: ExistingMedia[];
  files: File[];
  maxImages: number;
  maxFileSizeMb: number;
  onPickFiles: (event: ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  deleteExistingMedia: (mediaId: number) => Promise<void>;
  handleDragStart: (index: number, type: 'existing' | 'new') => void;
  handleDragOver: (event: DragEvent) => void;
  handleDrop: (dropIndex: number, dropType: 'existing' | 'new') => void;
}

export function PhotoSection({
  t,
  existingMedia,
  files,
  maxImages,
  maxFileSizeMb,
  onPickFiles,
  removeFile,
  deleteExistingMedia,
  handleDragStart,
  handleDragOver,
  handleDrop,
}: PhotoSectionProps) {
  const placeholders = Math.max(0, maxImages - files.length - existingMedia.length - 1);

  return (
    <div className="form-card">
      <h3>{t('post.photos')}</h3>
      <p className="muted" style={{ marginTop: -8 }}>
        {t('post.photoNote', { max: maxImages, size: maxFileSizeMb })}
      </p>
      <div className="photo-grid">
        {existingMedia.map((media, idx) => (
          <div
            key={`existing-${media.id}`}
            className="photo-tile"
            draggable
            onDragStart={() => handleDragStart(idx, 'existing')}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(idx, 'existing')}
            style={{ cursor: 'move' }}
          >
            {idx === 0 && (
              <div className="photo-main-badge" title={t('post.mainPhoto')}>
                {t('post.mainPhotoBadge')}
              </div>
            )}
            <img src={trustedImageUrl(media.imageUrl ?? '') || media.image || ''} alt="" />
            <button
              type="button"
              className="photo-remove"
              onClick={() => deleteExistingMedia(media.id)}
              title={t('post.deletePhoto')}
            >
              ×
            </button>
          </div>
        ))}

        {files.map((file, idx) => (
          <div
            key={`new-${idx}`}
            className="photo-tile"
            draggable
            onDragStart={() => handleDragStart(idx, 'new')}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(idx, 'new')}
            style={{ cursor: 'move' }}
          >
            {existingMedia.length === 0 && idx === 0 && (
              <div className="photo-main-badge" title={t('post.mainPhoto')}>
                {t('post.mainPhotoBadge')}
              </div>
            )}
            <img src={URL.createObjectURL(file)} alt="" />
            <button type="button" className="photo-remove" onClick={() => removeFile(idx)}>
              🗑️
            </button>
          </div>
        ))}

        <label className="photo-tile add">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onPickFiles}
            style={{ display: 'none' }}
          />
          <span>{t('post.addPhoto')}</span>
        </label>

        {Array.from({ length: placeholders }).map((_, i) => (
          <div key={`placeholder-${i}`} className="photo-tile placeholder">
            📷
          </div>
        ))}
      </div>
    </div>
  );
}
