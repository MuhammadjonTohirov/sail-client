"use client";

import React from 'react';
import type { ChatThread } from '@/domain/chat';

interface ThreadListProps {
  threads: ChatThread[];
  selectedId: string | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onSelect: (thread: ChatThread) => void;
}

export function ThreadList({ threads, selectedId, loading, error, onRetry, onSelect }: ThreadListProps) {
  if (loading) {
    return <div className="thread-list__state">Загрузка чатов…</div>;
  }
  if (error) {
    return (
      <div className="thread-list__state thread-list__state--error">
        <p>{error}</p>
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn-outline" style={{ marginTop: 8 }}>
            Повторить
          </button>
        )}
      </div>
    );
  }
  if (!threads.length) {
    return (
      <div className="thread-list__state">
        <p>Сообщений пока нет</p>
        <span className="thread-list__state-sub">Начните переписку с продавцом, чтобы она появилась здесь.</span>
      </div>
    );
  }

  return (
    <ul className="thread-list">
      {threads.map((thread) => {
        const active = thread.id === selectedId;
        const other = thread.otherParticipant;
        return (
          <li key={thread.id}>
            <button
              type="button"
              onClick={() => onSelect(thread)}
              className={`thread-list__item${active ? ' is-active' : ''}`}
            >
              <div className="thread-list__title">
                {other?.displayName || thread.listing.title}
              </div>
              <div className="thread-list__subtitle">
                {thread.lastMessagePreview || 'Без сообщений'}
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
