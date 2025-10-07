"use client";

import React, { useState } from "react";
import {
  AppShell,
  Group,
  TextInput,
  Avatar,
  Badge,
  Burger,
  Drawer,
  Stack,
  NavLink,
  Divider,
  ActionIcon,
  Notification,
  rem,
} from "@mantine/core";
import {
  IconSearch,
  IconBell,
  IconUser,
  IconHome,
  IconBuilding,
  IconCalendar,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import CompanyTable from "../CompanyTable";
import { Company } from "@/types/company";
import { mockCompanies } from "@/data/companies";
import Text from "../Text";

const CompanyListPage: React.FC = () => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleEditCompany = (company: Company) => {
    setNotification({ message: `Editing ${company.name}`, type: "success" });
    // Here you would typically open a modal or navigate to an edit page
  };

  const handleDeleteCompany = (company: Company) => {
    setCompanies((prev) => prev.filter((c) => c.id !== company.id));
    setNotification({
      message: `${company.name} deleted successfully`,
      type: "success",
    });
  };

  const handleViewCompany = (company: Company) => {
    setNotification({ message: `Viewing ${company.name}`, type: "success" });
    // Here you would typically navigate to a company details page
  };

  const totalEvents = companies.reduce(
    (sum, company) => sum + company.numberOfEvents,
    0
  );
  const activeCompanies = companies.filter((c) => c.status === "active").length;

  return (
    <>
      {notification && (
        <Notification
          title={notification.type === "success" ? "Success" : "Error"}
          color={notification.type === "success" ? "green" : "red"}
          onClose={() => setNotification(null)}
          style={{ position: "fixed", top: 20, right: 20, zIndex: 1000 }}
        >
          {notification.message}
        </Notification>
      )}

      <AppShell
        header={{ height: 60 }}
        padding="md"
        styles={{
          main: {
            paddingTop: rem(60),
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
          },
        }}
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />

            {/* Top Navigation */}
            <Group justify="space-between" style={{ width: "100%" }}>
              <Group>
                <TextInput
                  placeholder="Search companies, events, industry..."
                  leftSection={<IconSearch size={16} />}
                  style={{ width: 400 }}
                />
              </Group>

              <Group gap="md">
                <Group gap="xs">
                  <Text fontSize="sm" color="dimmed">
                    Total Events:
                  </Text>
                  <Badge color="blue" variant="light" size="lg">
                    {totalEvents.toLocaleString()}
                  </Badge>
                </Group>

                <Group gap="xs">
                  <Text fontSize="sm" color="dimmed">
                    Active:
                  </Text>
                  <Badge color="green" variant="light">
                    {activeCompanies}
                  </Badge>
                </Group>

                <ActionIcon variant="subtle" color="gray">
                  <IconBell size={20} />
                </ActionIcon>

                <Avatar size="sm" color="blue">
                  <IconUser size={16} />
                </Avatar>
              </Group>
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Main>
          <div style={{ maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
            <CompanyTable
              companies={companies}
              onEdit={handleEditCompany}
              onDelete={handleDeleteCompany}
              onView={handleViewCompany}
            />
          </div>
        </AppShell.Main>

        {/* Mobile Drawer */}
        <Drawer opened={opened} onClose={close} title="Navigation" size="sm">
          <Stack gap="xs">
            <NavLink
              href="/"
              label="Dashboard"
              leftSection={<IconHome size={16} />}
              active
            />
            <NavLink
              href="/companies"
              label="Companies"
              leftSection={<IconBuilding size={16} />}
            />
            <NavLink
              href="/events"
              label="Events"
              leftSection={<IconCalendar size={16} />}
            />
            <Divider />
            <NavLink
              href="/settings"
              label="Settings"
              leftSection={<IconSettings size={16} />}
            />
            <NavLink
              href="/logout"
              label="Logout"
              leftSection={<IconLogout size={16} />}
              color="red"
            />
          </Stack>
        </Drawer>
      </AppShell>
    </>
  );
};

export default CompanyListPage;
