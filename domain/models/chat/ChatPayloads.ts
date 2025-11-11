import { ChatAttachment } from './ChatMessage';

export interface CreateThreadPayload {
  readonly listingId: number;
  readonly message?: string;
  readonly attachments?: ChatAttachment[];
  readonly clientMessageId?: string;
}

export interface SendMessagePayload {
  readonly body?: string;
  readonly attachments?: ChatAttachment[];
  readonly metadata?: Record<string, unknown>;
  readonly clientMessageId?: string;
}
