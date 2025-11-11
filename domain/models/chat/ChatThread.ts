export type ChatThreadStatus = 'active' | 'archived' | 'closed';
export type ChatParticipantRole = 'buyer' | 'seller';

export interface ChatListingSnapshot {
  readonly listingId: number;
  readonly title: string;
  readonly priceAmount: string | number | null;
  readonly priceCurrency: string;
  readonly thumbnailUrl?: string;
}

export interface ChatParticipantSummary {
  readonly userId: number;
  readonly role: ChatParticipantRole;
  readonly displayName: string;
  readonly avatarUrl?: string;
}

export interface ChatThread {
  readonly id: string;
  readonly buyerId: number;
  readonly sellerId: number;
  readonly status: ChatThreadStatus;
  readonly listing: ChatListingSnapshot;
  readonly otherParticipant: ChatParticipantSummary | null;
  readonly lastMessageAt: string | null;
  readonly lastMessagePreview: string;
  readonly unreadCount: number;
  readonly isArchived: boolean;
  readonly lastReadMessageId: string | null;
  readonly lastReadAt: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ThreadQueryParams {
  readonly archived?: boolean;
  readonly unread?: boolean;
  readonly myAds?: boolean;
  readonly role?: ChatParticipantRole;
}
