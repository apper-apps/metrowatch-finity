import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-border bg-surface p-6 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;