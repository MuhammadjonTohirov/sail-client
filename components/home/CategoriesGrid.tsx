"use client";
import { useEffect, useState } from 'react';
import { Taxonomy } from '@/lib/api';
import { useI18n } from '@/lib/i18n';

type CategoryNode = { id: number; name: string; slug: string; is_leaf: boolean; icon?: string; icon_url?: string; children?: CategoryNode[] };

export default function CategoriesGrid() {
  const [cats, setCats] = useState<CategoryNode[]>([]);
  const { t } = useI18n();

  useEffect(() => {
    (async () => {
      try { setCats(await Taxonomy.categories()); } catch {}
    })();
  }, []);

  return (
    <section className="home-section">
      <div className="container">
        <h2 style={{ margin: '16px 0' }}>{t('nav.search')}</h2>
        <div className="category-grid">
          {cats.map((c) => (
            <a key={c.id} className="category-tile" href={`/search?category_slug=${encodeURIComponent(c.slug)}`}>
              <div className="category-tile__icon" aria-hidden>
                {c.icon_url ? (
                  <img src={c.icon_url} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
                ) : (
                  c.icon || c.name.charAt(0)
                )}
              </div>
              <div className="category-tile__name">{c.name}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
