import React from "react";
import { IconCalendar, IconUsers, IconTag } from "@tabler/icons-react";
import { Select } from "@mantine/core";
import { FormField } from "./FormField";
import { SeatRange } from "@/types/company";
import CalenderPicker from "../CalenderPicker";

interface ExperienceDetailsFieldsProps {
  seatRanges: SeatRange[];
  dateConfigType: "selected" | "range" | "monthly";
  selectedDates: string[];
  dateRange: { startDate: string | null; endDate: string | null };
  monthlyDay: string | null;
  tempDate: string | null;
  category: string;
  tags: string;
  featured: boolean;
  errors: Record<string, string>;
  onAddSeatRange: () => void;
  onUpdateSeatRange: (id: string, field: "min" | "max", value: number) => void;
  onRemoveSeatRange: (id: string) => void;
  onDateConfigTypeChange: (value: "selected" | "range" | "monthly") => void;
  onTempDateChange: (value: string | null) => void;
  onAddSelectedDate: () => void;
  onRemoveSelectedDate: (date: string) => void;
  onDateRangeChange: (
    field: "startDate" | "endDate",
    value: string | null
  ) => void;
  onMonthlyDayChange: (value: string | null) => void;
  onCategoryChange: (value: string | null) => void;
  onTagsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFeaturedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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

export const ExperienceDetailsFields: React.FC<
  ExperienceDetailsFieldsProps
> = ({
  seatRanges,
  dateConfigType,
  selectedDates,
  dateRange,
  monthlyDay,
  tempDate,
  category,
  tags,
  featured,
  errors,
  onAddSeatRange,
  onUpdateSeatRange,
  onRemoveSeatRange,
  onDateConfigTypeChange,
  onTempDateChange,
  onAddSelectedDate,
  onRemoveSelectedDate,
  onDateRangeChange,
  onMonthlyDayChange,
  onCategoryChange,
  onTagsChange,
  onFeaturedChange,
}) => {
  return (
    <>
      {/* Seat Ranges */}
      <FormField
        label="Seat ranges"
        icon={<IconUsers size={16} />}
        error={errors.seatRanges}
      >
        <div className="space-y-3 mb-3">
          {seatRanges.map((range) => (
            <div key={range.id} className="flex items-center gap-3">
              <input
                type="number"
                value={range.min || ""}
                onChange={(e) =>
                  onUpdateSeatRange(
                    range.id,
                    "min",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Min"
                min="0"
                className="flex-1 px-4 py-3 border border-gray-300 outline-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                value={range.max || ""}
                onChange={(e) =>
                  onUpdateSeatRange(
                    range.id,
                    "max",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Max"
                min="0"
                className="flex-1 px-4 py-3 border border-gray-300 outline-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => onRemoveSeatRange(range.id)}
                className="px-4 py-3 outline-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onAddSeatRange}
          className="w-full px-4 py-3 outline-0 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors"
        >
          + Add seat range
        </button>

        <p className="text-sm text-gray-500 mt-2">
          Add different seat capacity ranges (e.g., 15-20, 20-30)
        </p>
      </FormField>

      {/* Date Configuration */}
      <FormField
        label="Date availability"
        icon={<IconCalendar size={16} />}
        error={errors.dateConfig}
      >
        <Select
          name="dateConfigType"
          value={dateConfigType}
          onChange={(value) =>
            onDateConfigTypeChange(value as "selected" | "range" | "monthly")
          }
          styles={{
            input: {
              height: 48,
              marginBottom: 14,
            },
          }}
          data={[
            { value: "selected", label: "Specific dates" },
            { value: "range", label: "Date range" },
            { value: "monthly", label: "Monthly recurrence" },
          ]}
        />

        {dateConfigType === "selected" && (
          <div>
            <div className="flex gap-3 mb-3">
              <CalenderPicker value={tempDate} onChange={onTempDateChange} />

              <button
                type="button"
                onClick={onAddSelectedDate}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {selectedDates.map((date) => (
                <div
                  key={date}
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
                >
                  <span className="text-gray-900">{date}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveSelectedDate(date)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {dateConfigType === "range" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start date
              </label>
              <CalenderPicker
                value={dateRange.startDate}
                onChange={(value) => onDateRangeChange("startDate", value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End date
              </label>
              <CalenderPicker
                value={dateRange.endDate}
                onChange={(value) => onDateRangeChange("endDate", value)}
              />
            </div>
          </div>
        )}

        {dateConfigType === "monthly" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Day of month (1-31)
            </label>
            <input
              type="number"
              value={monthlyDay || ""}
              onChange={(e) => onMonthlyDayChange(e.target.value)}
              placeholder="e.g., 15 for the 15th of every month"
              min="1"
              max="31"
              className="w-full outline-0 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-2">
              This experience will be available on this day every month
            </p>
          </div>
        )}
      </FormField>

      {/* Category */}
      <FormField
        label="Experience category"
        icon={<IconTag size={16} />}
        error={errors.category}
      >
        <Select
          name="category"
          placeholder="Select a category"
          value={category}
          onChange={(value) => onCategoryChange(value)}
          data={CATEGORIES}
          styles={{
            input: {
              height: 48,
              marginBottom: 14,
            },
          }}
        />
      </FormField>

      {/* Tags */}
      <FormField label="Experience tags">
        <input
          type="text"
          name="tags"
          value={tags}
          onChange={onTagsChange}
          placeholder="Enter tags separated by commas (e.g., adventure, outdoor, group)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">
          Separate multiple tags with commas
        </p>
      </FormField>

      {/* Featured */}
      <div className="mb-8">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="featured"
            checked={featured}
            onChange={onFeaturedChange}
            className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-900">
            Feature this experience (show in featured section)
          </span>
        </label>
      </div>
    </>
  );
};
