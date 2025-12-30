"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { appConfig } from '@/config/app.config';
import { Auth } from '@/lib/authApi';
import { useI18n } from '@/lib/i18n';

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void;
  }
}

interface TelegramLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  /** If true, skip confirmation and login directly (for linking accounts) */
  skipConfirmation?: boolean;
}

export function TelegramLoginButton({ onSuccess, onError, skipConfirmation = false }: TelegramLoginButtonProps) {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const redirectTo = searchParams.get('redirect') || '/search';

  // Confirmation modal state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingUser, setPendingUser] = useState<TelegramUser | null>(null);
  const [showLogoutInstructions, setShowLogoutInstructions] = useState(false);

  useEffect(() => {
    if (!appConfig.telegram.enabled || !appConfig.telegram.botUsername) {
      console.warn('Telegram login not configured');
      return;
    }

    // Define callback function
    window.onTelegramAuth = async (user: TelegramUser) => {
      console.log('Telegram auth callback received:', user);

      if (skipConfirmation) {
        // Direct login without confirmation (used for account linking)
        await performLogin(user);
      } else {
        // Show confirmation modal
        setPendingUser(user);
        setShowConfirmation(true);
      }
    };

    // Render button immediately
    renderTelegramButton();

    return () => {
      if (window.onTelegramAuth) {
        delete window.onTelegramAuth;
      }
    };
  }, [skipConfirmation]);

  const performLogin = async (user: TelegramUser) => {
    setLoading(true);
    setError('');
    setShowConfirmation(false);

    try {
      await Auth.telegram(user);
      onSuccess?.();
      router.push(redirectTo);
    } catch (e: any) {
      const errorMsg = e.message || t('auth.telegram.error');
      console.error('Telegram auth error:', errorMsg, e);
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmLogin = () => {
    if (pendingUser) {
      performLogin(pendingUser);
    }
  };

  const handleUseDifferentAccount = () => {
    setShowConfirmation(false);
    setPendingUser(null);
    // Show logout instructions - the Telegram widget caches sessions in browser cookies
    // User needs to clear cookies or use incognito mode to switch accounts
    setShowLogoutInstructions(true);
  };

  const handleCloseLogoutInstructions = () => {
    setShowLogoutInstructions(false);
  };

  const handleCancelLogin = () => {
    setShowConfirmation(false);
    setPendingUser(null);
  };

  const renderTelegramButton = () => {
    if (!containerRef.current || !appConfig.telegram.botUsername) {
      return;
    }

    // Clear existing content
    containerRef.current.innerHTML = '';

    // Create Telegram login button script element
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', appConfig.telegram.botUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.async = true;

    containerRef.current.appendChild(script);
  };

  const getUserDisplayName = (user: TelegramUser) => {
    const parts = [user.first_name, user.last_name].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : user.username || `User ${user.id}`;
  };

  if (!appConfig.telegram.enabled) {
    return null;
  }

  return (
    <div className="telegram-login-wrapper w-full">
      <div
        ref={containerRef}
        className="flex justify-center items-center min-h-[46px] w-full"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      />

      {loading && (
        <div className="text-center mt-2 text-sm text-gray-600">
          <svg className="animate-spin inline-block w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {t('auth.telegram.connecting')}
        </div>
      )}

      {error && (
        <div className="mt-2 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && pendingUser && (
        <div className="telegram-confirm-overlay">
          <div className="telegram-confirm-modal">
            <div className="telegram-confirm-header">
              {pendingUser.photo_url && (
                <img
                  src={pendingUser.photo_url}
                  alt={getUserDisplayName(pendingUser)}
                  className="telegram-confirm-avatar"
                />
              )}
              <div className="telegram-confirm-user-info">
                <p className="telegram-confirm-name">{getUserDisplayName(pendingUser)}</p>
                {pendingUser.username && (
                  <p className="telegram-confirm-username">@{pendingUser.username}</p>
                )}
              </div>
            </div>

            <p className="telegram-confirm-message">
              {t('auth.telegram.confirmMessage')}
            </p>

            <div className="telegram-confirm-actions">
              <button
                onClick={handleConfirmLogin}
                className="telegram-confirm-btn primary"
              >
                {t('auth.telegram.continueAs', { name: getUserDisplayName(pendingUser) })}
              </button>

              <button
                onClick={handleUseDifferentAccount}
                className="telegram-confirm-btn secondary"
              >
                {t('auth.telegram.useDifferentAccount')}
              </button>

              <button
                onClick={handleCancelLogin}
                className="telegram-confirm-btn cancel"
              >
                {t('auth.telegram.cancel')}
              </button>
            </div>

            <p className="telegram-confirm-hint">
              {t('auth.telegram.switchAccountHint')}
            </p>
          </div>
        </div>
      )}

      {/* Logout Instructions Modal */}
      {showLogoutInstructions && (
        <div className="telegram-confirm-overlay">
          <div className="telegram-confirm-modal">
            <div className="telegram-logout-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0088cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
            </div>

            <h3 className="telegram-logout-title">
              {t('auth.telegram.logoutTitle')}
            </h3>

            <p className="telegram-confirm-message whitespace-pre-wrap">
              {t('auth.telegram.logoutInstructions')}
            </p>

            <div className="telegram-confirm-actions">
              <a
                href="https://web.telegram.org/a/"
                target="_blank"
                rel="noopener noreferrer"
                className="telegram-confirm-btn secondary text-center no-underline flex items-center justify-center"
              >
                <span>Open Telegram Web</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              <button
                onClick={handleCloseLogoutInstructions}
                className="telegram-confirm-btn primary"
              >
                {t('auth.telegram.understoodTryAgain')}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Ensure Telegram widget iframe is visible */
        iframe[src*="telegram.org"] {
          display: block !important;
          margin: 0 auto !important;
          border: none !important;
          overflow: hidden !important;
        }

        .telegram-login-wrapper {
          position: relative;
          z-index: 1;
        }

        /* Confirmation Modal Styles */
        .telegram-confirm-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
        }

        .telegram-confirm-modal {
          background: white;
          border-radius: 16px;
          padding: 24px;
          max-width: 380px;
          width: 100%;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .telegram-confirm-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .telegram-confirm-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          object-fit: cover;
        }

        .telegram-confirm-user-info {
          flex: 1;
        }

        .telegram-confirm-name {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .telegram-confirm-username {
          font-size: 14px;
          color: #666;
          margin: 4px 0 0 0;
        }

        .telegram-confirm-message {
          font-size: 15px;
          color: #444;
          margin: 0 0 20px 0;
          line-height: 1.5;
        }

        .telegram-confirm-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .telegram-confirm-btn {
          width: 100%;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .telegram-confirm-btn.primary {
          background: #0088cc;
          color: white;
        }

        .telegram-confirm-btn.primary:hover {
          background: #006699;
        }

        .telegram-confirm-btn.secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .telegram-confirm-btn.secondary:hover {
          background: #e5e7eb;
        }

        .telegram-confirm-btn.cancel {
          background: transparent;
          color: #6b7280;
        }

        .telegram-confirm-btn.cancel:hover {
          background: #f9fafb;
        }

        .telegram-confirm-hint {
          margin: 16px 0 0 0;
          font-size: 12px;
          color: #9ca3af;
          text-align: center;
          line-height: 1.4;
        }

        .telegram-logout-icon {
          display: flex;
          justify-content: center;
          margin-bottom: 16px;
        }

        .telegram-logout-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 12px 0;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
