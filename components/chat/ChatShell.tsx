import React from 'react';

interface ChatShellProps {
  sidebar: React.ReactNode;
  conversation: React.ReactNode;
  header?: React.ReactNode;
  isMobileDetailOpen?: boolean;
}

export function ChatShell({ sidebar, conversation, header, isMobileDetailOpen = false }: ChatShellProps) {
  return (
    <div className={`chat-page ${isMobileDetailOpen ? 'chat-page--mobile-detail' : ''}`}>
      {header}
      <div className="chat-shell">
        <aside className="chat-sidebar">{sidebar}</aside>
        <section className="chat-main">{conversation}</section>
      </div>
    </div>
  );
}

export default ChatShell;
