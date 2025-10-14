"use client";

import React, { useState, useMemo } from "react";
import { Booking } from "@/types/booking";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconCurrencyDollar,
  IconUser,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";

interface BookingCalendarProps {
  bookings: Booking[];
  onBookingClick?: (booking: Booking) => void;
  loading?: boolean;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  bookings,
  onBookingClick,
  loading,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysCount = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return {
      daysCount,
      startingDayOfWeek,
      year,
      month,
    };
  }, [currentDate]);

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    bookings.forEach((booking) => {
      const dateKey = booking.bookedDate;
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)?.push(booking);
    });
    return map;
  }, [bookings]);

  const getBookingsForDate = (day: number): Booking[] => {
    const dateStr = `${daysInMonth.year}-${String(
      daysInMonth.month + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return bookingsByDate.get(dateStr) || [];
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDayClick = (day: number) => {
    const dayBookings = getBookingsForDate(day);
    if (dayBookings.length > 0) {
      setSelectedBooking(dayBookings[0]);
      if (onBookingClick) {
        onBookingClick(dayBookings[0]);
      }
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const renderCalendarDays = () => {
    const days = [];
    const { daysCount, startingDayOfWeek } = daysInMonth;

    // Empty cells before first day
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="aspect-square p-2 border border-gray-200"
        />
      );
    }

    // Actual days
    for (let day = 1; day <= daysCount; day++) {
      const dayBookings = getBookingsForDate(day);
      const hasBookings = dayBookings.length > 0;
      const isToday =
        day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={`aspect-square p-2 border border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 ${
            isToday ? "bg-blue-50 border-blue-300" : ""
          } ${
            hasBookings ? "bg-green-50 border-green-300 hover:bg-green-100" : ""
          }`}
        >
          <div className="flex flex-col h-full">
            <div
              className={`text-sm font-medium mb-1 ${
                isToday
                  ? "text-blue-600"
                  : hasBookings
                  ? "text-green-700"
                  : "text-gray-700"
              }`}
            >
              {day}
            </div>
            {hasBookings && (
              <div className="flex-1 overflow-hidden">
                {dayBookings.slice(0, 2).map((booking) => (
                  <div
                    key={booking.id}
                    className="text-xs truncate mb-1 px-1 py-0.5 bg-green-600 text-white rounded"
                    title={booking.eventTitle}
                  >
                    {booking.eventTitle}
                  </div>
                ))}
                {dayBookings.length > 2 && (
                  <div className="text-xs text-green-700 font-medium px-1">
                    +{dayBookings.length - 2} more
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: IconClock },
      confirmed: { color: "bg-green-100 text-green-800", icon: IconCheck },
      completed: { color: "bg-blue-100 text-blue-800", icon: IconCheck },
      cancelled: { color: "bg-red-100 text-red-800", icon: IconX },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const StatusIcon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <StatusIcon size={14} className="mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <IconCalendar size={24} className="text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <IconChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <IconChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 mb-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-50 border border-blue-300 rounded mr-2" />
            <span className="text-gray-600">Today</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-50 border border-green-300 rounded mr-2" />
            <span className="text-gray-600">Booked</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            {/* Day names */}
            <div className="grid grid-cols-7 mb-2">
              {dayNames.map((dayName) => (
                <div
                  key={dayName}
                  className="text-center text-sm font-semibold text-gray-600 py-2"
                >
                  {dayName}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-0 border-l border-t border-gray-200">
              {renderCalendarDays()}
            </div>
          </div>

          {/* Booking Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedBooking ? "Booking Details" : "Select a Date"}
              </h3>

              {selectedBooking ? (
                <div className="space-y-4">
                  <div>
                    <Image
                      src={selectedBooking.eventImage}
                      alt={selectedBooking.eventTitle}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {selectedBooking.eventTitle}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {selectedBooking.eventDescription}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <IconCalendar size={16} className="mr-2 text-gray-400" />
                      {new Date(
                        selectedBooking.bookedDate
                      ).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <IconClock size={16} className="mr-2 text-gray-400" />
                      {selectedBooking.bookedTime}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <IconMapPin size={16} className="mr-2 text-gray-400" />
                      {selectedBooking.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <IconCurrencyDollar
                        size={16}
                        className="mr-2 text-gray-400"
                      />
                      {selectedBooking.currency} {selectedBooking.price}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <IconUser size={16} className="mr-2 text-gray-400" />
                      {selectedBooking.bookerName}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Status
                      </span>
                      {getStatusBadge(selectedBooking.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Payment
                      </span>
                      {getStatusBadge(selectedBooking.paymentStatus)}
                    </div>
                  </div>

                  {selectedBooking.notes && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedBooking.notes}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <IconCalendar size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    Click on a booked date to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
