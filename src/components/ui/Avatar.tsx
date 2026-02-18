// =============================================================================
// AVATAR COMPONENT
// =============================================================================
// User avatar with fallback to initials.
// =============================================================================

import { cn, getInitials } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";

const avatarVariants = cva(
  "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary-400 to-primary-600 font-semibold text-white",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
        "2xl": "h-24 w-24 text-2xl",
        "3xl": "h-32 w-32 text-3xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string;
  firstName: string;
  lastName: string;
  className?: string;
  /** Show online indicator */
  showStatus?: boolean;
  /** Is the user online/available */
  isOnline?: boolean;
}

/**
 * Avatar component with image and fallback initials
 *
 * @example
 * <Avatar src="/path/to/image.jpg" firstName="John" lastName="Doe" size="lg" />
 * <Avatar firstName="Jane" lastName="Smith" showStatus isOnline />
 */
export function Avatar({
  src,
  firstName,
  lastName,
  size,
  className,
  showStatus = false,
  isOnline = false,
}: AvatarProps) {
  const initials = getInitials(firstName, lastName);
  const sizeNum = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
    "2xl": 96,
    "3xl": 128,
  }[size || "md"];

  return (
    <div className={cn("relative inline-block", className)}>
      <div className={cn(avatarVariants({ size }))}>
        {src ? (
          <Image
            src={src}
            alt={`${firstName} ${lastName}`}
            fill
            className="object-cover"
            sizes={`${sizeNum}px`}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {showStatus && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-white",
            size === "xs" && "h-1.5 w-1.5",
            size === "sm" && "h-2 w-2",
            size === "md" && "h-2.5 w-2.5",
            size === "lg" && "h-3 w-3",
            size === "xl" && "h-4 w-4",
            size === "2xl" && "h-5 w-5",
            size === "3xl" && "h-6 w-6",
            isOnline ? "bg-green-500" : "bg-gray-400"
          )}
        />
      )}
    </div>
  );
}
