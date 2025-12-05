"use client";

import type { ChangeEvent, DragEvent } from 'react';
import type { TranslateFn, PostFile } from './types';
import { trustedImageUrl } from '@/config';
import { Lineicons } from "@lineiconshq/react-lineicons";
import {
  XmarkOutlined as Xmark,
  Trash3Outlined as Trash,
  Camera1Outlined as Camera,
} from "@lineiconshq/free-icons";

type ExistingMedia = { id: number; image?: string; imageUrl?: string };

interface PhotoSectionProps {
  t: TranslateFn;
  existingMedia: ExistingMedia[];
  files: PostFile[];
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
              <Lineicons icon={Xmark} width={16} height={16} />
            </button>
          </div>
        ))}

        {files.map((postFile, idx) => (
          <div
            key={postFile.id}
            className={`photo-tile ${postFile.status === 'error' ? 'error-tile' : ''}`}
            draggable={postFile.status === 'ready'}
            onDragStart={() => handleDragStart(idx, 'new')}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(idx, 'new')}
            style={{ cursor: postFile.status === 'ready' ? 'move' : 'default', position: 'relative' }}
          >
            {existingMedia.length === 0 && idx === 0 && postFile.status === 'ready' && (
              <div className="photo-main-badge" title={t('post.mainPhoto')}>
                {t('post.mainPhotoBadge')}
              </div>
            )}
            <img src={postFile.previewUrl} alt="" style={{ opacity: postFile.status === 'compressing' ? 0.5 : 1 }} />

            {postFile.status === 'compressing' && (
              <div className="overlay">
                <div className="spinner"></div>
              </div>
            )}

            {postFile.status === 'error' && (
              <div className="overlay error-overlay">
                <span className="error-label">Error</span>
              </div>
            )}

            <button type="button" className="photo-remove" onClick={() => removeFile(idx)}>
              {postFile.status === 'error' ? (
                <Lineicons icon={Xmark} width={16} height={16} />
              ) : (
                <Lineicons icon={Trash} width={16} height={16} />
              )}
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
          <span className="flex flex-col items-center">
             <span className="mt-2">{t('post.addPhoto')}</span>
          </span>
        </label>

        {Array.from({ length: placeholders }).map((_, i) => (
          <div key={`placeholder-${i}`} className="photo-tile placeholder flex items-center justify-center">
             <Lineicons icon={Camera} width={24} height={24} style={{ opacity: 0.3 }} />
          </div>
        ))}
      </div>
      <style jsx>{`
        .error-tile {
          border: 2px solid red;
        }
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .error-overlay {
          background-color: rgba(255, 0, 0, 0.1);
        }
        .error-label {
          color: red;
          font-weight: bold;
          background: rgba(255, 255, 255, 0.8);
          padding: 2px 4px;
          border-radius: 4px;
        }
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border-left-color: var(--accent, #002f34);
          animation: spin 1s ease infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
