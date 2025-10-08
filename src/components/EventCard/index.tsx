"use client";

import React from "react";
import {
  IconHeart,
  IconCalendar,
  IconMapPin,
  IconUsers,
  IconClock,
} from "@tabler/icons-react";
import { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
  onFavorite?: (event: Event) => void;
  onView?: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onFavorite, onView }) => {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100"
      onClick={() => onView?.(event)}
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite?.(event);
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
        >
          <IconHeart
            size={16}
            className="text-gray-600 hover:text-red-500 transition-colors"
          />
        </button>

        {/* Featured Badge */}
        {event.featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Featured
            </span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute bottom-3 left-3">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
              event.status
            )}`}
          >
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-4">
        {/* Event Title and Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>
          <span className="text-lg font-bold text-blue-600 ml-2">
            {formatPrice(event.price, event.currency)}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <IconMapPin size={14} className="mr-1" />
          <span className="truncate">{event.location}</span>
        </div>

        {/* Date and Time */}
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <IconCalendar size={14} className="mr-1" />
          <span className="mr-4">{formatDate(event.date)}</span>
          <IconClock size={14} className="mr-1" />
          <span>{event.time}</span>
        </div>

        {/* Event Details */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <IconUsers size={14} className="mr-1" />
            <span>
              {event.attendees.toLocaleString()}/
              {event.maxAttendees.toLocaleString()}
            </span>
          </div>
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
            {event.category}
          </span>
        </div>

        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{event.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
