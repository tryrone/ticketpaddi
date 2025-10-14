"use client";

import React from "react";
import { Conversation } from "@/types/message";
import { IconMessage, IconCircle, IconChevronRight } from "@tabler/icons-react";

interface ConversationsListProps {
  conversations: Conversation[];
  onConversationSelect: (conversation: Conversation) => void;
  selectedConversationId?: string;
  loading?: boolean;
  userType: "owner" | "booker";
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  onConversationSelect,
  selectedConversationId,
  loading,
  userType,
}) => {
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (conversations.length === 0) {
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
        const otherParticipant =
          userType === "owner"
            ? conversation.participants.bookerName
            : conversation.participants.ownerName;

        return (
          <div
            key={conversation.id}
            onClick={() => onConversationSelect(conversation)}
            className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
              isSelected ? "bg-blue-50 border-l-4 border-blue-600" : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 mr-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {conversation.eventTitle}
                  </h4>
                  {conversation.unreadCount > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs font-medium rounded-full">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-1">{otherParticipant}</p>
                {conversation.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end space-y-1">
                {conversation.lastMessageTime && (
                  <span className="text-xs text-gray-400">
                    {formatTime(conversation.lastMessageTime)}
                  </span>
                )}
                <IconChevronRight size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationsList;
