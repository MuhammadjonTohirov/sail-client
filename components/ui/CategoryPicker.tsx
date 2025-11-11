"use client";
import { useEffect, useMemo, useState } from "react";

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
  const [lvl1, setLvl1] = useState<CategoryNode | null>(null);
  const [lvl2, setLvl2] = useState<CategoryNode | null>(null);

  useEffect(() => {
    if (!open) {
      setLvl1(null);
      setLvl2(null);
    }
  }, [open]);

  const roots = categories || [];
  const second = useMemo(() => (lvl1?.children || []), [lvl1]);
  const third = useMemo(() => (lvl2?.children || []), [lvl2]);

  const pick = (node: CategoryNode, parentPath: string[]) => {
    const path = [...parentPath, node.name].join(" / ");
    if (node.is_leaf || !node.children || node.children.length === 0) {
      onSelect({ id: node.id, path });
      onClose();
    } else {
      // advance level selection
      if (!lvl1 || lvl1.id !== node.id) {
        setLvl1(node);
        setLvl2(null);
      } else {
        setLvl2(null);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal>
      <div className="modal" style={{ width: 800, maxWidth: "calc(100% - 24px)" }}>
        <div className="modal-header">
          <div className="modal-title">Выберите категорию</div>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="cat-picker">
            <div className="cat-col">
              {roots.map((c) => (
                <button key={c.id} type="button" className={`cat-item ${lvl1?.id === c.id ? "is-active" : ""}`} onClick={() => { setLvl1(c); setLvl2(null); }}>
                  <span>{c.name}</span>
                  {(c.children && c.children.length > 0) && <span className="cat-arrow">›</span>}
                </button>
              ))}
            </div>
            <div className="cat-col">
              {second.map((c) => (
                <button key={c.id} type="button" className={`cat-item ${lvl2?.id === c.id ? "is-active" : ""}`} onClick={() => { setLvl2(c); if (c.is_leaf || !c.children?.length) pick(c, [lvl1?.name || ""]); }}>
                  <span>{c.name}</span>
                  {(c.children && c.children.length > 0) && <span className="cat-arrow">›</span>}
                </button>
              ))}
            </div>
            <div className="cat-col">
              {third.map((c) => (
                <button key={c.id} type="button" className="cat-item" onClick={() => pick(c, [lvl1?.name || "", lvl2?.name || ""]) }>
                  <span>{c.name}</span>
                  {(c.children && c.children.length > 0) && <span className="cat-arrow">›</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-outline" onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
}

