"use client";

import React from "react";
import Link from "next/link";
import { IconCalendar, IconTicket, IconArrowRight } from "@tabler/icons-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <IconTicket size={64} className="text-blue-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Ticket<span className="text-blue-600">Paddi</span>
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Discover, Book, and Experience Amazing Events
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/events"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <IconCalendar size={24} className="mr-2" />
              Browse Events
              <IconArrowRight size={20} className="ml-2" />
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center px-8 py-[14px] bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl border-2 border-blue-600"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <IconCalendar size={24} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Book Events
            </h3>
            <p className="text-gray-600">
              Choose from a wide variety of events and book your preferred date
              instantly.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <IconTicket size={24} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Manage Bookings
            </h3>
            <p className="text-gray-600">
              Track all your bookings in one place with our intuitive calendar
              view.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Stay Connected
            </h3>
            <p className="text-gray-600">
              Chat directly with event organizers through our built-in messaging
              system.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TicketPaddi</h3>
              <p className="text-gray-400 text-sm">
                Your one-stop platform for discovering and booking amazing
                events.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/events"
                    className="text-gray-400 hover:text-white"
                  >
                    Browse Events
                  </Link>
                </li>
                <li>
                  <Link href="/auth" className="text-gray-400 hover:text-white">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white">
                    Home
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400 text-sm">
                Questions? Reach out to us!
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 TicketPaddi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
