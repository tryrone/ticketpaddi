import { useState, useEffect, useCallback } from "react";
import { Event } from "@/types/company";
import { BookedEvent, Booking } from "@/types/booking";
import {
  getExperiencesByCompany,
  getBookingById,
  getBookingsByCompany,
  getConfirmedBookingsByEvent,
  isDateBooked,
} from "@/lib/firestore";

// New hook using experiences (events with eventType="experience")
export const useExperiencesByCompany = (companyId: string) => {
  const [experiences, setExperiences] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExperiences = useCallback(async () => {
    if (!companyId) return;

    try {
      setLoading(true);
      const data = await getExperiencesByCompany(companyId);
      setExperiences(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch experiences"
      );
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  return { experiences, loading, error, refetch: fetchExperiences };
};

// Backward compatibility hook - returns Booking[] from experiences
export const useBookingsByCompany = (companyId: string) => {
  const [bookings, setBookings] = useState<BookedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!companyId) return;

    try {
      setLoading(true);
      const data = await getBookingsByCompany({ companyId });
      setBookings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings };
};

// export const useBookingsByUser = () => {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { user } = useAuth();

//   const fetchBookings = useCallback(async () => {
//     if (!user?.uid) return;

//     try {
//       setLoading(true);
//       const data = await getBookingsByUser(user.uid);
//       setBookings(data);
//       setError(null);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to fetch bookings");
//     } finally {
//       setLoading(false);
//     }
//   }, [user?.uid]);

//   useEffect(() => {
//     fetchBookings();
//   }, [fetchBookings]);

//   return { bookings, loading, error, refetch: fetchBookings };
// };

export const useBookedEventById = ({
  companyId,
  eventId,
}: {
  companyId: string;
  eventId: string;
}) => {
  const [booking, setBooking] = useState<BookedEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooking = useCallback(async () => {
    if (!companyId || !eventId) return;

    try {
      setLoading(true);
      const data = await getBookingById({ companyId, eventId });
      setBooking(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, [companyId, eventId]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking, companyId, eventId]);

  return { booking, loading, error, refetch: fetchBooking };
};

export const useBooking = ({
  companyId,
  eventId,
}: {
  companyId: string;
  eventId: string;
}) => {
  const [booking, setBooking] = useState<BookedEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookedEvent = useCallback(async () => {
    if (!companyId || !eventId) return;

    try {
      setLoading(true);
      const data = await getBookingById({ companyId, eventId });
      setBooking(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch booking");
    } finally {
      setLoading(false);
    }
  }, [companyId, eventId]);

  useEffect(() => {
    fetchBookedEvent();
  }, [fetchBookedEvent]);

  return { booking, loading, error, refetch: fetchBookedEvent };
};

export const useConfirmedBookingsByEvent = ({
  companyId,
  eventId,
}: {
  companyId: string;
  eventId: string;
}) => {
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfirmedBookings = useCallback(async () => {
    if (!companyId || !eventId) return;

    try {
      setLoading(true);
      const data = await getConfirmedBookingsByEvent({ companyId, eventId });
      setConfirmedBookings(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch confirmed bookings"
      );
    } finally {
      setLoading(false);
    }
  }, [companyId, eventId]);

  useEffect(() => {
    fetchConfirmedBookings();
  }, [fetchConfirmedBookings]);

  return { confirmedBookings, loading, error, refetch: fetchConfirmedBookings };
};

export const useCreateBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (bookingData: Omit<Booking, "id">) => {
    try {
      setLoading(true);
      setError(null);
      const id = await setTimeout(() => {
        return "123";
      }, 1000);
      return id;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create booking";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
};

export const useCheckDateBooked = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkDate = async ({
    companyId,
    eventId,
    date,
  }: {
    companyId: string;
    eventId: string;
    date: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const booked = await isDateBooked({ companyId, eventId, date });
      return booked;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to check date";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { checkDate, loading, error };
};
