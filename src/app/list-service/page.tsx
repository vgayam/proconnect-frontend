// =============================================================================
// LIST YOUR SERVICE PAGE
// =============================================================================
// Form for professionals to create their profile and list services.
// =============================================================================

import { ListServiceForm } from "./ListServiceForm";

export default function ListServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              List Your Services
            </h1>
            <p className="text-lg text-gray-600">
              Create your professional profile and start connecting with clients today.
            </p>
          </div>

          {/* Form */}
          <ListServiceForm />
        </div>
      </div>
    </div>
  );
}
