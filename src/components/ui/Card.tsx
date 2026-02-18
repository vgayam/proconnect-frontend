// =============================================================================
// CARD COMPONENT
// =============================================================================
// Flexible card container component for content sections.
// =============================================================================

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
  /** Add hover effect */
  hoverable?: boolean;
  /** Add padding inside card */
  padded?: boolean;
  /** Click handler */
  onClick?: () => void;
}

/**
 * Card component for containing content
 *
 * @example
 * <Card padded hoverable>
 *   <h3>Title</h3>
 *   <p>Content goes here</p>
 * </Card>
 */
export function Card({
  children,
  className,
  hoverable = false,
  padded = true,
  onClick,
}: CardProps) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      className={cn(
        "rounded-xl border border-gray-200 bg-white shadow-sm",
        padded && "p-6",
        hoverable && "transition-all hover:shadow-md hover:border-gray-300",
        onClick && "cursor-pointer text-left w-full",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}

/**
 * Card Header subcomponent
 */
export function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

/**
 * Card Title subcomponent
 */
export function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-lg font-semibold text-gray-900", className)}>
      {children}
    </h3>
  );
}

/**
 * Card Description subcomponent
 */
export function CardDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-sm text-gray-500", className)}>
      {children}
    </p>
  );
}

/**
 * Card Content subcomponent
 */
export function CardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("", className)}>{children}</div>;
}

/**
 * Card Footer subcomponent
 */
export function CardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-4 flex items-center gap-2", className)}>
      {children}
    </div>
  );
}
