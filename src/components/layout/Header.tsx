// =============================================================================
// HEADER COMPONENT
// =============================================================================
// Main navigation header with logo and nav links.
// =============================================================================

"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Menu, X, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS: { href: string; label: string }[] = [];

/**
 * Main site header with navigation
 */
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-gray-900"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Briefcase className="h-5 w-5" />
            </div>
            <span>ProConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Link href="/list-service">
              <Button size="sm">List Your Services</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden border-t border-gray-200 bg-white overflow-hidden transition-all duration-300",
          isMobileMenuOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-2" />
          <Button variant="ghost" className="justify-start">
            Sign In
          </Button>
          <Link href="/list-service">
            <Button className="mt-2 w-full">List Your Services</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
