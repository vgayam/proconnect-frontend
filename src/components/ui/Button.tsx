// =============================================================================
// BUTTON COMPONENT
// =============================================================================
// A versatile button component with multiple variants and sizes.
// Uses class-variance-authority for type-safe variant handling.
// =============================================================================

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

/**
 * Button variants configuration
 * Add new variants here to extend button styles
 */
const buttonVariants = cva(
  // Base styles applied to all buttons
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm",
        secondary:
          "bg-secondary-600 text-white hover:bg-secondary-700 active:bg-secondary-800 shadow-sm",
        outline:
          "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 active:bg-primary-100",
        ghost:
          "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
        danger:
          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
        success:
          "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-sm",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Show loading spinner and disable button */
  isLoading?: boolean;
}

/**
 * Button component
 *
 * @example
 * <Button variant="primary" size="lg">Click me</Button>
 * <Button variant="outline" isLoading>Loading...</Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
