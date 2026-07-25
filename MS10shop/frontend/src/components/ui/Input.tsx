"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-dark-300">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder:text-dark-500",
            "focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-300",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
