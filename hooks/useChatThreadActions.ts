import { useCallback, useState } from 'react';
import { ChatApi } from '@/lib/api';
import type { ChatThread } from '@/domain/chat';

interface UseChatThreadActionsOptions {
  onThreadUpdated?: (thread: ChatThread) => void;
  onThreadRemoved?: (threadId: string) => void;
}

export function useChatThreadActions(threadId: string | null, options: UseChatThreadActionsOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wrap = useCallback(
    async (fn: () => Promise<any>) => {
      if (!threadId) throw new Error('Thread not selected');
      try {
        setLoading(true);
        setError(null);
        return await fn();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Chat action failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [threadId],
  );

  const markRead = useCallback(
    (messageId?: string) =>
      wrap(async () => {
        const thread = await ChatApi.markRead(threadId!, messageId);
        options.onThreadUpdated?.(thread);
        return thread;
      }),
    [wrap, options, threadId],
  );

  const archive = useCallback(
    () =>
      wrap(async () => {
        const thread = await ChatApi.archiveThread(threadId!);
        options.onThreadUpdated?.(thread);
        return thread;
      }),
    [wrap, options, threadId],
  );

  const unarchive = useCallback(
    () =>
      wrap(async () => {
        const thread = await ChatApi.unarchiveThread(threadId!);
        options.onThreadUpdated?.(thread);
        return thread;
      }),
    [wrap, options, threadId],
  );

  const remove = useCallback(
    () =>
      wrap(async () => {
        await ChatApi.deleteThread(threadId!);
        options.onThreadRemoved?.(threadId!);
      }),
    [wrap, options, threadId],
  );

  return {
    loading,
    error,
    markRead,
    archive,
    unarchive,
    remove,
  };
}
