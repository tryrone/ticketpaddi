"use client";

import React, { useMemo } from "react";
import { Modal } from "@mantine/core";
import { Booking } from "@/types/booking";
import {
  useBookedEventById,
  useConfirmedBookingsByEvent,
} from "@/hooks/useBookings";
import {
  IconCalendar,
  IconClock,
  IconMapPin,
  IconUser,
  IconMail,
  IconPhone,
  IconCheck,
  IconX,
  IconFileText,
  IconHash,
} from "@tabler/icons-react";
import {
  amountFormatter,
  amountFormatterWithoutCurrency,
} from "@/utils/amountFormatter";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  companyId: string;
  selectedBookingDate: string;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  companyId,
  selectedBookingDate,
}) => {
  const { booking, loading: bookingLoading } = useBookedEventById({
    companyId,
    eventId,
  });
  const { confirmedBookings, loading: confirmedBookingsLoading } =
    useConfirmedBookingsByEvent({ companyId, eventId });

  const loading = confirmedBookingsLoading || bookingLoading;

  const bookingInConfirmedBookings = confirmedBookings.find(
    (b) => b.event_id === booking?.id
  );

  const selectedDateIsAvailable = useMemo(() => {
    return Object.keys(booking?.dateAvailability || {}).some(
      (date) =>
        date === selectedBookingDate &&
        booking?.dateAvailability?.[date] === "booked"
    );
  }, [booking?.dateAvailability, selectedBookingDate]);

  const getStatusBadge = (status: Booking["status"]) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: IconClock },
      confirmed: { color: "bg-green-100 text-green-800", icon: IconCheck },
      completed: { color: "bg-blue-100 text-blue-800", icon: IconCheck },
      cancelled: { color: "bg-red-100 text-red-800", icon: IconX },
      paid: { color: "bg-green-100 text-green-800", icon: IconCheck },
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
        ) : booking === null || !selectedDateIsAvailable ? (
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
                    {bookingInConfirmedBookings
                      ? bookingInConfirmedBookings?.quantity
                      : booking?.attendees}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Confirmed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {bookingInConfirmedBookings
                      ? bookingInConfirmedBookings?.paid_ticket_ids?.length
                      : 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Revenue</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {bookingInConfirmedBookings
                      ? amountFormatter({
                          amount: bookingInConfirmedBookings?.grand_total,
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {bookingInConfirmedBookings?.status &&
                      getStatusBadge(bookingInConfirmedBookings?.status)}
                    {!bookingInConfirmedBookings?.status &&
                      getPaymentBadge(booking?.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <IconCalendar size={16} className="mr-2 text-gray-400" />
                      {new Date(selectedBookingDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <IconClock size={16} className="mr-2 text-gray-400" />
                      {bookingInConfirmedBookings
                        ? new Date(
                            bookingInConfirmedBookings?.time_created
                          ).toLocaleTimeString()
                        : new Date(booking?.createdAt).toLocaleTimeString()}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <IconMapPin size={16} className="mr-2 text-gray-400" />
                      {booking?.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <IconHash size={16} className="mr-2 text-gray-400" />
                      {amountFormatterWithoutCurrency({
                        amount: booking?.price,
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {bookingInConfirmedBookings && (
                <div className="border-t border-gray-200 pt-3 mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Customer Information
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <IconUser size={16} className="mr-2 text-gray-400" />
                      {bookingInConfirmedBookings?.customer_name}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <IconMail size={16} className="mr-2 text-gray-400" />
                      {bookingInConfirmedBookings?.customer_email}
                    </div>
                    {bookingInConfirmedBookings?.customer_phone && (
                      <div className="flex items-center text-gray-600">
                        <IconPhone size={16} className="mr-2 text-gray-400" />
                        {bookingInConfirmedBookings?.customer_phone}
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <IconUser size={16} className="mr-2 text-gray-400" />
                      {bookingInConfirmedBookings?.quantity} attendee
                      {bookingInConfirmedBookings?.quantity > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              )}

              {bookingInConfirmedBookings?.notes && (
                <div className="border-t border-gray-200 pt-3 mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    <IconFileText size={16} className="inline mr-1" />
                    Notes
                  </p>
                  <p className="text-sm text-gray-600">
                    {bookingInConfirmedBookings?.notes}
                  </p>
                </div>
              )}

              {/* <div className="flex items-center space-x-2 pt-3 border-t border-gray-200">
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
                </div> */}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BookingDetailsModal;
