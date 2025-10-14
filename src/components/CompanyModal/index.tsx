"use client";

import React, { useState } from "react";
import { IconUpload, IconDots } from "@tabler/icons-react";
import { useCreateCompany } from "@/hooks/useFirestore";
import { Company } from "@/types/company";
import { Modal } from "@mantine/core";
import { User as FirebaseUser } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (company: Company) => void;
}

const CompanyModal: React.FC<CompanyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { create, loading, error } = useCreateCompany();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: null as File | null,

    location: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { user } = useAuth();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Brand name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Brand description is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Convert logo to base64 if present
      let logoUrl = "";
      if (formData.logo) {
        logoUrl = await convertFileToBase64(formData.logo);
      }

      const companyData = {
        name: formData.name,
        logo: logoUrl || "",
        numberOfEvents: 0,
        status: "active" as const,
        location: formData.location,
        lastEventDate: new Date().toISOString(),
        description: formData.description,
        userId: user?.uid as FirebaseUser["uid"],
      };

      const companyId = await create(companyData);

      // Create the full company object for the callback
      const newCompany: Company = {
        id: companyId,
        ...companyData,
      };

      onSuccess?.(newCompany);
      onClose();

      // Reset form
      setFormData({
        name: "",
        description: "",
        logo: null,

        location: "",
      });
      setCurrentStep(1);
      setErrors({});
    } catch (err) {
      console.error("Failed to create company:", err);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onClose();
    }
  };

  //   const handleNext = () => {
  //     if (validateForm()) {
  //       setCurrentStep(2);
  //     }
  //   };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      size="lg"
      styles={{
        body: {
          padding: "8px 0px",
        },
      }}
    >
      {/* Content */}
      <form onSubmit={handleSubmit} className="px-6 py-3 relative">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create your brand profile
          </h2>
          <p className="text-gray-600">Tell us about your brand</p>
        </div>

        {/* Brand Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Brand name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your brand name"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Brand Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Brand description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your brand"
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Upload Logo */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Upload your logo
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <IconUpload size={24} className="text-gray-600" />
              </div>
              <div className="flex-1">
                {formData.logo ? (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-medium">
                      {formData.logo.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData((prev) => ({ ...prev, logo: null }));
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <IconDots size={20} />
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-500">
                    Click to upload your logo
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mb-[100px]">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter your location"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.location ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location}</p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex items-center justify-between pt-3 border-t bg-white border-gray-200 absolute bottom-0 left-0 right-0 px-6">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Back
          </button>
          <div className="flex space-x-3">
            {/* {currentStep === 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next Step
              </button>
            ) : ( */}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Company"}
            </button>
            {/* )} */}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CompanyModal;
