import { useState, useCallback } from 'react';
import { ChatRepositoryImpl } from '../data/repositories/ChatRepositoryImpl';
import { ListThreadsUseCase } from '../domain/usecases/chat/ListThreadsUseCase';
import { CreateThreadUseCase } from '../domain/usecases/chat/CreateThreadUseCase';
import { GetThreadUseCase } from '../domain/usecases/chat/GetThreadUseCase';
import { ListMessagesUseCase } from '../domain/usecases/chat/ListMessagesUseCase';
import { SendMessageUseCase } from '../domain/usecases/chat/SendMessageUseCase';
import { MarkReadUseCase } from '../domain/usecases/chat/MarkReadUseCase';
import { ArchiveThreadUseCase } from '../domain/usecases/chat/ArchiveThreadUseCase';
import { UnarchiveThreadUseCase } from '../domain/usecases/chat/UnarchiveThreadUseCase';
import { DeleteThreadUseCase } from '../domain/usecases/chat/DeleteThreadUseCase';
import { UploadAttachmentUseCase } from '../domain/usecases/chat/UploadAttachmentUseCase';
import type { ChatThread, ThreadQueryParams } from '../domain/models/chat/ChatThread';
import type {
  ChatMessage,
  ChatAttachment,
  ChatMessagePage,
  MessageQueryParams,
} from '../domain/models/chat/ChatMessage';
import type {
  CreateThreadPayload,
  SendMessagePayload,
} from '../domain/models/chat/ChatPayloads';

const repository = new ChatRepositoryImpl();
const listThreadsUseCase = new ListThreadsUseCase(repository);
const createThreadUseCase = new CreateThreadUseCase(repository);
const getThreadUseCase = new GetThreadUseCase(repository);
const listMessagesUseCase = new ListMessagesUseCase(repository);
const sendMessageUseCase = new SendMessageUseCase(repository);
const markReadUseCase = new MarkReadUseCase(repository);
const archiveThreadUseCase = new ArchiveThreadUseCase(repository);
const unarchiveThreadUseCase = new UnarchiveThreadUseCase(repository);
const deleteThreadUseCase = new DeleteThreadUseCase(repository);
const uploadAttachmentUseCase = new UploadAttachmentUseCase(repository);

interface UseChatState {
  threads: ChatThread[];
  currentThread: ChatThread | null;
  messages: ChatMessage[];
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}

export function useChat() {
  const [state, setState] = useState<UseChatState>({
    threads: [],
    currentThread: null,
    messages: [],
    hasMore: false,
    loading: false,
    error: null,
  });

  const loadThreads = useCallback(async (params?: ThreadQueryParams) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const threads = await listThreadsUseCase.execute(params);
      setState((prev) => ({ ...prev, threads, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load threads';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, []);

  const createThread = useCallback(async (payload: CreateThreadPayload) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const thread = await createThreadUseCase.execute(payload);
      setState((prev) => ({
        ...prev,
        threads: [thread, ...prev.threads],
        currentThread: thread,
        loading: false,
      }));
      return thread;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create thread';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  const loadThread = useCallback(async (threadId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const thread = await getThreadUseCase.execute(threadId);
      setState((prev) => ({ ...prev, currentThread: thread, loading: false }));
      return thread;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load thread';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  const loadMessages = useCallback(
    async (threadId: string, params?: MessageQueryParams) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const messagePage = await listMessagesUseCase.execute(threadId, params);
        setState((prev) => ({
          ...prev,
          messages: params?.before
            ? [...prev.messages, ...messagePage.messages]
            : messagePage.messages,
          hasMore: messagePage.hasMore,
          loading: false,
        }));
        return messagePage;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load messages';
        setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
        throw error;
      }
    },
    []
  );

  const sendMessage = useCallback(
    async (threadId: string, payload: SendMessagePayload) => {
      try {
        const message = await sendMessageUseCase.execute(threadId, payload);
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }));
        return message;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
        setState((prev) => ({ ...prev, error: errorMessage }));
        throw error;
      }
    },
    []
  );

  const markAsRead = useCallback(async (threadId: string, messageId?: string) => {
    try {
      const thread = await markReadUseCase.execute(threadId, messageId);
      setState((prev) => ({
        ...prev,
        currentThread: thread,
        threads: prev.threads.map((t) => (t.id === thread.id ? thread : t)),
      }));
      return thread;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark as read';
      setState((prev) => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const archiveThread = useCallback(async (threadId: string) => {
    try {
      const thread = await archiveThreadUseCase.execute(threadId);
      setState((prev) => ({
        ...prev,
        threads: prev.threads.map((t) => (t.id === thread.id ? thread : t)),
      }));
      return thread;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to archive thread';
      setState((prev) => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const unarchiveThread = useCallback(async (threadId: string) => {
    try {
      const thread = await unarchiveThreadUseCase.execute(threadId);
      setState((prev) => ({
        ...prev,
        threads: prev.threads.map((t) => (t.id === thread.id ? thread : t)),
      }));
      return thread;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to unarchive thread';
      setState((prev) => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const deleteThread = useCallback(async (threadId: string) => {
    try {
      await deleteThreadUseCase.execute(threadId);
      setState((prev) => ({
        ...prev,
        threads: prev.threads.filter((t) => t.id !== threadId),
        currentThread: prev.currentThread?.id === threadId ? null : prev.currentThread,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete thread';
      setState((prev) => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const uploadAttachment = useCallback(async (threadId: string, file: File) => {
    try {
      const attachment = await uploadAttachmentUseCase.execute(threadId, file);
      return attachment;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload attachment';
      setState((prev) => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  return {
    threads: state.threads,
    currentThread: state.currentThread,
    messages: state.messages,
    hasMore: state.hasMore,
    loading: state.loading,
    error: state.error,
    loadThreads,
    createThread,
    loadThread,
    loadMessages,
    sendMessage,
    markAsRead,
    archiveThread,
    unarchiveThread,
    deleteThread,
    uploadAttachment,
  };
}
