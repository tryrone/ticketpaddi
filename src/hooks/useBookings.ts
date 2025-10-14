import { useState, useEffect, useCallback } from "react";
import { Booking } from "@/types/booking";
import {
  getBookingById,
  getBookingsByCompany,
  getBookingsByUser,
  getBookingsByEvent,
  getBookingsByDateRange,
  createBooking,
  updateBooking,
  deleteBooking,
  isDateBooked,
} from "@/lib/firestore";
import { useAuth } from "./useAuth";

export const useBookingsByCompany = (companyId: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!companyId) return;

    try {
      setLoading(true);
      const data = await getBookingsByCompany(companyId);
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

export const useBookingsByUser = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchBookings = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const data = await getBookingsByUser(user.uid);
      setBookings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings };
};

export const useBookingsByEvent = (eventId: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!eventId) return;

    try {
      setLoading(true);
      const data = await getBookingsByEvent(eventId);
      setBookings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings };
};

export const useBooking = (id: string) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooking = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getBookingById(id);
      setBooking(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch booking");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  return { booking, loading, error, refetch: fetchBooking };
};

export const useBookingsByDateRange = (
  companyId: string,
  startDate: string,
  endDate: string
) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!companyId || !startDate || !endDate) return;

    try {
      setLoading(true);
      const data = await getBookingsByDateRange(companyId, startDate, endDate);
      setBookings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, [companyId, startDate, endDate]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings };
};

export const useCreateBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (bookingData: Omit<Booking, "id">) => {
    try {
      setLoading(true);
      setError(null);
      const id = await createBooking(bookingData);
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

export const useUpdateBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: string, bookingData: Partial<Booking>) => {
    try {
      setLoading(true);
      setError(null);
      await updateBooking(id, bookingData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update booking";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
};

export const useDeleteBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteBooking(id);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete booking";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
};

export const useCheckDateBooked = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkDate = async (eventId: string, date: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const booked = await isDateBooked(eventId, date);
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
