"use client";

import React from "react";
import {
  Table,
  Badge,
  Avatar,
  ActionIcon,
  Menu,
  Text,
  Group,
  Stack,
  Button,
  TextInput,
  Select,
  Flex,
  Title,
  Paper,
  Container,
  Pagination,
  Center,
} from "@mantine/core";
import {
  IconDots,
  IconSearch,
  IconFilter,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
} from "@tabler/icons-react";
import { CompanyTableProps } from "@/types/company";
import { useState, useMemo } from "react";
import { formatDate } from "@/utils/date";

const CompanyTable: React.FC<CompanyTableProps> = ({
  companies,
  onEdit,
  onDelete,
  onView,
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
        company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location.toLowerCase().includes(searchTerm.toLowerCase());
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
        case "industry":
          aValue = a.industry.toLowerCase();
          bValue = b.industry.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "red";
      case "pending":
        return "yellow";
      default:
        return "gray";
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const SortableHeader = ({
    column,
    children,
  }: {
    column: string;
    children: React.ReactNode;
  }) => (
    <th
      style={{ cursor: "pointer", userSelect: "none" }}
      onClick={() => handleSort(column)}
    >
      <Group gap="xs">
        {children}
        {sortBy === column && (
          <Text size="xs" c="dimmed">
            {sortDirection === "asc" ? "↑" : "↓"}
          </Text>
        )}
      </Group>
    </th>
  );

  return (
    <div style={{ padding: "var(--mantine-spacing-md)" }}>
      <Paper p="md" mb="md">
        <Flex justify="space-between" align="center" mb="md">
          <Title order={2} c="dark">
            <Group gap="sm">
              <IconSearch size={24} />
              Companies
            </Group>
          </Title>
          <Group gap="sm">
            <Button leftSection={<IconPlus size={16} />} variant="filled">
              Create Company
            </Button>
            <Button leftSection={<IconFilter size={16} />} variant="outline">
              Filter
            </Button>
          </Group>
        </Flex>

        <Flex gap="md" mb="md">
          <TextInput
            placeholder="Search companies, industry, location..."
            leftSection={<IconSearch size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
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
          />
        </Flex>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <SortableHeader column="name">
                <Text fw={600}>Company</Text>
              </SortableHeader>
              <SortableHeader column="industry">
                <Text fw={600}>Industry</Text>
              </SortableHeader>
              <SortableHeader column="status">
                <Text fw={600}>Status</Text>
              </SortableHeader>
              <SortableHeader column="events">
                <Text fw={600}>Events</Text>
              </SortableHeader>
              <th>
                <Text fw={600}>Location</Text>
              </th>
              <th>
                <Text fw={600}>Last Event</Text>
              </th>
              <th>
                <Text fw={600}>Actions</Text>
              </th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedCompanies.map((company) => (
              <Table.Tr key={company.id}>
                <Table.Td>
                  <Group gap="sm">
                    <Avatar src={company.logo} size="md" radius="sm">
                      {company.name.charAt(0)}
                    </Avatar>
                    <Stack gap={2}>
                      <Text fw={500} size="sm">
                        {company.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        ID: {company.id}
                      </Text>
                    </Stack>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{company.industry}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge color={getStatusColor(company.status)} variant="light">
                    {company.status.charAt(0).toUpperCase() +
                      company.status.slice(1)}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text fw={600} size="sm">
                    {company.numberOfEvents.toLocaleString()}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{company.location}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {formatDate(company.lastEventDate)}
                  </Text>
                </Table.Td>
                <Table.Td>
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
                      <Menu.Item
                        leftSection={<IconEdit size={14} />}
                        onClick={() => onEdit?.(company)}
                      >
                        Edit Company
                      </Menu.Item>
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
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {filteredAndSortedCompanies.length === 0 && (
          <Center py="xl">
            <Stack align="center" gap="md">
              <Text c="dimmed">No companies found matching your criteria</Text>
              <Button
                variant="light"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </Stack>
          </Center>
        )}

        {totalPages > 1 && (
          <Flex justify="center" mt="md">
            <Pagination
              value={currentPage}
              onChange={setCurrentPage}
              total={totalPages}
              size="sm"
            />
          </Flex>
        )}
      </Paper>
    </div>
  );
};

export default CompanyTable;
