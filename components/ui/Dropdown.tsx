"use client";
import { useEffect, useRef, useState } from "react";

type Option = { value: string; label: string };

export default function Dropdown({
  options,
  value,
  onChange,
  style,
  className = "",
  buttonClassName = "",
  align = "right",
}: {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
  style?: { [key: string]: string };
  buttonClassName?: string;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const selected = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className={`dd ${className}`} style={style}>
      <button
        type="button"
        className={`dd-trigger ${buttonClassName}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {selected?.label}
        <span className="dd-caret">▾</span>
      </button>
      {open && (
        <div className={`dd-menu ${align === "left" ? "dd-left" : "dd-right"}`} role="menu">
          {options.map((opt) => (
            <button
              type="button"
              key={opt.value}
              className={`dd-item ${opt.value === value ? "is-active" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.value === value ? <span className="dd-check">✓</span> : <span className="dd-check" />}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

