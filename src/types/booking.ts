export interface Booking {
  id: string;
  eventId: string; // Reference to the event template
  eventTitle: string;
  eventDescription: string;
  eventImage: string;
  companyId: string;
  companyName: string;
  bookedDate: string; // The specific date this booking is for
  bookedTime: string;
  location: string;
  price: number;
  currency: string;
  category: string;
  bookerUserId: string; // User who booked the event
  bookerName: string;
  bookerEmail: string;
  bookerPhone?: string;
  numberOfAttendees: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
  paymentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingFormData {
  eventId: string;
  bookedDate: string;
  bookedTime: string;
  numberOfAttendees: number;
  bookerName: string;
  bookerEmail: string;
  bookerPhone?: string;
  notes?: string;
}
