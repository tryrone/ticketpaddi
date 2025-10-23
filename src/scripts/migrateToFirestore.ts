import { createCompany } from "@/lib/firestore";
import { mockCompanies } from "@/data/companies";

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

    return {
      companies: migratedCompanies,
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
