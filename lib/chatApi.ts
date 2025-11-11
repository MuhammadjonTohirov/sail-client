import { apiFetch } from './api';
import type {
  ChatAttachment,
  ChatAttachmentResponse,
  ChatMessage,
  ChatMessagePage,
  ChatMessagePageResponse,
  ChatMessageResponse,
  ChatParticipantRole,
  ChatThread,
  ChatThreadResponse,
  CreateThreadInput,
  SendMessageInput,
  ThreadQueryParams,
} from '@/domain/chat';
import {
  mapAttachment,
  mapMessage,
  mapMessagePage,
  mapThread,
} from '@/domain/chat';

type QueryDict = Record<string, string>;

function toSnakeCaseAttachment(input: ChatAttachment): ChatAttachmentResponse {
  return {
    type: input.type,
    url: input.url,
    name: input.name,
    size: input.size,
    content_type: input.contentType,
    width: input.width,
    height: input.height,
  };
}

function buildQuery(params: ThreadQueryParams | undefined): QueryDict {
  const query: QueryDict = {};
  if (!params) return query;
  if (typeof params.archived === 'boolean') query.archived = params.archived ? '1' : '0';
  if (typeof params.unread === 'boolean') query.unread = params.unread ? '1' : '0';
  if (typeof params.myAds === 'boolean') query.my_ads = params.myAds ? '1' : '0';
  if (params.role) query.role = params.role;
  return query;
}

function makeSearchParams(params: QueryDict): string {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      usp.set(key, value);
    }
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : '';
}

const THREADS_BASE = '/api/v1/chat/threads/';

async function listThreads(params?: ThreadQueryParams): Promise<ChatThread[]> {
  const query = makeSearchParams(buildQuery(params));
  const data = await apiFetch(`${THREADS_BASE}${query}`);
  return Array.isArray(data) ? data.map(mapThread) : [];
}

async function createThread(input: CreateThreadInput): Promise<ChatThread> {
  const payload: Record<string, unknown> = {
    listing_id: input.listingId,
    message: input.message,
    client_message_id: input.clientMessageId,
  };
  if (input.attachments?.length) {
    payload.attachments = input.attachments.map(toSnakeCaseAttachment);
  }
  const data = await apiFetch(THREADS_BASE, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return mapThread(data as ChatThreadResponse);
}

async function fetchThread(threadId: string): Promise<ChatThread> {
  const data = await apiFetch(`${THREADS_BASE}${threadId}/`);
  return mapThread(data as ChatThreadResponse);
}

async function listMessages(
  threadId: string,
  params?: { before?: string; after?: string; limit?: number },
): Promise<ChatMessagePage> {
  const queryParams: QueryDict = {};
  if (params?.before) queryParams.before = params.before;
  if (params?.after) queryParams.after = params.after;
  if (params?.limit !== undefined) queryParams.limit = String(params.limit);
  const query = makeSearchParams(queryParams);
  const data = await apiFetch(`${THREADS_BASE}${threadId}/messages/${query}`);
  return mapMessagePage(data as ChatMessagePageResponse);
}

async function sendMessage(threadId: string, input: SendMessageInput): Promise<ChatMessage> {
  const payload: Record<string, unknown> = {
    body: input.body,
    metadata: input.metadata,
    client_message_id: input.clientMessageId,
  };
  if (input.attachments?.length) {
    payload.attachments = input.attachments.map(toSnakeCaseAttachment);
  }
  const data = await apiFetch(`${THREADS_BASE}${threadId}/messages/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return mapMessage(data as ChatMessageResponse);
}

async function markRead(threadId: string, messageId?: string): Promise<ChatThread> {
  const payload = messageId ? { message_id: messageId } : {};
  const data = await apiFetch(`${THREADS_BASE}${threadId}/read/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return mapThread(data as ChatThreadResponse);
}

async function archiveThread(threadId: string): Promise<ChatThread> {
  const data = await apiFetch(`${THREADS_BASE}${threadId}/archive/`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
  return mapThread(data as ChatThreadResponse);
}

async function unarchiveThread(threadId: string): Promise<ChatThread> {
  const data = await apiFetch(`${THREADS_BASE}${threadId}/unarchive/`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
  return mapThread(data as ChatThreadResponse);
}

async function deleteThread(threadId: string): Promise<void> {
  await apiFetch(`${THREADS_BASE}${threadId}/`, { method: 'DELETE' });
}

async function uploadAttachment(threadId: string, file: File): Promise<ChatAttachment> {
  const form = new FormData();
  form.append('file', file);
  const response = await apiFetch(`${THREADS_BASE}${threadId}/attachments/`, {
    method: 'POST',
    body: form,
  }, false);
  const data = await response.json();
  return mapAttachment(data as ChatAttachmentResponse);
}

export const ChatApi = {
  listThreads,
  createThread,
  fetchThread,
  listMessages,
  sendMessage,
  markRead,
  archiveThread,
  unarchiveThread,
  deleteThread,
  uploadAttachment,
};
