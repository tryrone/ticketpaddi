import { useState } from "react";
import { Event } from "@/types/company";
import { Company } from "@/types/company";

export const useEventModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const openModal = (event?: Event, company?: Company) => {
    setSelectedEvent(event || null);
    setSelectedCompany(company || null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedEvent(null);
    setSelectedCompany(null);
  };

  const handleSuccess = (event: Event) => {
    // You can add success handling logic here
    console.log("Event created/updated:", event);
  };

  return {
    isOpen,
    selectedEvent,
    selectedCompany,
    openModal,
    closeModal,
    handleSuccess,
  };
};
