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
