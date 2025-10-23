"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ConversationsList from "@/components/ConversationsList";
import MessagingPanel from "@/components/MessagingPanel";
import { useConversationsByUser } from "@/hooks/useMessages";
import { Conversation } from "@/types/message";
import { IconMessage, IconInbox } from "@tabler/icons-react";
import { useCompanies } from "@/hooks/useFirestore";
import { Select } from "@mantine/core";
import { markConversationAsRead } from "@/lib/firestore";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const { companies, loading: companiesLoading } = useCompanies();

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");

  const { conversations, refetch: refetchConversations } =
    useConversationsByUser({
      companyId: selectedCompanyId,
    });

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    markConversationAsRead({
      companyId: selectedCompanyId,
      conversationId: conversation.id,
    }).then(() => {
      refetchConversations();
    });
  };

  // const handleCreateConversation = async (booking: Booking) => {
  //   // Check if conversation already exists
  //   const existingConversation = conversations.find(
  //     (c) => c.messages.some((m) => m.receiver === booking.bookerUserId)
  //   );

  //   if (existingConversation) {
  //     setSelectedConversation(existingConversation);
  //     return;
  //   }

  //   // Create new conversation
  //   try {
  //     const conversationId = await create({
  //       bookingId: booking.id,
  //       eventTitle: booking.eventTitle,
  //       participants: {
  //         ownerId: "", // This should be fetched from the company/event owner
  //         ownerName: booking.companyName,
  //         bookerId: booking.bookerUserId,
  //         bookerName: booking.bookerName,
  //       },
  //       unreadCount: 0,
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //     });

  //     refetch();
  //   } catch (error) {
  //     console.error("Failed to create conversation:", error);
  //   }
  // };

  if (companiesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between w-full">
            <div className="flex items-center space-x-3 mb-2">
              <IconMessage size={32} className="text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-600">
                  Chat with customers about their bookings
                </p>
              </div>
            </div>

            <Select
              placeholder="Select a company"
              data={companies.map((company) => ({
                value: company.id,
                label: company.name,
              }))}
              value={selectedCompanyId}
              onChange={(value) => setSelectedCompanyId(value || "")}
            />
          </div>

          {/* Messages Layout */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(100vh-200px)]">
              {/* Conversations List */}
              <div className="lg:col-span-1 border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Conversations
                  </h2>
                  {conversations && conversations.length > 0 && (
                    <p className="text-sm text-gray-600">
                      {
                        conversations.filter(
                          (c) => (c?.unseen_messages || 0) > 0
                        ).length
                      }{" "}
                      unread
                    </p>
                  )}
                </div>
                <ConversationsList
                  conversations={conversations}
                  onConversationSelect={handleConversationSelect}
                  selectedConversationId={selectedConversation?.id}
                  userType="user"
                  companyId={selectedCompanyId}
                />
              </div>

              {/* Messaging Panel */}
              <div className="lg:col-span-2 overflow-y-scroll">
                {selectedConversation ? (
                  <MessagingPanel
                    userType="user"
                    companyId={selectedCompanyId}
                    conversationId={selectedConversation.id}
                    onClose={() => setSelectedConversation(null)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <IconInbox size={64} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium">
                      No conversation selected
                    </p>
                    <p className="text-sm">
                      Select a conversation from the list to start messaging
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
