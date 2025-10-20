"use client";

import React, { useState, useMemo } from "react";
import { useEvents } from "@/hooks/useFirestore";
import { Event } from "@/types/company";
import BookingModal from "@/components/BookingModal";
import {
  IconCalendar,
  IconClock,
  IconMapPin,
  IconCurrencyDollar,
  IconSearch,
  IconFilter,
  IconUsers,
  IconTag,
} from "@tabler/icons-react";
import Image from "next/image";

export default function EventsPage() {
  const { events, loading, error } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showTemplatesOnly, setShowTemplatesOnly] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(events.map((e) => e.category));
    return Array.from(cats);
  }, [events]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Search filter
      const matchesSearch =
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "all" || event.category === selectedCategory;

      // Template filter
      const matchesTemplate = !showTemplatesOnly || event.isTemplate;

      return matchesSearch && matchesCategory && matchesTemplate;
    });
  }, [events, searchTerm, selectedCategory, showTemplatesOnly]);

  const handleBookEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setSelectedEvent(null);
    alert(
      "Booking submitted successfully! You'll receive a confirmation email shortly."
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error loading events</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">Discover Amazing Events</h1>
          <p className="text-xl text-blue-100">
            Book tickets for concerts, workshops, experiences and more
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <IconSearch
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search events, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <IconFilter size={20} className="text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Template Filter */}
            <label className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={showTemplatesOnly}
                onChange={(e) => setShowTemplatesOnly(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Bookable Events Only
              </span>
            </label>
          </div>

          {/* Results Count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredEvents.length} of {events.length} events
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <IconCalendar size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title || "Event Image"}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {event.isTemplate && (
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      📅 Book Your Date
                    </div>
                  )}
                  {event.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      ⭐ Featured
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="p-5">
                  {/* Category Badge */}
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <IconTag size={12} className="mr-1" />
                      {event.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Event Info */}
                  <div className="space-y-2 mb-4">
                    {!event.isTemplate && (
                      <>
                        <div className="flex items-center text-sm text-gray-600">
                          <IconCalendar
                            size={16}
                            className="mr-2 text-blue-600"
                          />
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <IconClock
                            size={16}
                            className="mr-2 text-purple-600"
                          />
                          {event.time}
                        </div>
                      </>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <IconMapPin size={16} className="mr-2 text-red-600" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <IconUsers size={16} className="mr-2 text-green-600" />
                        {event.maxAttendees - event.attendees} spots left
                      </div>
                      <div className="flex items-center text-lg font-bold text-gray-900">
                        <IconCurrencyDollar
                          size={20}
                          className="text-green-600"
                        />
                        {event.currency} {event.price}
                      </div>
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="pt-3 border-t border-gray-200 mb-4">
                    <p className="text-xs text-gray-500">Organized by</p>
                    <p className="text-sm font-medium text-gray-900">
                      {event.companyName}
                    </p>
                  </div>

                  {/* Action Button */}
                  {event.isTemplate ? (
                    <button
                      onClick={() => handleBookEvent(event)}
                      className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <IconCalendar size={18} className="mr-2" />
                      Book Now
                    </button>
                  ) : (
                    <button className="w-full py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                      Buy Tickets
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedEvent && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
