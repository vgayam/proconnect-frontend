"use client";

// =============================================================================
// LIST SERVICE FORM COMPONENT
// =============================================================================
// Multi-step form for professionals to create their profile and list services.
// =============================================================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card, Badge } from "@/components/ui";
import { SKILL_CATEGORIES } from "@/lib/data";
import {
  User,
  Briefcase,
  MapPin,
  DollarSign,
  Link as LinkIcon,
  Plus,
  X,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

interface ServiceFormData {
  title: string;
  description: string;
  priceMin: string;
  priceMax: string;
  priceUnit: string;
  duration: string;
}

interface FormData {
  // Step 1: Basic Info
  firstName: string;
  lastName: string;
  headline: string;
  bio: string;
  // Step 2: Location
  city: string;
  state: string;
  country: string;
  // Step 3: Skills
  selectedCategory: string;
  skills: string[];
  // Step 4: Services
  services: ServiceFormData[];
  hourlyRateMin: string;
  hourlyRateMax: string;
  // Step 5: Social Links
  linkedin: string;
  twitter: string;
  instagram: string;
  website: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  headline: "",
  bio: "",
  city: "",
  state: "",
  country: "",
  selectedCategory: "",
  skills: [],
  services: [
    {
      title: "",
      description: "",
      priceMin: "",
      priceMax: "",
      priceUnit: "per project",
      duration: "",
    },
  ],
  hourlyRateMin: "",
  hourlyRateMax: "",
  linkedin: "",
  twitter: "",
  instagram: "",
  website: "",
};

const STEPS = [
  { id: 1, title: "Basic Info", icon: User },
  { id: 2, title: "Location", icon: MapPin },
  { id: 3, title: "Skills", icon: Briefcase },
  { id: 4, title: "Services", icon: DollarSign },
  { id: 5, title: "Links", icon: LinkIcon },
];

export function ListServiceForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      updateField("skills", [...formData.skills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    updateField(
      "skills",
      formData.skills.filter((s) => s !== skill)
    );
  };

  const addService = () => {
    updateField("services", [
      ...formData.services,
      {
        title: "",
        description: "",
        priceMin: "",
        priceMax: "",
        priceUnit: "per project",
        duration: "",
      },
    ]);
  };

  const updateService = (index: number, field: keyof ServiceFormData, value: string) => {
    const newServices = [...formData.services];
    newServices[index] = { ...newServices[index], [field]: value };
    updateField("services", newServices);
  };

  const removeService = (index: number) => {
    if (formData.services.length > 1) {
      updateField(
        "services",
        formData.services.filter((_, i) => i !== index)
      );
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isSuccess) {
    return (
      <Card className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Created!</h2>
        <p className="text-gray-600 mb-6">
          Your professional profile has been submitted successfully.
          <br />
          You&apos;ll start receiving inquiries from clients soon.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push("/professionals")}>
            Browse Professionals
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Go Home
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isComplete = step.id < currentStep;
            return (
              <div key={step.id} className="flex-1 flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive
                        ? "bg-primary-600 text-white"
                        : isComplete
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isComplete ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span
                    className={`text-xs mt-1 hidden sm:block ${
                      isActive ? "text-primary-600 font-medium" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step.id < currentStep ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Card */}
      <Card>
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Basic Information</h2>
              <p className="text-gray-600 text-sm">Tell us about yourself</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                required
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                required
              />
            </div>

            <Input
              label="Professional Headline"
              placeholder="e.g., Senior Photographer | Weddings & Events"
              value={formData.headline}
              onChange={(e) => updateField("headline", e.target.value)}
              helperText="A short tagline that describes what you do"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio / About You
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                rows={4}
                placeholder="Tell potential clients about your experience, skills, and what makes you unique..."
                value={formData.bio}
                onChange={(e) => updateField("bio", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Location</h2>
              <p className="text-gray-600 text-sm">Where are you based?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                placeholder="San Francisco"
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
              />
              <Input
                label="State / Province"
                placeholder="CA"
                value={formData.state}
                onChange={(e) => updateField("state", e.target.value)}
              />
            </div>

            <Input
              label="Country"
              placeholder="USA"
              value={formData.country}
              onChange={(e) => updateField("country", e.target.value)}
              required
            />
          </div>
        )}

        {/* Step 3: Skills */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Skills & Expertise</h2>
              <p className="text-gray-600 text-sm">What do you specialize in?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select a Category
              </label>
              <div className="flex flex-wrap gap-2">
                {SKILL_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => updateField("selectedCategory", category)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.selectedCategory === category
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Your Skills
              </label>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Type a skill and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.querySelector(
                      'input[placeholder="Type a skill and press Enter"]'
                    ) as HTMLInputElement;
                    if (input) {
                      addSkill(input.value);
                      input.value = "";
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="primary" className="flex items-center gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Services */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Services & Pricing</h2>
              <p className="text-gray-600 text-sm">Define what you offer and your rates</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Hourly Rate (Min)"
                type="number"
                placeholder="50"
                value={formData.hourlyRateMin}
                onChange={(e) => updateField("hourlyRateMin", e.target.value)}
                leftIcon={<DollarSign className="h-4 w-4" />}
              />
              <Input
                label="Hourly Rate (Max)"
                type="number"
                placeholder="150"
                value={formData.hourlyRateMax}
                onChange={(e) => updateField("hourlyRateMax", e.target.value)}
                leftIcon={<DollarSign className="h-4 w-4" />}
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">Services You Offer</label>
                <Button type="button" variant="outline" size="sm" onClick={addService}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Service
                </Button>
              </div>

              <div className="space-y-4">
                {formData.services.map((service, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg relative">
                    {formData.services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}

                    <div className="space-y-3">
                      <Input
                        label="Service Title"
                        placeholder="e.g., Wedding Photography Package"
                        value={service.title}
                        onChange={(e) => updateService(index, "title", e.target.value)}
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                          rows={2}
                          placeholder="Describe what's included..."
                          value={service.description}
                          onChange={(e) => updateService(index, "description", e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          label="Price Min"
                          type="number"
                          placeholder="500"
                          value={service.priceMin}
                          onChange={(e) => updateService(index, "priceMin", e.target.value)}
                        />
                        <Input
                          label="Price Max"
                          type="number"
                          placeholder="2000"
                          value={service.priceMax}
                          onChange={(e) => updateService(index, "priceMax", e.target.value)}
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            value={service.priceUnit}
                            onChange={(e) => updateService(index, "priceUnit", e.target.value)}
                          >
                            <option value="per project">Per Project</option>
                            <option value="per hour">Per Hour</option>
                            <option value="per day">Per Day</option>
                            <option value="per month">Per Month</option>
                            <option value="per session">Per Session</option>
                          </select>
                        </div>
                      </div>

                      <Input
                        label="Typical Duration"
                        placeholder="e.g., 2-4 weeks"
                        value={service.duration}
                        onChange={(e) => updateService(index, "duration", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Social Links */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Social & Web Links</h2>
              <p className="text-gray-600 text-sm">Help clients find you online (all optional)</p>
            </div>

            <Input
              label="LinkedIn"
              placeholder="https://linkedin.com/in/yourprofile"
              value={formData.linkedin}
              onChange={(e) => updateField("linkedin", e.target.value)}
            />

            <Input
              label="Website / Portfolio"
              placeholder="https://yourwebsite.com"
              value={formData.website}
              onChange={(e) => updateField("website", e.target.value)}
            />

            <Input
              label="Instagram"
              placeholder="https://instagram.com/yourprofile"
              value={formData.instagram}
              onChange={(e) => updateField("instagram", e.target.value)}
            />

            <Input
              label="Twitter / X"
              placeholder="https://twitter.com/yourprofile"
              value={formData.twitter}
              onChange={(e) => updateField("twitter", e.target.value)}
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Button type="button" onClick={nextStep} disabled={isSubmitting}>
            {isSubmitting ? (
              "Submitting..."
            ) : currentStep === STEPS.length ? (
              <>
                Submit Profile
                <CheckCircle className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
