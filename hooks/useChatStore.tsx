import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface ChatStoreState {
  selectedThreadId: string | null;
  draftByThread: Record<string, string>;
}

interface ChatStoreContextValue extends ChatStoreState {
  selectThread: (threadId: string | null) => void;
  setDraft: (threadId: string, draft: string) => void;
  clearDraft: (threadId: string) => void;
}

const ChatStoreContext = createContext<ChatStoreContextValue | undefined>(undefined);

export function ChatStoreProvider({ children }: { children: ReactNode }) {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [draftByThread, setDraftByThread] = useState<Record<string, string>>({});

  const selectThread = useCallback((threadId: string | null) => {
    setSelectedThreadId(threadId);
  }, []);

  const setDraft = useCallback((threadId: string, draft: string) => {
    setDraftByThread((prev) => ({ ...prev, [threadId]: draft }));
  }, []);

  const clearDraft = useCallback((threadId: string) => {
    setDraftByThread((prev) => {
      const clone = { ...prev };
      delete clone[threadId];
      return clone;
    });
  }, []);

  const value = useMemo<ChatStoreContextValue>(
    () => ({ selectedThreadId, draftByThread, selectThread, setDraft, clearDraft }),
    [selectedThreadId, draftByThread, selectThread, setDraft, clearDraft],
  );

  return <ChatStoreContext.Provider value={value}>{children}</ChatStoreContext.Provider>;
}

export function useChatStore() {
  const ctx = useContext(ChatStoreContext);
  if (!ctx) {
    throw new Error('useChatStore must be used within ChatStoreProvider');
  }
  return ctx;
}
