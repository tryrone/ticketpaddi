import React from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  icon,
  children,
}) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-900 mb-2">
      {icon && <span className="inline-flex items-center mr-2">{icon}</span>}
      {label}
    </label>
    {children}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);
