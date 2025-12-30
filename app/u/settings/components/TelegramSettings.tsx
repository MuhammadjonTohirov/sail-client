'use client';

import { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/lib/i18n';
import { useProfile } from '@/hooks';
import { appConfig, trustedImageUrl } from '@/config';
import { Auth } from '@/lib/authApi';
import { Lineicons } from "@lineiconshq/react-lineicons";
import {
  TelegramOutlined as TelegramIcon,
  CheckOutlined as CheckIcon,
  Trash3Outlined as TrashIcon,
} from "@lineiconshq/free-icons";
import { TelegramChat } from '@/domain/models/TelegramChat';
import { GetTelegramChatsUseCase } from '@/domain/usecases/telegram/GetTelegramChatsUseCase';
import { DisconnectTelegramChatUseCase } from '@/domain/usecases/telegram/DisconnectTelegramChatUseCase';
import { VerifyTelegramChatsUseCase } from '@/domain/usecases/telegram/VerifyTelegramChatsUseCase';
import { TelegramRepositoryImpl } from '@/data/repositories/TelegramRepositoryImpl';

export interface SecurityInfo {
  has_password: boolean;
  has_email: boolean;
  has_phone: boolean;
  has_telegram: boolean;
  telegram_username: string | null;
  email: string | null;
  phone: string | null;
}

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
    onTelegramLinkAuth?: (user: TelegramUser) => void;
  }
}

function ConnectedChatsList() {
  const { t } = useI18n();
  const [chats, setChats] = useState<TelegramChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadChats = async () => {
    try {
      const repo = new TelegramRepositoryImpl();

      // First verify all chats to update their status
      const verifyUseCase = new VerifyTelegramChatsUseCase(repo);
      await verifyUseCase.execute();

      // Then load the updated chats
      const getChatsUseCase = new GetTelegramChatsUseCase(repo);
      const data = await getChatsUseCase.execute();
      setChats(data);
    } catch (e) {
      console.error('Failed to load chats:', e);
      setError(t('settings.telegram.loadChatsError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  const handleDisconnect = async (chatId: string) => {
    if (!confirm(t('settings.telegram.disconnectChatConfirm'))) return;

    try {
      const repo = new TelegramRepositoryImpl();
      const useCase = new DisconnectTelegramChatUseCase(repo);
      await useCase.execute(chatId);
      await loadChats();
    } catch (e) {
      console.error('Failed to disconnect chat:', e);
      alert(t('settings.telegram.disconnectChatError'));
    }
  };

  if (loading) return <div className="text-sm text-gray-500">{t('settings.loading')}</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (chats.length === 0) return <div className="text-sm text-gray-500">{t('settings.telegram.noChats')}</div>;

  return (
    <div className="flex gap-3" style={{ display: 'flex', flexDirection: 'column' }}>
      {chats.map(chat => (
        <div
          key={chat.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          style={{ opacity: chat.isActive ? 1 : 0.6 }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{ width: '40px', height: '40px', minWidth: '40px' }}
            >
              {chat.chatPhoto ? (
                <img
                  src={trustedImageUrl(chat.chatPhoto)}
                  alt={chat.chatTitle}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-xs font-bold">{chat.chatTitle.substring(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900 truncate">{chat.chatTitle}</p>
                {!chat.isActive && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700"
                    title={t('settings.telegram.chatInactiveHint')}
                  >
                    {t('settings.telegram.chatInactive')}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 capitalize">{chat.chatType}</p>
            </div>
          </div>
          <button
            onClick={() => handleDisconnect(String(chat.id))}
            className="text-gray-600 hover:text-red-500 transition-colors p-2 flex-shrink-0 ml-2"
            title={t('settings.telegram.disconnectChat')}
            style={{ backgroundColor: 'transparent' }}
          >
            <Lineicons icon={TrashIcon} width={20} height={20} />
          </button>
        </div>
      ))}
    </div>
  );
}

interface TelegramSettingsProps {
  securityInfo: SecurityInfo | null;
  loading: boolean;
  onReloadSecurity: () => Promise<void>;
}

export default function TelegramSettings({ securityInfo, loading, onReloadSecurity }: TelegramSettingsProps) {
  const { t } = useI18n();
  const { getProfile } = useProfile();
  
  const [telegramLinking, setTelegramLinking] = useState(false);
  const [telegramError, setTelegramError] = useState('');
  const [telegramSuccess, setTelegramSuccess] = useState(false);
  const telegramContainerRef = useRef<HTMLDivElement>(null);

  const [showTelegramConfirm, setShowTelegramConfirm] = useState(false);
  const [pendingTelegramUser, setPendingTelegramUser] = useState<TelegramUser | null>(null);
  const [showTelegramLogoutInstructions, setShowTelegramLogoutInstructions] = useState(false);

  useEffect(() => {
    if (securityInfo && !securityInfo.has_telegram && appConfig.telegram.enabled && appConfig.telegram.botUsername) {
      renderTelegramLinkButton();
    }

    return () => {
      if (window.onTelegramLinkAuth) {
        delete window.onTelegramLinkAuth;
      }
    };
  }, [securityInfo]);

  const renderTelegramLinkButton = () => {
    if (!telegramContainerRef.current || !appConfig.telegram.botUsername) {
      return;
    }

    window.onTelegramLinkAuth = (user: TelegramUser) => {
      setPendingTelegramUser(user);
      setShowTelegramConfirm(true);
    };

    telegramContainerRef.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', appConfig.telegram.botUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramLinkAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.async = true;

    telegramContainerRef.current.appendChild(script);
  };

  const handleConfirmTelegramLink = async () => {
    if (!pendingTelegramUser) return;

    setShowTelegramConfirm(false);
    setTelegramLinking(true);
    setTelegramError('');
    setTelegramSuccess(false);

    try {
      await Auth.linkTelegram(pendingTelegramUser);
      setTelegramSuccess(true);
      await onReloadSecurity();
      await getProfile();
    } catch (e: any) {
      const errorMsg = e.message || t('settings.telegram.linkError');
      setTelegramError(errorMsg);
    } finally {
      setTelegramLinking(false);
      setPendingTelegramUser(null);
    }
  };

  const handleUseDifferentTelegramAccount = () => {
    setShowTelegramConfirm(false);
    setPendingTelegramUser(null);
    setShowTelegramLogoutInstructions(true);
  };

  const handleCloseTelegramLogoutInstructions = () => {
    setShowTelegramLogoutInstructions(false);
  };

  const handleCancelTelegramLink = () => {
    setShowTelegramConfirm(false);
    setPendingTelegramUser(null);
  };

  // Check if user can disconnect Telegram (must have another login method)
  const canDisconnectTelegram = securityInfo?.has_telegram && (securityInfo?.has_password || securityInfo?.has_phone);

  const handleUnlinkTelegram = async () => {
    // Prevent disconnect if this is the only auth method
    if (!canDisconnectTelegram) {
      setTelegramError(t('settings.telegram.cannotUnlinkOnlyMethod'));
      return;
    }

    if (!confirm(t('settings.telegram.unlinkConfirm'))) {
      return;
    }

    setTelegramLinking(true);
    setTelegramError('');

    try {
      await Auth.unlinkTelegram();
      await onReloadSecurity();
      await getProfile();
    } catch (e: any) {
      setTelegramError(e.message || t('settings.telegram.unlinkError'));
    } finally {
      setTelegramLinking(false);
    }
  };

  const getTelegramUserDisplayName = (user: TelegramUser) => {
    const parts = [user.first_name, user.last_name].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : user.username || `User ${user.id}`;
  };

  return (
    <div style={{ minWidth: '100%' }}>
      <div className="settings-card telegram-section">
        <div className="settings-card-header">
          <div className="settings-card-header-icon">
            <Lineicons icon={TelegramIcon} width={24} height={24} />
            <h2 className="settings-card-title">{t('settings.telegram.title')}</h2>
          </div>
        </div>
        <div className="settings-card-body">
          {loading ? (
            <div className="loading-inline">
              <div className="spinner-small"></div>
              <span>{t('settings.loading')}</span>
            </div>
          ) : securityInfo?.has_telegram ? (
            <div className="flex-col gap-6">
              <div className="telegram-connected" style={{ marginBottom: '32px' }}>
                <div className="telegram-connected-info">
                  <Lineicons icon={CheckIcon} width={20} height={20} className="success-icon" />
                  <div>
                    <p className="telegram-status">{t('settings.telegram.connected')}</p>
                    {securityInfo.telegram_username && (
                      <p className="telegram-username">@{securityInfo.telegram_username}</p>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <button
                    onClick={handleUnlinkTelegram}
                    className="btn-secondary btn-unlink"
                    disabled={telegramLinking || !canDisconnectTelegram}
                    title={!canDisconnectTelegram ? t('settings.telegram.cannotUnlinkOnlyMethod') : undefined}
                  >
                    {telegramLinking ? t('settings.telegram.unlinking') : t('settings.telegram.unlink')}
                  </button>
                  {!canDisconnectTelegram && (
                    <span style={{ fontSize: '12px', color: 'var(--muted)', maxWidth: '200px', textAlign: 'right' }}>
                      {t('settings.telegram.onlyMethodHint')}
                    </span>
                  )}
                </div>
              </div>

              {/* Connected Chats List */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('settings.telegram.connectedChats')}</h3>
                <ConnectedChatsList />
              </div>
            </div>
          ) : (
            <div className="telegram-not-connected">
              <div className="telegram-benefits">
                <p className="telegram-benefits-title">{t('settings.telegram.benefitsTitle')}</p>
                <ul className="telegram-benefits-list">
                  <li>{t('settings.telegram.benefit1')}</li>
                  <li>{t('settings.telegram.benefit2')}</li>
                  <li>{t('settings.telegram.benefit3')}</li>
                </ul>
              </div>
              <div className="telegram-button-container" ref={telegramContainerRef}>
                {/* Telegram widget will be rendered here */}
              </div>
              {telegramLinking && (
                <div className="loading-inline">
                  <div className="spinner-small"></div>
                  <span>{t('settings.telegram.linking')}</span>
                </div>
              )}
            </div>
          )}
          {telegramError && (
            <div className="error-message">{telegramError}</div>
          )}
          {telegramSuccess && (
            <div className="success-message">{t('settings.telegram.linkSuccess')}</div>
          )}
        </div>
      </div>

      {showTelegramConfirm && pendingTelegramUser && (
        <div className="telegram-confirm-overlay">
          <div className="telegram-confirm-modal">
            <div className="telegram-confirm-header">
              {pendingTelegramUser.photo_url && (
                <img
                  src={pendingTelegramUser.photo_url}
                  alt={getTelegramUserDisplayName(pendingTelegramUser)}
                  className="telegram-confirm-avatar"
                />
              )}
              <div className="telegram-confirm-user-info">
                <p className="telegram-confirm-name">{getTelegramUserDisplayName(pendingTelegramUser)}</p>
                {pendingTelegramUser.username && (
                  <p className="telegram-confirm-username">@{pendingTelegramUser.username}</p>
                )}
              </div>
            </div>

            <p className="telegram-confirm-message">
              {t('settings.telegram.confirmMessage')}
            </p>

            <div className="telegram-confirm-actions">
              <button
                onClick={handleConfirmTelegramLink}
                className="telegram-confirm-btn primary"
              >
                {t('settings.telegram.connectAs', { name: getTelegramUserDisplayName(pendingTelegramUser) })}
              </button>

              <button
                onClick={handleUseDifferentTelegramAccount}
                className="telegram-confirm-btn secondary"
              >
                {t('settings.telegram.useDifferentAccount')}
              </button>

              <button
                onClick={handleCancelTelegramLink}
                className="telegram-confirm-btn cancel"
              >
                {t('settings.telegram.cancel')}
              </button>
            </div>

            <p className="telegram-confirm-hint">
              {t('settings.telegram.switchAccountHint')}
            </p>
          </div>
        </div>
      )}

      {showTelegramLogoutInstructions && (
        <div className="telegram-confirm-overlay">
          <div className="telegram-confirm-modal">
            <div className="telegram-logout-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0088cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>

            <h3 className="telegram-logout-title">
              {t('settings.telegram.logoutTitle')}
            </h3>

            <p className="telegram-confirm-message">
              {t('settings.telegram.logoutInstructions')}
            </p>

            <div className="telegram-confirm-actions">
              <button
                onClick={handleCloseTelegramLogoutInstructions}
                className="telegram-confirm-btn primary"
              >
                {t('settings.telegram.understoodTryAgain')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
