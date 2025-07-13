import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  className, 
  children,
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "flex h-10 w-full appearance-none rounded-md border border-border bg-surface px-3 py-2 pr-8 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ApperIcon 
        name="ChevronDown" 
        size={16} 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted pointer-events-none" 
      />
    </div>
  );
});

Select.displayName = "Select";

export default Select;