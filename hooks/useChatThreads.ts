import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { ChatApi } from '@/lib/api';
import type { ChatThread, ThreadQueryParams } from '@/domain/chat';

type Action =
  | { type: 'set'; threads: ChatThread[] }
  | { type: 'update'; thread: ChatThread }
  | { type: 'remove'; threadId: string };

function threadsReducer(state: ChatThread[], action: Action): ChatThread[] {
  switch (action.type) {
    case 'set':
      return action.threads;
    case 'update': {
      const idx = state.findIndex((t) => t.id === action.thread.id);
      if (idx === -1) return [action.thread, ...state];
      const next = state.slice();
      next[idx] = action.thread;
      return next;
    }
    case 'remove':
      return state.filter((t) => t.id !== action.threadId);
    default:
      return state;
  }
}

interface UseChatThreadsOptions {
  query?: ThreadQueryParams;
  autoRefreshMs?: number;
}

export function useChatThreads({ query, autoRefreshMs }: UseChatThreadsOptions = {}) {
  const [threads, dispatch] = useReducer(threadsReducer, [] as ChatThread[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchedQuery = useRef<string | null>(null);

  const queryKey = useMemo(
    () => [
      query?.role ?? '',
      query?.archived ?? '',
      query?.myAds ?? '',
      query?.unread ?? '',
    ].join('|'),
    [query?.role, query?.archived, query?.myAds, query?.unread],
  );

  const loadThreads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await ChatApi.listThreads(query);
      dispatch({ type: 'set', threads: list });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load threads');
    } finally {
      setLoading(false);
    }
  }, [query?.archived, query?.myAds, query?.role, query?.unread]);

  useEffect(() => {
    if (lastFetchedQuery.current === queryKey) {
      return;
    }
    lastFetchedQuery.current = queryKey;
    void loadThreads();
  }, [loadThreads, queryKey]);

  useEffect(() => {
    if (!autoRefreshMs) return;
    const id = window.setInterval(loadThreads, autoRefreshMs);
    return () => window.clearInterval(id);
  }, [autoRefreshMs, loadThreads]);

  const updateThread = useCallback((thread: ChatThread) => {
    dispatch({ type: 'update', thread });
  }, []);

  const removeThread = useCallback((threadId: string) => {
    dispatch({ type: 'remove', threadId });
  }, []);

  return {
    threads,
    loading,
    error,
    reload: loadThreads,
    updateThread,
    removeThread,
  };
}
