'use client';

import { useEffect, useRef, useState } from 'react';
import { Lineicons } from "@lineiconshq/react-lineicons";
import {
  XmarkOutlined as Xmark,
  TelegramOutlined as TelegramIcon,
  Link2AngularRightOutlined as LinkIcon,
  CheckOutlined as CheckIcon,
} from "@lineiconshq/free-icons";
import { TelegramChat } from '@/domain/models/TelegramChat';
import { Auth } from '@/lib/authApi';
import { Listings } from '@/lib/listingsApi';
import { appConfig, trustedImageUrl } from '@/config';

interface ShareListingModalProps {
  open: boolean;
  listing: { id: number; title: string } | null;
  onClose: () => void;
  t: (key: string) => string;
}

export function ShareListingModal({
  open,
  listing,
  onClose,
  t,
}: ShareListingModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [chats, setChats] = useState<TelegramChat[]>([]);
  const [selectedChats, setSelectedChats] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      setShareSuccess(false);
      setSelectedChats(new Set());
      setCopied(false);

      Auth.getTelegramChats()
        .then((data: any[]) => {
          const mappedChats: TelegramChat[] = data.map((item: any) => ({
            id: item.id,
            chatId: item.chat_id,
            chatTitle: item.chat_title,
            chatUsername: item.chat_username,
            chatPhoto: item.chat_photo,
            chatType: item.chat_type,
            isActive: item.is_active,
          }));
          setChats(mappedChats);
        })
        .catch((err) => {
          console.error('Failed to load Telegram chats:', err);
          setError(t('myListings.shareModal.loadError'));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, t]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || !listing) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const toggleChat = (chatId: number) => {
    const newSelected = new Set(selectedChats);
    if (newSelected.has(chatId)) {
      newSelected.delete(chatId);
    } else {
      newSelected.add(chatId);
    }
    setSelectedChats(newSelected);
  };

  const listingUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/l/${listing.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(listingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (selectedChats.size === 0) return;

    setSharing(true);
    setError(null);

    try {
      const chatIds = Array.from(selectedChats);
      await Listings.share(listing.id, chatIds);
      setShareSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Failed to share:', err);
      setError(t('myListings.shareModal.shareError'));
    } finally {
      setSharing(false);
    }
  };

  return (
    <div
      ref={backdropRef}
      className="modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div className="modal-content share-modal">
        <div className="modal-header">
          <h2 className="modal-title">{t('myListings.shareModal.title')}</h2>
          <button className="modal-close" onClick={onClose}>
            <Lineicons icon={Xmark} width={20} height={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Listing Info */}
          <div className="share-listing-info">
            <p className="share-listing-title">{listing.title}</p>
            <p className="share-listing-url">{listingUrl}</p>
          </div>

          {/* Copy Link Button */}
          <button
            className={`share-copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopyLink}
          >
            <Lineicons icon={copied ? CheckIcon : LinkIcon} width={18} height={18} />
            <span>{copied ? t('myListings.shareModal.copied') : t('myListings.shareModal.copyLink')}</span>
          </button>

          {/* Divider */}
          <div className="share-divider">
            <span>{t('myListings.shareModal.orShareTo')}</span>
          </div>

          {/* Telegram Chats Section */}
          <div className="share-telegram-section">
            <div className="share-section-header">
              <Lineicons icon={TelegramIcon} width={20} height={20} />
              <span>{t('myListings.shareModal.telegramChats')}</span>
            </div>

            {loading ? (
              <div className="share-loading">
                <div className="spinner"></div>
                <span>{t('myListings.shareModal.loading')}</span>
              </div>
            ) : error ? (
              <div className="share-error">
                <p>{error}</p>
              </div>
            ) : chats.length === 0 ? (
              <div className="share-empty">
                <p>{t('myListings.shareModal.noChats')}</p>
                <p className="share-empty-hint">{t('myListings.shareModal.noChatsHint')}</p>
              </div>
            ) : shareSuccess ? (
              <div className="share-success">
                <Lineicons icon={CheckIcon} width={24} height={24} />
                <p>{t('myListings.shareModal.success')}</p>
              </div>
            ) : (
              <div className="share-chat-list">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    type="button"
                    className={`share-chat-item ${selectedChats.has(chat.chatId) ? 'selected' : ''}`}
                    onClick={() => toggleChat(chat.chatId)}
                  >
                    <div className="share-chat-avatar">
                      {chat.chatPhoto ? (
                        <img src={trustedImageUrl(chat.chatPhoto)} alt={chat.chatTitle} />
                      ) : (
                        <div className="share-chat-avatar-placeholder">
                          {chat.chatTitle.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="share-chat-info">
                      <span className="share-chat-title">{chat.chatTitle}</span>
                      {chat.chatUsername && (
                        <span className="share-chat-username">@{chat.chatUsername}</span>
                      )}
                    </div>
                    <div className="share-chat-check">
                      {selectedChats.has(chat.chatId) && (
                        <Lineicons icon={CheckIcon} width={18} height={18} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            {t('myListings.shareModal.cancel')}
          </button>
          <button
            className="btn-primary"
            onClick={handleShare}
            disabled={selectedChats.size === 0 || sharing || shareSuccess}
          >
            {sharing ? t('myListings.shareModal.sharing') : t('myListings.shareModal.share')}
          </button>
        </div>
      </div>
    </div>
  );
}
