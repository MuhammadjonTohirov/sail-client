import { IChatRepository } from '../../domain/repositories/IChatRepository';
import { ChatThread, ThreadQueryParams } from '../../domain/models/chat/ChatThread';
import {
  ChatMessage,
  ChatAttachment,
  ChatMessagePage,
  MessageQueryParams,
} from '../../domain/models/chat/ChatMessage';
import {
  CreateThreadPayload,
  SendMessagePayload,
} from '../../domain/models/chat/ChatPayloads';
import { ChatApi } from '../../lib/chatApi';
import { ChatMapper } from '../mappers/ChatMapper';
import {
  ChatThreadDTO,
  ChatMessageDTO,
  ChatAttachmentDTO,
  ChatMessagePageDTO,
} from '../models/ChatDTO';

export class ChatRepositoryImpl implements IChatRepository {
  async listThreads(params?: ThreadQueryParams): Promise<ChatThread[]> {
    const threads = await ChatApi.listThreads(params);
    // ChatApi already returns mapped domain models, but we'll ensure consistency
    return threads;
  }

  async createThread(payload: CreateThreadPayload): Promise<ChatThread> {
    const input = {
      listingId: payload.listingId,
      message: payload.message,
      attachments: payload.attachments,
      clientMessageId: payload.clientMessageId,
    };
    const thread = await ChatApi.createThread(input);
    return thread;
  }

  async fetchThread(threadId: string): Promise<ChatThread> {
    const thread = await ChatApi.fetchThread(threadId);
    return thread;
  }

  async listMessages(
    threadId: string,
    params?: MessageQueryParams
  ): Promise<ChatMessagePage> {
    const messagePage = await ChatApi.listMessages(threadId, params);
    return messagePage;
  }

  async sendMessage(
    threadId: string,
    payload: SendMessagePayload
  ): Promise<ChatMessage> {
    const input = {
      body: payload.body,
      attachments: payload.attachments,
      metadata: payload.metadata,
      clientMessageId: payload.clientMessageId,
    };
    const message = await ChatApi.sendMessage(threadId, input);
    return message;
  }

  async markRead(threadId: string, messageId?: string): Promise<ChatThread> {
    const thread = await ChatApi.markRead(threadId, messageId);
    return thread;
  }

  async archiveThread(threadId: string): Promise<ChatThread> {
    const thread = await ChatApi.archiveThread(threadId);
    return thread;
  }

  async unarchiveThread(threadId: string): Promise<ChatThread> {
    const thread = await ChatApi.unarchiveThread(threadId);
    return thread;
  }

  async deleteThread(threadId: string): Promise<void> {
    await ChatApi.deleteThread(threadId);
  }

  async uploadAttachment(threadId: string, file: File): Promise<ChatAttachment> {
    const attachment = await ChatApi.uploadAttachment(threadId, file);
    return attachment;
  }
}
