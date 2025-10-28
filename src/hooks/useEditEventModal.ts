import { useState } from "react";
import { Event } from "@/types/company";

export const useEditEventModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedEvent(null);
  };

  const handleSuccess = (event: Event) => {
    // You can add success handling logic here
    console.log("Event updated:", event);
  };

  return {
    isOpen,
    selectedEvent,
    openModal,
    closeModal,
    handleSuccess,
  };
};
