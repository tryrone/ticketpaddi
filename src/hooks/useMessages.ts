import { useState, useEffect, useCallback } from "react";
import { Message, Conversation } from "@/types/message";
import {
  createMessage,
  getMessagesByConversationId,
  markMessageAsRead,
  createConversation,
  getConversationsByUser,
  getConversationByBooking,
} from "@/lib/firestore";
import { useAuth } from "./useAuth";

export const useMessagesByConversation = ({
  companyId,
  conversationId,
}: {
  companyId: string;
  conversationId: string;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!companyId || !conversationId) return;

    try {
      setLoading(true);
      const data = await getMessagesByConversationId({
        companyId,
        conversationId,
      });
      setMessages(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, [companyId, conversationId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { messages, loading, error, refetch: fetchMessages };
};

export const useConversationsByUser = ({
  companyId,
}: {
  companyId: string;
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const userId = user?.uid;

  const fetchConversations = useCallback(async () => {
    if (!companyId) return;

    try {
      setLoading(true);
      const data = await getConversationsByUser({ companyId });

      setConversations(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch conversations"
      );
    } finally {
      setLoading(false);
    }
  }, [userId, companyId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations, userId, companyId]);

  return { conversations, loading, error, refetch: fetchConversations };
};

export const useConversationByBooking = (bookingId: string) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversation = useCallback(async () => {
    if (!bookingId) return;

    try {
      setLoading(true);
      const data = await getConversationByBooking(bookingId);
      setConversation(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch conversation"
      );
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  return { conversation, loading, error, refetch: fetchConversation };
};

export const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async ({
    messageData,
    companyId,
    conversationId,
  }: {
    messageData: Omit<Message, "id">;
    companyId: string;
    conversationId: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const id = await createMessage({
        messageData,
        companyId,
        conversationId,
      });
      return id;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { send, loading, error };
};

export const useMarkMessageAsRead = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markRead = async (messageId: string) => {
    try {
      setLoading(true);
      setError(null);
      await markMessageAsRead(messageId);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to mark message as read";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { markRead, loading, error };
};

export const useCreateConversation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (conversationData: Omit<Conversation, "id">) => {
    try {
      setLoading(true);
      setError(null);
      const id = await createConversation(conversationData);
      return id;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create conversation";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
};
