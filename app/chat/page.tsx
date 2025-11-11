"use client";

import React, { useEffect, useMemo, useState } from 'react';
import ChatShell from '@/components/chat/ChatShell';
import ChatPanel from '@/components/chat/ChatPanel';
import ThreadList from '@/components/chat/ThreadList';
import { ChatStoreProvider, useChatStore, useChatThreads } from '@/hooks';
import { useI18n } from '@/lib/i18n';

function ChatPageHeader() {
  const { t } = useI18n();
  return (
    <div className="chat-header">
      <div>
        <h1>{t('chat.pageTitle')}</h1>
        <p>{t('chat.pageDescription')}</p>
      </div>
    </div>
  );
}

function ChatPageContentInner() {
  const { t } = useI18n();
  const { threads, loading, error, reload, updateThread } = useChatThreads();
  const { selectedThreadId, selectThread } = useChatStore();
  const [viewerId, setViewerId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const readProfile = () => {
      try {
        const raw = localStorage.getItem('profile');
        if (!raw) {
          setViewerId(null);
          return;
        }
        const parsed = JSON.parse(raw);
        const uid = parsed?.user_id ?? parsed?.id ?? null;
        setViewerId(typeof uid === 'number' ? uid : null);
      } catch {
        setViewerId(null);
      }
    };
    readProfile();
    window.addEventListener('auth-changed', readProfile);
    return () => window.removeEventListener('auth-changed', readProfile);
  }, []);

  const currentThread = useMemo(
    () => {
      if (!selectedThreadId) return null;
      return threads.find((t) => String(t.id) === String(selectedThreadId)) || null;
    },
    [threads, selectedThreadId],
  );

  return (
    <ChatShell
      header={<ChatPageHeader />}
      sidebar={(
        <ThreadList
          threads={threads}
          selectedId={selectedThreadId}
          loading={loading}
          error={error}
          onRetry={reload}
          onSelect={(thread) => selectThread(thread.id)}
        />
      )}
      conversation={currentThread ? (
        <ChatPanel
          thread={currentThread}
          viewerId={viewerId}
          onThreadChange={updateThread}
        />
      ) : (
        <div className="chat-panel__empty">
          <div>
            <p>{t('chat.selectConversation')}</p>
          </div>
        </div>
      )}
    />
  );
}

export default function ChatPage() {
  return (
    <ChatStoreProvider>
      <ChatPageContentInner />
    </ChatStoreProvider>
  );
}
