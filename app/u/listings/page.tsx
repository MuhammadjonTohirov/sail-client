"use client";
import { Listings, Taxonomy } from '@/lib/api';
import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import Dropdown from '@/components/ui/Dropdown';
import CategoryPicker from '@/components/ui/CategoryPicker';
import { appConfig } from '@/config';

type CatNode = { id: number; name: string; slug: string; is_leaf: boolean; children?: CatNode[] };

export default function MyListings() {
  const { t, locale } = useI18n();

  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [cats, setCats] = useState<CatNode[]>([]);
  const [q, setQ] = useState('');
  const [catId, setCatId] = useState<string>('');
  const [catPath, setCatPath] = useState<string>('');
  const [catPickerOpen, setCatPickerOpen] = useState(false);
  const [sort, setSort] = useState('newest');
  const [tab, setTab] = useState<'active'|'pending_review'|'inactive'>('active');

  const load = async () => {
    try {
      const [data, tree] = await Promise.all([Listings.mine(), Taxonomy.categories()]);
      setItems(data);
      setCats(tree);
    } catch (e: any) { setError(e.message); }
  };
  useEffect(() => { load(); }, []);

  const bump = async (id: number) => { await Listings.refresh(id); await load(); };
  const upload = async (id: number, file?: File | null) => {
    if (!file) return; await Listings.uploadMedia(id, file); await load();
  };

  // Category tree is provided to CategoryPicker; no need to flatten here

  const filtered = useMemo(() => {
    const inactive = new Set(['paused','closed','expired']);
    return items
      .filter((it) => (
        tab === 'active' ? it.status === 'active'
        : tab === 'pending_review' ? it.status === 'pending_review'
        : inactive.has(it.status)
      ))
      .filter((it) => (q ? (it.title?.toLowerCase()?.includes(q.toLowerCase()) || String(it.id) === q.trim()) : true))
      .filter((it) => (catId ? String(it.category) === catId : true))
      .sort((a: any, b: any) => {
        if (sort === 'newest') return new Date(b.refreshed_at).getTime() - new Date(a.refreshed_at).getTime();
        if (sort === 'oldest') return new Date(a.refreshed_at).getTime() - new Date(b.refreshed_at).getTime();
        if (sort === 'price_asc') return Number(a.price_amount) - Number(b.price_amount);
        if (sort === 'price_desc') return Number(b.price_amount) - Number(a.price_amount);
        return 0;
      });
  }, [items, tab, q, catId, sort]);

  const counts = useMemo(() => {
    const c = { active: 0, pending_review: 0, inactive: 0 } as Record<string, number>;
    const inactive = new Set(['paused','closed','expired']);
    items.forEach((it: any) => {
      if (it.status === 'active') c.active++;
      else if (it.status === 'pending_review') c.pending_review++;
      else if (inactive.has(it.status)) c.inactive++;
    });
    return c;
  }, [items]);

  const [loading, setLoading] = useState(false);

  if (error) {
    return (
      <div className="container py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('myListings.pageTitle')}
        </h1>
        <a
          href={`/post`}
          className="bg-[#23E5DB] hover:bg-[#1dd4cb] text-white font-semibold py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('myListings.addListing')}
        </a>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm text-blue-900">
          <strong>{t('myListings.noticeBold')}:</strong>{' '}
          {t('myListings.noticeText', { brand: appConfig.name })}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs border-b border-gray-200 mb-6">
        <button
          className={`tab ${tab==='active'?'is-active':''}`}
          onClick={() => setTab('active')}
        >
          {t('myListings.tabActive')} ({counts.active})
        </button>
        <button
          className={`tab ${tab==='pending_review'?'is-active':''}`}
          onClick={() => setTab('pending_review')}
        >
          {t('myListings.tabPendingReview')} ({counts.pending_review})
        </button>
        <button
          className={`tab ${tab==='inactive'?'is-active':''}`}
          onClick={() => setTab('inactive')}
        >
          {t('myListings.tabInactive')} ({counts.inactive})
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[250px]">
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#23E5DB] focus:ring-2 focus:ring-[#23E5DB] focus:ring-opacity-20"
              placeholder={t('myListings.searchPlaceholder')}
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>

          <button
            className="px-4 py-2 border border-gray-300 rounded-lg hover:border-[#23E5DB] transition-colors"
            onClick={() => setCatPickerOpen(true)}
          >
            {catId ? catPath : t('myListings.allCategories')}
          </button>

          {catId && (
            <button
              className="px-4 py-2 text-sm text-[#23E5DB] hover:text-[#1dd4cb]"
              onClick={() => { setCatId(''); setCatPath(''); }}
            >
              {t('myListings.resetFilter')}
            </button>
          )}

          <Dropdown
            value={sort}
            onChange={(v) => setSort(v)}
            options={[
              { value: 'newest', label: t('myListings.sortNewest') },
              { value: 'oldest', label: t('myListings.sortOldest') },
              { value: 'price_asc', label: t('myListings.sortPriceAsc') },
              { value: 'price_desc', label: t('myListings.sortPriceDesc') },
            ]}
          />
        </div>

        <CategoryPicker
          open={catPickerOpen}
          categories={cats}
          onClose={() => setCatPickerOpen(false)}
          onSelect={({ id, path }) => { setCatId(String(id)); setCatPath(path); setCatPickerOpen(false); }}
        />
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('myListings.noListings')}
          </h3>
          <p className="text-gray-600 mb-6">
            {tab === 'active'
              ? t('myListings.noActiveListings')
              : tab === 'pending_review'
              ? t('myListings.noPendingListings')
              : t('myListings.noInactiveListings')
            }
          </p>
          <a
            href={`/post`}
            className="inline-flex items-center gap-2 bg-[#23E5DB] hover:bg-[#1dd4cb] text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('myListings.createListing')}
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((l: any) => (
            <div className="my-listing-card" key={l.id}>
              <a href={`/l/${l.id}`} className="listing-image-link">
                {l.media?.[0]?.image_url ? (
                  <img className="listing-image" src={l.media[0].image_url} alt={l.title} />
                ) : (
                  <div className="listing-image-placeholder">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </a>

              <div className="listing-info">
                <a href={`/l/${l.id}`} className="listing-title-link">
                  <h3 className="listing-title">{l.title}</h3>
                </a>
                <div className="listing-price">
                  {l.price_amount} {l.price_currency === 'UZS' ? t('myListings.currencySom') : l.price_currency}
                </div>
                <div className="listing-meta">
                  <span>ID: {l.id}</span>
                  <span>•</span>
                  <span>{new Date(l.created_at).toLocaleDateString(locale === 'uz' ? 'uz-UZ' : 'ru-RU')}</span>
                  <span>•</span>
                  <span className={`status-badge status-${l.status}`}>
                    {l.status === 'active' ? t('myListings.statusActive') :
                     l.status === 'pending_review' ? t('myListings.statusPendingReview') :
                     t('myListings.statusInactive')}
                  </span>
                </div>
              </div>

              <div className="listing-actions-col">
                <button
                  className="action-btn primary"
                  onClick={() => bump(l.id)}
                  title={t('myListings.bumpTooltip')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {t('myListings.bumpButton')}
                </button>

                <a
                  href={`/post?edit=${l.id}`}
                  className="action-btn secondary"
                  title={t('myListings.editTooltip')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
