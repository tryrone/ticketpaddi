"use client";

import React, { useState } from "react";
import { Modal } from "@mantine/core";
import { useCreateEvent } from "@/hooks/useFirestore";
import { Event, SeatRange, DateConfiguration, Company } from "@/types/company";
import { useImageUpload } from "@/hooks/useImageUpload";
import { checkExperienceDateConflicts } from "@/lib/firestore";
import Button from "../Button";
import { TypeSelectionStep } from "./TypeSelectionStep";
import { BasicInfoFields } from "./BasicInfoFields";
import { EventDetailsFields } from "./EventDetailsFields";
import { ExperienceDetailsFields } from "./ExperienceDetailsFields";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (event: Event) => void;
  company?: Company;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  company,
}) => {
  const { create, loading, error } = useCreateEvent();
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

  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    if (!validateForm()) {
      return;
    }

    try {
      // Check for date conflicts if creating an experience
      if (eventType === "experience" && company?.id) {
        const datesToCheck = getDatesFromConfiguration();
        const conflictCheck = await checkExperienceDateConflicts(
          company.id,
          datesToCheck
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

      let imageUrl = "";
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
        image:
          imageUrl ||
          "https://images.unsplash.com/photo-1511184059754-e4b5bbbcef75?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        location: formData.location,
        price: parseFloat(formData.price),
        currency: formData.currency,
        category: formData.category,
        companyId: company?.id || "",
        companyName: company?.name || "",
        attendees: 0,
        status: "upcoming" as const,
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
          isTemplate: true,
        };
      }

      const eventId = await create(eventData);

      const newEvent: Event = {
        id: eventId,
        ...eventData,
      };

      onSuccess?.(newEvent);
      onClose();

      // Reset form
      setFormData({
        title: "",
        description: "",
        image: null,
        date: "",
        time: "",
        location: "",
        price: "",
        currency: "USD",
        category: "",
        maxAttendees: "",
        tags: "",
        featured: false,
        isTemplate: false,
      });
      setEventType(null);
      setSeatRanges([]);
      setSelectedDates([]);
      setDateRange({ startDate: "", endDate: "" });
      setMonthlyDay("");
      setCurrentStep(0);
      setErrors({});
    } catch (err) {
      console.error("Failed to create event:", err);
    }
  };

  // Navigation handlers
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onClose();
    }
  };

  const handleNext = () => {
    if (currentStep === 0 && eventType) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handleTypeSelection = (type: "event" | "experience") => {
    setEventType(type);
    setCurrentStep(1);
  };

  // Render step content
  const renderStepContent = () => {
    // Step 0: Type Selection
    if (currentStep === 0) {
      return (
        <TypeSelectionStep
          company={company}
          onSelectType={handleTypeSelection}
        />
      );
    }

    // Step 1: Basic Info
    if (currentStep === 1 && eventType) {
      const title =
        eventType === "event" ? "Create your event" : "Create your experience";
      const subtitle = company
        ? `Creating ${eventType} for ${company.name}`
        : `Tell us about your ${eventType}`;

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
          ? "Add more information about your event"
          : "Configure seat ranges and availability";

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
      {renderStepContent()}

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Footer Buttons */}
      {currentStep > 0 && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
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
                    ? "Create Experience"
                    : "Create Event"
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
    </Modal>
  );
};

export default EventModal;
