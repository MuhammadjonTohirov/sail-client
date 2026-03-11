"use client";
import { useEffect } from 'react';
import { appConfig } from '@/config';
import { useI18n } from '@/lib/i18n';
import { useSavedSearches } from '@/hooks/useSavedSearches';

export default function SavedPage() {
  const { t } = useI18n();
  const { savedSearches, loading, error, loadSavedSearches, updateSavedSearch, deleteSavedSearch } = useSavedSearches();

  useEffect(() => {
    if (appConfig.features.enableSavedSearches) {
      loadSavedSearches();
    }
  }, [loadSavedSearches]);

  const toggle = async (id: number, isActive: boolean) => {
    await updateSavedSearch(id, { isActive: !isActive });
  };

  const del = async (id: number) => {
    await deleteSavedSearch(id);
  };

  if (!appConfig.features.enableSavedSearches) {
    return (
      <div className="container" style={{ padding: '32px 0' }}>
        <div className="card" style={{ textAlign: 'center', padding: 24 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: 'var(--fg)' }}>
            {t('savedSearches.disabledTitle')}
          </h1>
          <p style={{ color: 'var(--muted)' }}>
            {t('savedSearches.disabledDescription')}
          </p>
        </div>
      </div>
    );
  }

  if (error) return <p>{error}</p>;
  if (loading) return <p>{t('savedSearches.loading')}</p>;
  return (
    <div>
      <h2>{t('savedSearches.pageTitle')}</h2>
      {savedSearches.length === 0 && <p className="muted">{t('savedSearches.noSearches')}</p>}
      <ul>
        {savedSearches.map(s => (
          <li key={s.id} className="row" style={{ alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <strong>{s.title}</strong> <span className="muted">({s.isActive ? t('savedSearches.statusActive') : t('savedSearches.statusInactive')})</span>
            </div>
            <button onClick={() => toggle(s.id, !!s.isActive)}>{s.isActive ? t('savedSearches.deactivateButton') : t('savedSearches.activateButton')}</button>
            <button onClick={() => del(s.id)}>{t('savedSearches.deleteButton')}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
