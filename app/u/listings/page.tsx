"use client";
import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useListings } from '@/hooks/useListings';
import { useTaxonomy } from '@/hooks/useTaxonomy';
import { Listing } from '@/domain/models/Listing';
import { Category } from '@/domain/models/Category';
import Dropdown from '@/components/ui/Dropdown';
import CategoryPicker from '@/components/ui/CategoryPicker';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ListingStatisticsModal } from '@/components/listing/ListingStatisticsModal';
import { ShareListingModal } from '@/components/listing/ShareListingModal';
import { Lineicons } from "@lineiconshq/react-lineicons";
import {
  Share1Outlined as ShareIcon,
  BarChart4Outlined as StatsIcon,
} from "@lineiconshq/free-icons";
import { appConfig, trustedImageUrl } from '@/config';

type CatNode = { id: number; name: string; slug: string; is_leaf: boolean; children?: CatNode[] };

interface ListingStatistics {
  id: number;
  title: string;
  viewCount: number;
  favoriteCount: number;
  interestCount: number;
  createdAt: string;
}

function mapCategoryToNode(cat: Category): CatNode {
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    is_leaf: cat.isLeaf,
    children: cat.children?.map(mapCategoryToNode),
  };
}

export default function MyListings() {
  const { t, locale } = useI18n();
  const listings = useListings();
  const taxonomy = useTaxonomy();

  const [items, setItems] = useState<Listing[]>([]);
  const [error, setError] = useState<string>('');
  const [q, setQ] = useState('');
  const [catId, setCatId] = useState<string>('');
  const [catPath, setCatPath] = useState<string>('');
  const [catPickerOpen, setCatPickerOpen] = useState(false);
  const [sort, setSort] = useState('newest');
  const [tab, setTab] = useState<'active'|'pending_review'|'inactive'>('active');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<number | null>(null);
  const [statisticsModalOpen, setStatisticsModalOpen] = useState(false);
  const [selectedListingStats, setSelectedListingStats] = useState<ListingStatistics | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedListingForShare, setSelectedListingForShare] = useState<{ id: number; title: string } | null>(null);

  const catNodes = useMemo(() => taxonomy.categories.map(mapCategoryToNode), [taxonomy.categories]);

  const handleShareClick = (listing: Listing) => {
    setSelectedListingForShare({ id: listing.id, title: listing.title });
    setShareModalOpen(true);
  };

  const handleStatisticsClick = (listing: Listing) => {
    setSelectedListingStats({
      id: listing.id,
      title: listing.title,
      viewCount: listing.viewCount ?? 0,
      favoriteCount: listing.favoriteCount ?? 0,
      interestCount: listing.interestCount ?? 0,
      createdAt: listing.createdAt ?? '',
    });
    setStatisticsModalOpen(true);
  };

  const load = async () => {
    try {
      const data = await listings.getMyListings();
      setItems(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load listings');
    }
  };

  useEffect(() => {
    load();
    taxonomy.loadCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const bump = async (id: number) => {
    await listings.refreshListing(id);
    await load();
  };

  const deactivate = async (id: number) => {
    try {
      await listings.deactivateListing(id);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to deactivate');
    }
  };

  const activate = async (id: number) => {
    try {
      await listings.activateListing(id);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to activate');
    }
  };

  const handleDeleteClick = (id: number) => {
    setListingToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!listingToDelete) return;
    try {
      await listings.deleteListing(listingToDelete);
      setDeleteModalOpen(false);
      setListingToDelete(null);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete');
      setDeleteModalOpen(false);
      setListingToDelete(null);
    }
  };

  const filtered = useMemo(() => {
    const inactive = new Set(['paused','closed','expired']);
    return items
      .filter((it) => (
        tab === 'active' ? it.status === 'active'
        : tab === 'pending_review' ? it.status === 'pending_review'
        : inactive.has(it.status ?? '')
      ))
      .filter((it) => (q ? (it.title?.toLowerCase()?.includes(q.toLowerCase()) || String(it.id) === q.trim()) : true))
      .filter((it) => (catId ? String(it.categoryId) === catId : true))
      .sort((a, b) => {
        if (sort === 'newest') return new Date(b.refreshedAt ?? '').getTime() - new Date(a.refreshedAt ?? '').getTime();
        if (sort === 'oldest') return new Date(a.refreshedAt ?? '').getTime() - new Date(b.refreshedAt ?? '').getTime();
        if (sort === 'price_asc') return Number(a.priceAmount) - Number(b.priceAmount);
        if (sort === 'price_desc') return Number(b.priceAmount) - Number(a.priceAmount);
        return 0;
      });
  }, [items, tab, q, catId, sort]);

  const counts = useMemo(() => {
    const c = { active: 0, pending_review: 0, inactive: 0 } as Record<string, number>;
    const inactive = new Set(['paused','closed','expired']);
    items.forEach((it) => {
      if (it.status === 'active') c.active++;
      else if (it.status === 'pending_review') c.pending_review++;
      else if (inactive.has(it.status ?? '')) c.inactive++;
    });
    return c;
  }, [items]);

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
          className="bg-accent hover:bg-accent-2 text-white font-semibold py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20"
              placeholder={t('myListings.searchPlaceholder')}
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>

          <button
            className="px-4 py-2 border border-gray-300 rounded-lg hover:border-accent transition-colors"
            onClick={() => setCatPickerOpen(true)}
          >
            {catId ? catPath : t('myListings.allCategories')}
          </button>

          {catId && (
            <button
              className="px-4 py-2 text-sm text-accent hover:text-accent-2"
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
          categories={catNodes}
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
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-2 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('myListings.createListing')}
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((l) => (
            <div className="my-listing-card" key={l.id}>
              <a href={`/l/${l.id}`} className="listing-image-link">
                {l.media?.[0]?.imageUrl ? (
                  <img className="listing-image" src={trustedImageUrl(l.media[0].imageUrl)} alt={l.title} />
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
                  {l.priceAmount} {l.priceCurrency === 'UZS' ? t('myListings.currencySom') : l.priceCurrency}
                </div>
                <div className="listing-meta">
                  <span>ID: {l.id}</span>
                  <span>•</span>
                  <span>{new Date(l.createdAt ?? '').toLocaleDateString(locale === 'uz' ? 'uz-UZ' : 'ru-RU')}</span>
                  <span>•</span>
                  <span className={`status-badge status-${l.status}`}>
                    {l.status === 'active' ? t('myListings.statusActive') :
                     l.status === 'pending_review' ? t('myListings.statusPendingReview') :
                     t('myListings.statusInactive')}
                  </span>
                </div>
              </div>

              <div className="listing-actions-col">
                <div className="listing-actions-buttons">
                  {l.status === 'active' && (
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
                  )}

                  <a
                    href={`/post?edit=${l.id}`}
                    className="action-btn secondary"
                    title={t('myListings.editTooltip')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </a>

                  <button
                    className="action-btn secondary"
                    onClick={() => handleStatisticsClick(l)}
                    title={t('myListings.statisticsTooltip')}
                  >
                    <Lineicons icon={StatsIcon} width={16} height={16} />
                  </button>

                  <button
                    className="action-btn secondary"
                    onClick={() => handleShareClick(l)}
                    title={t('myListings.shareTooltip')}
                  >
                    <Lineicons icon={ShareIcon} width={16} height={16} />
                  </button>

                  {l.status === 'active' && (
                    <button
                      className="action-btn secondary"
                      onClick={() => deactivate(l.id)}
                      title={t('myListings.deactivateTooltip')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}

                  {(l.status === 'paused' || l.status === 'closed') && (
                    <button
                      className="action-btn primary"
                      onClick={() => activate(l.id)}
                      title={t('myListings.activateTooltip')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}

                  <button
                    className="action-btn secondary text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteClick(l.id)}
                    title={t('myListings.deleteTooltip')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Statistics */}
                <div className="listing-stats">
                  <div className="stat-item" title={t('myListings.stats.views')}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{l.viewCount ?? 0}</span>
                  </div>
                  <div className="stat-item" title={t('myListings.stats.favorites')}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{l.favoriteCount ?? 0}</span>
                  </div>
                  <div className="stat-item" title={t('myListings.stats.interests')}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{l.interestCount ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={deleteModalOpen}
        title={t('myListings.confirmDelete')}
        message={t('myListings.confirmDeleteMessage')}
        confirmText={t('myListings.confirmButton')}
        cancelText={t('myListings.cancelButton')}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setListingToDelete(null);
        }}
        isDestructive
      />

      <ListingStatisticsModal
        open={statisticsModalOpen}
        listing={selectedListingStats}
        onClose={() => {
          setStatisticsModalOpen(false);
          setSelectedListingStats(null);
        }}
        t={t}
        locale={locale}
      />

      <ShareListingModal
        open={shareModalOpen}
        listing={selectedListingForShare}
        onClose={() => {
          setShareModalOpen(false);
          setSelectedListingForShare(null);
        }}
        t={t}
      />
    </div>
  );
}
