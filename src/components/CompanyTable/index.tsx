"use client";

import React, { useState, useMemo } from "react";
import {
  IconDots,
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconChevronUp,
  IconChevronDown,
} from "@tabler/icons-react";
import { CompanyTableProps } from "@/types/company";
import { formatDate } from "@/utils/date";
import { ActionIcon, Loader, Menu, Select } from "@mantine/core";

const CompanyTable: React.FC<CompanyTableProps> = ({
  companies,
  onEdit,
  onDelete,
  onView,
  onAddCompany,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAndSortedCompanies = useMemo(() => {
    const filtered = companies.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company?.location?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || company.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "events":
          aValue = a.numberOfEvents;
          bValue = b.numberOfEvents;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortDirection === "asc") {
        return (aValue || "") < (bValue || "")
          ? -1
          : (aValue || "") > (bValue || "")
          ? 1
          : 0;
      } else {
        return (aValue || "") > (bValue || "")
          ? -1
          : (aValue || "") < (bValue || "")
          ? 1
          : 0;
      }
    });

    return filtered;
  }, [companies, searchTerm, statusFilter, sortBy, sortDirection]);

  const totalPages = Math.ceil(
    filteredAndSortedCompanies.length / itemsPerPage
  );
  const paginatedCompanies = filteredAndSortedCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "active":
  //       return "green";
  //     case "inactive":
  //       return "red";
  //     case "pending":
  //       return "yellow";
  //     default:
  //       return "gray";
  //   }
  // };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="bg-white shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">Companies</h2>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onAddCompany?.()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <IconPlus size={16} className="mr-2" />
              Create Company
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconSearch size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search companies, industry, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <Select
              placeholder="Filter by status"
              data={[
                { value: "all", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "pending", label: "Pending" },
              ]}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value || "all")}
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

      {/* Table */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-[500px] w-full">
          <Loader size="lg" />
          <p className="text-gray-500">Loading companies...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-1">
                    <span>Company</span>
                    {sortBy === "name" && (
                      <span className="text-gray-400">
                        {sortDirection === "asc" ? (
                          <IconChevronUp size={12} />
                        ) : (
                          <IconChevronDown size={12} />
                        )}
                      </span>
                    )}
                  </div>
                </th>

                <th
                  onClick={() => handleSort("status")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sortBy === "status" && (
                      <span className="text-gray-400">
                        {sortDirection === "asc" ? (
                          <IconChevronUp size={12} />
                        ) : (
                          <IconChevronDown size={12} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("events")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-1">
                    <span>Events</span>
                    {sortBy === "events" && (
                      <span className="text-gray-400">
                        {sortDirection === "asc" ? (
                          <IconChevronUp size={12} />
                        ) : (
                          <IconChevronDown size={12} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCompanies.map(
                (company) =>
                  company && (
                    <tr key={company.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-md bg-blue-500 flex items-center justify-center text-white font-medium">
                              {company.name.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {company.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {company.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            company.status === "active"
                              ? "bg-green-100 text-green-800"
                              : company.status === "inactive"
                              ? "bg-red-100 text-red-800"
                              : company.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {company?.status
                            ? company.status.charAt(0).toUpperCase() +
                              company.status.slice(1)
                            : "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {(company.numberOfEvents || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {company.location || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {company.lastEventDate
                          ? formatDate(company.lastEventDate)
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Menu shadow="md" width={200}>
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                              <IconDots size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconEye size={14} />}
                              onClick={() => onView?.(company)}
                            >
                              View Details
                            </Menu.Item>
                            {/* <Menu.Item
                              leftSection={<IconEdit size={14} />}
                              onClick={() => onEdit?.(company)}
                            >
                              Edit Company
                            </Menu.Item> */}
                            <Menu.Divider />
                            <Menu.Item
                              leftSection={<IconTrash size={14} />}
                              color="red"
                              onClick={() => onDelete?.(company)}
                            >
                              Delete Company
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedCompanies.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            No companies found matching your criteria
          </div>
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(
                currentPage * itemsPerPage,
                filteredAndSortedCompanies.length
              )}{" "}
              of {filteredAndSortedCompanies.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyTable;
