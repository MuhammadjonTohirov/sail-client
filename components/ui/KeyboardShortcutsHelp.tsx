"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { KEYBOARD_SHORTCUTS } from "@/hooks/useKeyboardShortcuts";

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleShowHelp = () => setIsOpen(true);
    window.addEventListener("show-shortcuts-help", handleShowHelp);
    return () => window.removeEventListener("show-shortcuts-help", handleShowHelp);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isMac = typeof navigator !== "undefined" && /Mac/.test(navigator.platform);

  return (
    <div className="shortcuts-modal-overlay" onClick={() => setIsOpen(false)}>
      <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h2>{t("shortcuts.title", "Keyboard Shortcuts")}</h2>
          <button
            className="shortcuts-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="shortcuts-list">
          {KEYBOARD_SHORTCUTS.map((shortcut, i) => (
            <div key={i} className="shortcut-item">
              <div className="shortcut-keys">
                {shortcut.keys.map((key, j) => (
                  <React.Fragment key={j}>
                    {j > 0 && <span className="shortcut-plus">+</span>}
                    <kbd className="shortcut-key">
                      {key === "⌘" ? (isMac ? "⌘" : "Ctrl") : key}
                    </kbd>
                  </React.Fragment>
                ))}
              </div>
              <div className="shortcut-description">
                {t(shortcut.description, shortcut.description.split(".").pop() ?? '')}
              </div>
            </div>
          ))}
        </div>
        <div className="shortcuts-footer">
          <span className="shortcuts-hint">
            {t("shortcuts.hint", "Press ? to show this help")}
          </span>
        </div>
      </div>

      <style jsx>{`
        .shortcuts-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fade-in 0.2s ease;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .shortcuts-modal {
          background: var(--card-bg);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 400px;
          width: 90%;
          animation: slide-up 0.2s ease;
        }

        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .shortcuts-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
        }

        .shortcuts-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .shortcuts-close {
          background: none;
          border: none;
          font-size: 18px;
          color: var(--muted);
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .shortcuts-close:hover {
          background: var(--color-neutral-100);
        }

        .shortcuts-list {
          padding: 12px 20px;
        }

        .shortcut-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid var(--color-neutral-100);
        }

        .shortcut-item:last-child {
          border-bottom: none;
        }

        .shortcut-keys {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .shortcut-key {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 28px;
          height: 28px;
          padding: 0 8px;
          background: var(--color-neutral-100);
          border: 1px solid var(--border);
          border-radius: 6px;
          font-family: monospace;
          font-size: 12px;
          font-weight: 500;
          color: var(--fg);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .shortcut-plus {
          color: var(--muted);
          font-size: 12px;
        }

        .shortcut-description {
          font-size: 14px;
          color: var(--muted);
        }

        .shortcuts-footer {
          padding: 12px 20px;
          border-top: 1px solid var(--border);
          text-align: center;
        }

        .shortcuts-hint {
          font-size: 12px;
          color: var(--muted);
        }
      `}</style>
    </div>
  );
}
