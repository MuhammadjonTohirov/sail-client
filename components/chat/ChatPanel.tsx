"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChatAttachment, ChatThread } from '@/domain/chat';
import { ChatApi } from '@/lib/api';
import {
  useChatMessages,
  useChatThreadActions,
  useSendChatMessage,
} from '@/hooks';

interface ChatPanelProps {
  thread: ChatThread;
  viewerId: number | null;
  onThreadChange: (thread: ChatThread) => void;
}

export function ChatPanel({
  thread,
  viewerId,
  onThreadChange,
}: ChatPanelProps) {
  const threadId = thread.id;
  const {
    messages,
    hasMore,
    fetchOlder,
    loading: messagesLoading,
    error: messagesError,
    appendMessage,
  } = useChatMessages({ threadId, pageSize: 30 });

  const {
    sendMessage,
    isSending,
    error: sendError,
  } = useSendChatMessage(threadId, {
    onSuccess: appendMessage,
  });

  const { markRead } = useChatThreadActions(threadId, {
    onThreadUpdated: onThreadChange,
  });

  const [draft, setDraft] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const lastReadRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!threadId || !messages.length) return;
    const last = messages[messages.length - 1];
    if (lastReadRef.current === last.id) return;
    lastReadRef.current = last.id;
    markRead(last.id).catch(() => {
      /* ignore */
    });
  }, [threadId, messages, markRead]);

  useEffect(() => {
    if (!messages.length) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, threadId]);

  useEffect(() => {
    lastReadRef.current = null;
  }, [threadId]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const text = draft.trim();
      if (!text && pendingAttachments.length === 0) return;

      try {
        const message = await sendMessage({ body: text, attachments: pendingAttachments });
        const preview = message.body || message.attachments?.[0]?.name || '[вложение]';
        onThreadChange({
          ...thread,
          lastMessagePreview: preview,
          lastMessageAt: message.createdAt,
          updatedAt: message.createdAt,
          unreadCount: 0,
        });
        setDraft('');
        setPendingAttachments([]);
      } catch (err) {
        // error handled by hook state
      }
    },
    [draft, thread, onThreadChange, sendMessage, pendingAttachments],
  );

  const listingPrice = useMemo(() => {
    const listing = thread.listing;
    if (listing.priceAmount == null || listing.priceAmount === '') return null;
    const amount = Number(listing.priceAmount);
    if (Number.isNaN(amount)) return `${listing.priceAmount} ${listing.priceCurrency || ''}`.trim();
    return `${amount.toLocaleString()}${listing.priceCurrency ? ` ${listing.priceCurrency}` : ''}`;
  }, [thread.listing]);

  const combinedError = sendError || messagesError || null;

  const handleAttachClick = useCallback(() => {
    setAttachmentError(null);
    fileInputRef.current?.click();
  }, []);

  const handleFileSelected = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setAttachmentError(null);
    setUploadingAttachment(true);
    const uploaded: ChatAttachment[] = [];
    for (const file of Array.from(files)) {
      try {
        const attachment = await ChatApi.uploadAttachment(threadId, file);
        uploaded.push(attachment);
      } catch (err) {
        setAttachmentError(err instanceof Error ? err.message : 'Не удалось загрузить файл');
      }
    }
    if (uploaded.length) {
      setPendingAttachments((prev) => [...prev, ...uploaded]);
    }
    setUploadingAttachment(false);
    event.target.value = '';
  }, [threadId]);

  const removeAttachment = useCallback((index: number) => {
    setPendingAttachments((prev) => prev.filter((_, idx) => idx !== index));
  }, []);

  const formatBytes = useCallback((size?: number | null) => {
    if (!size || size <= 0) return '—';
    const units = ['байт', 'КБ', 'МБ', 'ГБ'];
    let idx = 0;
    let value = size;
    while (value >= 1024 && idx < units.length - 1) {
      value /= 1024;
      idx += 1;
    }
    return `${value.toFixed(value < 10 && idx > 0 ? 1 : 0)} ${units[idx]}`;
  }, []);

  const attachmentLabel = useCallback((att: ChatAttachment) => {
    const raw = att.name || att.url?.split('/')?.pop() || 'Файл';
    return raw;
  }, []);

  const listing = thread.listing;

  return (
    <div className="chat-panel">
      <div className="chat-panel__header">
        <div className="chat-panel__listing">
          {listing.thumbnailUrl ? (
            <img src={listing.thumbnailUrl} alt="" className="chat-panel__thumb" />
          ) : (
            <div className="chat-panel__thumb chat-panel__thumb--placeholder" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          <div>
            <div className="chat-panel__title" title={listing.title}>
              {listing.title}
            </div>
            <div className="chat-panel__subtitle">
              {listingPrice || thread.otherParticipant?.displayName || 'Чат'}
            </div>
          </div>
        </div>
      </div>

      <div className="chat-panel__body">
        {combinedError ? (
          <div className="chat-panel__state chat-panel__state--error">
            <p>{combinedError}</p>
          </div>
        ) : (
          <>
            <div className="chat-panel__messages">
              {messagesLoading && !messages.length && (
                <div className="chat-panel__state">Загрузка…</div>
              )}
              {hasMore && (
                <button className="chat-panel__history" onClick={fetchOlder} disabled={messagesLoading}>
                  {messagesLoading ? 'Загрузка…' : 'Показать предыдущие сообщения'}
                </button>
              )}

              {messages.map((message) => {
                const isOwn = viewerId != null && message.senderId === viewerId;
                return (
                  <div
                    key={message.id}
                    className={`chat-message${isOwn ? ' chat-message--own' : ''}`}
                  >
                    {message.body && <div className="chat-message__text">{message.body}</div>}
                    {message.attachments?.length ? (
                      <div className="chat-message__attachments">
                        {message.attachments.map((att) => {
                          const label = attachmentLabel(att);
                          return (
                            <div className="chat-message__attachment" key={`${message.id}-${att.url || label}`}>
                              <div className="chat-message__attachment-info">
                                <span className="chat-message__attachment-name">{label}</span>
                                <span className="chat-message__attachment-meta">{formatBytes(att.size)}</span>
                              </div>
                              <a
                                className="chat-message__attachment-download"
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                aria-label="Скачать вложение"
                              >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                  <path d="M12 3v12m0 0l-4-4m4 4l4-4" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M5 19h14" strokeLinecap="round" />
                                </svg>
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                    <div className="chat-message__meta">
                      {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {pendingAttachments.length > 0 && (
              <div className="chat-panel__pending">
                {pendingAttachments.map((att, index) => (
                  <div className="chat-panel__pending-item" key={`${att.url || att.name}-${index}`}>
                    <div>
                      <div className="chat-panel__pending-name">{attachmentLabel(att)}</div>
                      <div className="chat-panel__pending-meta">{formatBytes(att.size)}</div>
                    </div>
                    <button
                      type="button"
                      className="chat-panel__pending-remove"
                      onClick={() => removeAttachment(index)}
                      aria-label="Удалить вложение"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {attachmentError && (
              <div className="chat-panel__state chat-panel__state--error" style={{ margin: '8px 16px 0' }}>
                {attachmentError}
              </div>
            )}

            <form className="chat-panel__composer" onSubmit={handleSubmit}>
              <button
                type="button"
                className="chat-composer__icon"
                onClick={handleAttachClick}
                disabled={uploadingAttachment || isSending}
                aria-label="Прикрепить файл"
              >
                {uploadingAttachment ? (
                  <svg className="chat-composer__spinner" viewBox="0 0 24 24">
                    <circle className="path" cx="12" cy="12" r="10" fill="none" strokeWidth="2" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M16.5 6.5l-7.8 7.8a2.5 2.5 0 103.5 3.5l8-8a4 4 0 00-5.7-5.7l-8.2 8.2a5.5 5.5 0 007.8 7.8l6.2-6.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <div className="chat-composer__input">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Напишите сообщение"
                  rows={1}
                  disabled={isSending}
                />
              </div>
              <button
                type="submit"
                className="chat-composer__send"
                disabled={isSending || (draft.trim() === '' && pendingAttachments.length === 0)}
                aria-label="Отправить сообщение"
              >
                {isSending ? (
                  <svg className="chat-composer__spinner" viewBox="0 0 24 24">
                    <circle className="path" cx="12" cy="12" r="10" fill="none" strokeWidth="2" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 4l16 8-16 8 5-8-5-8z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileSelected}
              />
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatPanel;
