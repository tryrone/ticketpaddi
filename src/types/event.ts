export interface Event {
  id: string;
  title?: string;
  description?: string;
  image: string;
  date: string;
  time: string;
  location: string;
  price: number;
  currency: string;
  category: string;
  companyId: string;
  companyName: string;
  attendees: number;
  maxAttendees: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  tags: string[];
  featured: boolean;
  isTemplate?: boolean; // True if this is a template that can be applied to multiple dates
  availableDates?: string[]; // Array of dates this template is available for
}
