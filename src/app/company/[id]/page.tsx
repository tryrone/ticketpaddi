import { getCompanies } from "@/lib/firestore";
import CompanyDetailClient from "./CompanyDetailClient";

export async function generateStaticParams() {
  try {
    const companies = await getCompanies();
    return companies.map((company) => ({
      id: company.id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CompanyDetailClient companyId={id} />;
}
