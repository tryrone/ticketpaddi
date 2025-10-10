import { getCompanies } from "@/lib/firestore";
import CompanyDetailClient from "./CompanyDetailClient";

export async function generateStaticParams() {
  const companies = await getCompanies();
  return companies.map((company) => ({
    id: company.id,
  }));
}

export default async function CompanyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const companyId = id || "";

  console.log("companyId", companyId);
  return <CompanyDetailClient companyId={companyId} />;
}
