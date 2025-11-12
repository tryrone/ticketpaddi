"use client";

import React, { useState } from "react";
import { Modal } from "@mantine/core";
import { Event } from "@/types/company";
import {
  updateEventDateAvailability,
  toggleCompanyDateBlock,
} from "@/lib/firestore";
import {
  IconCalendar,
  IconLoader,
  IconBan,
  IconPlus,
} from "@tabler/icons-react";
import Image from "next/image";

interface DateActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  experiencesOnDate: Event[];
  allExperiences: Event[];
  companyId: string;
  companyBlockedDates?: string[]; // Globally blocked dates for the company
  onUpdate: () => void; // Callback to refresh data
}

const DateActionModal: React.FC<DateActionModalProps> = ({
  isOpen,
  onClose,
  date,
  experiencesOnDate,
  allExperiences,
  companyId,
  companyBlockedDates = [],
  onUpdate,
}) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [blockingDate, setBlockingDate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDateGloballyBlocked = companyBlockedDates.includes(date);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleToggleGlobalBlock = async () => {
    if (!companyId) return;

    setBlockingDate(true);
    setError(null);

    try {
      await toggleCompanyDateBlock({
        companyId,
        date,
        block: !isDateGloballyBlocked,
      });

      onUpdate();
      // Don't close modal, just update the state
    } catch (err) {
      console.error("Failed to toggle date block:", err);
      setError("Failed to block/unblock date. Please try again.");
    } finally {
      setBlockingDate(false);
    }
  };

  const handleAssignExperience = async (experience: Event) => {
    if (!companyId || !experience.id) return;

    setLoading(experience.id);
    setError(null);

    try {
      // Update dateAvailability to "available"
      await updateEventDateAvailability({
        companyId,
        eventId: experience.id,
        date,
        status: "available",
      });

      // Also add to availableDates or dateConfiguration if needed
      const updates: Partial<Event> = {};

      if (experience.dateConfiguration?.type === "selected") {
        // Add to existing selected dates
        const selectedDates = experience.dateConfiguration.selectedDates || [];
        if (!selectedDates.includes(date)) {
          updates.dateConfiguration = {
            ...experience.dateConfiguration,
            selectedDates: [...selectedDates, date],
          };
        }
      } else if (experience.dateConfiguration?.type === "range") {
        // Convert range to selected dates, preserving all dates in the range
        const config = experience.dateConfiguration;
        const existingDates: string[] = [];

        if (config.startDate && config.endDate) {
          const start = new Date(config.startDate);
          const end = new Date(config.endDate);
          const current = new Date(start);

          while (current <= end) {
            existingDates.push(current.toISOString().split("T")[0]);
            current.setDate(current.getDate() + 1);
          }
        }

        // Add the new date if not already included
        if (!existingDates.includes(date)) {
          existingDates.push(date);
        }

        updates.dateConfiguration = {
          type: "selected",
          selectedDates: existingDates,
        };
      } else if (experience.dateConfiguration?.type === "monthly") {
        // Convert monthly to selected dates, preserving all monthly dates
        const config = experience.dateConfiguration;
        const existingDates: string[] = [];

        if (config.monthlyDay) {
          const today = new Date();
          for (let i = 0; i < 12; i++) {
            const monthlyDate = new Date(
              today.getFullYear(),
              today.getMonth() + i,
              config.monthlyDay
            );
            existingDates.push(monthlyDate.toISOString().split("T")[0]);
          }
        }

        // Add the new date if not already included
        if (!existingDates.includes(date)) {
          existingDates.push(date);
        }

        updates.dateConfiguration = {
          type: "selected",
          selectedDates: existingDates,
        };
      } else if (experience.availableDates) {
        // Add to existing availableDates array
        const availableDates = experience.availableDates;
        if (!availableDates.includes(date)) {
          updates.availableDates = [...availableDates, date];
        }
      } else {
        // If no date configuration exists, create one
        updates.dateConfiguration = {
          type: "selected",
          selectedDates: [date],
        };
      }

      // Apply additional updates if any
      if (Object.keys(updates).length > 0) {
        const { updateEvent } = await import("@/lib/firestore");
        await updateEvent(experience.id, updates);
      }

      onUpdate();
      onClose();
    } catch (err) {
      console.error("Failed to assign experience:", err);
      setError("Failed to assign experience. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // For free dates, show all experiences that aren't already assigned
  const experiencesForFreeDate = allExperiences.filter(
    (exp) => !experiencesOnDate.some((e) => e.id === exp.id)
  );

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center space-x-2">
          <IconCalendar size={20} className="text-blue-600" />
          <span>Manage Date: {formatDate(date)}</span>
        </div>
      }
    >
      <div className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Show message if no content at all */}
        {experiencesOnDate.length === 0 &&
          experiencesForFreeDate.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <IconCalendar size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium text-gray-600 mb-1">
                No experiences available
              </p>
              <p className="text-xs text-gray-500">
                Create an experience first to manage dates
              </p>
            </div>
          )}

        {/* Experiences on this date */}
        {experiencesOnDate.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Experiences on this date
              </h3>
              <button
                onClick={handleToggleGlobalBlock}
                disabled={blockingDate}
                className={`px-4 py-2 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${
                  isDateGloballyBlocked
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {blockingDate ? (
                  <>
                    <IconLoader size={16} className="animate-spin" />
                    <span>
                      {isDateGloballyBlocked ? "Unblocking..." : "Blocking..."}
                    </span>
                  </>
                ) : (
                  <>
                    <IconBan size={16} />
                    <span>
                      {isDateGloballyBlocked ? "Unblock Date" : "Block Date"}
                    </span>
                  </>
                )}
              </button>
            </div>
            {isDateGloballyBlocked && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 flex items-center">
                  <IconBan size={16} className="mr-2" />
                  This date is globally blocked for all experiences
                </p>
              </div>
            )}
            <div className="space-y-2">
              {experiencesOnDate.map((experience) => {
                const isLoading = loading === experience.id;

                return (
                  <div
                    key={experience.id}
                    className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                  >
                    <div className="flex items-start space-x-3">
                      <Image
                        src={experience.image}
                        alt={experience.title || ""}
                        width={60}
                        height={60}
                        className="w-15 h-15 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {experience.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {experience.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Manage free date - assign or block */}
        {experiencesOnDate.length === 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Manage this date
              </h3>
              <button
                onClick={handleToggleGlobalBlock}
                disabled={blockingDate}
                className={`px-4 py-2 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${
                  isDateGloballyBlocked
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {blockingDate ? (
                  <>
                    <IconLoader size={16} className="animate-spin" />
                    <span>
                      {isDateGloballyBlocked ? "Unblocking..." : "Blocking..."}
                    </span>
                  </>
                ) : (
                  <>
                    <IconBan size={16} />
                    <span>
                      {isDateGloballyBlocked ? "Unblock Date" : "Block Date"}
                    </span>
                  </>
                )}
              </button>
            </div>
            {isDateGloballyBlocked && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 flex items-center">
                  <IconBan size={16} className="mr-2" />
                  This date is globally blocked for all experiences
                </p>
              </div>
            )}
            <p className="text-sm text-gray-600 mb-4">
              Assign an experience to this date
            </p>
            {experiencesForFreeDate.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <IconCalendar size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium text-gray-600 mb-1">
                  No experiences available
                </p>
                <p className="text-xs text-gray-500">
                  Create an experience first to manage dates
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {experiencesForFreeDate.map((experience) => {
                  const isLoading = loading === experience.id;

                  return (
                    <div
                      key={experience.id}
                      className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <Image
                          src={experience.image}
                          alt={experience.title || ""}
                          width={60}
                          height={60}
                          className="w-15 h-15 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {experience.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {experience.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleAssignExperience(experience)}
                          disabled={isLoading || isDateGloballyBlocked}
                          className="flex-shrink-0 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                        >
                          {isLoading ? (
                            <>
                              <IconLoader size={14} className="animate-spin" />
                              <span>Assigning...</span>
                            </>
                          ) : (
                            <>
                              <IconPlus size={14} />
                              <span>Assign</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Show available experiences even when there are experiences on date */}
        {experiencesOnDate.length > 0 && experiencesForFreeDate.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Also assign another experience
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {experiencesForFreeDate.slice(0, 5).map((experience) => {
                const isLoading = loading === experience.id;

                return (
                  <div
                    key={experience.id}
                    className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <Image
                        src={experience.image}
                        alt={experience.title || ""}
                        width={60}
                        height={60}
                        className="w-15 h-15 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {experience.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {experience.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAssignExperience(experience)}
                        disabled={isLoading || isDateGloballyBlocked}
                        className="flex-shrink-0 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                      >
                        {isLoading ? (
                          <>
                            <IconLoader size={14} className="animate-spin" />
                            <span>Assigning...</span>
                          </>
                        ) : (
                          <>
                            <IconPlus size={14} />
                            <span>Assign</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DateActionModal;
