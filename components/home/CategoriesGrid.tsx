"use client";
import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { GetCategoriesUseCase } from '@/domain/usecases/taxonomy/GetCategoriesUseCase';
import { TaxonomyRepositoryImpl } from '@/data/repositories/TaxonomyRepositoryImpl';
import { Category } from '@/domain/models/Category';
import { trustedImageUrl } from '@/config';

// type CategoryNode = { id: number; name: string; slug: string; is_leaf: boolean; icon?: string; icon_url?: string; children?: CategoryNode[] };

export default function CategoriesGrid() {
  const usecase = new GetCategoriesUseCase(new TaxonomyRepositoryImpl())
  const { t } = useI18n();  
  
  const [cats, setCats] = useState<Category[]>([]);

  useEffect(() => {
    (async () => {
      try { setCats(await usecase.execute(t.name)); } catch {}
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
                {c.iconUrl ? (
                  <img src={trustedImageUrl(c.iconUrl)} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
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
