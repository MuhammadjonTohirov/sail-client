"use client";

import React from 'react';
import type { ChatThread, ListingAvailability } from '@/domain/chat';
import { useI18n } from '@/lib/i18n';

interface ThreadListProps {
  threads: ChatThread[];
  selectedId: string | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onSelect: (thread: ChatThread) => void;
}

function getAvailabilityBadge(availability: ListingAvailability | undefined, t: (key: string, fallback?: string) => string) {
  if (!availability || availability === 'available') return null;

  const label = availability === 'deleted'
    ? t('chat.listingDeleted', 'Удалено')
    : t('chat.listingUnavailable', 'Недоступно');

  return (
    <span className={`thread-list__availability thread-list__availability--${availability}`}>
      {label}
    </span>
  );
}

export function ThreadList({ threads, selectedId, loading, error, onRetry, onSelect }: ThreadListProps) {
  const { t } = useI18n();

  if (loading) {
    return <div className="thread-list__state">{t('chat.loadingChats', 'Загрузка чатов…')}</div>;
  }
  if (error) {
    return (
      <div className="thread-list__state thread-list__state--error">
        <p>{error}</p>
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn-outline" style={{ marginTop: 8 }}>
            {t('common.retry', 'Повторить')}
          </button>
        )}
      </div>
    );
  }
  if (!threads.length) {
    return (
      <div className="thread-list__state">
        <p>{t('chat.noMessages', 'Сообщений пока нет')}</p>
        <span className="thread-list__state-sub">{t('chat.startConversation', 'Начните переписку с продавцом, чтобы она появилась здесь.')}</span>
      </div>
    );
  }

  return (
    <ul className="thread-list">
      {threads.map((thread) => {
        const active = thread.id === selectedId;
        const other = thread.otherParticipant;
        const isUnavailable = thread.listing.availability && thread.listing.availability !== 'available';

        return (
          <li key={thread.id}>
            <button
              type="button"
              onClick={() => onSelect(thread)}
              className={`thread-list__item${active ? ' is-active' : ''}${isUnavailable ? ' is-unavailable' : ''}`}
            >
              <div className="thread-list__header">
                <div className="thread-list__title">
                  {other?.displayName || thread.listing.title}
                </div>
                {getAvailabilityBadge(thread.listing.availability, t)}
              </div>
              <div className="thread-list__subtitle">
                {thread.lastMessagePreview || t('chat.noMessagesYet', 'Без сообщений')}
              </div>
              {thread.unreadCount > 0 && (
                <span className="thread-list__badge">{thread.unreadCount}</span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default ThreadList;
