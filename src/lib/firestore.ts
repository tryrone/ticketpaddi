import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
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
import { Company } from "@/types/company";
import { Event } from "@/types/event";
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
const EVENTS_COLLECTION = "ticketed-events";
const BOOKINGS_COLLECTION = "bookings";
const MESSAGES_COLLECTION = "messages";
const CONVERSATIONS_COLLECTION = "conversations";

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
    const eventsRef = collection(db, EVENTS_COLLECTION);
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
    const eventRef = doc(db, EVENTS_COLLECTION, id);
    const eventSnap = await getDoc(eventRef);

    if (eventSnap.exists()) {
      return {
        id: eventSnap.id,
        ...eventSnap.data(),
      } as Event;
    }
    return null;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
};

export const getEventsByCompany = async (
  companyId: string
): Promise<Event[]> => {
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const q = query(eventsRef, where("companyId", "==", companyId));
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
    const eventsRef = collection(db, EVENTS_COLLECTION);
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
    const eventsRef = collection(db, EVENTS_COLLECTION);
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
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const q = query(
      eventsRef,
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
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const companyRef = doc(db, COMPANIES_COLLECTION, eventData.companyId);

    const docRef = await addDoc(eventsRef, eventData);

    await updateDoc(companyRef, {
      numberOfEvents: increment(1),
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
    const eventRef = doc(db, EVENTS_COLLECTION, id);
    await updateDoc(eventRef, eventData);
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, id);
    await deleteDoc(eventRef);
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
    const eventsRef = collection(db, EVENTS_COLLECTION);
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

// Booking operations
export const createBooking = async (
  bookingData: Omit<Booking, "id">
): Promise<string> => {
  try {
    checkFirebaseConnection();
    const bookingsRef = collection(db, BOOKINGS_COLLECTION);
    const docRef = await addDoc(bookingsRef, bookingData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const getBookingById = async (id: string): Promise<Booking | null> => {
  try {
    checkFirebaseConnection();
    const bookingRef = doc(db, BOOKINGS_COLLECTION, id);
    const bookingSnap = await getDoc(bookingRef);

    if (bookingSnap.exists()) {
      return {
        id: bookingSnap.id,
        ...bookingSnap.data(),
      } as Booking;
    }
    return null;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};

export const getBookingsByCompany = async (
  companyId: string
): Promise<Booking[]> => {
  try {
    checkFirebaseConnection();
    const bookingsRef = collection(db, BOOKINGS_COLLECTION);
    const q = query(bookingsRef, where("companyId", "==", companyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Booking)
    );
  } catch (error) {
    console.error("Error fetching bookings by company:", error);
    throw error;
  }
};

export const getBookingsByUser = async (userId: string): Promise<Booking[]> => {
  try {
    checkFirebaseConnection();
    const bookingsRef = collection(db, BOOKINGS_COLLECTION);
    const q = query(bookingsRef, where("bookerUserId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Booking)
    );
  } catch (error) {
    console.error("Error fetching bookings by user:", error);
    throw error;
  }
};

export const getBookingsByEvent = async (
  eventId: string
): Promise<Booking[]> => {
  try {
    checkFirebaseConnection();
    const bookingsRef = collection(db, BOOKINGS_COLLECTION);
    const q = query(bookingsRef, where("eventId", "==", eventId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Booking)
    );
  } catch (error) {
    console.error("Error fetching bookings by event:", error);
    throw error;
  }
};

export const getBookingsByDateRange = async (
  companyId: string,
  startDate: string,
  endDate: string
): Promise<Booking[]> => {
  try {
    checkFirebaseConnection();
    const bookingsRef = collection(db, BOOKINGS_COLLECTION);
    const q = query(
      bookingsRef,
      where("companyId", "==", companyId),
      where("bookedDate", ">=", startDate),
      where("bookedDate", "<=", endDate)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Booking)
    );
  } catch (error) {
    console.error("Error fetching bookings by date range:", error);
    throw error;
  }
};

export const updateBooking = async (
  id: string,
  bookingData: Partial<Booking>
): Promise<void> => {
  try {
    checkFirebaseConnection();
    const bookingRef = doc(db, BOOKINGS_COLLECTION, id);
    await updateDoc(bookingRef, {
      ...bookingData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

export const deleteBooking = async (id: string): Promise<void> => {
  try {
    checkFirebaseConnection();
    const bookingRef = doc(db, BOOKINGS_COLLECTION, id);
    await deleteDoc(bookingRef);
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};

// Check if a date is already booked for a specific event
export const isDateBooked = async (
  eventId: string,
  date: string
): Promise<boolean> => {
  try {
    checkFirebaseConnection();
    const bookingsRef = collection(db, BOOKINGS_COLLECTION);
    const q = query(
      bookingsRef,
      where("eventId", "==", eventId),
      where("bookedDate", "==", date),
      where("status", "in", ["confirmed", "pending"])
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking if date is booked:", error);
    throw error;
  }
};

// Message operations
export const createMessage = async (
  messageData: Omit<Message, "id">
): Promise<string> => {
  try {
    checkFirebaseConnection();
    const messagesRef = collection(db, MESSAGES_COLLECTION);
    const docRef = await addDoc(messagesRef, messageData);

    // Update conversation with last message
    const conversationRef = collection(db, CONVERSATIONS_COLLECTION);
    const q = query(
      conversationRef,
      where("bookingId", "==", messageData.bookingId)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const conversationDoc = snapshot.docs[0];
      await updateDoc(doc(db, CONVERSATIONS_COLLECTION, conversationDoc.id), {
        lastMessage: messageData.message,
        lastMessageTime: messageData.timestamp,
        updatedAt: new Date().toISOString(),
      });
    }

    return docRef.id;
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
};

export const getMessagesByBooking = async (
  bookingId: string
): Promise<Message[]> => {
  try {
    checkFirebaseConnection();
    const messagesRef = collection(db, MESSAGES_COLLECTION);
    const q = query(
      messagesRef,
      where("bookingId", "==", bookingId),
      orderBy("timestamp", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Message)
    );
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

export const getConversationsByUser = async (
  userId: string,
  userType: "owner" | "booker"
): Promise<Conversation[]> => {
  try {
    checkFirebaseConnection();
    const conversationsRef = collection(db, CONVERSATIONS_COLLECTION);
    const field =
      userType === "owner" ? "participants.ownerId" : "participants.bookerId";
    const q = query(
      conversationsRef,
      where(field, "==", userId),
      orderBy("updatedAt", "desc")
    );
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
