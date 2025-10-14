"use client";

import React, { useState } from "react";
import { Modal } from "@mantine/core";
import { Booking } from "@/types/booking";
import { useBookingsByEvent } from "@/hooks/useBookings";
import { useUpdateBooking } from "@/hooks/useBookings";
import {
  IconCalendar,
  IconClock,
  IconMapPin,
  IconCurrencyDollar,
  IconUser,
  IconMail,
  IconPhone,
  IconCheck,
  IconX,
  IconMessage,
  IconFileText,
} from "@tabler/icons-react";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  onMessageClick?: (booking: Booking) => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  onMessageClick,
}) => {
  const { bookings, loading, refetch } = useBookingsByEvent(eventId);
  const { update } = useUpdateBooking();
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(
    null
  );

  const handleStatusUpdate = async (
    bookingId: string,
    status: Booking["status"]
  ) => {
    try {
      setUpdatingBookingId(bookingId);
      await update(bookingId, { status });
      refetch();
    } catch (error) {
      console.error("Failed to update booking status:", error);
    } finally {
      setUpdatingBookingId(null);
    }
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

  const getPaymentBadge = (paymentStatus: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: IconClock },
      paid: { color: "bg-green-100 text-green-800", icon: IconCheck },
      refunded: { color: "bg-gray-100 text-gray-800", icon: IconX },
    };

    const config =
      statusConfig[paymentStatus as keyof typeof statusConfig] ||
      statusConfig.pending;
    const StatusIcon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <StatusIcon size={14} className="mr-1" />
        {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
      </span>
    );
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      size="xl"
      title={`Bookings for ${eventTitle}`}
    >
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <IconCalendar size={48} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No bookings yet</p>
            <p className="text-xs">
              Bookings will appear here when customers book this event
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {bookings.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Confirmed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {bookings.filter((b) => b.status === "confirmed").length}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Revenue</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {bookings[0]?.currency}{" "}
                    {bookings.reduce((sum, b) => sum + b.price, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusBadge(booking.status)}
                      {getPaymentBadge(booking.paymentStatus)}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <IconCalendar
                          size={16}
                          className="mr-2 text-gray-400"
                        />
                        {new Date(booking.bookedDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <IconClock size={16} className="mr-2 text-gray-400" />
                        {booking.bookedTime}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <IconMapPin size={16} className="mr-2 text-gray-400" />
                        {booking.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <IconCurrencyDollar
                          size={16}
                          className="mr-2 text-gray-400"
                        />
                        {booking.currency} {booking.price}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Customer Information
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <IconUser size={16} className="mr-2 text-gray-400" />
                      {booking.bookerName}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <IconMail size={16} className="mr-2 text-gray-400" />
                      {booking.bookerEmail}
                    </div>
                    {booking.bookerPhone && (
                      <div className="flex items-center text-gray-600">
                        <IconPhone size={16} className="mr-2 text-gray-400" />
                        {booking.bookerPhone}
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <IconUser size={16} className="mr-2 text-gray-400" />
                      {booking.numberOfAttendees} attendee
                      {booking.numberOfAttendees > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>

                {booking.notes && (
                  <div className="border-t border-gray-200 pt-3 mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      <IconFileText size={16} className="inline mr-1" />
                      Notes
                    </p>
                    <p className="text-sm text-gray-600">{booking.notes}</p>
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-3 border-t border-gray-200">
                  {booking.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusUpdate(booking.id, "confirmed")
                        }
                        disabled={updatingBookingId === booking.id}
                        className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <IconCheck size={16} className="inline mr-1" />
                        Confirm
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(booking.id, "cancelled")
                        }
                        disabled={updatingBookingId === booking.id}
                        className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        <IconX size={16} className="inline mr-1" />
                        Cancel
                      </button>
                    </>
                  )}
                  {booking.status === "confirmed" && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(booking.id, "completed")
                      }
                      disabled={updatingBookingId === booking.id}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <IconCheck size={16} className="inline mr-1" />
                      Mark Complete
                    </button>
                  )}
                  <button
                    onClick={() => onMessageClick?.(booking)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <IconMessage size={16} className="inline mr-1" />
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BookingDetailsModal;
