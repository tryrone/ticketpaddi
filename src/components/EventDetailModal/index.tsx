"use client";

import React from "react";
import { Modal, Button, Badge, Divider } from "@mantine/core";
import {
  IconCalendar,
  IconClock,
  IconMapPin,
  IconCurrencyDollar,
  IconUsers,
  IconTag,
  IconStar,
  IconBuilding,
  IconX,
  IconHeart,
  IconShare,
  IconBookmark,
} from "@tabler/icons-react";
import { Event } from "@/types/company";
import Image from "next/image";

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onFavorite?: (event: Event) => void;
  onBook?: (event: Event) => void;
  onShare?: (event: Event) => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  onClose,
  event,
  onFavorite,
  onBook,
  onShare,
}) => {
  if (!event) return null;

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "blue";
      case "ongoing":
        return "green";
      case "completed":
        return "gray";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const getEventTypeColor = (eventType?: string) => {
    switch (eventType) {
      case "event":
        return "purple";
      case "experience":
        return "orange";
      default:
        return "blue";
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      size="xl"
      centered
      padding={0}
      withCloseButton={false}
    >
      <div className="relative flex flex-col h-[80vh]">
        {/* Header with Image */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <Image
            src={event.image}
            alt={event.title || "Event image"}
            width={800}
            height={320}
            className="w-full h-full object-cover"
            unoptimized={true}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
          >
            <IconX size={20} className="text-gray-700" />
          </button>

          {/* Action Buttons */}
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              onClick={() => onFavorite?.(event)}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
            >
              <IconHeart
                size={18}
                className="text-gray-700 hover:text-red-500 transition-colors cursor-pointer"
              />
            </button>
            <button
              onClick={() => onShare?.(event)}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
            >
              <IconShare
                size={18}
                className="text-gray-700 hover:text-blue-500 transition-colors cursor-pointer"
              />
            </button>
          </div>

          {/* Badges */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            {event.featured && (
              <Badge
                leftSection={<IconStar size={12} />}
                color="yellow"
                variant="filled"
                size="md"
              >
                Featured
              </Badge>
            )}
            {/* <Badge
              color={getStatusColor(event.status)}
              variant="filled"
              size="md"
            >
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </Badge>
            {event.eventType && (
              <Badge
                color={getEventTypeColor(event.eventType)}
                variant="filled"
                size="md"
              >
                {event.eventType.charAt(0).toUpperCase() +
                  event.eventType.slice(1)}
              </Badge>
            )} */}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Title and Price */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {event.title}
              </h1>
              <div className="flex items-center text-gray-600 mb-2">
                <IconBuilding size={16} className="mr-2" />
                <span className="font-medium">{event.companyName}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {formatPrice(event.price, event.currency)}
              </div>
              <div className="text-sm text-gray-500">per person</div>
            </div>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Date & Time */}
            <div className="space-y-4">
              <div className="flex items-center">
                <IconCalendar size={20} className="text-gray-500 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Date</div>
                  <div className="text-gray-600">{formatDate(event.date)}</div>
                </div>
              </div>

              <div className="flex items-center">
                <IconClock size={20} className="text-gray-500 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Time</div>
                  <div className="text-gray-600">{event.time}</div>
                </div>
              </div>
            </div>

            {/* Location & Capacity */}
            <div className="space-y-4">
              <div className="flex items-center">
                <IconMapPin size={20} className="text-gray-500 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Location</div>
                  <div className="text-gray-600">{event.location}</div>
                </div>
              </div>

              <div className="flex items-center">
                <IconUsers size={20} className="text-gray-500 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Capacity</div>
                  <div className="text-gray-600">
                    {event.attendees.toLocaleString()} /{" "}
                    {event.maxAttendees.toLocaleString()} attendees
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                About this event
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {/* Category and Tags */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <IconTag size={18} className="text-gray-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Category & Tags
              </h3>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge color="blue" variant="light" size="lg">
                {event.category}
              </Badge>
            </div>

            {event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <Badge key={index} color="gray" variant="outline" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Experience-specific details */}
          {event.eventType === "experience" && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Experience Details
              </h3>

              {event.seatRanges && event.seatRanges.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Seat Ranges
                  </h4>
                  <div className="space-y-2">
                    {event.seatRanges.map((range, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-gray-700">
                          {range.min} - {range.max} seats
                        </span>
                        <Badge color="green" variant="light">
                          Available
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {event.availableDates && event.availableDates.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Available Dates
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {event.availableDates.slice(0, 5).map((date, index) => (
                      <Badge
                        key={index}
                        color="blue"
                        variant="outline"
                        size="sm"
                      >
                        {new Date(date).toLocaleDateString()}
                      </Badge>
                    ))}
                    {event.availableDates.length > 5 && (
                      <Badge color="gray" variant="outline" size="sm">
                        +{event.availableDates.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Floating Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => onBook?.(event)}
              disabled={
                event.status === "cancelled" || event.status === "completed"
              }
            >
              {event.status === "cancelled"
                ? "Event Cancelled"
                : event.status === "completed"
                ? "Event Completed"
                : "Book Now"}
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={() => onFavorite?.(event)}
            >
              <IconHeart size={18} className="mr-2" />
              Add to Favorites
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EventDetailModal;
