"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconCalendar, IconTicket } from "@tabler/icons-react";

export default function EventsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center">
              <IconTicket size={32} className="text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">
                Ticket<span className="text-blue-600">Paddi</span>
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                <IconHome size={18} className="mr-2" />
                Home
              </Link>
              <Link
                href="/auth"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Link
                href="/auth"
                className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg"
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex justify-around py-2">
            <Link
              href="/events"
              className={`flex flex-col items-center px-3 py-2 text-xs ${
                pathname === "/events" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <IconCalendar size={20} className="mb-1" />
              Events
            </Link>
            <Link
              href="/"
              className="flex flex-col items-center px-3 py-2 text-xs text-gray-600"
            >
              <IconHome size={20} className="mb-1" />
              Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

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
