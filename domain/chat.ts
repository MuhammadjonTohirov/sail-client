export type ChatThreadStatus = 'active' | 'archived' | 'closed';

export interface ChatListingSnapshot {
  listingId: number;
  title: string;
  priceAmount: string | number | null;
  priceCurrency: string;
  thumbnailUrl?: string;
}

export type ChatParticipantRole = 'buyer' | 'seller';

export interface ChatParticipantSummary {
  userId: number;
  role: ChatParticipantRole;
  displayName: string;
  avatarUrl?: string;
}

export interface ChatThread {
  id: string;
  buyerId: number;
  sellerId: number;
  status: ChatThreadStatus;
  listing: ChatListingSnapshot;
  otherParticipant: ChatParticipantSummary | null;
  lastMessageAt: string | null;
  lastMessagePreview: string;
  unreadCount: number;
  isArchived: boolean;
  lastReadMessageId: string | null;
  lastReadAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ChatAttachmentType = 'image' | 'file';

export interface ChatAttachment {
  type: ChatAttachmentType;
  url: string;
  name?: string;
  size?: number;
  contentType?: string;
  width?: number;
  height?: number;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: number;
  senderDisplayName: string;
  body: string;
  attachments: ChatAttachment[];
  metadata: Record<string, unknown>;
  clientMessageId?: string;
  createdAt: string;
  editedAt: string | null;
  deletedAt: string | null;
  isDeleted: boolean;
}

export interface ChatMessagePage {
  messages: ChatMessage[];
  hasMore: boolean;
}

// --- API response shapes (snake_case) ---

export interface ChatListingSnapshotResponse {
  listing_id: number;
  title: string;
  price_amount: string | number | null;
  price_currency: string;
  thumbnail_url?: string;
}

export interface ChatParticipantSummaryResponse {
  user_id: number;
  role: ChatParticipantRole;
  display_name: string;
  avatar_url?: string;
}

export interface ChatThreadResponse {
  id: string;
  buyer_id: number;
  seller_id: number;
  status: ChatThreadStatus;
  listing: ChatListingSnapshotResponse;
  other_participant: ChatParticipantSummaryResponse | null;
  last_message_at: string | null;
  last_message_preview: string;
  unread_count: number;
  is_archived: boolean;
  last_read_message_id: string | null;
  last_read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatAttachmentResponse {
  type: ChatAttachmentType;
  url: string;
  name?: string;
  size?: number;
  content_type?: string;
  width?: number;
  height?: number;
}

export interface ChatMessageResponse {
  id: string;
  thread_id: string;
  sender_id: number;
  sender_display_name: string;
  body: string;
  attachments: ChatAttachmentResponse[];
  metadata: Record<string, unknown>;
  client_message_id?: string;
  created_at: string;
  edited_at: string | null;
  deleted_at: string | null;
  is_deleted: boolean;
}

export interface ChatMessagePageResponse {
  messages: ChatMessageResponse[];
  has_more: boolean;
}

// --- Input payload shapes ---

export interface CreateThreadInput {
  listingId: number;
  message?: string;
  attachments?: ChatAttachment[];
  clientMessageId?: string;
}

export interface SendMessageInput {
  body?: string;
  attachments?: ChatAttachment[];
  metadata?: Record<string, unknown>;
  clientMessageId?: string;
}

export interface ThreadQueryParams {
  archived?: boolean;
  unread?: boolean;
  myAds?: boolean;
  role?: ChatParticipantRole;
}

// --- Mapping helpers ---

export function mapListingSnapshot(input: ChatListingSnapshotResponse): ChatListingSnapshot {
  return {
    listingId: input.listing_id,
    title: input.title,
    priceAmount: input.price_amount ?? null,
    priceCurrency: input.price_currency,
    thumbnailUrl: input.thumbnail_url,
  };
}

export function mapParticipantSummary(input: ChatParticipantSummaryResponse | null): ChatParticipantSummary | null {
  if (!input) return null;
  return {
    userId: input.user_id,
    role: input.role,
    displayName: input.display_name,
    avatarUrl: input.avatar_url,
  };
}

export function mapAttachment(input: ChatAttachmentResponse): ChatAttachment {
  return {
    type: input.type,
    url: input.url,
    name: input.name,
    size: input.size,
    contentType: input.content_type,
    width: input.width,
    height: input.height,
  };
}

export function mapThread(input: ChatThreadResponse): ChatThread {
  return {
    id: input.id,
    buyerId: input.buyer_id,
    sellerId: input.seller_id,
    status: input.status,
    listing: mapListingSnapshot(input.listing),
    otherParticipant: mapParticipantSummary(input.other_participant),
    lastMessageAt: input.last_message_at,
    lastMessagePreview: input.last_message_preview,
    unreadCount: input.unread_count,
    isArchived: input.is_archived,
    lastReadMessageId: input.last_read_message_id,
    lastReadAt: input.last_read_at,
    createdAt: input.created_at,
    updatedAt: input.updated_at,
  };
}

export function mapMessage(input: ChatMessageResponse): ChatMessage {
  return {
    id: input.id,
    threadId: input.thread_id,
    senderId: input.sender_id,
    senderDisplayName: input.sender_display_name,
    body: input.body,
    attachments: Array.isArray(input.attachments) ? input.attachments.map(mapAttachment) : [],
    metadata: input.metadata ?? {},
    clientMessageId: input.client_message_id,
    createdAt: input.created_at,
    editedAt: input.edited_at,
    deletedAt: input.deleted_at,
    isDeleted: input.is_deleted,
  };
}

export function mapMessagePage(input: ChatMessagePageResponse): ChatMessagePage {
  return {
    messages: input.messages?.map(mapMessage) ?? [],
    hasMore: Boolean(input.has_more),
  };
}
