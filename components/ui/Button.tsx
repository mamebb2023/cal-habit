import React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline-solid" | "ghost" | "link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  className,
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  const baseStyles =
    variant === "link"
      ? "px-0 py-0 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      : "px-5 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-black/20";

  const variantStyles = {
    primary:
      "bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white hover:opacity-90 active:opacity-80 shadow-xl  hover:shadow-2x hover:scale-105",
    "outline-solid":
      "border border-gray-300 text-gray-900 hover:bg-gray-50 active:bg-gray-100 bg-white",
    ghost:
      "text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200",
    link: "text-gray-950 hover:text-black bg-transparent shadow-none hover:shadow-none hover:scale-100",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        isLoading && "cursor-wait",
        className,
      )}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white align-middle" />
      )}
      <span className={isLoading ? "align-middle" : "align-middle"}>
        {children}
      </span>
    </button>
  );
};

export default Button;
