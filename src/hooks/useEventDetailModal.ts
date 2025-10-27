import { useState } from "react";
import { Event } from "@/types/company";

export const useEventDetailModal = () => {
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

  const handleFavorite = (event: Event) => {
    // TODO: Implement favorite functionality
    console.log("Favoriting event:", event.title);
  };

  const handleBook = (event: Event) => {
    // TODO: Implement booking functionality
    console.log("Booking event:", event.title);
  };

  const handleShare = (event: Event) => {
    // TODO: Implement share functionality
    console.log("Sharing event:", event.title);
  };

  return {
    isOpen,
    selectedEvent,
    openModal,
    closeModal,
    handleFavorite,
    handleBook,
    handleShare,
  };
};
