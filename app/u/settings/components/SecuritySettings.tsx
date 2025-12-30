'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Auth } from '@/lib/authApi';
import { Lineicons } from "@lineiconshq/react-lineicons";
import {
  Locked1Outlined as LockIcon,
  EyeOutlined as EyeIcon,
} from "@lineiconshq/free-icons";
import { SecurityInfo } from './TelegramSettings';

interface SecuritySettingsProps {
  securityInfo: SecurityInfo | null;
  loading: boolean;
  onReloadSecurity: () => Promise<void>;
}

export default function SecuritySettings({ securityInfo, loading, onReloadSecurity }: SecuritySettingsProps) {
  const { t } = useI18n();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordChanging, setPasswordChanging] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError(t('settings.security.passwordTooShort'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t('settings.security.passwordMismatch'));
      return;
    }

    setPasswordChanging(true);

    try {
      if (securityInfo?.has_password) {
        if (!currentPassword) {
          setPasswordError(t('settings.security.currentPasswordRequired'));
          setPasswordChanging(false);
          return;
        }
        await Auth.changePassword(currentPassword, newPassword);
      } else {
        await Auth.setPassword(newPassword);
      }

      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      await onReloadSecurity();
    } catch (e: any) {
      setPasswordError(e.message || t('settings.security.changeError'));
    } finally {
      setPasswordChanging(false);
    }
  };

  return (
    <div className="settings-card security-section">
      <div className="settings-card-header">
        <div className="settings-card-header-icon">
          <Lineicons icon={LockIcon} width={24} height={24} />
          <h2 className="settings-card-title">{t('settings.security.title')}</h2>
        </div>
      </div>
      <div className="settings-card-body">
        {loading ? (
          <div className="loading-inline">
            <div className="spinner-small"></div>
            <span>{t('settings.loading')}</span>
          </div>
        ) : (
          <div className="password-change-form">
            <p className="security-description">
              {securityInfo?.has_password
                ? t('settings.security.changePasswordDescription')
                : t('settings.security.setPasswordDescription')
              }
            </p>

            {securityInfo?.has_password && (
              <div className="form-group">
                <label className="form-label">{t('settings.security.currentPassword')}</label>
                <div className="password-input-wrapper">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="form-input"
                    placeholder={t('settings.security.currentPasswordPlaceholder')}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <Lineicons icon={EyeIcon} width={18} height={18} />
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">{t('settings.security.newPassword')}</label>
              <div className="password-input-wrapper">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input"
                  placeholder={t('settings.security.newPasswordPlaceholder')}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <Lineicons icon={EyeIcon} width={18} height={18} />
                  )}
                </button>
              </div>
              <span className="form-hint">{t('settings.security.passwordHint')}</span>
            </div>

            <div className="form-group">
              <label className="form-label">{t('settings.security.confirmPassword')}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                placeholder={t('settings.security.confirmPasswordPlaceholder')}
              />
            </div>

            {passwordError && (
              <div className="error-message">{passwordError}</div>
            )}
            {passwordSuccess && (
              <div className="success-message">{t('settings.security.changeSuccess')}</div>
            )}
          </div>
        )}
      </div>
      <div className="settings-card-footer">
        <button
          onClick={handlePasswordChange}
          className="btn-accent btn-save"
          disabled={passwordChanging || !newPassword || !confirmPassword}
        >
          {passwordChanging
            ? t('settings.security.changing')
            : (securityInfo?.has_password ? t('settings.security.changeButton') : t('settings.security.setButton'))
          }
        </button>
      </div>
    </div>
  );
}
