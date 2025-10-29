"use client";

import React, { useState } from "react";
import {
  IconBell,
  IconUser,
  IconHome,
  IconBuilding,
  IconCalendar,
  IconSettings,
  IconLogout,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import CompanyTable from "../CompanyTable";
import CompanyModal from "../CompanyModal";
import { useCompanyModal } from "@/hooks/useCompanyModal";
import { Company } from "@/types/company";
import { useCompanies, useDeleteCompany } from "@/hooks/useFirestore";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CompanyListPage: React.FC = () => {
  const [opened, setOpened] = useState(false);

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Company hook
  const { companies, loading, fetchCompanies } = useCompanies();

  // Company modal hook
  const { isOpen, openModal, closeModal } = useCompanyModal();

  // delete company hook
  const { remove, error: deleteError } = useDeleteCompany();

  // Auth hook
  const { signOut, userProfile, user } = useAuth();

  const router = useRouter();

  const toggle = () => setOpened(!opened);
  const close = () => setOpened(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDeleteCompany = (company: Company) => {
    remove(company.id)
      .then(() => {
        fetchCompanies();
      })
      .catch(() => {
        setNotification({
          message: deleteError
            ? deleteError
            : `failed to delete ${company.name}`,
          type: "error",
        });
      });
  };

  const handleViewCompany = (company: Company) => {
    router.push(`/company/${company.id}`);
  };

  const totalEvents = companies.reduce(
    (sum, company) => sum + (company?.numberOfEvents || 0),
    0
  );
  const activeCompanies = companies.filter((c) => c.status === "active").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {notification.type === "success" ? "Success" : "Error"}
            </span>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              <IconX size={16} />
            </button>
          </div>
          <p className="mt-1">{notification.message}</p>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <button
              onClick={toggle}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <IconMenu2 size={20} />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-lg mx-4" />

            {/* Stats and User Menu */}
            <div className="flex items-center space-x-4">
              {/* Stats */}
              <div className="hidden sm:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Total Events:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {totalEvents.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Active:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {activeCompanies}
                  </span>
                </div>
              </div>

              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                <IconBell size={20} />
              </button>

              {/* User Avatar */}

              <div className="flex items-center gap-2 cursor-pointer">
                {userProfile?.photoURL || user?.photoURL ? (
                  <Image
                    src={userProfile?.photoURL || user?.photoURL || ""}
                    alt={userProfile?.displayName || user?.email || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                    width={32}
                    height={32}
                  />
                ) : (
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                    <IconUser size={16} className="text-white" />
                  </div>
                )}
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {userProfile?.displayName ||
                    user?.email?.split("@")[0] ||
                    "User"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CompanyTable
          companies={companies}
          onDelete={handleDeleteCompany}
          onView={handleViewCompany}
          onAddCompany={openModal}
          loading={loading}
        />
      </main>

      {/* Mobile Drawer */}
      {opened && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={close}
          ></div>
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Navigation
              </h2>
              <button
                onClick={close}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                <IconX size={20} />
              </button>
            </div>
            <nav className="flex-1 px-4 pb-4 space-y-1">
              <Link
                href="/"
                className="flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md"
              >
                <IconHome size={16} className="mr-3" />
                Dashboard
              </Link>
              <Link
                href="/companies"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              >
                <IconBuilding size={16} className="mr-3" />
                Companies
              </Link>
              <Link
                href="/events"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              >
                <IconCalendar size={16} className="mr-3" />
                Events
              </Link>
              <div className="border-t border-gray-200 my-4"></div>
              <Link
                href="/settings"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              >
                <IconSettings size={16} className="mr-3" />
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-700 hover:text-red-900 hover:bg-red-50 rounded-md"
              >
                <IconLogout size={16} className="mr-3" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Company Modal */}
      <CompanyModal
        isOpen={isOpen}
        onClose={closeModal}
        onSuccess={() => {
          fetchCompanies();
        }}
      />
    </div>
  );
};

export default CompanyListPage;
