"use client";
import { Suspense, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import Dropdown from '@/components/ui/Dropdown';
import CategoryPicker from '@/components/ui/CategoryPicker';
import LocationPicker from '@/components/ui/LocationPicker';
import AttributesForm from '@/components/listing/AttributesForm';
import { usePostViewModel } from './usePostViewModel';

type CategoryNode = { id: number; name: string; slug: string; is_leaf: boolean; icon?: string; children: CategoryNode[] };

function PostPageContent() {
  const { t, locale } = useI18n();
  const vm = usePostViewModel();

  // Wait for client-side mount to avoid hydration issues with translations
  if (!vm.mounted) {
    return <div className="page-section page-section--padded post-page" style={{ minHeight: '400px' }}></div>;
  }

  const pageTitle = vm.isEditMode ? t('post.editTitle') : t('post.createTitle');

  return (
    <div className="page-section page-section--padded post-page">
      <h2>{pageTitle}</h2>
      <div className="form-section">
        <div className="form-card">
          <h3>{t('post.describeDetails')}</h3>
          <div className="field">
            <label>{t('post.titleLabel')}</label>
            <input
              value={vm.title}
              onChange={e => vm.setTitle(e.target.value.slice(0, 70))}
              placeholder={t('post.titlePlaceholder')}
            />
            <div className="muted" style={{ textAlign: 'right' }}>{vm.title.length}/70</div>
          </div>
          <div className="field">
            <label>{t('post.categoryLabel')}</label>
            <div className="row">
              <button
                type="button"
                className="btn-outline"
                onClick={() => vm.setCatPickerOpen(true)}
              >
                {vm.selectedCat && vm.selectedCatPath
                  ? vm.selectedCatPath
                  : vm.selectedCat
                    ? t('post.categorySelected')
                    : t('post.selectCategory')}
              </button>
            </div>
            <CategoryPicker
              open={vm.catPickerOpen}
              categories={vm.categories as any}
              onClose={() => vm.setCatPickerOpen(false)}
              onSelect={vm.onCategorySelect}
            />
          </div>
        </div>

        <div className="form-card">
          <h3>{t('post.photos')}</h3>
          <p className="muted" style={{ marginTop: -8 }}>
            {t('post.photoNote', { max: vm.maxImages, size: vm.maxFileSizeMb })}
          </p>
          <div className="photo-grid">
            {/* Show existing media in edit mode */}
            {vm.existingMedia.map((media, idx) => (
              <div
                key={`existing-${media.id}`}
                className="photo-tile"
                draggable
                onDragStart={() => vm.handleDragStart(idx, 'existing')}
                onDragOver={vm.handleDragOver}
                onDrop={() => vm.handleDrop(idx, 'existing')}
                style={{ cursor: 'move' }}
              >
                {idx === 0 && (
                  <div className="photo-main-badge" title={t('post.mainPhoto')}>
                    {t('post.mainPhotoBadge')}
                  </div>
                )}
                <img src={media.image_url || media.image} alt="" />
                <button
                  type="button"
                  className="photo-remove"
                  onClick={() => vm.deleteExistingMedia(media.id)}
                  title={t('post.deletePhoto')}
                >
                  ×
                </button>
              </div>
            ))}
            {/* Show new files being uploaded */}
            {vm.files.map((f, idx) => (
              <div
                key={`new-${idx}`}
                className="photo-tile"
                draggable
                onDragStart={() => vm.handleDragStart(idx, 'new')}
                onDragOver={vm.handleDragOver}
                onDrop={() => vm.handleDrop(idx, 'new')}
                style={{ cursor: 'move' }}
              >
                {vm.existingMedia.length === 0 && idx === 0 && (
                  <div className="photo-main-badge" title={t('post.mainPhoto')}>
                    {t('post.mainPhotoBadge')}
                  </div>
                )}
                <img src={URL.createObjectURL(f)} alt="" />
                <button type="button" className="photo-remove" onClick={() => vm.removeFile(idx)}>
                  🗑️
                </button>
              </div>
            ))}
            <label className="photo-tile add">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={vm.onPickFiles}
                style={{ display: 'none' }}
              />
              <span>{t('post.addPhoto')}</span>
            </label>
            {Array.from({ length: Math.max(0, vm.maxImages - vm.files.length - vm.existingMedia.length - 1) }).map((_, i) => (
              <div key={`ph-${i}`} className="photo-tile placeholder">
                📷
              </div>
            ))}
          </div>
        </div>

        <div className="form-card">
          <div className="field">
            <label>{t('post.descriptionLabel')}</label>
            <textarea
              rows={6}
              value={vm.description}
              onChange={e => vm.setDescription(e.target.value.slice(0, 9000))}
              placeholder={t('post.descriptionPlaceholder')}
            ></textarea>
            <div className="muted" style={{ textAlign: 'right' }}>{vm.description.length}/9000</div>
          </div>
        </div>

        <div className="form-card">
          <div className="row" style={{ gap: 8 }}>
            {([
              { key: 'sell', label: t('post.dealTypeSell') },
              { key: 'exchange', label: t('post.dealTypeExchange') },
              { key: 'free', label: t('post.dealTypeFree') },
            ] as const).map(opt => (
              <button
                key={opt.key}
                type="button"
                className="btn-outline"
                onClick={() => vm.setDealType(opt.key)}
                style={{ background: vm.dealType === opt.key ? '#e9f8f7' : '#fff' }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {vm.dealType === 'sell' && (
            <div style={{ marginTop: 12 }}>
              <div className="row">
                <div className="field" style={{ width: 300 }}>
                  <label>{t('post.priceLabel')}</label>
                  <input
                    type="number"
                    value={vm.price}
                    onChange={e => vm.setPrice(e.target.value)}
                    disabled={vm.negotiable}
                  />
                </div>
                <div className="field">
                  <label>{t('post.currencyLabel')}</label>
                  <Dropdown
                    value={vm.priceCurrency}
                    onChange={(v) => vm.setPriceCurrency((v as string) || vm.currencyOptions[0])}
                    options={vm.currencyOptions.map((value) => ({ value, label: value }))}
                    style={{ height: "50px" }}
                    align="left"
                  />
                </div>
              </div>
              <div className="row" style={{ alignItems: 'center' }}>
                <label className="muted">{t('post.negotiable')}</label>
                <input
                  type="checkbox"
                  checked={vm.negotiable}
                  onChange={e => vm.setNegotiable(e.target.checked)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="form-card">
          <h3>{t('post.additionalInfo')}</h3>
          <div className="field">
            <label>{t('post.sellerTypeLabel')}</label>
            <div className="row" style={{ gap: 8 }}>
              <button
                type="button"
                className="btn-outline"
                onClick={() => vm.setSellerType('person')}
                style={{ background: vm.sellerType === 'person' ? '#e9f8f7' : '#fff' }}
              >
                {t('post.sellerTypePerson')}
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => vm.setSellerType('business')}
                style={{ background: vm.sellerType === 'business' ? '#e9f8f7' : '#fff' }}
              >
                {t('post.sellerTypeBusiness')}
              </button>
            </div>
          </div>
          <div className="field">
            <label>{t('post.conditionLabel')}</label>
            <div className="row" style={{ gap: 8 }}>
              <button
                type="button"
                className="btn-outline"
                onClick={() => vm.setCondition('used')}
                style={{ background: vm.condition === 'used' ? '#e9f8f7' : '#fff' }}
              >
                {t('post.conditionUsed')}
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => vm.setCondition('new')}
                style={{ background: vm.condition === 'new' ? '#e9f8f7' : '#fff' }}
              >
                {t('post.conditionNew')}
              </button>
            </div>
          </div>
        </div>

        {vm.selectedCat && vm.attrs.length > 0 && (
          <div className="form-card">
            <h3>{t('post.characteristics')}</h3>
            <AttributesForm
              attrs={vm.attrs as any}
              values={vm.values}
              onChange={vm.setAttrValue}
              locale={locale}
            />
          </div>
        )}

        <div className="form-card">
          <h3>{t('post.locationTitle')}</h3>
          <div className="field">
            <label>{t('post.selectLocation')}</label>
            <button
              type="button"
              className="btn-outline"
              onClick={() => vm.setLocationPickerOpen(true)}
              style={{ flexWrap: 'wrap', textAlign: 'left', minWidth: '100px', maxWidth: '300px' }}
            >
              {vm.locationPath || t('post.selectRegionCity')}
            </button>
          </div>
          <LocationPicker
            open={vm.locationPickerOpen}
            onClose={() => vm.setLocationPickerOpen(false)}
            onSelect={vm.onLocationSelect}
          />
        </div>

        <div className="form-card">
          <h3>{t('post.contactInfo')}</h3>
          <p className="muted" style={{ marginTop: -8, marginBottom: 16 }}>
            {t('post.contactInfoNote')}
          </p>
          <div className="field">
            <label>{t('post.contactNameLabel')}*</label>
            <input
              value={vm.contactName}
              onChange={e => vm.setContactName(e.target.value.slice(0, 255))}
              placeholder={t('post.contactNamePlaceholder')}
            />
          </div>
          <div className="field">
            <label>{t('post.contactEmailLabel')}</label>
            <input
              type="email"
              value={vm.contactEmail}
              onChange={e => vm.setContactEmail(e.target.value.slice(0, 255))}
              placeholder={t('post.contactEmailPlaceholder')}
            />
          </div>
          <div className="field">
            <label>{t('post.contactPhoneLabel')}</label>
            <input
              type="tel"
              value={vm.contactPhone}
              onChange={e => vm.setContactPhone(e.target.value.slice(0, 20))}
              placeholder={t('post.contactPhonePlaceholder')}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            className="btn-accent"
            onClick={vm.onSubmit}
            disabled={
              vm.uploading ||
              !vm.selectedCat ||
              !vm.locationId ||
              !vm.title ||
              !vm.contactName ||
              (vm.dealType === 'sell' && !vm.negotiable && !vm.price)
            }
          >
            {vm.uploading
              ? t('post.saving')
              : vm.isEditMode
                ? t('post.saveChanges')
                : t('post.publish')}
          </button>
          {vm.error && <span className="muted" style={{ marginLeft: 12 }}>{vm.error}</span>}
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  const { t } = useI18n();
  return <div className="py-8 text-center">{t('post.loading')}</div>;
}

export default function PostPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PostPageContent />
    </Suspense>
  );
}
