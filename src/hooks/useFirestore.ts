import { useState, useEffect, useCallback } from "react";
import { Company } from "@/types/company";
import { Event } from "@/types/company";
import {
  getCompanies,
  getCompanyById,
  getEvents,
  getEventById,
  getEventsByCompany,
  getEventsByCategory,
  getEventsByPriceRange,
  searchEvents as searchEventsInFirestore,
  createCompany,
  createEvent,
  updateCompany,
  updateEvent,
  deleteCompany,
  deleteEvent,
} from "@/lib/firestore";
import { User as FirebaseUser } from "firebase/auth";
import { useAuth } from "./useAuth";

// Company hooks
export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await getCompanies(user?.uid as FirebaseUser["uid"]);
      setCompanies(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch companies"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies, user]);

  return { companies, loading, error, fetchCompanies };
};

export const useCompany = (id: string) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompany = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCompanyById(id);
      setCompany(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch company");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    fetchCompany();
  }, [id, fetchCompany]);

  return { company, loading, error, fetchCompany };
};

// Event hooks
export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
};

export const useEvent = (id: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await getEventById(id);
        setEvent(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  return { event, loading, error };
};

export const useEventsByCompany = (companyId: string) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEventsByCompany(companyId);
        setEvents(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [companyId]);

  return { events, loading, error };
};

export const useEventsByCategory = (category: string) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) return;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEventsByCategory(category);
        setEvents(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [category]);

  return { events, loading, error };
};

export const useEventsByPriceRange = (minPrice: number, maxPrice: number) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEventsByPriceRange(minPrice, maxPrice);
        setEvents(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [minPrice, maxPrice]);

  return { events, loading, error };
};

export const useSearchEvents = (searchTerm: string) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setEvents([]);
      return;
    }

    const performSearch = async () => {
      try {
        setLoading(true);
        const data = await searchEventsInFirestore(searchTerm);
        setEvents(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to search events"
        );
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return { events, loading, error };
};

// Mutation hooks
export const useCreateCompany = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (companyData: Omit<Company, "id">) => {
    try {
      setLoading(true);
      setError(null);
      const id = await createCompany(companyData);
      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create company");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
};

export const useCreateEvent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (eventData: Omit<Event, "id">) => {
    try {
      setLoading(true);
      setError(null);
      const id = await createEvent(eventData);
      return id;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create event";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
};

export const useUpdateCompany = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: string, companyData: Partial<Company>) => {
    try {
      setLoading(true);
      setError(null);
      await updateCompany(id, companyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update company");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
};

export const useUpdateEvent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: string, eventData: Partial<Event>) => {
    try {
      setLoading(true);
      setError(null);
      await updateEvent(id, eventData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
};

export const useDeleteCompany = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteCompany(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete company");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
};

export const useDeleteEvent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteEvent(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
};
