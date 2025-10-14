export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderType: "owner" | "booker"; // Event owner or person who booked
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  bookingId: string;
  eventTitle: string;
  participants: {
    ownerId: string;
    ownerName: string;
    bookerId: string;
    bookerName: string;
  };
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}
