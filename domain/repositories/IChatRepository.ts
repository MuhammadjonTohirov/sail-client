import { ChatThread, ThreadQueryParams } from '../models/chat/ChatThread';
import { ChatMessage, ChatMessagePage, ChatAttachment, MessageQueryParams } from '../models/chat/ChatMessage';
import { CreateThreadPayload, SendMessagePayload } from '../models/chat/ChatPayloads';

export interface IChatRepository {
  listThreads(params?: ThreadQueryParams): Promise<ChatThread[]>;
  createThread(payload: CreateThreadPayload): Promise<ChatThread>;
  fetchThread(threadId: string): Promise<ChatThread>;

  listMessages(threadId: string, params?: MessageQueryParams): Promise<ChatMessagePage>;
  sendMessage(threadId: string, payload: SendMessagePayload): Promise<ChatMessage>;

  markRead(threadId: string, messageId?: string): Promise<ChatThread>;
  archiveThread(threadId: string): Promise<ChatThread>;
  unarchiveThread(threadId: string): Promise<ChatThread>;
  deleteThread(threadId: string): Promise<void>;

  uploadAttachment(threadId: string, file: File): Promise<ChatAttachment>;
}
