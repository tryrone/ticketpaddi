"use client";

import React, { useState, useMemo } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import BookingCalendar from "@/components/BookingCalendar";
import BookingDetailsModal from "@/components/BookingDetailsModal";
import { useCompanies } from "@/hooks/useFirestore";
import { Event } from "@/types/company";
import { useExperiencesByCompany } from "@/hooks/useBookings";
import { IconCalendar, IconChevronDown } from "@tabler/icons-react";
import { Select } from "@mantine/core";

export default function CalendarPage() {
  const { companies, loading: companiesLoading } = useCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [selectedBooking, setSelectedBooking] = useState<Event | null>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  // Get the first company by default
  const defaultCompanyId = useMemo(() => {
    if (companies.length > 0 && !selectedCompanyId) {
      return companies[0].id;
    }
    return selectedCompanyId;
  }, [companies, selectedCompanyId]);

  const { experiences, loading: bookingsLoading } = useExperiencesByCompany(
    defaultCompanyId || selectedCompanyId
  );

  const handleBookingClick = (booking: Event, date: string) => {
    const bookingCopy = { ...booking, date: date };
    setSelectedBooking(bookingCopy);
    setShowBookingDetails(true);
  };

  const selectedCompany = companies.find(
    (c) => c.id === (defaultCompanyId || selectedCompanyId)
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-start space-x-3">
                <IconCalendar size={32} className="text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Booking Calendar
                  </h1>
                  <p className="text-gray-600">View and manage your bookings</p>
                </div>
              </div>

              {/* Company Selector */}
              {companies.length > 1 && (
                <Select
                  data={companies.map((company) => ({
                    value: company.id,
                    label: company.name,
                  }))}
                  value={defaultCompanyId || selectedCompanyId}
                  onChange={(value) => setSelectedCompanyId(value || "")}
                  styles={{
                    input: {
                      height: 43,
                    },
                  }}
                  classNames={{
                    input:
                      "border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-medium",
                  }}
                  rightSection={<IconChevronDown size={20} />}
                />
              )}
            </div>

            {selectedCompany && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Viewing experiences for
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedCompany.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Experiences</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {experiences.length}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Calendar */}
          {companiesLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : companies.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <IconCalendar size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Companies Found
              </h3>
              <p className="text-gray-600 mb-4">
                Create a company first to start managing experiences
              </p>
            </div>
          ) : (
            <BookingCalendar
              bookings={experiences}
              onBookingClick={handleBookingClick}
              loading={bookingsLoading}
              companyId={selectedCompany?.id}
            />
          )}
        </div>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <BookingDetailsModal
            isOpen={showBookingDetails}
            onClose={() => {
              setShowBookingDetails(false);
              setSelectedBooking(null);
            }}
            eventId={selectedBooking.id}
            eventTitle={selectedBooking.title || ""}
            companyId={selectedCompany?.id || ""}
            selectedBookingDate={selectedBooking.date}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
