import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { ChatApi } from '@/lib/api';
import type { ChatMessage, ChatMessagePage } from '@/domain/chat';

type Action =
  | { type: 'reset'; messages: ChatMessage[]; hasMore: boolean }
  | { type: 'prepend'; messages: ChatMessage[]; hasMore: boolean }
  | { type: 'append'; messages: ChatMessage[] }
  | { type: 'update'; message: ChatMessage };

interface State {
  items: ChatMessage[];
  hasMore: boolean;
}

function messagesReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'reset':
      return { items: action.messages, hasMore: action.hasMore };
    case 'prepend': {
      const existingIds = new Set(state.items.map((m) => m.id));
      const merged = [...action.messages.filter((m) => !existingIds.has(m.id)), ...state.items];
      return { items: merged, hasMore: action.hasMore };
    }
    case 'append': {
      const existingIds = new Set(state.items.map((m) => m.id));
      const merged = [...state.items, ...action.messages.filter((m) => !existingIds.has(m.id))];
      return { items: merged, hasMore: state.hasMore };
    }
    case 'update': {
      const idx = state.items.findIndex((m) => m.id === action.message.id);
      if (idx === -1) return state;
      const next = state.items.slice();
      next[idx] = action.message;
      return { ...state, items: next };
    }
    default:
      return state;
  }
}

interface UseChatMessagesOptions {
  threadId: string | null;
  pageSize?: number;
}

export function useChatMessages({ threadId, pageSize = 30 }: UseChatMessagesOptions) {
  const [{ items, hasMore }, dispatch] = useReducer(messagesReducer, { items: [], hasMore: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializedRef = useRef(false);

  const loadInitial = useCallback(async () => {
    if (!threadId) {
      dispatch({ type: 'reset', messages: [], hasMore: false });
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const page = await ChatApi.listMessages(threadId, { limit: pageSize });
      dispatch({ type: 'reset', messages: page.messages, hasMore: page.hasMore });
      initializedRef.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
      dispatch({ type: 'reset', messages: [], hasMore: false });
    } finally {
      setLoading(false);
    }
  }, [threadId, pageSize]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const fetchOlder = useCallback(async () => {
    if (!threadId || !items.length || !hasMore) return;
    const oldest = items[0];
    try {
      setLoading(true);
      const page = await ChatApi.listMessages(threadId, {
        before: oldest.createdAt,
        limit: pageSize,
      });
      dispatch({ type: 'prepend', messages: page.messages, hasMore: page.hasMore });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load earlier messages');
    } finally {
      setLoading(false);
    }
  }, [threadId, items, hasMore, pageSize]);

  const appendMessage = useCallback((message: ChatMessage) => {
    dispatch({ type: 'append', messages: [message] });
  }, []);

  const updateMessage = useCallback((message: ChatMessage) => {
    dispatch({ type: 'update', message });
  }, []);

  return {
    messages: items,
    hasMore,
    loading,
    error,
    initialized: initializedRef.current,
    reload: loadInitial,
    fetchOlder,
    appendMessage,
    updateMessage,
  };
}
