import React from "react";
import {
  IconUpload,
  IconDots,
  IconMapPin,
  IconHash,
  IconCalendar,
  IconClock,
} from "@tabler/icons-react";
import { Select } from "@mantine/core";
import { FormField } from "./FormField";
import CalenderPicker from "../CalenderPicker";

interface BasicInfoFieldsProps {
  formData: {
    title: string;
    description: string;
    image: File | null;
    location: string;
    price: string;
    currency: string;
    date?: string;
    time?: string;
  };
  errors: Record<string, string>;
  type: "event" | "experience";
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCurrencyChange: (value: string) => void;
}

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  formData,
  errors,
  type,
  onInputChange,
  onFileChange,
  onCurrencyChange,
}) => {
  const isExperience = type === "experience";
  const colorScheme = isExperience ? "purple" : "blue";
  const label = isExperience ? "experience" : "event";

  return (
    <>
      <FormField label={`${label} name`} error={errors.title}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onInputChange}
          placeholder={`Enter your ${label} name`}
          className={`w-full px-4 py-3 border outline-0 rounded-lg focus:ring-2 focus:ring-${colorScheme}-500 focus:border-transparent ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
      </FormField>

      <FormField label={`${label} description`} error={errors.description}>
        <textarea
          name="description"
          value={formData.description}
          onChange={onInputChange}
          placeholder={`Describe your ${label}`}
          rows={4}
          className={`w-full px-4 py-3 border outline-0 rounded-lg focus:ring-2 focus:ring-${colorScheme}-500 focus:border-transparent resize-none ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
      </FormField>

      <FormField label={`Upload ${label} image`}>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
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
                      onInputChange({
                        target: { name: "image", value: null },
                      } as AnyType);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <IconDots size={20} />
                  </button>
                </div>
              ) : (
                <span className="text-gray-500">
                  Click to upload your {label} image
                </span>
              )}
            </div>
          </div>
        </div>
      </FormField>

      {isExperience === false && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FormField
            label="Event date"
            icon={<IconCalendar size={16} />}
            error={errors.date}
          >
            <CalenderPicker
              value={formData.date}
              onChange={(value) =>
                onInputChange({
                  target: { name: "date", value: value || "" },
                } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)
              }
            />
          </FormField>

          <FormField
            label="Event time"
            icon={<IconClock size={16} />}
            error={errors.time}
          >
            <input
              type="time"
              name="time"
              value={formData.time || ""}
              onChange={onInputChange}
              className={`w-full px-4 py-3 outline-0 border rounded-lg focus:ring-2 focus:ring-${colorScheme}-500 focus:border-transparent ${
                errors.time ? "border-red-500" : "border-gray-300"
              }`}
            />
          </FormField>
        </div>
      )}

      <FormField
        label={`${label} location`}
        icon={<IconMapPin size={16} />}
        error={errors.location}
      >
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={onInputChange}
          placeholder={`Enter ${label} location`}
          className={`w-full px-4 py-3 outline-0 border rounded-lg focus:ring-2 focus:ring-${colorScheme}-500 focus:border-transparent ${
            errors.location ? "border-red-500" : "border-gray-300"
          }`}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-center">
        <FormField
          label={`${label} price`}
          icon={<IconHash size={16} />}
          error={errors.price}
        >
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={onInputChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            className={`w-full px-4 outline-0 py-3 border rounded-lg focus:ring-2 focus:ring-${colorScheme}-500 focus:border-transparent ${
              errors.price ? "border-red-500" : "border-gray-300"
            }`}
          />
        </FormField>

        <FormField label="Currency">
          <Select
            name="currency"
            value={formData.currency}
            onChange={(value) => onCurrencyChange(value || "NGN")}
            styles={{
              input: {
                height: 48,
                marginTop: 10,
              },
            }}
            data={[
              { value: "USD", label: "USD" },
              { value: "EUR", label: "EUR" },
              { value: "NGN", label: "NGN" },
            ]}
          />
        </FormField>
      </div>
    </>
  );
};
