import { useState } from "react";
import { Company } from "@/types/company";

export const useCompanyModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const openModal = (company?: Company) => {
    setSelectedCompany(company || null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedCompany(null);
  };

  const handleSuccess = (company: Company) => {
    // You can add success handling logic here
    console.log("Company created/updated:", company);
  };

  return {
    isOpen,
    selectedCompany,
    openModal,
    closeModal,
    handleSuccess,
  };
};
