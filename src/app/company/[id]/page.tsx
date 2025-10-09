import { getCompanies } from "@/lib/firestore";
import CompanyDetailClient from "./CompanyDetailClient";

// Generate static params for static export
export async function generateStaticParams() {
  const companies = await getCompanies();
  return companies.map((company) => ({
    id: company.id,
  }));
}

// Server component that wraps the client component
export default function CompanyDetailPage() {
  return <CompanyDetailClient />;
}
