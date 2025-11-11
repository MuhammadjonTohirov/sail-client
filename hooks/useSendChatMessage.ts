import { useCallback, useState } from 'react';
import { ChatApi } from '@/lib/api';
import type { ChatMessage, SendMessageInput } from '@/domain/chat';

interface UseSendChatMessageOptions {
  onSuccess?: (message: ChatMessage) => void;
  onError?: (error: Error) => void;
}

export function useSendChatMessage(threadId: string | null, options: UseSendChatMessageOptions = {}) {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (payload: SendMessageInput) => {
      if (!threadId) throw new Error('Thread not selected');
      try {
        setIsSending(true);
        setError(null);
        const message = await ChatApi.sendMessage(threadId, payload);
        options.onSuccess?.(message);
        return message;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to send message');
        setError(error.message);
        options.onError?.(error);
        throw error;
      } finally {
        setIsSending(false);
      }
    },
    [threadId, options],
  );

  return {
    sendMessage,
    isSending,
    error,
  };
}
