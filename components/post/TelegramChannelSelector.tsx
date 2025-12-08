import React from 'react';
import { trustedImageUrl } from '@/config/app.config';
import { TelegramChat } from '@/domain/models/TelegramChat';

interface TelegramChannelSelectorProps {
  chats: TelegramChat[];
  selectedChatIds: number[];
  onChange: (chatIds: number[]) => void;
}

export const TelegramChannelSelector: React.FC<TelegramChannelSelectorProps> = ({
  chats,
  selectedChatIds,
  onChange,
}) => {
  const activeChats = chats.filter(c => c.isActive);

  const toggleChat = (chatId: number) => {
    if (selectedChatIds.includes(chatId)) {
      onChange(selectedChatIds.filter((id) => id !== chatId));
    } else {
      onChange([...selectedChatIds, chatId]);
    }
  };

  if (activeChats.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900">
        Share to Telegram
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {activeChats.map((chat) => {
          const isSelected = selectedChatIds.includes(chat.chatId);
          return (
            <div
              key={chat.id}
              onClick={() => toggleChat(chat.chatId)}
              className={`
                relative flex items-center p-3 rounded-lg border cursor-pointer transition-all
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }
              `}
            >
              <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                {chat.chatPhoto ? (
                  <img
                    src={trustedImageUrl(chat.chatPhoto)}
                    alt={chat.chatTitle}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 flex items-center justify-center text-gray-400">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {chat.chatTitle}
                </p>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {chat.chatUsername ? `@${chat.chatUsername}` : chat.chatType}
                </p>
              </div>
              <div className={`
                ml-3 flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center
                ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}
              `}>
                {isSelected && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

