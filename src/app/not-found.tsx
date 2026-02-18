// =============================================================================
// 404 NOT FOUND PAGE
// =============================================================================

import Link from "next/link";
import { Button } from "@/components/ui";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mt-4 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button>
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/professionals">
            <Button variant="outline">
              <Search className="h-4 w-4" />
              Find Professionals
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
