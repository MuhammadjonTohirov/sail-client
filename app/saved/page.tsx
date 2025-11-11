"use client";
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { appConfig } from '@/config';
import { useI18n } from '@/lib/i18n';

type Saved = { id: number; title: string; query: any; is_active: boolean; created_at: string };

export default function SavedPage() {
  const { t } = useI18n();

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

  const [items, setItems] = useState<Saved[]>([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await apiFetch('/api/v1/saved-searches');
      setItems(res);
    } catch (e: any) { setError(e.message); }
  };
  useEffect(() => { load(); }, []);

  const toggle = async (id: number, isActive: boolean) => {
    await apiFetch(`/api/v1/saved-searches/${id}`, { method: 'PATCH', body: JSON.stringify({ is_active: !isActive }) });
    await load();
  };
  const del = async (id: number) => {
    await apiFetch(`/api/v1/saved-searches/${id}`, { method: 'DELETE' });
    await load();
  };

  if (error) return <p>{error}</p>;
  return (
    <div>
      <h2>{t('savedSearches.pageTitle')}</h2>
      {items.length === 0 && <p className="muted">{t('savedSearches.noSearches')}</p>}
      <ul>
        {items.map(s => (
          <li key={s.id} className="row" style={{ alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <strong>{s.title}</strong> <span className="muted">({s.is_active ? t('savedSearches.statusActive') : t('savedSearches.statusInactive')})</span>
            </div>
            <button onClick={() => toggle(s.id, s.is_active)}>{s.is_active ? t('savedSearches.deactivateButton') : t('savedSearches.activateButton')}</button>
            <button onClick={() => del(s.id)}>{t('savedSearches.deleteButton')}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
