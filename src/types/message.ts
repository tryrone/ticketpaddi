export interface Message {
  id: string;
  company_id: string;
  company_name: string;
  content: string;
  cost: number | null;
  input_tokens: number | null;
  message_id: string;
  message_name: string;
  message_type: "message" | "response" | "notification";
  output_tokens: number | null;
  receiver: string;
  sender: string;
  sender_type: "bot" | "user" | "admin";
  time_created: string;
}

export interface Conversation {
  id: string;
  last_updated_at?: string;
  unseen_messages?: number;
}
