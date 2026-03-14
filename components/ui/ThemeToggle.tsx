"use client";

import React from "react";
import { useDarkMode } from "@/hooks/useDarkMode";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { isDark, toggleTheme, theme, cycleTheme } = useDarkMode();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span className="theme-toggle-icon">
        {isDark ? "☀️" : "🌙"}
      </span>
      {showLabel && (
        <span className="theme-toggle-label">
          {isDark ? "Light" : "Dark"}
        </span>
      )}
      <style jsx>{`
        .theme-toggle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--card-bg);
          cursor: pointer;
          font-size: 14px;
          color: var(--fg);
          transition: all 0.2s ease;
        }

        .theme-toggle:hover {
          background: var(--color-neutral-100);
        }

        .theme-toggle-icon {
          font-size: 16px;
          line-height: 1;
        }

        .theme-toggle-label {
          font-weight: 500;
        }
      `}</style>
    </button>
  );
}

export function ThemeCycler({ className = "" }: { className?: string }) {
  const { theme, cycleTheme } = useDarkMode();

  const icons = {
    light: "☀️",
    dark: "🌙",
    system: "💻",
  };

  const labels = {
    light: "Light",
    dark: "Dark",
    system: "System",
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={`theme-cycler ${className}`}
      aria-label={`Current theme: ${labels[theme]}. Click to change.`}
      title={`Theme: ${labels[theme]}`}
    >
      <span className="theme-cycler-icon">{icons[theme]}</span>
      <span className="theme-cycler-label">{labels[theme]}</span>
      <style jsx>{`
        .theme-cycler {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--card-bg);
          cursor: pointer;
          font-size: 14px;
          color: var(--fg);
          transition: all 0.2s ease;
        }

        .theme-cycler:hover {
          background: var(--color-neutral-100);
        }

        .theme-cycler-icon {
          font-size: 14px;
          line-height: 1;
        }

        .theme-cycler-label {
          font-weight: 500;
          min-width: 50px;
          text-align: left;
        }
      `}</style>
    </button>
  );
}
