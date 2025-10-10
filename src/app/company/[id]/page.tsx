import { getCompanies } from "@/lib/firestore";
import CompanyDetailClient from "./CompanyDetailClient";

export async function generateStaticParams() {
  const companies = await getCompanies();
  return companies.map((company) => ({
    id: company.id,
  }));
}

export default async function CompanyDetailPage() {
  return <CompanyDetailClient />;
}
