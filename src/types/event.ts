export interface SeatRange {
  min: number;
  max: number;
  id: string;
}

export interface DateConfiguration {
  type: "selected" | "range" | "monthly";
  selectedDates?: string[]; // For specific dates
  startDate?: string; // For date ranges
  endDate?: string; // For date ranges
  monthlyDay?: number; // For monthly recurrence (1-31)
}

export interface Event {
  id: string;
  eventType?: "event" | "experience"; // Type of the event
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

  // Experience-specific fields
  seatRanges?: SeatRange[]; // For experiences with different seat tiers
  dateConfiguration?: DateConfiguration; // For experiences with flexible dates

  experienceBooked?: boolean; // True if this experience has been booked
}
