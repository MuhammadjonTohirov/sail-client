export type ChatAttachmentType = 'image' | 'file';

export interface ChatAttachment {
  readonly type: ChatAttachmentType;
  readonly url: string;
  readonly name?: string;
  readonly size?: number;
  readonly contentType?: string;
  readonly width?: number;
  readonly height?: number;
}

export interface ChatMessage {
  readonly id: string;
  readonly threadId: string;
  readonly senderId: number;
  readonly senderDisplayName: string;
  readonly body: string;
  readonly attachments: ChatAttachment[];
  readonly metadata: Record<string, unknown>;
  readonly clientMessageId?: string;
  readonly createdAt: string;
  readonly editedAt: string | null;
  readonly deletedAt: string | null;
  readonly isDeleted: boolean;
}

export interface ChatMessagePage {
  readonly messages: ChatMessage[];
  readonly hasMore: boolean;
}

export interface MessageQueryParams {
  readonly before?: string;
  readonly after?: string;
  readonly limit?: number;
}
