"use client";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

type Option = { value: string; label: string };

export default function MultiDropdown({
  options,
  value,
  onChange,
  placeholder = "--",
  className = "",
  align = "right",
}: {
  options: Option[];
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  className?: string;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); };
  }, []);

  const getLabel = () => {
    if (!value || value.length === 0) return placeholder;
    if (value.length === 1) return options.find(o => o.value === value[0])?.label || placeholder;
    return t("multiDropdown.selectedCount", { count: value.length });
  };

  const toggle = (val: string) => {
    if (value.includes(val)) onChange(value.filter(v => v !== val));
    else onChange([...value, val]);
  };

  return (
    <div ref={ref} className={`dd ${className}`}>
      <button
        type="button"
        className="dd-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        suppressHydrationWarning
      >
        {getLabel()}
        <span className="dd-caret">▾</span>
      </button>
      {open && (
        <div className={`dd-menu ${align === 'left' ? 'dd-left' : 'dd-right'}`} role="menu">
          {options.map(opt => (
            <label key={opt.value} className="dd-item" style={{ gap: 10 }}>
              <input type="checkbox" checked={value.includes(opt.value)} onChange={() => toggle(opt.value)} />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
