"use client";

import React from "react";
import { Conversation } from "@/types/message";
import { IconMessage, IconChevronRight } from "@tabler/icons-react";
import { useMessagesByConversation } from "@/hooks/useMessages";

interface ConversationsListProps {
  conversations: Conversation[];
  onConversationSelect: (conversation: Conversation) => void;
  selectedConversationId?: string;
  companyId: string;
}

interface ConversationItemProps {
  conversation: Conversation;
  onConversationSelect: (conversation: Conversation) => void;
  isSelected: boolean;
  companyId: string;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  onConversationSelect,
  isSelected,
  companyId,
}) => {
  const { messages, loading } = useMessagesByConversation({
    companyId,
    conversationId: conversation.id,
  });

  if (loading) {
    return null;
  }

  const lastMessage = messages[messages.length - 1];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-full h-[100px] bg-gray-200 rounded-md" />
        <div className="w-full h-[100px] bg-gray-200 rounded-md" />
      </div>
    );
  }

  return (
    <div
      onClick={() => onConversationSelect(conversation)}
      className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
        isSelected ? "bg-blue-50 border-l-4 border-blue-600" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 mr-3">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              {lastMessage.company_name}
            </h4>
            {(conversation?.unseen_messages || 0) > 0 && (
              <span className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs font-medium rounded-full">
                {conversation.unseen_messages}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 mb-1">{conversation?.id}</p>
          {lastMessage?.content && (
            <p className="text-sm text-gray-500 truncate">
              {lastMessage?.content}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end space-y-1">
          {lastMessage?.time_created && (
            <span className="text-xs text-gray-400">
              {formatTime(lastMessage?.time_created ?? "")}
            </span>
          )}
          <IconChevronRight size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  onConversationSelect,
  selectedConversationId,
  companyId,
}) => {
  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <IconMessage size={48} className="mb-2 opacity-50" />
        <p className="text-sm">No conversations yet</p>
        <p className="text-xs">Your messages will appear here</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation) => {
        const isSelected = conversation.id === selectedConversationId;

        return (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            onConversationSelect={onConversationSelect}
            isSelected={isSelected}
            companyId={companyId}
          />
        );
      })}
    </div>
  );
};

export default ConversationsList;
