"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { GetCategoriesUseCase } from '@/domain/usecases/taxonomy/GetCategoriesUseCase';
import { TaxonomyRepositoryImpl } from '@/data/repositories/TaxonomyRepositoryImpl';
import { Category } from '@/domain/models/Category';
import { trustedImageUrl } from '@/config';

export default function CategoriesSection() {
  const usecase = new GetCategoriesUseCase(new TaxonomyRepositoryImpl())
  const { t } = useI18n();  
  
  const [cats, setCats] = useState<Category[]>([]);

  useEffect(() => {
    (async () => {
      try { setCats(await usecase.execute(t.name)); } catch {}
    })();
  }, []);

  return (
    <section className="py-8 bg-white">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {t("home.popularCategories")}
          </h2>
          <Link
            href={`/search`}
            className="text-accent hover:text-accent-2 text-sm font-medium"
          >
            {t("home.allCategories")}
          </Link>
        </div>
        <div className="category-grid">
          {cats.map((c) => (
            <Link key={c.id} className="category-tile" href={`/search?category_slug=${encodeURIComponent(c.slug)}`}>
              <div className="category-tile__icon" aria-hidden>
                {c.iconUrl ? (
                  <img src={trustedImageUrl(c.iconUrl)} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
                ) : (
                  c.icon || c.name.charAt(0)
                )}
              </div>
              <div className="category-tile__name">{c.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
