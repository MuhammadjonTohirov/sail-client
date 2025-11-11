"use client";

import React, { useMemo } from 'react';
import ChatShell from '@/components/chat/ChatShell';
import ChatOverlay from '@/components/chat/ChatOverlay';
import ThreadList from '@/components/chat/ThreadList';
import {
  ChatStoreProvider,
  useChatStore,
  useChatThreads,
} from '@/hooks';
import { useI18n } from '@/lib/i18n';

function ChatPageHeader() {
  const { t } = useI18n();
  return (
    <div className="chat-header">
      <div>
        <h1>{t('chat.userChatTitle')}</h1>
        <p>{t('chat.userChatDescription')}</p>
      </div>
    </div>
  );
}

function ChatPageContentInner() {
  const { t } = useI18n();
  const { threads, loading, error, reload, updateThread } = useChatThreads();
  const { selectedThreadId, selectThread } = useChatStore();

  const currentThread = useMemo(
    () => threads.find((t) => t.id === selectedThreadId) || null,
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
        <ChatOverlay
          listing={{
            id: currentThread.listing.listingId,
            title: currentThread.listing.title,
            priceAmount: currentThread.listing.priceAmount,
            priceCurrency: currentThread.listing.priceCurrency,
            thumbnailUrl: currentThread.listing.thumbnailUrl,
          }}
          thread={currentThread}
          viewerId={currentThread.buyerId}
          loading={false}
          error={null}
          onThreadChange={updateThread}
          variant="panel"
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
