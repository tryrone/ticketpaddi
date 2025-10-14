"use client";

import React, { useState, useEffect, useRef } from "react";
import { Conversation } from "@/types/message";
import { useMessagesByBooking, useSendMessage } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import {
  IconSend,
  IconMessage,
  IconClock,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

interface MessagingPanelProps {
  conversation: Conversation;
  userType: "owner" | "booker";
  onClose?: () => void;
}

const MessagingPanel: React.FC<MessagingPanelProps> = ({
  conversation,
  userType,
  onClose,
}) => {
  const [messageText, setMessageText] = useState("");
  const { messages, loading, refetch } = useMessagesByBooking(
    conversation.bookingId
  );
  const { send, loading: sending } = useSendMessage();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageText.trim() || !user) return;

    const senderName =
      userType === "owner"
        ? conversation.participants.ownerName
        : conversation.participants.bookerName;

    try {
      await send({
        bookingId: conversation.bookingId,
        senderId: user.uid,
        senderName,
        senderType: userType,
        message: messageText,
        timestamp: new Date().toISOString(),
        read: false,
      });

      setMessageText("");
      refetch();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return (
        "Yesterday " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } else {
      return (
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {conversation.eventTitle}
            </h3>
            <p className="text-sm text-gray-600">
              Chat with{" "}
              {userType === "owner"
                ? conversation.participants.bookerName
                : conversation.participants.ownerName}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <IconX size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <IconMessage size={48} className="mb-2 opacity-50" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isOwnMessage = message.senderId === user?.uid;

              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md ${
                      isOwnMessage ? "order-2" : "order-1"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        isOwnMessage
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {!isOwnMessage && (
                        <p className="text-xs font-semibold mb-1 opacity-75">
                          {message.senderName}
                        </p>
                      )}
                      <p className="text-sm break-words">{message.message}</p>
                    </div>
                    <div
                      className={`flex items-center mt-1 space-x-1 ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <IconClock size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {formatTime(message.timestamp)}
                      </span>
                      {isOwnMessage && message.read && (
                        <IconCheck size={12} className="text-blue-600" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-200"
      >
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!messageText.trim() || sending}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconSend size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessagingPanel;
