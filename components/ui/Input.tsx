
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      hint,
      leftIcon,
      rightElement,
      id,
      ...props
    },
    ref
  ) => {
    const reactId = React.useId();
    const inputId = id ?? reactId;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1 block text-sm font-medium text-gray-900"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            "group flex items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-xs transition",
            "focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20",
            error
              ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-500/20"
              : "border-gray-200"
          )}
        >
          {leftIcon && <span className="text-gray-400">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full bg-transparent text-gray-900 placeholder:text-gray-400 outline-hidden",
              className
            )}
            {...props}
          />
          {rightElement && <span className="flex items-center">{rightElement}</span>}
        </div>

        {error ? (
          <p className="mt-1 text-xs text-red-600">{error}</p>
        ) : hint ? (
          <p className="mt-1 text-xs text-gray-500">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
