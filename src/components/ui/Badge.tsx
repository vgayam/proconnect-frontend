// =============================================================================
// BADGE COMPONENT
// =============================================================================
// Small badges for displaying tags, skills, status indicators, etc.
// =============================================================================

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { type ReactNode } from "react";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-700",
        primary: "bg-primary-100 text-primary-700",
        secondary: "bg-secondary-100 text-secondary-700",
        success: "bg-green-100 text-green-700",
        warning: "bg-yellow-100 text-yellow-700",
        danger: "bg-red-100 text-red-700",
        outline: "border border-gray-300 text-gray-700",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode;
  className?: string;
  /** Optional icon to display */
  icon?: ReactNode;
  /** Click handler - makes badge interactive */
  onClick?: () => void;
  /** Whether badge can be removed */
  removable?: boolean;
  /** Callback when remove button is clicked */
  onRemove?: () => void;
}

/**
 * Badge component for tags, skills, and status indicators
 *
 * @example
 * <Badge>React</Badge>
 * <Badge variant="primary">New</Badge>
 * <Badge variant="success" icon={<CheckIcon />}>Verified</Badge>
 */
export function Badge({
  className,
  variant,
  size,
  children,
  icon,
  onClick,
  removable,
  onRemove,
}: BadgeProps) {
  const Component = onClick ? "button" : "span";

  return (
    <Component
      className={cn(
        badgeVariants({ variant, size }),
        onClick && "cursor-pointer hover:opacity-80",
        className
      )}
      onClick={onClick}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10"
          aria-label="Remove"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </Component>
  );
}
