"use client";

import CompanyListPage from "@/components/CompanyListPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <CompanyListPage />
    </ProtectedRoute>
  );
}
