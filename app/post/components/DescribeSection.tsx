"use client";

import CategoryPicker from '@/components/ui/CategoryPicker';
import type { TranslateFn } from './types';

type CategoryNode = { id: number; name: string; slug: string; is_leaf: boolean; icon?: string; children?: CategoryNode[] };

interface DescribeSectionProps {
  t: TranslateFn;
  title: string;
  maxTitleLength: number;
  selectedCat: number | null;
  selectedCatPath: string;
  categories: CategoryNode[];
  catPickerOpen: boolean;
  onTitleChange: (value: string) => void;
  onOpenCategoryPicker: () => void;
  onCloseCategoryPicker: () => void;
  onCategorySelect: (payload: { id: number; path: string }) => void;
}

export function DescribeSection({
  t,
  title,
  maxTitleLength,
  selectedCat,
  selectedCatPath,
  categories,
  catPickerOpen,
  onTitleChange,
  onOpenCategoryPicker,
  onCloseCategoryPicker,
  onCategorySelect,
}: DescribeSectionProps) {
  const titleValue = title.slice(0, maxTitleLength);
  const categoryLabel = selectedCat && selectedCatPath
    ? selectedCatPath
    : selectedCat
      ? t('post.categorySelected')
      : t('post.selectCategory');

  return (
    <div className="form-card">
      <h3>{t('post.describeDetails')}</h3>
      <div className="field">
        <label>{t('post.titleLabel')}</label>
        <input
          value={titleValue}
          onChange={e => onTitleChange(e.target.value.slice(0, maxTitleLength))}
          placeholder={t('post.titlePlaceholder')}
        />
        <div className="muted" style={{ textAlign: 'right' }}>
          {titleValue.length}/{maxTitleLength}
        </div>
      </div>
      <div className="field">
        <label>{t('post.categoryLabel')}</label>
        <div className="row">
          <button
            type="button"
            className="btn-outline"
            onClick={onOpenCategoryPicker}
          >
            {categoryLabel}
          </button>
        </div>
        <CategoryPicker
          open={catPickerOpen}
          categories={categories as any}
          onClose={onCloseCategoryPicker}
          onSelect={onCategorySelect}
        />
      </div>
    </div>
  );
}
