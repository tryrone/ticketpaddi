import React from "react";
import { IconCalendar, IconUsers } from "@tabler/icons-react";
import { Company } from "@/types/company";

interface TypeSelectionStepProps {
  company?: Company;
  onSelectType: (type: "event" | "experience") => void;
}

export const TypeSelectionStep: React.FC<TypeSelectionStepProps> = ({
  company,
  onSelectType,
}) => {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          What would you like to create?
        </h2>
        <p className="text-gray-600">
          {company
            ? `Creating for ${company.name}`
            : "Choose the type of event"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button
          type="button"
          onClick={() => onSelectType("event")}
          className="p-6 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group outline-0"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200">
            <IconCalendar size={24} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Event</h3>
          <p className="text-gray-600 text-sm">
            Create a standard event with a specific date, time, and fixed
            capacity
          </p>
        </button>

        <button
          type="button"
          onClick={() => onSelectType("experience")}
          className="p-6 border-2 border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left group outline-0"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200">
            <IconUsers size={24} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Experience</h3>
          <p className="text-gray-600 text-sm">
            Create a flexible experience with seat ranges and multiple date
            options
          </p>
        </button>
      </div>
    </>
  );
};
