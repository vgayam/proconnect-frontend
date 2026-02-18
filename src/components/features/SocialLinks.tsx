// =============================================================================
// SOCIAL LINKS COMPONENT
// =============================================================================
// Displays social media links with appropriate icons.
// =============================================================================

import { cn } from "@/lib/utils";
import { SocialLink, SocialPlatform } from "@/types";
import {
  Linkedin,
  Twitter,
  Github,
  Globe,
  Instagram,
  Youtube,
  Mail,
  Dribbble,
} from "lucide-react";

const PLATFORM_CONFIG: Record<
  SocialPlatform,
  { icon: React.ComponentType<{ className?: string }>; label: string; color: string }
> = {
  linkedin: { icon: Linkedin, label: "LinkedIn", color: "hover:text-[#0077B5]" },
  twitter: { icon: Twitter, label: "Twitter/X", color: "hover:text-[#1DA1F2]" },
  github: { icon: Github, label: "GitHub", color: "hover:text-[#333]" },
  website: { icon: Globe, label: "Website", color: "hover:text-primary-600" },
  instagram: { icon: Instagram, label: "Instagram", color: "hover:text-[#E4405F]" },
  youtube: { icon: Youtube, label: "YouTube", color: "hover:text-[#FF0000]" },
  dribbble: { icon: Dribbble, label: "Dribbble", color: "hover:text-[#EA4C89]" },
  behance: { icon: Globe, label: "Behance", color: "hover:text-[#1769FF]" },
  medium: { icon: Globe, label: "Medium", color: "hover:text-[#00AB6C]" },
  email: { icon: Mail, label: "Email", color: "hover:text-primary-600" },
};

export interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
  /** Size of the icons */
  size?: "sm" | "md" | "lg";
  /** Show platform labels */
  showLabels?: boolean;
}

/**
 * Social links component with icons
 *
 * @example
 * <SocialLinks links={professional.socialLinks} size="md" />
 */
export function SocialLinks({
  links,
  className,
  size = "md",
  showLabels = false,
}: SocialLinksProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const buttonSizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5",
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {links.map((link) => {
        const config = PLATFORM_CONFIG[link.platform];
        const Icon = config.icon;

        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg text-gray-500 transition-colors",
              buttonSizeClasses[size],
              config.color,
              "hover:bg-gray-100"
            )}
            title={link.label || config.label}
          >
            <Icon className={sizeClasses[size]} />
            {showLabels && (
              <span className="text-sm">{link.label || config.label}</span>
            )}
          </a>
        );
      })}
    </div>
  );
}
