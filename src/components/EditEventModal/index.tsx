"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@mantine/core";
import { useUpdateEvent } from "@/hooks/useFirestore";
import { Event, SeatRange, DateConfiguration } from "@/types/company";
import { useImageUpload } from "@/hooks/useImageUpload";
import { checkExperienceDateConflicts } from "@/lib/firestore";
import Button from "../Button";
import { BasicInfoFields } from "../EventModal/BasicInfoFields";
import { EventDetailsFields } from "../EventModal/EventDetailsFields";
import { ExperienceDetailsFields } from "../EventModal/ExperienceDetailsFields";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onSuccess?: (event: Event) => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  isOpen,
  onClose,
  event,
  onSuccess,
}) => {
  const { update, loading, error } = useUpdateEvent();
  const { uploadImageWithProgress, uploading } = useImageUpload();

  // Form state
  const [eventType, setEventType] = useState<"event" | "experience" | null>(
    null
  );
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null as File | null,
    date: "",
    time: "",
    location: "",
    price: "",
    currency: "NGN",
    category: "",
    maxAttendees: "",
    tags: "",
    featured: false,
    isTemplate: false,
  });

  // Experience-specific state
  const [seatRanges, setSeatRanges] = useState<SeatRange[]>([]);
  const [dateConfigType, setDateConfigType] = useState<
    "selected" | "range" | "monthly"
  >("selected");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({ startDate: null, endDate: null });
  const [monthlyDay, setMonthlyDay] = useState<string | null>(null);
  const [tempDate, setTempDate] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when event changes
  useEffect(() => {
    if (event) {
      setEventType(event.eventType || "event");
      setFormData({
        title: event.title || "",
        description: event.description || "",
        image: null,
        date: event.date || "",
        time: event.time || "",
        location: event.location || "",
        price: event.price?.toString() || "",
        currency: event.currency || "NGN",
        category: event.category || "",
        maxAttendees: event.maxAttendees?.toString() || "",
        tags: event.tags?.join(", ") || "",
        featured: event.featured || false,
        isTemplate: event.isTemplate || false,
      });

      // Initialize experience-specific data
      if (event.eventType === "experience") {
        setSeatRanges(event.seatRanges || []);

        if (event.dateConfiguration) {
          setDateConfigType(event.dateConfiguration.type);

          if (event.dateConfiguration.type === "selected") {
            setSelectedDates(event.dateConfiguration.selectedDates || []);
          } else if (event.dateConfiguration.type === "range") {
            setDateRange({
              startDate: event.dateConfiguration.startDate || null,
              endDate: event.dateConfiguration.endDate || null,
            });
          } else if (event.dateConfiguration.type === "monthly") {
            setMonthlyDay(
              event.dateConfiguration.monthlyDay?.toString() || null
            );
          }
        }
      }
    }
  }, [event]);

  // Input handlers
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleCurrencyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, currency: value }));
  };

  // Seat range handlers
  const addSeatRange = () => {
    const newRange: SeatRange = {
      id: Date.now().toString(),
      min: 0,
      max: 0,
    };
    setSeatRanges([...seatRanges, newRange]);
  };

  const updateSeatRange = (id: string, field: "min" | "max", value: number) => {
    setSeatRanges(
      seatRanges.map((range) =>
        range.id === id ? { ...range, [field]: value } : range
      )
    );
  };

  const removeSeatRange = (id: string) => {
    setSeatRanges(seatRanges.filter((range) => range.id !== id));
  };

  // Date handlers
  const addSelectedDate = () => {
    if (tempDate && !selectedDates.includes(tempDate)) {
      setSelectedDates([...selectedDates, tempDate]);
      setTempDate("");
    }
  };

  const removeSelectedDate = (date: string) => {
    setSelectedDates(selectedDates.filter((d) => d !== date));
  };

  const handleDateRangeChange = (
    field: "startDate" | "endDate",
    value: string | null
  ) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (eventType === "event") {
      if (!formData.date.trim()) {
        newErrors.date = "Event date is required";
      }
      if (!formData.time.trim()) {
        newErrors.time = "Event time is required";
      }
      if (!formData.maxAttendees.trim()) {
        newErrors.maxAttendees = "Maximum attendees is required";
      }
    } else if (eventType === "experience") {
      if (seatRanges.length === 0) {
        newErrors.seatRanges = "At least one seat range is required";
      } else {
        const invalidRange = seatRanges.find(
          (range) => range.min >= range.max || range.min < 0
        );
        if (invalidRange) {
          newErrors.seatRanges =
            "Invalid seat range. Min must be less than Max and both must be positive.";
        }
      }

      if (dateConfigType === "selected" && selectedDates.length === 0) {
        newErrors.dateConfig = "At least one date must be selected";
      } else if (
        dateConfigType === "range" &&
        (!dateRange.startDate || !dateRange.endDate)
      ) {
        newErrors.dateConfig = "Start and end dates are required";
      } else if (dateConfigType === "monthly" && !monthlyDay) {
        newErrors.dateConfig = "Monthly day is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to get all dates from configuration
  const getDatesFromConfiguration = (): string[] => {
    if (eventType !== "experience") return [];

    if (dateConfigType === "selected") {
      return selectedDates;
    } else if (
      dateConfigType === "range" &&
      dateRange.startDate &&
      dateRange.endDate
    ) {
      const dates: string[] = [];
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      const current = new Date(start);

      while (current <= end) {
        dates.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
      return dates;
    } else if (dateConfigType === "monthly" && monthlyDay) {
      const dates: string[] = [];
      const today = new Date();
      for (let i = 0; i < 12; i++) {
        const date = new Date(
          today.getFullYear(),
          today.getMonth() + i,
          parseInt(monthlyDay)
        );
        dates.push(date.toISOString().split("T")[0]);
      }
      return dates;
    }
    return [];
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!event?.id) return;

    if (!validateForm()) {
      return;
    }

    try {
      // Check for date conflicts if updating an experience
      if (eventType === "experience" && event.companyId) {
        const datesToCheck = getDatesFromConfiguration();
        const conflictCheck = await checkExperienceDateConflicts(
          event.companyId,
          datesToCheck,
          event.id // Exclude current event from conflict check
        );

        if (conflictCheck.hasConflict) {
          const conflictMessage = `Date conflict detected! The following dates already have experiences:\n${conflictCheck.conflictingDates
            .slice(0, 5)
            .join(", ")}${
            conflictCheck.conflictingDates.length > 5
              ? `\n...and ${conflictCheck.conflictingDates.length - 5} more`
              : ""
          }`;

          setErrors({
            dateConfig: conflictMessage,
          });
          return;
        }
      }

      let imageUrl = event.image; // Keep existing image by default
      if (formData.image) {
        const result = await uploadImageWithProgress(formData.image);
        if (result) {
          imageUrl = result.url;
        }
      }

      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const baseEventData = {
        eventType,
        title: formData.title,
        description: formData.description,
        image: imageUrl,
        location: formData.location,
        price: parseFloat(formData.price),
        currency: formData.currency,
        category: formData.category,
        status: event.status, // Keep existing status
        tags: tagsArray,
        featured: formData.featured,
      };

      let eventData: AnyType = { ...baseEventData };

      if (eventType === "event") {
        eventData = {
          ...eventData,
          date: formData.date,
          time: formData.time,
          maxAttendees: parseInt(formData.maxAttendees),
          isTemplate: formData.isTemplate,
        };
      } else if (eventType === "experience") {
        const dateConfiguration: DateConfiguration = {
          type: dateConfigType,
          ...(dateConfigType === "selected" && { selectedDates }),
          ...(dateConfigType === "range" && {
            startDate: dateRange.startDate || undefined,
            endDate: dateRange.endDate || undefined,
          }),
          ...(dateConfigType === "monthly" && {
            monthlyDay: parseInt(monthlyDay || "0"),
          }),
        };

        // Create dateAvailability map based on date configuration
        const dateAvailability: Record<string, string> = {};

        if (dateConfigType === "selected" && selectedDates.length > 0) {
          // For selected dates, mark all as available
          selectedDates.forEach((date) => {
            dateAvailability[date] = "available";
          });
        } else if (
          dateConfigType === "range" &&
          dateRange.startDate &&
          dateRange.endDate
        ) {
          // For date range, generate all dates in range and mark as available
          const start = new Date(dateRange.startDate);
          const end = new Date(dateRange.endDate);
          const current = new Date(start);

          while (current <= end) {
            const dateStr = current.toISOString().split("T")[0];
            dateAvailability[dateStr] = "available";
            current.setDate(current.getDate() + 1);
          }
        } else if (dateConfigType === "monthly" && monthlyDay) {
          // For monthly recurrence, generate dates for next 12 months
          const today = new Date();
          for (let i = 0; i < 12; i++) {
            const date = new Date(
              today.getFullYear(),
              today.getMonth() + i,
              parseInt(monthlyDay)
            );
            const dateStr = date.toISOString().split("T")[0];
            dateAvailability[dateStr] = "available";
          }
        }

        eventData = {
          ...eventData,
          date:
            dateConfigType === "selected"
              ? selectedDates[0]
              : dateRange.startDate || "",
          time: formData.time || "00:00",
          maxAttendees: Math.max(...seatRanges.map((r) => r.max)),
          seatRanges,
          dateConfiguration,
          dateAvailability,
          isTemplate: true,
        };
      }

      await update(event.id, eventData);

      const updatedEvent: Event = {
        ...event,
        ...eventData,
      };

      onSuccess?.(updatedEvent);
      onClose();
    } catch (err) {
      console.error("Failed to update event:", err);
    }
  };

  // Navigation handlers
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onClose();
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  // Render step content
  const renderStepContent = () => {
    // Step 1: Basic Info
    if (currentStep === 1 && eventType) {
      const title =
        eventType === "event" ? "Edit your event" : "Edit your experience";
      const subtitle = event
        ? `Editing ${eventType} for ${event.companyName}`
        : `Update your ${eventType}`;

      return (
        <>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>

          <BasicInfoFields
            formData={formData}
            errors={errors}
            type={eventType}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
            onCurrencyChange={handleCurrencyChange}
          />
        </>
      );
    }

    // Step 2: Additional Details
    if (currentStep === 2 && eventType) {
      const title =
        eventType === "event" ? "Event details" : "Experience details";
      const subtitle =
        eventType === "event"
          ? "Update information about your event"
          : "Update seat ranges and availability";

      return (
        <>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>

          {eventType === "event" ? (
            <EventDetailsFields
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />
          ) : (
            <ExperienceDetailsFields
              seatRanges={seatRanges}
              dateConfigType={dateConfigType}
              selectedDates={selectedDates}
              dateRange={dateRange}
              monthlyDay={monthlyDay}
              tempDate={tempDate}
              category={formData.category}
              tags={formData.tags}
              featured={formData.featured}
              errors={errors}
              onAddSeatRange={addSeatRange}
              onUpdateSeatRange={updateSeatRange}
              onRemoveSeatRange={removeSeatRange}
              onDateConfigTypeChange={setDateConfigType}
              onTempDateChange={setTempDate}
              onAddSelectedDate={addSelectedDate}
              onRemoveSelectedDate={removeSelectedDate}
              onDateRangeChange={handleDateRangeChange}
              onMonthlyDayChange={setMonthlyDay}
              onCategoryChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value || "" }))
              }
              onTagsChange={handleInputChange}
              onFeaturedChange={handleInputChange}
            />
          )}
        </>
      );
    }

    return null;
  };

  return (
    <Modal opened={isOpen} onClose={onClose} size="lg">
      <div className="flex flex-col h-[80vh]">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-2">
          {renderStepContent()}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Fixed Footer Buttons */}
        {currentStep >= 1 && (
          <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t border-gray-200 bg-white">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 cursor-pointer text-gray-600 hover:text-gray-900 transition-colors"
            >
              Back
            </button>
            <div className="flex space-x-3">
              {currentStep === 1 ? (
                <Button
                  text="Next Step"
                  onClick={handleNext}
                  className={`cursor-pointer px-6 py-3 text-white rounded-lg transition-colors ${
                    eventType === "experience"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                />
              ) : (
                <Button
                  text={
                    eventType === "experience"
                      ? "Update Experience"
                      : "Update Event"
                  }
                  loading={loading || uploading}
                  disabled={loading || uploading}
                  onClick={handleSubmit}
                  className={`cursor-pointer px-6 py-3 text-white rounded-lg transition-colors ${
                    eventType === "experience"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EditEventModal;
