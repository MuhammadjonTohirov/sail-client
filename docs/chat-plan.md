## Chat Web Client Plan

### 1. API Surface (server -> client)

- `GET /api/v1/chat/threads?archived=0|1&unread=1&role=seller|buyer&my_ads=1`
  - Returns `ChatThread` objects with listing snapshot, other participant meta, unread counters.
- `POST /api/v1/chat/threads/`
  - Body `{ listing_id, message?, attachments?, client_message_id? }`
  - Creates or reuses thread; returns refreshed thread payload.
- `GET /api/v1/chat/threads/{id}/messages?before&after&limit`
  - Returns `{ messages: ChatMessage[], has_more }` ordered asc by `created_at`.
- `POST /api/v1/chat/threads/{id}/messages/`
  - Sends message (text/attachments).
- `POST /api/v1/chat/threads/{id}/read`
  - Marks as read (optional `message_id`).
- `POST /api/v1/chat/threads/{id}/archive` / `.../unarchive`
- `DELETE /api/v1/chat/threads/{id}`

> Attachments are URL-based (validated server-side) and limited to five per message.

### 2. Domain Types (to add under `web_client/domain/chat.ts`)

```ts
export interface ChatListingSnapshot {
  listingId: number;
  title: string;
  priceAmount: string | number | null;
  priceCurrency: string;
  thumbnailUrl?: string;
}

export interface ChatParticipantSummary {
  userId: number;
  role: 'buyer' | 'seller';
  displayName: string;
  avatarUrl?: string;
}

export interface ChatThread {
  id: string;
  buyerId: number;
  sellerId: number;
  status: 'active' | 'archived' | 'closed';
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

export interface ChatAttachment {
  type: 'image' | 'file';
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
  editedAt?: string | null;
  deletedAt?: string | null;
  isDeleted: boolean;
}
```

### 3. Gateways (`web_client/lib/chatApi.ts`)

- `listThreads(params: ThreadQuery)` – wraps `/chat/threads`.
- `createThread(payload: ThreadCreateInput)` – returns `ChatThread`.
- `listMessages(threadId, params)` – returns `{ messages, hasMore }`.
- `sendMessage(threadId, input)`.
- `markRead(threadId, messageId?)`.
- `archiveThread`, `unarchiveThread`, `deleteThread`.

Use existing `apiFetch` helper; ensure locale-aware query assembly where relevant.

### 4. Use Cases / Hooks (`web_client/hooks/chat/…`)

- `useChatThreads(query)` with React state caching (consider `useSWR`-style local caching until a data library is introduced).
- `useChatMessages(threadId)` with pagination helpers (`fetchBefore`, `fetchAfter`).
- `useSendChatMessage(threadId)` handling optimistic append and error rollback.
- `useArchiveThread`, `useMarkRead` managing derived state tied to other hooks.
- Provide shared context `ChatStoreProvider` to keep selected thread id, composer draft, unread counts in sync.

> No state library today; plan is to use React context + `useReducer` for scoped state to avoid external deps.

### 5. UI Layout (under `app/chat/…`)

- Route: `/chat` (locale prefixed).
- Components:
  - `ChatLayout` – responsive split pane (sidebar + conversation). Falls back to list ⇄ detail navigation on small screens.
  - `ThreadList` – filters (All/Unread/Archived), infinite scroll, active-state highlight, listing preview snippet.
  - `ConversationHeader` – listing info, participant name, archive toggle.
  - `MessageList` – virtualized scroll (simple `overflow-y-auto` w/ reverse order for MVP) pulling more on scroll top.
  - `MessageComposer` – textarea, send button, attachment uploader placeholder (hooked to uploads module later).
  - `EmptyState` screens (no threads selected, no messages, archived filter empty).
- Use existing CSS conventions (`globals.css`) and utility classes.

### 6. Interaction Notes

- Selecting a thread triggers `markRead` after initial message load.
- Optimistically append outgoing messages; if send fails, show inline error + retry CTA.
- Refresh thread list after archive/delete/send via shared store or `listThreads` refresh.
- Handle attachment placeholder by allowing paste/upload but show "Upload coming soon" until pipeline ready.

### 7. Outstanding Questions / Follow-ups

- How to integrate push notifications on web (likely later).
- Attachment upload UX depends on `uploads/presign` flow (future task).
- No pagination metadata from server for threads; plan for cursor/offset as needed (for now simple list fetch).

---

With this plan in place, next steps are:
1. Add domain types file.
2. Implement chat API gateway.
3. Build hooks/use-cases.
4. Scaffold UI components and pages. 
