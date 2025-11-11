import {
  ChatThread,
  ChatListingSnapshot,
  ChatParticipantSummary,
} from '../../domain/models/chat/ChatThread';
import {
  ChatMessage,
  ChatAttachment,
  ChatMessagePage,
} from '../../domain/models/chat/ChatMessage';
import {
  CreateThreadPayload,
  SendMessagePayload,
} from '../../domain/models/chat/ChatPayloads';
import {
  ChatThreadDTO,
  ChatListingSnapshotDTO,
  ChatParticipantSummaryDTO,
  ChatMessageDTO,
  ChatAttachmentDTO,
  ChatMessagePageDTO,
} from '../models/ChatDTO';

export class ChatMapper {
  static toListingSnapshot(dto: ChatListingSnapshotDTO): ChatListingSnapshot {
    return {
      listingId: dto.listing_id,
      title: dto.title,
      priceAmount: dto.price_amount,
      priceCurrency: dto.price_currency,
      thumbnailUrl: dto.thumbnail_url,
    };
  }

  static toParticipantSummary(dto: ChatParticipantSummaryDTO): ChatParticipantSummary {
    return {
      userId: dto.user_id,
      role: dto.role,
      displayName: dto.display_name,
      avatarUrl: dto.avatar_url,
    };
  }

  static toAttachment(dto: ChatAttachmentDTO): ChatAttachment {
    return {
      type: dto.type,
      url: dto.url,
      name: dto.name,
      size: dto.size,
      contentType: dto.content_type,
      width: dto.width,
      height: dto.height,
    };
  }

  static toThread(dto: ChatThreadDTO): ChatThread {
    return {
      id: dto.id,
      buyerId: dto.buyer_id,
      sellerId: dto.seller_id,
      status: dto.status,
      listing: this.toListingSnapshot(dto.listing),
      otherParticipant: dto.other_participant
        ? this.toParticipantSummary(dto.other_participant)
        : null,
      lastMessageAt: dto.last_message_at,
      lastMessagePreview: dto.last_message_preview,
      unreadCount: dto.unread_count,
      isArchived: dto.is_archived,
      lastReadMessageId: dto.last_read_message_id,
      lastReadAt: dto.last_read_at,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    };
  }

  static toMessage(dto: ChatMessageDTO): ChatMessage {
    return {
      id: dto.id,
      threadId: dto.thread_id,
      senderId: dto.sender_id,
      senderDisplayName: dto.sender_display_name,
      body: dto.body,
      attachments: dto.attachments.map((a) => this.toAttachment(a)),
      metadata: dto.metadata,
      clientMessageId: dto.client_message_id,
      createdAt: dto.created_at,
      editedAt: dto.edited_at,
      deletedAt: dto.deleted_at,
      isDeleted: dto.is_deleted,
    };
  }

  static toMessagePage(dto: ChatMessagePageDTO): ChatMessagePage {
    return {
      messages: dto.messages.map((m) => this.toMessage(m)),
      hasMore: dto.has_more,
    };
  }

  // Reverse mappings for payloads
  static createThreadPayloadToDTO(payload: CreateThreadPayload): {
    listing_id: number;
    message?: string;
    attachments?: Array<{ type: string; url: string }>;
  } {
    return {
      listing_id: payload.listingId,
      message: payload.message,
      attachments: payload.attachments,
    };
  }

  static sendMessagePayloadToDTO(payload: SendMessagePayload): {
    body?: string;
    attachments?: Array<{ type: string; url: string }>;
    client_message_id?: string;
  } {
    return {
      body: payload.body,
      attachments: payload.attachments,
      client_message_id: payload.clientMessageId,
    };
  }
}
