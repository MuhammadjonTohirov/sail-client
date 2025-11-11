import { ChatThreadStatus, ChatParticipantRole } from '../../domain/models/chat/ChatThread';
import { ChatAttachmentType } from '../../domain/models/chat/ChatMessage';

export interface ChatListingSnapshotDTO {
  listing_id: number;
  title: string;
  price_amount: string | number | null;
  price_currency: string;
  thumbnail_url?: string;
}

export interface ChatParticipantSummaryDTO {
  user_id: number;
  role: ChatParticipantRole;
  display_name: string;
  avatar_url?: string;
}

export interface ChatThreadDTO {
  id: string;
  buyer_id: number;
  seller_id: number;
  status: ChatThreadStatus;
  listing: ChatListingSnapshotDTO;
  other_participant: ChatParticipantSummaryDTO | null;
  last_message_at: string | null;
  last_message_preview: string;
  unread_count: number;
  is_archived: boolean;
  last_read_message_id: string | null;
  last_read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatAttachmentDTO {
  type: ChatAttachmentType;
  url: string;
  name?: string;
  size?: number;
  content_type?: string;
  width?: number;
  height?: number;
}

export interface ChatMessageDTO {
  id: string;
  thread_id: string;
  sender_id: number;
  sender_display_name: string;
  body: string;
  attachments: ChatAttachmentDTO[];
  metadata: Record<string, unknown>;
  client_message_id?: string;
  created_at: string;
  edited_at: string | null;
  deleted_at: string | null;
  is_deleted: boolean;
}

export interface ChatMessagePageDTO {
  messages: ChatMessageDTO[];
  has_more: boolean;
}
