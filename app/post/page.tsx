"use client";
import { Listings, Taxonomy } from '@/lib/api';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import Dropdown from '@/components/ui/Dropdown';
import CategoryPicker from '@/components/ui/CategoryPicker';
import LocationPicker from '@/components/ui/LocationPicker';
import MultiDropdown from '@/components/ui/MultiDropdown';
import AttributesForm from '@/components/listing/AttributesForm';
import { appConfig } from '@/config';

type CategoryNode = { id: number; name: string; slug: string; is_leaf: boolean; icon?: string; children: CategoryNode[] };
type Attr = { id: number; key: string; label: string; type: string; unit?: string; options?: string[]; is_required?: boolean; min_number?: number; max_number?: number };
type Loc = { id: number; name: string; has_children?: boolean; parent?: number | null };

function PostPageContent() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  // Ensure we're mounted before rendering translated content
  useEffect(() => {
    setMounted(true);
  }, []);
  const { upload, i18n: configI18n } = appConfig;
  const maxImages = upload.maxImages;
  const maxFileSize = upload.maxFileSize;
  const maxFileSizeMb = Math.round(maxFileSize / (1024 * 1024));
  const currencyOptions = Array.from(new Set([configI18n.currency, 'UZS', 'USD'].filter(Boolean))) as string[];

  // Check if we're in edit mode (use state to avoid hydration mismatch)
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [existingMedia, setExistingMedia] = useState<any[]>([]);

  // Initialize edit mode from search params after mount
  useEffect(() => {
    const editIdParam = searchParams.get('edit');
    setIsEditMode(!!editIdParam);
    setEditId(editIdParam ? parseInt(editIdParam, 10) : null);
  }, [searchParams]);

  const [cats, setCats] = useState<CategoryNode[]>([]);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [selectedCatPath, setSelectedCatPath] = useState<string>('');
  const [catPickerOpen, setCatPickerOpen] = useState(false);
  const [attrs, setAttrs] = useState<Attr[]>([]);

  const [locationId, setLocationId] = useState<number | null>(null);
  const [locationPath, setLocationPath] = useState<string>('');
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [priceCurrency, setPriceCurrency] = useState<string>(configI18n.currency);
  const [negotiable, setNegotiable] = useState<boolean>(false);
  const [dealType, setDealType] = useState<'sell' | 'exchange' | 'free'>('sell');
  const [sellerType, setSellerType] = useState<'person' | 'business'>('person');
  const [condition, setCondition] = useState<'new' | 'used'>('used');
  const [desc, setDesc] = useState('');
  const [values, setValues] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    (async () => {
      setCats(await Taxonomy.categories());
    })();
  }, []);

  // Load listing data when in edit mode
  useEffect(() => {
    if (isEditMode && editId) {
      (async () => {
        try {
          const listing = await Listings.detail(editId);

          // Pre-fill form fields
          setTitle(listing.title || '');
          setDesc(listing.description || '');
          setPrice(listing.price_amount ? String(listing.price_amount) : '');
          setPriceCurrency(listing.price_currency || configI18n.currency);
          setNegotiable(listing.is_price_negotiable || false);
          setDealType(listing.deal_type || 'sell');
          setSellerType(listing.seller_type || 'person');
          setCondition(listing.condition || 'used');

          const categoryId = listing.category?.id || listing.category;
          setSelectedCat(categoryId);
          setLocationId(listing.location?.id || listing.location);

          // Build category path - use category_name from API
          if (listing.category_name) {
            setSelectedCatPath(listing.category_name);
          }

          // Build location path - use location_name from API
          if (listing.location_name) {
            setLocationPath(listing.location_name);
          }

          // Load existing media
          if (listing.media && Array.isArray(listing.media)) {
            setExistingMedia(listing.media);
          }

          // Load category attributes first, then set values
          // This ensures we only set values that belong to this category
          if (categoryId) {
            const categoryAttrs = await Taxonomy.attributes(categoryId);
            setAttrs(categoryAttrs);

            // Now pre-fill attribute values using the loaded category attributes
            if (listing.attributes && Array.isArray(listing.attributes)) {
              const attrKeysMap = new Set(categoryAttrs.map((a: any) => a.key));
              const attrVals: Record<string, any> = {};

              listing.attributes.forEach((av: any) => {
                const key = av.key;
                if (!key || !attrKeysMap.has(key)) return; // Skip if not in current category

                // Determine the value based on the attribute type
                if (av.value !== undefined && av.value !== null) {
                  attrVals[key] = av.value;
                } else if (av.value_text) {
                  attrVals[key] = av.value_text;
                } else if (av.value_number !== null && av.value_number !== undefined) {
                  attrVals[key] = av.value_number;
                } else if (av.value_bool !== null && av.value_bool !== undefined) {
                  attrVals[key] = av.value_bool;
                } else if (av.value_option_key) {
                  attrVals[key] = av.value_option_key;
                }
              });
              setValues(attrVals);
            }
          }
        } catch (e: any) {
          setError(t('post.errorLoadListing'));
        }
      })();
    }
  }, [isEditMode, editId, configI18n.currency, locale]);

  useEffect(() => {
    (async () => {
      if (selectedCat) {
        const categoryAttrs = await Taxonomy.attributes(selectedCat);
        setAttrs(categoryAttrs);
      } else {
        setAttrs([]);
      }
    })();
  }, [selectedCat]);
  // Prune attribute values when the attributes set changes (category switch)
  // This ensures we only keep values that match the current category's attributes
  useEffect(() => {
    if (!attrs || attrs.length === 0) {
      // If no attributes for this category, clear all attribute values
      setValues({});
      return;
    }
    const keys = new Set(attrs.map(a => a.key));
    setValues(prev => {
      const out: Record<string, any> = {};
      for (const k of Object.keys(prev)) {
        if (keys.has(k)) {
          out[k] = prev[k];
        }
      }
      return out;
    });
  }, [attrs]);

  const flatCategories = useMemo(() => {
    const arr: { id: number; slug: string; name: string }[] = [];
    const walk = (nodes: CategoryNode[], prefix: string[]) => {
      nodes.forEach(n => {
        arr.push({ id: n.id, slug: n.slug, name: [...prefix, n.name].join(' / ') });
        if (n.children?.length) walk(n.children, [...prefix, n.name]);
      });
    };
    walk(cats, []);
    return arr;
  }, [cats]);

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files || []);
    const availableSlots = Math.max(0, maxImages - files.length);
    if (!availableSlots) {
      setError(t('post.errorMaxPhotos', { max: maxImages }));
      e.currentTarget.value = '';
      return;
    }
    const accepted: File[] = [];
    const rejected: string[] = [];
    for (const file of incoming) {
      if (accepted.length >= availableSlots) break;
      if (file.size > maxFileSize) {
        rejected.push(file.name);
        continue;
      }
      accepted.push(file);
    }
    if (accepted.length) {
      setFiles(prev => [...prev, ...accepted]);
    }
    if (rejected.length) {
      setError(t('post.errorFileSize', { size: maxFileSizeMb, files: rejected.join(', ') }));
    }
    e.currentTarget.value = '';
  };
  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx));

  const deleteExistingMedia = async (mediaId: number) => {
    if (!editId) return;
    try {
      await Listings.deleteMedia(editId, mediaId);
      setExistingMedia(prev => prev.filter(m => m.id !== mediaId));
    } catch (e: any) {
      setError(t('post.errorDeletePhoto'));
    }
  };

  // Drag and drop handlers for reordering photos
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedType, setDraggedType] = useState<'existing' | 'new' | null>(null);

  const handleDragStart = (index: number, type: 'existing' | 'new') => {
    setDraggedIndex(index);
    setDraggedType(type);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number, dropType: 'existing' | 'new') => {
    if (draggedIndex === null || draggedType === null) return;

    // Reorder within the same type
    if (draggedType === dropType) {
      if (draggedType === 'existing') {
        const items = [...existingMedia];
        const [removed] = items.splice(draggedIndex, 1);
        items.splice(dropIndex, 0, removed);
        setExistingMedia(items);
      } else {
        const items = [...files];
        const [removed] = items.splice(draggedIndex, 1);
        items.splice(dropIndex, 0, removed);
        setFiles(items);
      }
    }

    setDraggedIndex(null);
    setDraggedType(null);
  };

  const onSubmit = async () => {
    if (!selectedCat || !locationId || !title) { setError(t('post.errorRequiredFields')); return; }
    // Client-side required attributes validation
    const missing: string[] = [];
    for (const a of attrs) {
      if (!a.is_required) continue;
      const v = values[a.key];
      if (a.type === 'multiselect') {
        if (!Array.isArray(v) || v.length === 0) missing.push(a.label);
      } else if (a.type === 'number' || a.type === 'range') {
        if (v === undefined || v === '' || isNaN(Number(v))) missing.push(a.label);
      } else if (a.type === 'boolean') {
        if (v === undefined) missing.push(a.label);
      } else if (v === undefined || String(v) === '') missing.push(a.label);
    }
    if (missing.length) {
      setError(t('post.errorRequiredAttributes', { attrs: missing.join(', ') }));
      return;
    }
    setError('');
    setUploading(true);
    try {
      const attributes = attrs
        .filter(a => values[a.key] !== undefined && values[a.key] !== '')
        .map(a => {
          let v = values[a.key];
          if (a.type === 'number' || a.type === 'range') {
            const num = typeof v === 'number' ? v : Number(v);
            return { attribute: a.id, value: num };
          }
          return { attribute: a.id, value: v };
        });
      const payload = {
        title,
        description: desc,
        price_amount: dealType === 'sell' && !negotiable ? (price || '0') : '0',
        price_currency: priceCurrency,
        is_price_negotiable: dealType === 'sell' ? negotiable : false,
        condition,
        deal_type: dealType,
        seller_type: sellerType,
        category: selectedCat,
        location: locationId,
        attributes,
      };

      let id: number;

      if (isEditMode && editId) {
        // Update existing listing
        await Listings.update(editId, payload);
        id = editId;
      } else {
        // Create new listing
        const created = await Listings.create(payload);
        id = created.id || created.pk || created?.data?.id;
      }

      // Upload new media files
      for (const f of files) {
        try { await Listings.uploadMedia(Number(id), f); } catch {}
      }

      // Reorder existing media if in edit mode
      if (isEditMode && editId && existingMedia.length > 0) {
        try {
          const mediaIds = existingMedia.map(m => m.id);
          await Listings.reorderMedia(editId, mediaIds);
        } catch (e) {
          console.error('Failed to reorder media:', e);
        }
      }

      router.push(`/u/listings`);
    } catch (e: any) { setError(e.message); } finally { setUploading(false); }
  };

  // Wait for client-side mount to avoid hydration issues with translations
  if (!mounted) {
    return <div className="page-section page-section--padded post-page" style={{ minHeight: '400px' }}></div>;
  }

  const pageTitle = isEditMode ? t('post.editTitle') : t('post.createTitle');

  return (
    <div className="page-section page-section--padded post-page">
      <h2>{pageTitle}</h2>
      <div className="form-section">
        <div className="form-card">
          <h3>{t('post.describeDetails')}</h3>
          <div className="field">
            <label>{t('post.titleLabel')}</label>
            <input value={title} onChange={e => setTitle(e.target.value.slice(0,70))} placeholder={t('post.titlePlaceholder')} />
            <div className="muted" style={{ textAlign: 'right' }}>{title.length}/70</div>
          </div>
          <div className="field">
            <label>{t('post.categoryLabel')}</label>
            <div className="row">
              <button type="button" className="btn-outline" onClick={() => setCatPickerOpen(true)}>
                {selectedCat && selectedCatPath ? selectedCatPath : selectedCat ? t('post.categorySelected') : t('post.selectCategory')}
              </button>
            </div>
            <CategoryPicker
              open={catPickerOpen}
              categories={cats}
              onClose={() => setCatPickerOpen(false)}
              onSelect={({ id, path }) => { setSelectedCat(id); setSelectedCatPath(path); }}
            />
          </div>
        </div>

        <div className="form-card">
          <h3>{t('post.photos')}</h3>
          <p className="muted" style={{ marginTop: -8 }}>{t('post.photoNote', { max: maxImages, size: maxFileSizeMb })}</p>
          <div className="photo-grid">
            {/* Show existing media in edit mode */}
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
                <img src={media.image_url || media.image} alt="" />
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
            {/* Show new files being uploaded */}
            {files.map((f, idx) => (
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
                <img src={URL.createObjectURL(f)} alt="" />
                <button type="button" className="photo-remove" onClick={() => removeFile(idx)}>🗑️</button>
              </div>
            ))}
            <label className="photo-tile add">
              <input type="file" accept="image/*" multiple onChange={onPickFiles} style={{ display: 'none' }} />
              <span>{t('post.addPhoto')}</span>
            </label>
            {Array.from({ length: Math.max(0, maxImages - files.length - existingMedia.length - 1) }).map((_, i) => (
              <div key={`ph-${i}`} className="photo-tile placeholder">📷</div>
            ))}
          </div>
        </div>

        <div className="form-card">
          <div className="field">
            <label>{t('post.descriptionLabel')}</label>
            <textarea rows={6} value={desc} onChange={e => setDesc(e.target.value.slice(0,9000))} placeholder={t('post.descriptionPlaceholder')}></textarea>
            <div className="muted" style={{ textAlign: 'right' }}>{desc.length}/9000</div>
          </div>
        </div>

        <div className="form-card">
          <div className="row" style={{ gap: 8 }}>
            {([
              { key: 'sell', label: t('post.dealTypeSell') },
              { key: 'exchange', label: t('post.dealTypeExchange') },
              { key: 'free', label: t('post.dealTypeFree') },
            ] as const).map(opt => (
              <button key={opt.key} type="button" className="btn-outline" onClick={() => setDealType(opt.key)} style={{ background: dealType === opt.key ? '#e9f8f7' : '#fff' }}>
                {opt.label}
              </button>
            ))}
          </div>
          {dealType === 'sell' && (
            <div style={{ marginTop: 12 }}>
              <div className="row">
                <div className="field" style={{ width: 300 }}>
                  <label>{t('post.priceLabel')}</label>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} disabled={negotiable} />
                </div>
                <div className="field">
                  <label>{t('post.currencyLabel')}</label>
                  <Dropdown
                    value={priceCurrency}
                    onChange={(v) => setPriceCurrency((v as string) || configI18n.currency)}
                    options={currencyOptions.map((value) => ({ value, label: value }))}
                    style={{"height": "50px"}}
                    align="left"
                  />
                </div>
              </div>
              <div className="row" style={{ alignItems: 'center' }}>
                <label className="muted">{t('post.negotiable')}</label>
                <input type="checkbox" checked={negotiable} onChange={e => setNegotiable(e.target.checked)} />
              </div>
            </div>
          )}
        </div>

        <div className="form-card">
          <h3>{t('post.additionalInfo')}</h3>
          <div className="field">
            <label>{t('post.sellerTypeLabel')}</label>
            <div className="row" style={{ gap: 8 }}>
              <button type="button" className="btn-outline" onClick={() => setSellerType('person')} style={{ background: sellerType === 'person' ? '#e9f8f7' : '#fff' }}>{t('post.sellerTypePerson')}</button>
              <button type="button" className="btn-outline" onClick={() => setSellerType('business')} style={{ background: sellerType === 'business' ? '#e9f8f7' : '#fff' }}>{t('post.sellerTypeBusiness')}</button>
            </div>
          </div>
          <div className="field">
            <label>{t('post.conditionLabel')}</label>
            <div className="row" style={{ gap: 8 }}>
              <button type="button" className="btn-outline" onClick={() => setCondition('used')} style={{ background: condition === 'used' ? '#e9f8f7' : '#fff' }}>{t('post.conditionUsed')}</button>
              <button type="button" className="btn-outline" onClick={() => setCondition('new')} style={{ background: condition === 'new' ? '#e9f8f7' : '#fff' }}>{t('post.conditionNew')}</button>
            </div>
          </div>
        </div>

        {selectedCat && attrs.length > 0 && (
          <div className="form-card">
            <h3>{t('post.characteristics')}</h3>
            <AttributesForm attrs={attrs as any} values={values} onChange={(k, v) => setValues(s => ({ ...s, [k]: v }))} locale={locale} />
          </div>
        )}

        <div className="form-card">
          <h3>{t('post.locationTitle')}</h3>
          <div className="field">
            <label>{t('post.selectLocation')}</label>
            <button
              type="button"
              className="btn-outline"
              onClick={() => setLocationPickerOpen(true)}
              style={{ flexWrap: 'wrap', textAlign: 'left' , minWidth: '100px', maxWidth: '300px'}}
            >
              {locationPath || t('post.selectRegionCity')}
            </button>
          </div>
          <LocationPicker
            open={locationPickerOpen}
            onClose={() => setLocationPickerOpen(false)}
            onSelect={(loc) => {
              setLocationId(loc.id);
              setLocationPath(loc.path);
            }}
            locale={locale as 'ru' | 'uz'}
          />
        </div>

        <div className="form-actions">
          <button className="btn-accent" onClick={onSubmit} disabled={uploading || !selectedCat || !locationId || !title || (dealType === 'sell' && !negotiable && !price)}>
            {uploading
              ? t('post.saving')
              : isEditMode
                ? t('post.saveChanges')
                : t('post.publish')
            }
          </button>
          {error && <span className="muted" style={{ marginLeft: 12 }}>{error}</span>}
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
