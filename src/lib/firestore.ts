import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import { Company, Event } from "@/types/company";
import { Booking } from "@/types/booking";
import { Message, Conversation } from "@/types/message";
import { User as FirebaseUser } from "firebase/auth";

// Helper function to check if Firebase is available
const checkFirebaseConnection = () => {
  if (!db) {
    throw new Error(
      "Firebase is not configured. Please set up your environment variables."
    );
  }
};

// Collection names
const COMPANIES_COLLECTION = "ticket-companies";
const MESSAGES_COLLECTION = "messages";
const CONVERSATIONS_COLLECTION = "conversations";
const EVENTS_SUBCOLLECTION = "events"; // events are now housed under each company
const EVENTS_INDEX_COLLECTION = "events-index"; // maps eventId -> companyId

// Company operations
export const getCompanies = async (
  userId: FirebaseUser["uid"] | null
): Promise<Company[]> => {
  try {
    checkFirebaseConnection();
    const companiesRef = collection(db, COMPANIES_COLLECTION);
    const snapshot = await getDocs(companiesRef);
    return snapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Company)
      )
      .filter((company) => company.userId === userId);
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
};

export const getCompanyById = async (id: string): Promise<Company | null> => {
  try {
    checkFirebaseConnection();
    const companyRef = doc(db, COMPANIES_COLLECTION, id);
    const companySnap = await getDoc(companyRef);

    if (companySnap.exists()) {
      return {
        id: companySnap.id,
        ...companySnap.data(),
      } as Company;
    }
    return null;
  } catch (error) {
    console.error("Error fetching company:", error);
    throw error;
  }
};

export const createCompany = async (
  companyData: Omit<Company, "id">
): Promise<string> => {
  try {
    checkFirebaseConnection();
    const companiesRef = collection(db, COMPANIES_COLLECTION);
    const docRef = await addDoc(companiesRef, companyData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
};

export const updateCompany = async (
  id: string,
  companyData: Partial<Company>
): Promise<void> => {
  try {
    const companyRef = doc(db, COMPANIES_COLLECTION, id);
    await updateDoc(companyRef, companyData);
  } catch (error) {
    console.error("Error updating company:", error);
    throw error;
  }
};

export const deleteCompany = async (id: string): Promise<void> => {
  try {
    const companyRef = doc(db, COMPANIES_COLLECTION, id);
    await deleteDoc(companyRef);
  } catch (error) {
    console.error("Error deleting company:", error);
    throw error;
  }
};

// Event operations
export const getEvents = async (): Promise<Event[]> => {
  try {
    checkFirebaseConnection();
    const eventsRef = collectionGroup(db, EVENTS_SUBCOLLECTION);
    const snapshot = await getDocs(eventsRef);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Event)
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    checkFirebaseConnection();
    const idxSnap = await getDoc(doc(db, EVENTS_INDEX_COLLECTION, id));
    if (!idxSnap.exists()) return null;
    const { companyId } = idxSnap.data() as { companyId: string };
    const eventSnap = await getDoc(
      doc(db, COMPANIES_COLLECTION, companyId, EVENTS_SUBCOLLECTION, id)
    );
    if (!eventSnap.exists()) return null;
    return { id: eventSnap.id, ...eventSnap.data() } as Event;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
};

export const getEventsByCompany = async (
  companyId: string
): Promise<Event[]> => {
  try {
    checkFirebaseConnection();
    const eventsRef = collection(
      db,
      COMPANIES_COLLECTION,
      companyId,
      EVENTS_SUBCOLLECTION
    );
    const q = query(eventsRef);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Event)
    );
  } catch (error) {
    console.error("Error fetching events by company:", error);
    throw error;
  }
};

export const getEventsByCategory = async (
  category: string
): Promise<Event[]> => {
  try {
    checkFirebaseConnection();
    const eventsRef = collectionGroup(db, EVENTS_SUBCOLLECTION);
    const q = query(eventsRef, where("category", "==", category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Event)
    );
  } catch (error) {
    console.error("Error fetching events by category:", error);
    throw error;
  }
};

export const getEventsByPriceRange = async (
  minPrice: number,
  maxPrice: number
): Promise<Event[]> => {
  try {
    checkFirebaseConnection();
    const eventsRef = collectionGroup(db, EVENTS_SUBCOLLECTION);
    const q = query(
      eventsRef,
      where("price", ">=", minPrice),
      where("price", "<=", maxPrice)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Event)
    );
  } catch (error) {
    console.error("Error fetching events by price range:", error);
    throw error;
  }
};

export const searchEvents = async (searchTerm: string): Promise<Event[]> => {
  try {
    checkFirebaseConnection();
    const eventsRef = collectionGroup(db, EVENTS_SUBCOLLECTION);
    const q = query(
      eventsRef,
      orderBy("title"),
      where("title", ">=", searchTerm),
      where("title", "<=", searchTerm + "\uf8ff")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Event)
    );
  } catch (error) {
    console.error("Error searching events:", error);
    throw error;
  }
};

export const createEvent = async (
  eventData: Omit<Event, "id">
): Promise<string> => {
  try {
    checkFirebaseConnection();
    // Store events under the company's events subcollection
    const companyId = eventData.companyId;
    const companyRef = doc(db, COMPANIES_COLLECTION, companyId);
    const eventsRef = collection(
      db,
      COMPANIES_COLLECTION,
      companyId,
      EVENTS_SUBCOLLECTION
    );

    const docRef = await addDoc(eventsRef, eventData);

    await updateDoc(companyRef, {
      numberOfEvents: increment(1),
      lastEventDate: eventData.date || new Date().toISOString(),
    });

    // Persist the generated id to support lookups and write an index entry
    await updateDoc(docRef, { id: docRef.id });
    await setDoc(doc(db, EVENTS_INDEX_COLLECTION, docRef.id), {
      eventId: docRef.id,
      companyId,
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const updateEvent = async (
  id: string,
  eventData: Partial<Event>
): Promise<void> => {
  try {
    checkFirebaseConnection();
    const idxSnap = await getDoc(doc(db, EVENTS_INDEX_COLLECTION, id));
    if (!idxSnap.exists()) throw new Error("Event index not found");
    const { companyId } = idxSnap.data() as { companyId: string };
    const eventRef = doc(
      db,
      COMPANIES_COLLECTION,
      companyId,
      EVENTS_SUBCOLLECTION,
      id
    );
    await updateDoc(eventRef, eventData);
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    checkFirebaseConnection();
    const idxRef = doc(db, EVENTS_INDEX_COLLECTION, id);
    const idxSnap = await getDoc(idxRef);
    if (!idxSnap.exists()) throw new Error("Event index not found");
    const { companyId } = idxSnap.data() as { companyId: string };
    const eventRef = doc(
      db,
      COMPANIES_COLLECTION,
      companyId,
      EVENTS_SUBCOLLECTION,
      id
    );
    await deleteDoc(eventRef);
    await deleteDoc(idxRef);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

// Advanced querying with pagination
export const getEventsPaginated = async (
  pageSize: number = 10,
  lastDoc?: DocumentSnapshot
): Promise<{ events: Event[]; lastDoc: DocumentSnapshot | null }> => {
  try {
    checkFirebaseConnection();
    const eventsRef = collectionGroup(db, EVENTS_SUBCOLLECTION);
    let q = query(eventsRef, orderBy("date", "desc"), limit(pageSize));

    if (lastDoc) {
      q = query(
        eventsRef,
        orderBy("date", "desc"),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const snapshot = await getDocs(q);
    const events = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Event)
    );

    return {
      events,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
    };
  } catch (error) {
    console.error("Error fetching paginated events:", error);
    throw error;
  }
};

// Experience operations (Experiences are events with eventType="experience")
export const getExperiencesByCompany = async (
  companyId: string
): Promise<Event[]> => {
  try {
    checkFirebaseConnection();
    const eventsRef = collection(
      db,
      COMPANIES_COLLECTION,
      companyId,
      EVENTS_SUBCOLLECTION
    );
    const q = query(eventsRef, where("eventType", "==", "experience"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Event)
    );
  } catch (error) {
    console.error("Error fetching experiences by company:", error);
    throw error;
  }
};

export const getExperiencesByDateRange = async (
  companyId: string,
  startDate: string,
  endDate: string
): Promise<Event[]> => {
  try {
    checkFirebaseConnection();
    const eventsRef = collection(
      db,
      COMPANIES_COLLECTION,
      companyId,
      EVENTS_SUBCOLLECTION
    );
    const q = query(
      eventsRef,
      where("eventType", "==", "experience"),
      where("date", ">=", startDate),
      where("date", "<=", endDate)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Event)
    );
  } catch (error) {
    console.error("Error fetching experiences by date range:", error);
    throw error;
  }
};

export const getExperienceById = async (id: string): Promise<Event | null> => {
  try {
    checkFirebaseConnection();
    const idxSnap = await getDoc(doc(db, EVENTS_INDEX_COLLECTION, id));
    if (!idxSnap.exists()) return null;
    const { companyId } = idxSnap.data() as { companyId: string };
    const eventSnap = await getDoc(
      doc(db, COMPANIES_COLLECTION, companyId, EVENTS_SUBCOLLECTION, id)
    );
    if (!eventSnap.exists()) return null;
    const data = { id: eventSnap.id, ...eventSnap.data() } as Event;
    return data.eventType === "experience" ? data : null;
  } catch (error) {
    console.error("Error fetching experience:", error);
    throw error;
  }
};

// Check for date conflicts with existing experiences
export const checkExperienceDateConflicts = async (
  companyId: string,
  datesToCheck: string[],
  excludeEventId?: string
): Promise<{
  hasConflict: boolean;
  conflictingDates: string[];
  conflictingEvents: Event[];
}> => {
  try {
    checkFirebaseConnection();

    if (datesToCheck.length === 0) {
      return {
        hasConflict: false,
        conflictingDates: [],
        conflictingEvents: [],
      };
    }

    const eventsRef = collection(
      db,
      COMPANIES_COLLECTION,
      companyId,
      EVENTS_SUBCOLLECTION
    );
    const q = query(eventsRef, where("eventType", "==", "experience"));
    const snapshot = await getDocs(q);

    const experiences = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as Event))
      .filter((event) => event.id !== excludeEventId); // Exclude current event if editing

    const conflictingDates = new Set<string>();
    const conflictingEvents: Event[] = [];

    experiences.forEach((experience) => {
      const experienceDates = new Set<string>();

      // Get all dates for this experience
      if (experience.availableDates && experience.availableDates.length > 0) {
        experience.availableDates.forEach((date) => experienceDates.add(date));
      } else if (experience.dateConfiguration) {
        const config = experience.dateConfiguration;

        if (config.type === "selected" && config.selectedDates) {
          config.selectedDates.forEach((date) => experienceDates.add(date));
        } else if (
          config.type === "range" &&
          config.startDate &&
          config.endDate
        ) {
          const start = new Date(config.startDate);
          const end = new Date(config.endDate);
          const current = new Date(start);

          while (current <= end) {
            experienceDates.add(current.toISOString().split("T")[0]);
            current.setDate(current.getDate() + 1);
          }
        } else if (config.type === "monthly" && config.monthlyDay) {
          const today = new Date();
          for (let i = 0; i < 12; i++) {
            const date = new Date(
              today.getFullYear(),
              today.getMonth() + i,
              config.monthlyDay
            );
            experienceDates.add(date.toISOString().split("T")[0]);
          }
        }
      } else if (experience.date) {
        experienceDates.add(experience.date);
      }

      // Check for conflicts
      datesToCheck.forEach((date) => {
        if (experienceDates.has(date)) {
          conflictingDates.add(date);
          if (!conflictingEvents.find((e) => e.id === experience.id)) {
            conflictingEvents.push(experience);
          }
        }
      });
    });

    return {
      hasConflict: conflictingDates.size > 0,
      conflictingDates: Array.from(conflictingDates).sort(),
      conflictingEvents,
    };
  } catch (error) {
    console.error("Error checking experience date conflicts:", error);
    throw error;
  }
};

// Deprecated: Kept for backward compatibility - use Event operations instead
export const createBooking = async (
  bookingData: Omit<Booking, "id">
): Promise<string> => {
  console.warn(
    "createBooking is deprecated. Use createEvent with eventType='experience' instead."
  );
  return createEvent({
    eventType: "experience",
    title: bookingData.eventTitle,
    description: bookingData.eventDescription,
    image: bookingData.eventImage,
    date: bookingData.bookedDate,
    time: bookingData.bookedTime,
    location: bookingData.location,
    price: bookingData.price,
    currency: bookingData.currency,
    category: bookingData.category,
    companyId: bookingData.companyId,
    companyName: bookingData.companyName,
    attendees: bookingData.numberOfAttendees,
    maxAttendees: bookingData.numberOfAttendees,
    status:
      bookingData.status === "pending" || bookingData.status === "confirmed"
        ? "upcoming"
        : (bookingData.status as "completed" | "cancelled"),
    tags: [],
    featured: false,
  });
};

export const getBookingById = async (id: string): Promise<Booking | null> => {
  console.warn("getBookingById is deprecated. Use getExperienceById instead.");
  const event = await getExperienceById(id);
  if (!event) return null;

  return {
    id: event.id,
    eventId: event.id,
    eventTitle: event.title || "",
    eventDescription: event.description || "",
    eventImage: event.image,
    companyId: event.companyId,
    companyName: event.companyName,
    bookedDate: event.date,
    bookedTime: event.time,
    location: event.location,
    price: event.price,
    currency: event.currency,
    category: event.category,
    bookerUserId: "",
    bookerName: "",
    bookerEmail: "",
    numberOfAttendees: event.attendees,
    status:
      event.status === "upcoming"
        ? "confirmed"
        : (event.status as "completed" | "cancelled" | "pending"),
    paymentStatus: "pending",
    createdAt: "",
    updatedAt: "",
  } as Booking;
};

export const getBookingsByCompany = async (
  companyId: string
): Promise<Booking[]> => {
  console.warn(
    "getBookingsByCompany is deprecated. Use getExperiencesByCompany instead."
  );
  const experiences = await getExperiencesByCompany(companyId);
  return experiences.map(
    (event) =>
      ({
        id: event.id,
        eventId: event.id,
        eventTitle: event.title || "",
        eventDescription: event.description || "",
        eventImage: event.image,
        companyId: event.companyId,
        companyName: event.companyName,
        bookedDate: event.date,
        bookedTime: event.time,
        location: event.location,
        price: event.price,
        currency: event.currency,
        category: event.category,
        bookerUserId: "",
        bookerName: "",
        bookerEmail: "",
        numberOfAttendees: event.attendees,
        status:
          event.status === "upcoming"
            ? "confirmed"
            : (event.status as "completed" | "cancelled" | "pending"),
        paymentStatus: "pending",
        createdAt: "",
        updatedAt: "",
      } as Booking)
  );
};

export const getBookingsByUser = async (
  _userId: string
): Promise<Booking[]> => {
  console.warn(
    "getBookingsByUser is deprecated. Experiences don't have user-specific booking info."
  );
  return [];
};

export const getBookingsByEvent = async (
  eventId: string
): Promise<Booking[]> => {
  const event = await getExperienceById(eventId);
  if (!event) return [];

  return [
    {
      id: event.id,
      eventId: event.id,
      eventTitle: event.title || "",
      eventDescription: event.description || "",
      eventImage: event.image,
      companyId: event.companyId,
      companyName: event.companyName,
      bookedDate: event.date,
      bookedTime: event.time,
      location: event.location,
      price: event.price,
      currency: event.currency,
      category: event.category,
      bookerUserId: "",
      bookerName: "",
      bookerEmail: "",
      numberOfAttendees: event.maxAttendees,
      status:
        event.status === "upcoming"
          ? "confirmed"
          : (event.status as "completed" | "cancelled" | "pending"),
      paymentStatus: "pending",
      createdAt: "",
      updatedAt: "",
    } as Booking,
  ];
};

export const getBookingsByDateRange = async (
  companyId: string,
  startDate: string,
  endDate: string
): Promise<Booking[]> => {
  console.warn(
    "getBookingsByDateRange is deprecated. Use getExperiencesByDateRange instead."
  );
  const experiences = await getExperiencesByDateRange(
    companyId,
    startDate,
    endDate
  );
  return experiences.map(
    (event) =>
      ({
        id: event.id,
        eventId: event.id,
        eventTitle: event.title || "",
        eventDescription: event.description || "",
        eventImage: event.image,
        companyId: event.companyId,
        companyName: event.companyName,
        bookedDate: event.date,
        bookedTime: event.time,
        location: event.location,
        price: event.price,
        currency: event.currency,
        category: event.category,
        bookerUserId: "",
        bookerName: "",
        bookerEmail: "",
        numberOfAttendees: event.attendees,
        status:
          event.status === "upcoming"
            ? "confirmed"
            : (event.status as "completed" | "cancelled" | "pending"),
        paymentStatus: "pending",
        createdAt: "",
        updatedAt: "",
      } as Booking)
  );
};

export const updateBooking = async (
  id: string,
  bookingData: Partial<Booking>
): Promise<void> => {
  console.warn("updateBooking is deprecated. Use updateEvent instead.");
  await updateEvent(id, {
    title: bookingData.eventTitle,
    description: bookingData.eventDescription,
    image: bookingData.eventImage,
    date: bookingData.bookedDate,
    time: bookingData.bookedTime,
    location: bookingData.location,
    price: bookingData.price,
    currency: bookingData.currency,
    attendees: bookingData.numberOfAttendees,
    status:
      bookingData.status === "pending" || bookingData.status === "confirmed"
        ? "upcoming"
        : (bookingData.status as "completed" | "cancelled" | undefined),
  });
};

export const deleteBooking = async (id: string): Promise<void> => {
  console.warn("deleteBooking is deprecated. Use deleteEvent instead.");
  await deleteEvent(id);
};

export const isDateBooked = async (
  _eventId: string,
  _date: string
): Promise<boolean> => {
  console.warn(
    "isDateBooked is deprecated. Check experience availability instead."
  );
  return false;
};

// Message operations
export const createMessage = async ({
  messageData,
  companyId,
  conversationId,
}: {
  messageData: Omit<Message, "id">;
  companyId: string;
  conversationId: string;
}): Promise<string> => {
  try {
    checkFirebaseConnection();
    // Access the nested messages collection under the specific conversation
    const messagesRef = collection(
      db,
      "ticket-companies",
      companyId,
      "conversations",
      conversationId,
      "messages"
    );
    const docRef = await addDoc(messagesRef, messageData);

    // Update conversation with last message
    const conversationRef = doc(
      db,
      "ticket-companies",
      companyId,
      "conversations",
      conversationId
    );
    await updateDoc(conversationRef, {
      last_updated_at: new Date().toISOString(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
};

export const getMessagesByConversationId = async ({
  companyId,
  conversationId,
}: {
  companyId: string;
  conversationId: string;
}): Promise<Message[]> => {
  try {
    checkFirebaseConnection();
    const messagesRef = collection(
      db,
      "ticket-companies",
      companyId,
      "conversations",
      conversationId,
      "messages"
    );
    const snapshot = await getDocs(messagesRef);
    return snapshot.docs.map((doc) => ({
      ...(doc.data() as Message),
    }));
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const markMessageAsRead = async (messageId: string): Promise<void> => {
  try {
    checkFirebaseConnection();
    const messageRef = doc(db, MESSAGES_COLLECTION, messageId);
    await updateDoc(messageRef, { read: true });
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
};

// Conversation operations
export const createConversation = async (
  conversationData: Omit<Conversation, "id">
): Promise<string> => {
  try {
    checkFirebaseConnection();
    const conversationsRef = collection(db, CONVERSATIONS_COLLECTION);
    const docRef = await addDoc(conversationsRef, conversationData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};

export const getConversationsByUser = async ({
  companyId,
}: {
  companyId: string;
  userId: string;
}): Promise<Conversation[]> => {
  try {
    checkFirebaseConnection();

    // Use collection to query conversations for a specific company
    const conversationsRef = collection(
      db,
      "ticket-companies",
      companyId,
      "conversations"
    );
    const q = query(conversationsRef);
    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Conversation)
    );
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

export const markConversationAsRead = async ({
  companyId,
  conversationId,
}: {
  companyId: string;
  conversationId: string;
}): Promise<void> => {
  try {
    checkFirebaseConnection();
    const conversationRef = doc(
      db,
      "ticket-companies",
      companyId,
      "conversations",
      conversationId
    );
    await updateDoc(conversationRef, { unseen_messages: 0 });
  } catch (error) {
    console.error("Error marking conversation as read:", error);
    throw error;
  }
};

export const getConversationByBooking = async (
  bookingId: string
): Promise<Conversation | null> => {
  try {
    checkFirebaseConnection();
    const conversationsRef = collection(db, CONVERSATIONS_COLLECTION);
    const q = query(conversationsRef, where("bookingId", "==", bookingId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as Conversation;
    }
    return null;
  } catch (error) {
    console.error("Error fetching conversation:", error);
    throw error;
  }
};
