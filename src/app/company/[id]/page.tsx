"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  IconSearch,
  IconFilter,
  IconArrowLeft,
  IconMapPin,
  IconCalendar,
  IconUsers,
  IconBuilding,
  IconHeart,
  IconSortAscending,
  IconPlus,
} from "@tabler/icons-react";
import EventCard from "@/components/EventCard";
import { Event } from "@/types/event";
import { Company } from "@/types/company";
import { useCompany, useEventsByCompany } from "@/hooks/useFirestore";
import { Select } from "@mantine/core";

const CompanyDetailPage: React.FC = () => {
  const params = useParams();
  const companyId = params.id as string;

  // Use Firestore hooks
  const {
    company,
    loading: companyLoading,
    error: companyError,
  } = useCompany(companyId);
  const {
    events,
    loading: eventsLoading,
    error: eventsError,
  } = useEventsByCompany(companyId);

  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState("all");
  const [category, setCategory] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  // Update filtered events when events change
  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  useEffect(() => {
    let filtered = [...events];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price range filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((event) => {
        if (max) {
          return event.price >= min && event.price <= max;
        } else {
          return event.price >= min;
        }
      });
    }

    // Category filter
    if (category !== "all") {
      filtered = filtered.filter(
        (event) => event.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "date":
        filtered.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Keep original order
        break;
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, priceRange, category, sortBy]);

  const handleFavorite = (event: Event) => {
    setFavorites((prev) => {
      if (prev.includes(event.id)) {
        return prev.filter((id) => id !== event.id);
      } else {
        return [...prev, event.id];
      }
    });
  };

  const handleViewEvent = (event: Event) => {
    // Navigate to event detail page
    console.log("Viewing event:", event.title);
  };

  // Loading state
  if (companyLoading || eventsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading company details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (companyError || eventsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <IconBuilding size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">{companyError || eventsError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Company not found
  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <IconBuilding size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Company Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The company you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button */}
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <IconArrowLeft size={20} className="mr-2" />
              Back to Companies
            </button>

            {/* Search */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <IconSearch
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Button */}
            <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <IconFilter size={20} className="mr-2" />
              Filter
            </button>
          </div>
        </div>
      </header>

      {/* Company Info Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <IconBuilding size={32} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {company.name}
              </h1>
              <div className="flex items-center space-x-6 mt-2 text-gray-600">
                <div className="flex items-center">
                  <IconMapPin size={16} className="mr-1" />
                  <span>{company.location}</span>
                </div>
                <div className="flex items-center">
                  <IconCalendar size={16} className="mr-1" />
                  <span>{company.numberOfEvents} Events</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <IconPlus size={16} className="mr-2" />
              Add Event
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Price Range Filter */}

            <Select
              placeholder="Filter by status"
              data={[
                { value: "all", label: "All Categories" },
                { value: "0-50", label: "$0 - $50" },
                { value: "50-100", label: "$50 - $100" },
                { value: "100-200", label: "$100 - $200" },
                { value: "200-500", label: "$200 - $500" },
                { value: "500", label: "$500+" },
              ]}
              value={priceRange}
              onChange={(value) => setPriceRange(value || "all")}
              style={{ width: 200 }}
              styles={{
                input: {
                  height: 43,
                },
              }}
            />

            {/* Category Filter */}

            <Select
              placeholder="Filter by category"
              data={[
                { value: "all", label: "All Categories" },
                { value: "Marketing", label: "Marketing" },
                { value: "Technology", label: "Technology" },
                { value: "Finance", label: "Finance" },
                { value: "Education", label: "Education" },
                { value: "Health", label: "Health" },
                { value: "Sports", label: "Sports" },
                { value: "Other", label: "Other" },
              ]}
              value={category}
              onChange={(value) => setCategory(value || "all")}
              style={{ width: 200 }}
              styles={{
                input: {
                  height: 43,
                },
              }}
            />

            {/* Sort */}
            <div className="flex items-center ml-auto">
              <IconSortAscending size={20} className="mr-2 text-gray-400" />

              <Select
                placeholder="Filter by status"
                data={[
                  { value: "all", label: "All Sort By" },
                  { value: "price-low", label: "Price: Low to High" },
                  { value: "price-high", label: "Price: High to Low" },
                  { value: "date", label: "Date: Soonest" },
                  { value: "name", label: "Name: A to Z" },
                ]}
                value={sortBy}
                onChange={(value) => setSortBy(value || "all")}
                style={{ width: 200 }}
                styles={{
                  input: {
                    height: 43,
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Events by {company.name}
          </h2>
          <p className="text-gray-600 mt-1">
            We found {filteredEvents.length} event
            {filteredEvents.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onFavorite={handleFavorite}
                onView={handleViewEvent}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <IconCalendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600">
              {searchTerm || priceRange !== "all" || category !== "all"
                ? "Try adjusting your filters to see more events."
                : "This company hasn't created any events yet."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyDetailPage;
