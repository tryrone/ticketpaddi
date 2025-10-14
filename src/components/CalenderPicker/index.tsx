"use client";
import { DatePicker } from "@mantine/dates";
import { useState } from "react";
import Text from "@/components/Text";
import { Button, Menu } from "@mantine/core";
import { IconCalendar } from "@tabler/icons-react";

interface CalenderPickerProps {
  value?: string | null;
  onChange: (date: string | null) => void;
  placeholder?: string;
}

const CalenderPicker: React.FC<CalenderPickerProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="flex-1 px-4  py-3 border border-gray-300 outline-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
      <Menu>
        <Menu.Target>
          <div className="h-full w-full cursor-pointer flex items-center gap-2">
            <IconCalendar size={20} className="text-gray-500" />
            <Text>{value ? value : placeholder || "Select Date"}</Text>
          </div>
        </Menu.Target>

        <Menu.Dropdown>
          <DatePicker
            value={value}
            onChange={onChange}
            className="flex-1 px-4  py-3 border border-gray-300 outline-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default CalenderPicker;
