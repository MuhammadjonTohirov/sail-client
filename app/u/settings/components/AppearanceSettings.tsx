'use client';

import { useI18n } from '@/lib/i18n';
import { useDarkMode } from '@/hooks/useDarkMode';

type Theme = 'light' | 'dark' | 'system';

export default function AppearanceSettings() {
  const { t } = useI18n();
  const { theme, setTheme, isDark } = useDarkMode();

  const themeOptions: { value: Theme; label: string; icon: string; description: string }[] = [
    {
      value: 'light',
      label: t('settings.appearance.light', 'Light'),
      icon: '☀️',
      description: t('settings.appearance.lightDesc', 'Always use light theme'),
    },
    {
      value: 'dark',
      label: t('settings.appearance.dark', 'Dark'),
      icon: '🌙',
      description: t('settings.appearance.darkDesc', 'Always use dark theme'),
    },
    {
      value: 'system',
      label: t('settings.appearance.system', 'System'),
      icon: '💻',
      description: t('settings.appearance.systemDesc', 'Follow system preference'),
    },
  ];

  return (
    <div className="settings-section">
      <h2 className="settings-section-title">
        {t('settings.appearance.title', 'Appearance')}
      </h2>
      <p className="settings-section-subtitle">
        {t('settings.appearance.subtitle', 'Customize how Sail looks on your device')}
      </p>

      <div className="settings-card">
        <h3 className="settings-card-title">
          {t('settings.appearance.themeLabel', 'Theme')}
        </h3>

        <div className="theme-options">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              className={`theme-option ${theme === option.value ? 'active' : ''}`}
            >
              <div className="theme-option-preview">
                <span className="theme-option-icon">{option.icon}</span>
              </div>
              <div className="theme-option-info">
                <span className="theme-option-label">{option.label}</span>
                <span className="theme-option-desc">{option.description}</span>
              </div>
              {theme === option.value && (
                <span className="theme-option-check">✓</span>
              )}
            </button>
          ))}
        </div>

        <div className="theme-preview-box">
          <div className="theme-preview-header">
            <span className="theme-preview-dot" style={{ background: '#ff5f57' }}></span>
            <span className="theme-preview-dot" style={{ background: '#ffbd2e' }}></span>
            <span className="theme-preview-dot" style={{ background: '#28ca42' }}></span>
          </div>
          <div className="theme-preview-content">
            <div className="theme-preview-nav"></div>
            <div className="theme-preview-card"></div>
            <div className="theme-preview-card"></div>
          </div>
          <p className="theme-preview-label">
            {t('settings.appearance.currentTheme', 'Current')}: {isDark ? t('settings.appearance.dark', 'Dark') : t('settings.appearance.light', 'Light')}
          </p>
        </div>
      </div>

      <style jsx>{`
        .theme-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .theme-option {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border: 2px solid var(--border);
          border-radius: 12px;
          background: var(--card-bg);
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }

        .theme-option:hover {
          border-color: var(--color-neutral-300);
        }

        .theme-option.active {
          border-color: var(--accent);
          background: var(--accent-soft, rgba(var(--accent-rgb), 0.1));
        }

        .theme-option-preview {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-neutral-100);
          border-radius: 12px;
          font-size: 24px;
        }

        .theme-option-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .theme-option-label {
          font-weight: 600;
          font-size: 16px;
          color: var(--fg);
        }

        .theme-option-desc {
          font-size: 13px;
          color: var(--muted);
        }

        .theme-option-check {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--accent);
          color: white;
          border-radius: 50%;
          font-size: 14px;
          font-weight: bold;
        }

        .theme-preview-box {
          background: var(--color-neutral-100);
          border-radius: 12px;
          padding: 12px;
          margin-top: 16px;
        }

        .theme-preview-header {
          display: flex;
          gap: 6px;
          padding: 8px;
          background: var(--color-neutral-200);
          border-radius: 8px 8px 0 0;
        }

        .theme-preview-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .theme-preview-content {
          padding: 12px;
          background: var(--card-bg);
          border-radius: 0 0 8px 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .theme-preview-nav {
          height: 8px;
          background: var(--color-neutral-200);
          border-radius: 4px;
          width: 60%;
        }

        .theme-preview-card {
          height: 24px;
          background: var(--color-neutral-100);
          border-radius: 6px;
        }

        .theme-preview-label {
          text-align: center;
          font-size: 12px;
          color: var(--muted);
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}
