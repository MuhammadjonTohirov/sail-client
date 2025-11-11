import React from 'react';

interface ChatShellProps {
  sidebar: React.ReactNode;
  conversation: React.ReactNode;
  header?: React.ReactNode;
}

export function ChatShell({ sidebar, conversation, header }: ChatShellProps) {
  return (
    <div className="chat-page">
      {header}
      <div className="chat-shell">
        <aside className="chat-sidebar">{sidebar}</aside>
        <section className="chat-main">{conversation}</section>
      </div>
    </div>
  );
}

export default ChatShell;
