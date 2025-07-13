import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className 
}) => {
  return (
    <div className="relative">
      <ApperIcon 
        name="Search" 
        size={18} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" 
      />
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`pl-10 ${className}`}
      />
    </div>
  );
};

export default SearchBar;