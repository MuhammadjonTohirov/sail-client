"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';

export default function HeroSearch() {
  const [q, setQ] = useState('');
  const router = useRouter();
  const { t } = useI18n();

  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <h1 className="hero__title">{t('homeWelcome')}</h1>
          <p className="muted" style={{ marginBottom: 16 }}>{t('homeLead')}</p>
          <div className="searchbar">
            <input
              className="searchbar__input"
              placeholder={t('searchTitle')}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/search?q=${encodeURIComponent(q)}`); }}
            />
            <button className="searchbar__btn btn-accent" onClick={() => router.push(`/search?q=${encodeURIComponent(q)}`)}>
              {t('searchTitle')}
            </button>
          </div>
          <div style={{ marginTop: 10 }}>
            <a className="link" href={`/post`}>{t('postTitle')}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
