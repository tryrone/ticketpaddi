"use client";

import React, { useState } from "react";
import {
  IconX,
  IconArrowLeft,
  IconUpload,
  IconDots,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconCurrencyDollar,
  IconUsers,
  IconTag,
} from "@tabler/icons-react";
import { useCreateEvent } from "@/hooks/useFirestore";
import { Event } from "@/types/event";
import { Company } from "@/types/company";
import { Modal } from "@mantine/core";

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

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null as File | null,
    date: "",
    time: "",
    location: "",
    price: "",
    currency: "USD",
    category: "",
    maxAttendees: "",
    tags: "",
    featured: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Event description is required";
    }

    if (!formData.date.trim()) {
      newErrors.date = "Event date is required";
    }

    if (!formData.time.trim()) {
      newErrors.time = "Event time is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Event location is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Event price is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Event category is required";
    }

    if (!formData.maxAttendees.trim()) {
      newErrors.maxAttendees = "Maximum attendees is required";
    }

    setErrors(newErrors);
    console.log(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Convert image to base64 if present
      let imageUrl = "";
      if (formData.image) {
        imageUrl = await convertFileToBase64(formData.image);
      }

      // Parse tags from comma-separated string
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const eventData = {
        title: formData.title,
        description: formData.description,
        image:
          imageUrl ||
          "https://images.unsplash.com/photo-1511184059754-e4b5bbbcef75?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        date: formData.date,
        time: formData.time,
        location: formData.location,
        price: parseFloat(formData.price),
        currency: formData.currency,
        category: formData.category,
        companyId: company?.id || "",
        companyName: company?.name || "",
        attendees: 0,
        maxAttendees: parseInt(formData.maxAttendees),
        status: "upcoming" as const,
        tags: tagsArray,
        featured: formData.featured,
      };

      const eventId = await create(eventData);

      // Create the full event object for the callback
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
      });
      setCurrentStep(1);
      setErrors({});
    } catch (err) {
      console.error("Failed to create event:", err);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onClose();
    }
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  return (
    <Modal opened={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="relative">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create your event
              </h2>
              <p className="text-gray-600">
                {company
                  ? `Creating event for ${company.name}`
                  : "Tell us about your event"}
              </p>
            </div>

            {/* Event Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Event title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter your event title"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Event Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Event description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your event"
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Upload Event Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Upload event image
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                    <IconUpload size={24} className="text-gray-600" />
                  </div>
                  <div className="flex-1">
                    {formData.image ? (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 font-medium">
                          {formData.image.name}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData((prev) => ({ ...prev, image: null }));
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <IconDots size={20} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">
                        Click to upload your event image
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <IconCalendar size={16} className="inline mr-2" />
                  Event date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.date ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <IconClock size={16} className="inline mr-2" />
                  Event time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.time ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                <IconMapPin size={16} className="inline mr-2" />
                Event location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter event location"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.location ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            {/* Price and Currency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <IconCurrencyDollar size={16} className="inline mr-2" />
                  Event price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Additional Details */}
        {currentStep === 2 && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Event details
              </h2>
              <p className="text-gray-600">
                Add more information about your event
              </p>
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                <IconTag size={16} className="inline mr-2" />
                Event category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a category</option>
                <option value="Technology">Technology</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Sports">Sports</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Max Attendees */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                <IconUsers size={16} className="inline mr-2" />
                Maximum attendees
              </label>
              <input
                type="number"
                name="maxAttendees"
                value={formData.maxAttendees}
                onChange={handleInputChange}
                placeholder="100"
                min="1"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.maxAttendees ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.maxAttendees && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.maxAttendees}
                </p>
              )}
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Event tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Enter tags separated by commas (e.g., networking, tech, startup)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate multiple tags with commas
              </p>
            </div>

            {/* Featured Event */}
            <div className="mb-8">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-900">
                  Feature this event (show in featured section)
                </span>
              </label>
            </div>
          </>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Footer Buttons */}
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
              <button
                type="button"
                onClick={handleNext}
                className="cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Event"}
              </button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EventModal;
