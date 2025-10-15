"use client";

import React, { useState, useMemo } from "react";
import { Event } from "@/types/event";
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
  bookings: Event[]; // Now accepts Event[] (experiences)
  onBookingClick?: (booking: Event) => void;
  loading?: boolean;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  bookings,
  onBookingClick,
  loading,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Event | null>(null);

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
    const map = new Map<string, Event[]>();
    bookings.forEach((booking) => {
      const dates: string[] = [];

      // Check for availableDates array
      if (booking.availableDates && booking.availableDates.length > 0) {
        dates.push(...booking.availableDates);
      }
      // Check for dateConfiguration
      else if (booking.dateConfiguration) {
        const config = booking.dateConfiguration;

        if (config.type === "selected" && config.selectedDates) {
          dates.push(...config.selectedDates);
        } else if (
          config.type === "range" &&
          config.startDate &&
          config.endDate
        ) {
          // Generate all dates in the range
          const start = new Date(config.startDate);
          const end = new Date(config.endDate);
          const current = new Date(start);

          while (current <= end) {
            dates.push(current.toISOString().split("T")[0]);
            current.setDate(current.getDate() + 1);
          }
        } else if (config.type === "monthly" && config.monthlyDay) {
          // For monthly recurrence, add the day for the current and next few months
          const today = new Date();
          for (let i = 0; i < 12; i++) {
            const date = new Date(
              today.getFullYear(),
              today.getMonth() + i,
              config.monthlyDay
            );
            dates.push(date.toISOString().split("T")[0]);
          }
        }
      }
      // Fallback to single date field
      else if (booking.date) {
        dates.push(booking.date);
      }

      // Add booking to all applicable dates
      dates.forEach((dateKey) => {
        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }
        map.get(dateKey)?.push(booking);
      });
    });
    return map;
  }, [bookings]);

  const getBookingsForDate = (day: number): Event[] => {
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
                    title={booking.title || ""}
                  >
                    {booking.title}
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
      upcoming: { color: "bg-blue-100 text-blue-800", icon: IconClock },
      ongoing: { color: "bg-green-100 text-green-800", icon: IconCheck },
      completed: { color: "bg-gray-100 text-gray-800", icon: IconCheck },
      cancelled: { color: "bg-red-100 text-red-800", icon: IconX },
      // Backward compatibility for booking statuses
      pending: { color: "bg-yellow-100 text-yellow-800", icon: IconClock },
      confirmed: { color: "bg-green-100 text-green-800", icon: IconCheck },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.upcoming;
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
            <span className="text-gray-600">Available Experience</span>
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

          {/* Experience Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedBooking ? "Experience Details" : "Select a Date"}
              </h3>

              {selectedBooking ? (
                <div className="space-y-4">
                  <div>
                    <Image
                      src={selectedBooking.image}
                      alt={selectedBooking.title || ""}
                      width={400}
                      height={160}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {selectedBooking.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {selectedBooking.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start text-sm text-gray-600">
                      <IconCalendar
                        size={16}
                        className="mr-2 text-gray-400 mt-0.5"
                      />
                      <div>
                        {selectedBooking.dateConfiguration ? (
                          <>
                            {selectedBooking.dateConfiguration.type ===
                              "range" && (
                              <div>
                                <span className="font-medium">Date Range:</span>
                                <br />
                                {selectedBooking.dateConfiguration.startDate &&
                                  new Date(
                                    selectedBooking.dateConfiguration.startDate
                                  ).toLocaleDateString()}
                                {" - "}
                                {selectedBooking.dateConfiguration.endDate &&
                                  new Date(
                                    selectedBooking.dateConfiguration.endDate
                                  ).toLocaleDateString()}
                              </div>
                            )}
                            {selectedBooking.dateConfiguration.type ===
                              "selected" && (
                              <div>
                                <span className="font-medium">
                                  Multiple Dates
                                </span>
                                <br />
                                <span className="text-xs">
                                  {selectedBooking.dateConfiguration
                                    .selectedDates?.length || 0}{" "}
                                  dates selected
                                </span>
                              </div>
                            )}
                            {selectedBooking.dateConfiguration.type ===
                              "monthly" && (
                              <div>
                                <span className="font-medium">
                                  Monthly on day{" "}
                                  {selectedBooking.dateConfiguration.monthlyDay}
                                </span>
                              </div>
                            )}
                          </>
                        ) : selectedBooking.availableDates &&
                          selectedBooking.availableDates.length > 0 ? (
                          <div>
                            <span className="font-medium">Multiple Dates</span>
                            <br />
                            <span className="text-xs">
                              {selectedBooking.availableDates.length} dates
                              available
                            </span>
                          </div>
                        ) : (
                          new Date(selectedBooking.date).toLocaleDateString()
                        )}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <IconClock size={16} className="mr-2 text-gray-400" />
                      {selectedBooking.time}
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
                      {selectedBooking.attendees} /{" "}
                      {selectedBooking.maxAttendees} attendees
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
                        Category
                      </span>
                      <span className="text-sm text-gray-600 capitalize">
                        {selectedBooking.category}
                      </span>
                    </div>
                  </div>

                  {selectedBooking.tags && selectedBooking.tags.length > 0 && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {selectedBooking.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <IconCalendar size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    Click on a date with an experience to view details
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
