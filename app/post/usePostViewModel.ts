"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { appConfig } from '@/config';
import { PostInteractor } from './PostInteractor';
import { Category } from '@/domain/models/Category';
import { Attribute } from '@/domain/models/Attribute';
import { ListingPayload } from '@/domain/models/ListingPayload';
import { PostFile } from './components/types';
import { compressImage } from '@/lib/photoCompressor';

export interface PostViewModel {
  // State
  isEditMode: boolean;
  editId: number | null;
  mounted: boolean;

  // Category
  categories: Category[];
  selectedCat: number | null;
  selectedCatPath: string;
  catPickerOpen: boolean;
  setCatPickerOpen: (open: boolean) => void;
  onCategorySelect: (payload: { id: number; path: string }) => void;

  // Attributes
  attrs: Attribute[];
  values: Record<string, any>;
  setAttrValue: (key: string, value: any) => void;

  // Location
  locationId: number | null;
  locationPath: string;
  locationPickerOpen: boolean;
  setLocationPickerOpen: (open: boolean) => void;
  onLocationSelect: (payload: { id: number; path: string }) => void;

  // Basic fields
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;

  // Price & Deal
  price: string;
  setPrice: (value: string) => void;
  priceCurrency: string;
  setPriceCurrency: (value: string) => void;
  negotiable: boolean;
  setNegotiable: (value: boolean) => void;
  dealType: 'sell' | 'exchange' | 'free';
  setDealType: (value: 'sell' | 'exchange' | 'free') => void;

  // Additional info
  sellerType: 'person' | 'business';
  setSellerType: (value: 'person' | 'business') => void;
  condition: 'new' | 'used';
  setCondition: (value: 'new' | 'used') => void;

  // Contact fields
  contactName: string;
  setContactName: (value: string) => void;
  contactEmail: string;
  setContactEmail: (value: string) => void;
  contactPhone: string;
  setContactPhone: (value: string) => void;

  // Media
  files: PostFile[];
  existingMedia: any[];
  onPickFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  deleteExistingMedia: (mediaId: number) => Promise<void>;
  handleDragStart: (index: number, type: 'existing' | 'new') => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (dropIndex: number, dropType: 'existing' | 'new') => void;

  // Config
  maxImages: number;
  maxFileSizeMb: number;
  currencyOptions: string[];

  // Actions
  onSubmit: () => Promise<void>;
  uploading: boolean;
  isCompressing: boolean;
  hasCompressionError: boolean;
  error: string;
}

export function usePostViewModel(): PostViewModel {
  const { t, locale } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const interactorRef = useRef(new PostInteractor());

  const [mounted, setMounted] = useState(false);
  const { upload, i18n: configI18n } = appConfig;
  const maxImages = upload.maxImages;
  const maxFileSize = upload.maxFileSize;
  const maxFileSizeMb = Math.round(maxFileSize / (1024 * 1024));
  const currencyOptions = Array.from(new Set([configI18n.currency, 'UZS', 'USD'].filter(Boolean))) as string[];

  // Edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [existingMedia, setExistingMedia] = useState<any[]>([]);

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [selectedCatPath, setSelectedCatPath] = useState<string>('');
  const [catPickerOpen, setCatPickerOpen] = useState(false);

  // Attributes
  const [attrs, setAttrs] = useState<Attribute[]>([]);
  const [values, setValues] = useState<Record<string, any>>({});

  // Location
  const [locationId, setLocationId] = useState<number | null>(null);
  const [locationPath, setLocationPath] = useState<string>('');
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);

  // Basic fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Price & Deal
  const [price, setPrice] = useState('');
  const [priceCurrency, setPriceCurrency] = useState<string>(configI18n.currency);
  const [negotiable, setNegotiable] = useState<boolean>(false);
  const [dealType, setDealType] = useState<'sell' | 'exchange' | 'free'>('sell');

  // Additional info
  const [sellerType, setSellerType] = useState<'person' | 'business'>('person');
  const [condition, setCondition] = useState<'new' | 'used'>('used');

  // Contact fields
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Media
  const [files, setFiles] = useState<PostFile[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Drag and drop
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedType, setDraggedType] = useState<'existing' | 'new' | null>(null);

  // Computed states
  const isCompressing = useMemo(() => files.some(f => f.status === 'compressing'), [files]);
  const hasCompressionError = useMemo(() => files.some(f => f.status === 'error'), [files]);

  // Initialize mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize edit mode from search params
  useEffect(() => {
    const editIdParam = searchParams.get('edit');
    setIsEditMode(!!editIdParam);
    setEditId(editIdParam ? parseInt(editIdParam, 10) : null);
  }, [searchParams]);

  // Load categories
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const tree = await interactorRef.current.fetchCategoryTree();
      if (!cancelled) setCategories(tree || []);
    })();
    return () => { cancelled = true; };
  }, []);

  // Load user profile defaults
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const profile = await interactorRef.current.fetchUserProfile();
        if (!cancelled && profile) {
          setContactName(prev => prev || profile.displayName || '');
          setContactEmail(prev => prev || profile.email || '');
          setContactPhone(prev => prev || profile.phoneE164 || '');
        }
      } catch (e) {
        console.error('Failed to load user profile for contact defaults:', e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Load listing data when in edit mode
  useEffect(() => {
    if (!isEditMode || !editId) return;

    let cancelled = false;
    (async () => {
      try {
        const listing = await interactorRef.current.fetchListingDetail(editId);
        if (cancelled) return;

        // Pre-fill form fields
        setTitle(listing.title || '');
        setDescription(listing.description || '');
        setPrice(listing.priceAmount ? String(listing.priceAmount) : '');
        setPriceCurrency(listing.priceCurrency || configI18n.currency);
        setNegotiable(listing.isPriceNegotiable || false);
        setDealType(listing.dealType || 'sell');
        setSellerType(listing.sellerType || 'person');
        setCondition(listing.condition == 'new' ? 'new' : 'used');

        const categoryId = listing.categoryId;
        setSelectedCat(categoryId);
        setLocationId(listing.locationId);

        // Build category path
        if (listing.categoryName) {
          setSelectedCatPath(listing.categoryName);
        }

        // Build location path
        if (listing.locationName) {
          setLocationPath(listing.locationName);
        }

        // Load existing media
        if (listing.media && Array.isArray(listing.media)) {
          setExistingMedia(listing.media);
        }

        // Load contact information
        setContactName(listing.contactName || '');
        setContactEmail(listing.contactEmail || '');
        setContactPhone(listing.contactPhone || '');

        // Load category attributes first, then set values
        if (categoryId) {
          const categoryAttrs = await interactorRef.current.fetchCategoryAttributes(categoryId);
          if (cancelled) return;

          setAttrs(categoryAttrs);

          // Pre-fill attribute values
          if (listing.attributes && Array.isArray(listing.attributes)) {
            const attrKeysMap = new Set(categoryAttrs.map((a: any) => a.key));
            const attrVals: Record<string, any> = {};

            listing.attributes.forEach((av: any) => {
              const key = av.key;
              if (!key || !attrKeysMap.has(key)) return;

              if (av.value !== undefined && av.value !== null) {
                attrVals[key] = av.value;
              } else if (av.valueText) {
                attrVals[key] = av.valueText;
              } else if (av.valueNumber !== null && av.valueNumber !== undefined) {
                attrVals[key] = av.valueNumber;
              } else if (av.valueBool !== null && av.valueBool !== undefined) {
                attrVals[key] = av.valueBool;
              } else if (av.valueOptionKey) {
                attrVals[key] = av.valueOptionKey;
              }
            });
            setValues(attrVals);
          }
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(t('post.errorLoadListing'));
        }
      }
    })();
    return () => { cancelled = true; };
  }, [isEditMode, editId, configI18n.currency, locale, t]);

  // Load attributes when category changes
  useEffect(() => {
    if (!selectedCat) {
      setAttrs([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const categoryAttrs = await interactorRef.current.fetchCategoryAttributes(selectedCat);
      if (!cancelled) setAttrs(categoryAttrs);
    })();
    return () => { cancelled = true; };
  }, [selectedCat]);

  // Prune attribute values when attributes change
  useEffect(() => {
    if (!attrs || attrs.length === 0) {
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

  const onPickFiles = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files || []);
    const availableSlots = Math.max(0, maxImages - files.length);
    if (!availableSlots) {
      setError(t('post.errorMaxPhotos', { max: maxImages }));
      e.currentTarget.value = '';
      return;
    }

    // Preliminary check for initial files, though we allow compression to validate true size if we wanted to
    // But currently using browser-image-compression, input file size limit is less relevant if we compress it down.
    // However, keeping strict check on original file if necessary.
    // The requirement says "max image should be 500 kb", usually means output.
    // The previous code checked file.size > maxFileSize. I will keep it for now but relaxed or rely on compressor?
    // Actually, let's process all selected files.

    const accepted: File[] = [];
    const rejected: string[] = [];

    // We will attempt to compress everything that is an image.
    for (const file of incoming) {
      if (accepted.length >= availableSlots) break;
      accepted.push(file);
    }

    if (accepted.length) {
      const newPostFiles: PostFile[] = accepted.map(file => ({
        id: Math.random().toString(36).substring(7),
        file: null, // Not ready yet
        previewUrl: URL.createObjectURL(file),
        status: 'compressing'
      }));

      setFiles(prev => [...prev, ...newPostFiles]);

      // Process compression for each
      newPostFiles.forEach(async (postFile, index) => {
        const originalFile = accepted[index];
        try {
          const compressed = await compressImage(originalFile);

          setFiles(prev => prev.map(f => {
             if (f.id === postFile.id) {
               return { ...f, file: compressed, status: 'ready' };
             }
             return f;
          }));
        } catch (err) {
          console.error(`Failed to compress ${originalFile.name}`, err);
          setFiles(prev => prev.map(f => {
            if (f.id === postFile.id) {
              return { ...f, status: 'error' };
            }
            return f;
          }));
        }
      });
    }

    // Reset input
    e.currentTarget.value = '';
  }, [files.length, maxImages, maxFileSize, maxFileSizeMb, t]);

  const removeFile = useCallback((idx: number) => {
    setFiles(prev => {
      const fileToRemove = prev[idx];
      if (fileToRemove && fileToRemove.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter((_, i) => i !== idx);
    });
  }, []);

  const deleteExistingMedia = useCallback(async (mediaId: number) => {
    if (!editId) return;
    try {
      await interactorRef.current.deleteMedia(editId, mediaId);
      setExistingMedia(prev => prev.filter(m => m.id !== mediaId));
    } catch (e: any) {
      setError(t('post.errorDeletePhoto'));
    }
  }, [editId, t]);

  const handleDragStart = useCallback((index: number, type: 'existing' | 'new') => {
    setDraggedIndex(index);
    setDraggedType(type);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((dropIndex: number, dropType: 'existing' | 'new') => {
    if (draggedIndex === null || draggedType === null) return;

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
  }, [draggedIndex, draggedType, existingMedia, files]);

  const setAttrValue = useCallback((key: string, value: any) => {
    setValues(s => ({ ...s, [key]: value }));
  }, []);

  const onCategorySelect = useCallback((payload: { id: number; path: string }) => {
    setSelectedCat(payload.id);
    setSelectedCatPath(payload.path);
  }, []);

  const onLocationSelect = useCallback((payload: { id: number; path: string }) => {
    setLocationId(payload.id);
    setLocationPath(payload.path);
  }, []);

  const onSubmit = useCallback(async () => {
    if (!selectedCat || !locationId || !title || !contactName) {
      setError(t('post.errorRequiredFields'));
      return;
    }

    if (isCompressing) {
      // Should be disabled but double check
      return;
    }

    if (hasCompressionError) {
      setError(t('post.errorCompression'));
      return;
    }

    // Validate required attributes
    const missing: string[] = [];
    for (const a of attrs) {
      if (!a.required) continue;
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
      const attributePayload = attrs
        .filter(a => values[a.key] !== undefined && values[a.key] !== '')
        .map(a => {
          let v = values[a.key];
          if (a.type === 'number' || a.type === 'range') {
            const num = typeof v === 'number' ? v : Number(v);
            return { attributeId: a.id, value: num };
          }
          return { attributeId: a.id, value: v };
        });

      const listingPayload: ListingPayload = {
        title: title.trim(),
        description: description,
        priceAmount: price,
        priceCurrency,
        isPriceNegotiable: dealType === 'sell' ? negotiable : false,
        condition,
        dealType,
        sellerType,
        categoryId: selectedCat!,
        locationId: locationId!,
        attributes: attributePayload,
        contactName: contactName.trim(),
        contactEmail: contactEmail || undefined,
        contactPhone: contactPhone || undefined,
      };

      let id: number;
      console.log('Submitting listing payload:', listingPayload);
      if (isEditMode && editId) {
        await interactorRef.current.updateListing(editId, listingPayload);
        id = editId;
      } else {
        const created = await interactorRef.current.createListing(listingPayload);
        id = created.id;
      }

      // Upload new media files
      // Filter only ready files
      const readyFiles = files.filter(f => f.status === 'ready' && f.file).map(f => f.file!);

      for (const f of readyFiles) {
        try {
          await interactorRef.current.uploadMedia(Number(id), f);
        } catch (e) {
          console.error('Failed to upload media:', e);
        }
      }

      // Reorder existing media if in edit mode
      if (isEditMode && editId && existingMedia.length > 0) {
        try {
          const mediaIds = existingMedia.map(m => m.id);
          await interactorRef.current.reorderMedia(editId, mediaIds);
        } catch (e) {
          console.error('Failed to reorder media:', e);
        }
      }

      router.push(`/u/listings`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }, [
    selectedCat, locationId, title, contactName, attrs, values, description,
    dealType, negotiable, price, priceCurrency, condition, sellerType,
    contactEmail, contactPhone, isEditMode, editId, files, existingMedia,
    router, t, isCompressing, hasCompressionError
  ]);

  return {
    isEditMode,
    editId,
    mounted,
    categories,
    selectedCat,
    selectedCatPath,
    catPickerOpen,
    setCatPickerOpen,
    onCategorySelect,
    attrs,
    values,
    setAttrValue,
    locationId,
    locationPath,
    locationPickerOpen,
    setLocationPickerOpen,
    onLocationSelect,
    title,
    setTitle,
    description,
    setDescription,
    price,
    setPrice,
    priceCurrency,
    setPriceCurrency,
    negotiable,
    setNegotiable,
    dealType,
    setDealType,
    sellerType,
    setSellerType,
    condition,
    setCondition,
    contactName,
    setContactName,
    contactEmail,
    setContactEmail,
    contactPhone,
    setContactPhone,
    files,
    existingMedia,
    onPickFiles,
    removeFile,
    deleteExistingMedia,
    handleDragStart,
    handleDragOver,
    handleDrop,
    maxImages,
    maxFileSizeMb,
    currencyOptions,
    onSubmit,
    uploading,
    error,
    isCompressing,
    hasCompressionError
  };
}
