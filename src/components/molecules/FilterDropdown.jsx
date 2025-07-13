import React from "react";
import Select from "@/components/atoms/Select";

const FilterDropdown = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "All", 
  className 
}) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      className={className}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
};

export default FilterDropdown;