import { DateConfiguration, SeatRange } from "./company";

export interface Booking {
  id: string;
  bot_number: string;
  confirmedAt: string; // timestamp
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  event_id: string;
  expiration_time: string;
  grand_total: number;
  merchant_payment_reference: string;
  payment_amount_minor: number;
  payment_link: string;
  payment_reference: string;
  payment_status: "pending" | "paid" | "refunded" | "failed";
  quantity: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  status_time: Date;
  ticket_price_minor: number;
  time_created: string;
  updated_at: Date;
  paid_ticket_ids: { id: string; status: string }[];
  paid_ticket_links: string[];
  notes: string;
}

export interface BookedEvent {
  id: string;
  attendees: number;
  category: string;
  companyId: string;
  companyName: string;
  createdAt: Date;
  currency: string;
  date: string;
  dateConfiguration: DateConfiguration;
  datesAvailability: { [key: string]: boolean }[];
  description: string;
  eventType: string;
  featured: boolean;
  image?: string;
  isTemplate?: boolean;
  location: string;
  maxAttendees: number;
  price: number;
  seatRanges: SeatRange[];
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  tags: string[];
  title: string;
  updatedAt: string;
}
