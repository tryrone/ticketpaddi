import { createCompany, createEvent } from "@/lib/firestore";
import { mockCompanies } from "@/data/companies";
import { mockEvents } from "@/data/events";

/**
 * Migration script to populate Firestore with mock data
 * Run this script once to migrate your existing mock data to Firestore
 */
export const migrateToFirestore = async () => {
  console.log("Starting migration to Firestore...");

  try {
    // Migrate companies
    console.log("Migrating companies...");
    const companyPromises = mockCompanies.map(async (company) => {
      const { id, ...companyData } = company;
      const newId = await createCompany(companyData);
      console.log(`Created company: ${company.name} with ID: ${newId}`);
      return { oldId: id, newId, name: company.name };
    });

    const migratedCompanies = await Promise.all(companyPromises);
    console.log(`Successfully migrated ${migratedCompanies.length} companies`);

    // Create a mapping of old IDs to new IDs
    const companyIdMap = new Map(
      migratedCompanies.map(({ oldId, newId }) => [oldId, newId])
    );

    // Migrate events
    console.log("Migrating events...");
    const eventPromises = mockEvents.map(async (event) => {
      const { id, companyId, ...eventData } = event;
      const newCompanyId = companyIdMap.get(companyId);

      if (!newCompanyId) {
        console.warn(`Company not found for event: ${event.title}`);
        return null;
      }

      const newId = await createEvent({
        ...eventData,
        companyId: newCompanyId,
      });

      console.log(`Created event: ${event.title} with ID: ${newId}`);
      return { oldId: id, newId, title: event.title };
    });

    const migratedEvents = (await Promise.all(eventPromises)).filter(Boolean);
    console.log(`Successfully migrated ${migratedEvents.length} events`);

    console.log("Migration completed successfully!");
    console.log("Summary:");
    console.log(`- Companies migrated: ${migratedCompanies.length}`);
    console.log(`- Events migrated: ${migratedEvents.length}`);

    return {
      companies: migratedCompanies,
      events: migratedEvents,
    };
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};

// Helper function to run migration from browser console
if (typeof window !== "undefined") {
  (window as AnyType).migrateToFirestore = migrateToFirestore;
}
