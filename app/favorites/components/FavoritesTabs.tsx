'use client';

import type { CSSProperties } from 'react';

export type FavoritesTab = 'liked' | 'searches' | 'recent';

interface FavoritesTabsProps {
  activeTab: FavoritesTab;
  onChange: (tab: FavoritesTab) => void;
  enableFavorites: boolean;
  enableSavedSearches: boolean;
  favoritesLabel: string;
  savedSearchesLabel: string;
  recentLabel: string;
  favoritesCount: number;
  savedSearchesCount: number;
}

interface TabButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}

const baseButtonStyle: CSSProperties = {
  padding: '12px 24px',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  marginBottom: '-2px',
};

function TabButton({ label, active, onClick, count }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...baseButtonStyle,
        borderBottom: active ? '3px solid var(--brand)' : '3px solid transparent',
        fontWeight: active ? 700 : 400,
        color: active ? 'var(--brand)' : 'var(--muted)',
      }}
    >
      {label}
      {typeof count === 'number' && (
        <span style={{ marginLeft: 4, fontWeight: 400 }}>({count})</span>
      )}
    </button>
  );
}

export function FavoritesTabs({
  activeTab,
  onChange,
  enableFavorites,
  enableSavedSearches,
  favoritesLabel,
  savedSearchesLabel,
  recentLabel,
  favoritesCount,
  savedSearchesCount,
}: FavoritesTabsProps) {
  return (
    <div style={{ borderBottom: '2px solid var(--border)', marginBottom: '24px' }}>
      <div style={{ display: 'flex', gap: '0' }}>
        {enableFavorites && (
          <TabButton
            label={favoritesLabel}
            active={activeTab === 'liked'}
            onClick={() => onChange('liked')}
            count={favoritesCount}
          />
        )}
        {enableSavedSearches && (
          <TabButton
            label={savedSearchesLabel}
            active={activeTab === 'searches'}
            onClick={() => onChange('searches')}
            count={savedSearchesCount}
          />
        )}
        <TabButton
          label={recentLabel}
          active={activeTab === 'recent'}
          onClick={() => onChange('recent')}
        />
      </div>
    </div>
  );
}
