import { ProtectedRoute } from "@/components";
import CompanyDetailClient from "./CompanyDetailClient";

export default async function CompanyDetailPage() {
  return (
    <ProtectedRoute>
      <CompanyDetailClient />
    </ProtectedRoute>
  );
}
