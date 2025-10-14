"use client";

import React, { useState } from "react";
import { Modal } from "@mantine/core";
import { Event } from "@/types/event";
import { useCreateBooking, useCheckDateBooked } from "@/hooks/useBookings";
import { useCreateConversation } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import {
  IconCalendar,
  IconClock,
  IconMapPin,
  IconCurrencyDollar,
  IconUser,
  IconMail,
  IconPhone,
  IconFileText,
} from "@tabler/icons-react";
import Image from "next/image";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onSuccess?: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  event,
  onSuccess,
}) => {
  const { create, loading, error } = useCreateBooking();
  const { checkDate } = useCheckDateBooked();
  const { create: createConversation } = useCreateConversation();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    bookedDate: "",
    bookedTime: event.time || "",
    numberOfAttendees: "1",
    bookerName: "",
    bookerEmail: user?.email || "",
    bookerPhone: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checkingDate, setCheckingDate] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setFormData((prev) => ({ ...prev, bookedDate: date }));

    if (errors.bookedDate) {
      setErrors((prev) => ({ ...prev, bookedDate: "" }));
    }

    // Check if date is already booked
    if (date && event.isTemplate) {
      setCheckingDate(true);
      try {
        const isBooked = await checkDate(event.id, date);
        if (isBooked) {
          setErrors((prev) => ({
            ...prev,
            bookedDate:
              "This date is already booked. Please select another date.",
          }));
        }
      } catch (error) {
        console.error("Failed to check date:", error);
      } finally {
        setCheckingDate(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.bookedDate.trim()) {
      newErrors.bookedDate = "Date is required";
    }

    if (!formData.bookedTime.trim()) {
      newErrors.bookedTime = "Time is required";
    }

    if (
      !formData.numberOfAttendees.trim() ||
      parseInt(formData.numberOfAttendees) < 1
    ) {
      newErrors.numberOfAttendees = "Number of attendees must be at least 1";
    }

    if (!formData.bookerName.trim()) {
      newErrors.bookerName = "Name is required";
    }

    if (!formData.bookerEmail.trim()) {
      newErrors.bookerEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.bookerEmail)) {
      newErrors.bookerEmail = "Invalid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user) {
      return;
    }

    try {
      const bookingData = {
        eventId: event.id,
        eventTitle: event.title || "",
        eventDescription: event.description || "",
        eventImage: event.image,
        companyId: event.companyId,
        companyName: event.companyName,
        bookedDate: formData.bookedDate,
        bookedTime: formData.bookedTime,
        location: event.location,
        price: event.price,
        currency: event.currency,
        category: event.category,
        bookerUserId: user.uid,
        bookerName: formData.bookerName,
        bookerEmail: formData.bookerEmail,
        bookerPhone: formData.bookerPhone,
        numberOfAttendees: parseInt(formData.numberOfAttendees),
        status: "pending" as const,
        paymentStatus: "pending" as const,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const bookingId = await create(bookingData);

      // Create conversation for this booking
      await createConversation({
        bookingId,
        eventTitle: event.title || "",
        participants: {
          ownerId: event.companyId, // Using companyId as owner for now
          ownerName: event.companyName,
          bookerId: user.uid,
          bookerName: formData.bookerName,
        },
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      onSuccess?.();
      onClose();

      // Reset form
      setFormData({
        bookedDate: "",
        bookedTime: event.time || "",
        numberOfAttendees: "1",
        bookerName: "",
        bookerEmail: user?.email || "",
        bookerPhone: "",
        notes: "",
      });
      setErrors({});
    } catch (err) {
      console.error("Failed to create booking:", err);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} size="lg" title="Book This Event">
      <form onSubmit={handleSubmit}>
        {/* Event Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Image
              src={event.image}
              alt={event.title || "Event Image"}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {event.title}
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <IconMapPin size={14} className="mr-1" />
                  {event.location}
                </div>
                <div className="flex items-center">
                  <IconCurrencyDollar size={14} className="mr-1" />
                  {event.currency} {event.price}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              <IconCalendar size={16} className="inline mr-2" />
              Select Date{" "}
              {event.isTemplate && (
                <span className="text-xs text-gray-500">(Template)</span>
              )}
            </label>
            <input
              type="date"
              name="bookedDate"
              value={formData.bookedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split("T")[0]}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.bookedDate ? "border-red-500" : "border-gray-300"
              }`}
              disabled={checkingDate}
            />
            {errors.bookedDate && (
              <p className="text-red-500 text-sm mt-1">{errors.bookedDate}</p>
            )}
            {checkingDate && (
              <p className="text-blue-500 text-sm mt-1">
                Checking availability...
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              <IconClock size={16} className="inline mr-2" />
              Select Time
            </label>
            <input
              type="time"
              name="bookedTime"
              value={formData.bookedTime}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.bookedTime ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.bookedTime && (
              <p className="text-red-500 text-sm mt-1">{errors.bookedTime}</p>
            )}
          </div>
        </div>

        {/* Number of Attendees */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            <IconUser size={16} className="inline mr-2" />
            Number of Attendees
          </label>
          <input
            type="number"
            name="numberOfAttendees"
            value={formData.numberOfAttendees}
            onChange={handleInputChange}
            min="1"
            max={event.maxAttendees}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.numberOfAttendees ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.numberOfAttendees && (
            <p className="text-red-500 text-sm mt-1">
              {errors.numberOfAttendees}
            </p>
          )}
        </div>

        {/* Booker Information */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            <IconUser size={16} className="inline mr-2" />
            Full Name
          </label>
          <input
            type="text"
            name="bookerName"
            value={formData.bookerName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.bookerName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.bookerName && (
            <p className="text-red-500 text-sm mt-1">{errors.bookerName}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              <IconMail size={16} className="inline mr-2" />
              Email
            </label>
            <input
              type="email"
              name="bookerEmail"
              value={formData.bookerEmail}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.bookerEmail ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.bookerEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.bookerEmail}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              <IconPhone size={16} className="inline mr-2" />
              Phone (Optional)
            </label>
            <input
              type="tel"
              name="bookerPhone"
              value={formData.bookerPhone}
              onChange={handleInputChange}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            <IconFileText size={16} className="inline mr-2" />
            Special Requests or Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Any special requests or information we should know?"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || checkingDate}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BookingModal;
