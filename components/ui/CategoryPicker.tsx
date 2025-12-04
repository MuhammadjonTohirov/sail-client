"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

type CategoryNode = { id: number; name: string; slug: string; is_leaf: boolean; children?: CategoryNode[] };

export default function CategoryPicker({
  open,
  categories,
  onClose,
  onSelect,
}: {
  open: boolean;
  categories: CategoryNode[];
  onClose: () => void;
  onSelect: (payload: { id: number; path: string }) => void;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!open) return null;

  return isMobile ? (
    <CategoryPickerMobile
      categories={categories}
      onClose={onClose}
      onSelect={onSelect}
    />
  ) : (
    <CategoryPickerDesktop
      categories={categories}
      onClose={onClose}
      onSelect={onSelect}
    />
  );
}

function CategoryPickerDesktop({
  categories,
  onClose,
  onSelect,
}: {
  categories: CategoryNode[];
  onClose: () => void;
  onSelect: (payload: { id: number; path: string }) => void;
}) {
  const { t } = useI18n();
  const [level1, setLevel1] = useState<CategoryNode | null>(null);
  const [level2, setLevel2] = useState<CategoryNode | null>(null);

  const handleSelect = (category: CategoryNode, level: number) => {
    if (category.is_leaf || !category.children || category.children.length === 0) {
      const path: string[] = [];
      if (level >= 1 && level1) path.push(level1.name);
      if (level >= 2 && level2) path.push(level2.name);
      path.push(category.name);

      onSelect({ id: category.id, path: path.join(" / ") });
      onClose();
    } else {
      if (level === 0) {
        setLevel1(category);
        setLevel2(null);
      } else if (level === 1) {
        setLevel2(category);
      }
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal cat-picker-modal" style={{ width: 800, maxWidth: "calc(100% - 24px)" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{t('home.allCategories')}</div>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="cat-picker">
            <div className="cat-col">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`cat-item ${level1?.id === cat.id ? 'is-active' : ''}`}
                  onClick={() => handleSelect(cat, 0)}
                >
                  <span>{cat.name}</span>
                  {cat.children && cat.children.length > 0 && <span className="cat-arrow">›</span>}
                </button>
              ))}
            </div>

            <div className="cat-col">
              {level1?.children?.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`cat-item ${level2?.id === cat.id ? 'is-active' : ''}`}
                  onClick={() => handleSelect(cat, 1)}
                >
                  <span>{cat.name}</span>
                  {cat.children && cat.children.length > 0 && <span className="cat-arrow">›</span>}
                </button>
              ))}
            </div>

            <div className="cat-col">
              {level2?.children?.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className="cat-item"
                  onClick={() => handleSelect(cat, 2)}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryPickerMobile({
  categories,
  onClose,
  onSelect,
}: {
  categories: CategoryNode[];
  onClose: () => void;
  onSelect: (payload: { id: number; path: string }) => void;
}) {
  const { t } = useI18n();
  const [level, setLevel] = useState(0);
  const [history, setHistory] = useState<CategoryNode[]>([]);

  const currentCategory = history[level - 1] || null;
  const items = level === 0 ? categories : currentCategory?.children || [];
  const title = level === 0 ? t('home.allCategories') : currentCategory?.name;

  const select = (category: CategoryNode) => {
    if (category.is_leaf || !category.children || category.children.length === 0) {
      const path = [...history.map(c => c.name), category.name].join(" / ");
      onSelect({ id: category.id, path });
      onClose();
    } else {
      setHistory([...history, category]);
      setLevel(level + 1);
    }
  };

  const back = () => {
    if (level > 0) {
      setLevel(level - 1);
      setHistory(history.slice(0, history.length - 1));
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal cat-picker-modal" style={{ width: "calc(100% - 40px)", maxWidth: "calc(100% - 40px)" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ display: 'grid', gridTemplateColumns: '40px 1fr 40px', alignItems: 'center' }}>
          <div>
            {level > 0 && (
              <button type="button" className="cat-picker-back" onClick={back} aria-label={t('common.back')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            )}
          </div>
          <div className="modal-title" style={{ textAlign: 'center' }}>{title}</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" className="modal-close" onClick={onClose}>×</button>
          </div>
        </div>
        <div className="modal-body">
          <div className="cat-picker-list">
            {items.map((c) => (
              <button key={c.id} type="button" className="cat-item" onClick={() => select(c)}>
                <span>{c.name}</span>
                {(!c.is_leaf && c.children && c.children.length > 0) && <span className="cat-arrow">›</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

