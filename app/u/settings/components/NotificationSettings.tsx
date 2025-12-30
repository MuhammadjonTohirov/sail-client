'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { useProfile } from '@/hooks';

export default function NotificationSettings() {
  const { t } = useI18n();
  const { profile, updateProfile, loading } = useProfile();

  const [notifyNewMessages, setNotifyNewMessages] = useState(true);
  const [notifySavedSearches, setNotifySavedSearches] = useState(true);
  const [notifyPromotions, setNotifyPromotions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setNotifyNewMessages(profile.notifyNewMessages ?? true);
      setNotifySavedSearches(profile.notifySavedSearches ?? true);
      setNotifyPromotions(profile.notifyPromotions ?? false);
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      await updateProfile({
        notifyNewMessages,
        notifySavedSearches,
        notifyPromotions,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(t('settings.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const hasTelegram = profile?.telegramId != null;

  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <h2 className="settings-card-title">{t('settings.notifications.title')}</h2>
        <p className="settings-card-description">{t('settings.notifications.description')}</p>
      </div>

      <div className="settings-card-body">
        {!hasTelegram && (
          <div className="notification-warning">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{t('settings.notifications.connectTelegramHint')}</span>
          </div>
        )}

        <div className="notification-options">
          <label className="notification-option">
            <div className="notification-option-content">
              <span className="notification-option-label">{t('settings.notifications.newMessages')}</span>
              <span className="notification-option-description">{t('settings.notifications.newMessagesDescription')}</span>
            </div>
            <input
              type="checkbox"
              checked={notifyNewMessages}
              onChange={(e) => setNotifyNewMessages(e.target.checked)}
              disabled={!hasTelegram}
              className="notification-toggle"
            />
          </label>

          <label className="notification-option">
            <div className="notification-option-content">
              <span className="notification-option-label">{t('settings.notifications.savedSearches')}</span>
              <span className="notification-option-description">{t('settings.notifications.savedSearchesDescription')}</span>
            </div>
            <input
              type="checkbox"
              checked={notifySavedSearches}
              onChange={(e) => setNotifySavedSearches(e.target.checked)}
              disabled={!hasTelegram}
              className="notification-toggle"
            />
          </label>

          <label className="notification-option">
            <div className="notification-option-content">
              <span className="notification-option-label">{t('settings.notifications.promotions')}</span>
              <span className="notification-option-description">{t('settings.notifications.promotionsDescription')}</span>
            </div>
            <input
              type="checkbox"
              checked={notifyPromotions}
              onChange={(e) => setNotifyPromotions(e.target.checked)}
              disabled={!hasTelegram}
              className="notification-toggle"
            />
          </label>
        </div>

        <div className="settings-actions">
          <button
            onClick={handleSave}
            disabled={saving || !hasTelegram}
            className="settings-save-btn"
          >
            {saving ? t('settings.saving') : t('settings.saveButton')}
          </button>
          {saveSuccess && (
            <span className="settings-success">{t('settings.saveSuccess')}</span>
          )}
          {saveError && (
            <span className="settings-error">{saveError}</span>
          )}
        </div>
      </div>
    </div>
  );
}
