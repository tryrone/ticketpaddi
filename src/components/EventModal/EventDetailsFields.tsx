import React from "react";
import { IconUsers, IconTag } from "@tabler/icons-react";
import { FormField } from "./FormField";
import { Select } from "@mantine/core";

interface EventDetailsFieldsProps {
  formData: {
    maxAttendees: string;
    category: string;
    tags: string;
    featured: boolean;
    isTemplate: boolean;
  };
  errors: Record<string, string>;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

const CATEGORIES = [
  "Technology",
  "Marketing",
  "Finance",
  "Education",
  "Health",
  "Sports",
  "Entertainment",
  "Other",
];

export const EventDetailsFields: React.FC<EventDetailsFieldsProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  return (
    <>
      <FormField
        label="Event category"
        icon={<IconTag size={16} />}
        error={errors.category}
      >
        <Select
          name="category"
          placeholder="Select a category"
          value={formData.category}
          onChange={(value) =>
            onInputChange({
              target: { name: "category", value: value || "" },
            } as React.ChangeEvent<
              HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >)
          }
          data={CATEGORIES}
          styles={{
            input: {
              height: 48,
              marginBottom: 14,
            },
          }}
        />
      </FormField>

      <FormField
        label="Maximum attendees"
        icon={<IconUsers size={16} />}
        error={errors.maxAttendees}
      >
        <input
          type="number"
          name="maxAttendees"
          value={formData.maxAttendees}
          onChange={onInputChange}
          placeholder="100"
          min="1"
          className={`w-full px-4 py-3 border outline-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.maxAttendees ? "border-red-500" : "border-gray-300"
          }`}
        />
      </FormField>

      <FormField label="Event tags">
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={onInputChange}
          placeholder="Enter tags separated by commas (e.g., networking, tech, startup)"
          className="w-full px-4 py-3 outline-0 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">
          Separate multiple tags with commas
        </p>
      </FormField>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={onInputChange}
            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-900">
            Feature this event (show in featured section)
          </span>
        </label>
      </div>

      <div className="mb-8">
        <label className="flex items-start">
          <input
            type="checkbox"
            name="isTemplate"
            checked={formData.isTemplate}
            onChange={onInputChange}
            className="mr-3 mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <div>
            <span className="text-sm font-medium text-gray-900 block">
              Make this a booking template
            </span>
            <span className="text-xs text-gray-500">
              Customers can book this event on multiple available dates. Perfect
              for recurring services or bookings.
            </span>
          </div>
        </label>
      </div>
    </>
  );
};
