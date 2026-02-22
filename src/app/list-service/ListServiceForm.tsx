"use client";

// =============================================================================
// LIST SERVICE FORM — PROFESSIONAL ONBOARDING WIZARD
// =============================================================================
// 5-step guided wizard: BasicInfo → Location → Skills → Pricing → Links
// =============================================================================

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createProfessional } from "@/lib/api";
import { useCategories } from "@/hooks/useCategories";
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
  Loader2,
  Navigation,
  AlertCircle,
  Globe,
  Instagram,
  Twitter,
  Linkedin,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceFormData {
  title: string;
  description: string;
  priceMin: string;
  priceMax: string;
  priceUnit: string;
  duration: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  headline: string;
  bio: string;
  city: string;
  state: string;
  country: string;
  selectedCategory: string;
  skills: string[];
  services: ServiceFormData[];
  currency: string;
  hourlyRateMin: string;
  hourlyRateMax: string;
  phone: string;
  email: string;
  whatsapp: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  website: string;
  serviceAreas: string[];
}

interface FieldError {
  [key: string]: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

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
    { title: "", description: "", priceMin: "", priceMax: "", priceUnit: "per project", duration: "" },
  ],
  currency: "USD",
  hourlyRateMin: "",
  hourlyRateMax: "",
  phone: "",
  email: "",
  whatsapp: "",
  linkedin: "",
  twitter: "",
  instagram: "",
  website: "",
  serviceAreas: [],
};

const STEPS = [
  { id: 1, title: "About You",        short: "Profile",  icon: User },
  { id: 2, title: "Location",         short: "Location", icon: MapPin },
  { id: 3, title: "Service Category", short: "Category", icon: Briefcase },
  { id: 4, title: "Pricing",          short: "Pricing",  icon: DollarSign },
  { id: 5, title: "Contact Info",     short: "Contact",  icon: Phone },
  { id: 6, title: "Online Links",     short: "Links",    icon: LinkIcon },
];

// ─── Validation ───────────────────────────────────────────────────────────────

function validateStep(step: number, data: FormData): FieldError {
  const errors: FieldError = {};
  if (step === 1) {
    if (!data.firstName.trim()) errors.firstName = "First name is required.";
    if (!data.lastName.trim())  errors.lastName  = "Last name is required.";
    // headline and bio are optional — no validation
  }
  if (step === 2) {
    if (!data.city.trim())    errors.city    = "City is required.";
    if (!data.country.trim()) errors.country = "Country is required.";
  }
  if (step === 3) {
    if (!data.selectedCategory) errors.selectedCategory = "Please select a service category to continue.";
    // skills are optional — specializations can be added later
  }
  if (step === 5) {
    if (!data.email.trim()) errors.email = "Email is required so clients can contact you.";
  }
  return errors;
}

// ─── Helper UI ────────────────────────────────────────────────────────────────

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      {msg}
    </p>
  );
}

function Field({
  label, required, hint, error, children,
}: {
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      {children}
      <ErrorMsg msg={error} />
    </div>
  );
}

function TextInput({
  placeholder, value, onChange, type = "text", error, icon,
}: {
  placeholder?: string; value: string; onChange: (v: string) => void;
  type?: string; error?: string; icon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${icon ? "pl-9" : "pl-4"} pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition
          ${error ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-primary-200 focus:border-primary-400"}`}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ListServiceForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep]     = useState(1);
  const [formData, setFormData]           = useState<FormData>(initialFormData);
  const [errors, setErrors]               = useState<FieldError>({});
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [submittedId, setSubmittedId]     = useState<string | null | undefined>(undefined);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [serviceAreaInput, setServiceAreaInput] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const { categories, subcategoriesByCategory, isLoading: loadingCategories } = useCategories();
  const customSkillRef = useRef<HTMLInputElement>(null);
  const update = <K extends keyof FormData>(field: K, value: FormData[K]) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const clearError = (field: string) =>
    setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });

  // ── Skills helpers ──
  const addSkill = (skill: string) => {
    const t = skill.trim();
    if (t && !formData.skills.includes(t)) {
      update("skills", [...formData.skills, t]);
      clearError("skills");
    }
  };
  const removeSkill = (skill: string) =>
    update("skills", formData.skills.filter((s) => s !== skill));

  // ── Services helpers ──
  const updateService = (i: number, field: keyof ServiceFormData, value: string) => {
    const next = [...formData.services];
    next[i] = { ...next[i], [field]: value };
    update("services", next);
  };
  const removeService = (i: number) => {
    if (formData.services.length > 1)
      update("services", formData.services.filter((_, idx) => idx !== i));
  };
  const addService = () =>
    update("services", [
      ...formData.services,
      { title: "", description: "", priceMin: "", priceMax: "", priceUnit: "per project", duration: "" },
    ]);

  // ── Geolocation ──
  const detectLocation = () => {
    if (!("geolocation" in navigator)) return;
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          );
          const data = await res.json();
          update("city",    data.address?.city || data.address?.town || data.address?.village || "");
          update("state",   data.address?.state   || "");
          update("country", data.address?.country || "");
          clearError("city");
          clearError("country");
        } catch { /* silent */ }
        finally { setIsDetectingLocation(false); }
      },
      () => setIsDetectingLocation(false),
      { timeout: 6000 }
    );
  };

  // ── Navigation ──
  const goNext = () => {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) { setErrors(stepErrors); return; }
    setErrors({});
    if (currentStep < STEPS.length) setCurrentStep((s) => s + 1);
    else handleSubmit();
  };

  const goBack = () => { setErrors({}); setCurrentStep((s) => Math.max(1, s - 1)); };

  // ── Submit ──
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        firstName:   formData.firstName,
        lastName:    formData.lastName,
        displayName: `${formData.firstName} ${formData.lastName}`,
        headline:    formData.headline,
        bio:         formData.bio,
        location: {
          city:    formData.city,
          state:   formData.state,
          country: formData.country,
          remote:  false,
        },
        skills: formData.skills.map((name) => ({
          name,
          category: formData.selectedCategory || "Other",
        })),
        services: formData.services
          .filter((s) => s.title && s.description)
          .map((s) => ({
            title:       s.title,
            description: s.description,
            priceMin:    parseFloat(s.priceMin)  || 0,
            priceMax:    s.priceMax ? parseFloat(s.priceMax) : null,
            currency:    formData.currency || "USD",
            priceUnit:   s.priceUnit,
            duration:    s.duration,
          })),
        socialLinks: [
          formData.linkedin  && { platform: "linkedin",  url: formData.linkedin },
          formData.twitter   && { platform: "twitter",   url: formData.twitter },
          formData.instagram && { platform: "instagram", url: formData.instagram },
          formData.website   && { platform: "website",   url: formData.website },
        ].filter(Boolean),
        // Contact info — flat fields mapped directly to backend
        email:    formData.email    || null,
        phone:    formData.phone    || null,
        whatsapp: formData.whatsapp || null,
        // Primary category
        category: formData.selectedCategory || null,
        hourlyRateMin: formData.hourlyRateMin ? parseFloat(formData.hourlyRateMin) : null,
        hourlyRateMax: formData.hourlyRateMax ? parseFloat(formData.hourlyRateMax) : null,
        currency:    formData.currency || "USD",
        serviceAreas: formData.serviceAreas ?? [],
        isVerified:  false,
        isAvailable: true,
      };

      const created = await createProfessional(payload);
      setSubmittedId(created?.id ?? null);
    } catch (err) {
      console.error("Error creating professional profile:", err);
      setErrors({ _submit: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Success Screen ────────────────────────────────────────────────────────
  if (submittedId !== undefined && !isSubmitting) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-14 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-500 mb-6">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re live on ProConnect! 🎉</h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8">
          Your profile is submitted and will be visible to clients shortly. Start sharing your profile link!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {submittedId && (
            <button
              onClick={() => router.push(`/professionals/${submittedId}`)}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition"
            >
              View My Profile <ArrowRight className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => router.push("/professionals")}
            className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition"
          >
            Browse Professionals
          </button>
        </div>
      </div>
    );
  }

  const progress = (currentStep / STEPS.length) * 100;

  // ─── Wizard Shell ──────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100">
        <div
          className="h-full bg-primary-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step tabs */}
      <div className="flex border-b border-gray-100">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const done   = step.id < currentStep;
          const active = step.id === currentStep;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => done && setCurrentStep(step.id)}
              disabled={step.id > currentStep}
              className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs font-medium transition border-b-2
                ${active ? "border-primary-500 text-primary-600"
                  : done  ? "border-transparent text-green-600 cursor-pointer"
                          : "border-transparent text-gray-400 cursor-default"}`}
            >
              <span className={`flex items-center justify-center w-7 h-7 rounded-full
                ${active ? "bg-primary-100 text-primary-700"
                  : done  ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"}`}>
                {done ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </span>
              <span className="hidden sm:block">{step.short}</span>
            </button>
          );
        })}
      </div>

      {/* Step body */}
      <div className="px-6 py-8 sm:px-10">
        {currentStep === 1 && (
          <Step1 formData={formData} errors={errors} update={update} clearError={clearError} />
        )}
        {currentStep === 2 && (
          <Step2
            formData={formData} errors={errors} update={update} clearError={clearError}
            isDetectingLocation={isDetectingLocation} detectLocation={detectLocation}
            serviceAreaInput={serviceAreaInput} setServiceAreaInput={setServiceAreaInput}
          />
        )}
        {currentStep === 3 && (
          <Step3
            formData={formData} errors={errors} update={update} clearError={clearError}
            categories={categories} loadingCategories={loadingCategories}
            subcategoriesByCategory={subcategoriesByCategory}
            addSkill={addSkill} removeSkill={removeSkill}
            customSkillInput={customSkillInput} setCustomSkillInput={setCustomSkillInput}
            customSkillRef={customSkillRef}
          />
        )}
        {currentStep === 4 && (
          <Step4
            formData={formData} errors={errors} update={update} clearError={clearError}
            updateService={updateService} removeService={removeService} addService={addService}
          />
        )}
        {currentStep === 5 && (
          <Step5 formData={formData} errors={errors} update={update} clearError={clearError} />
        )}
        {currentStep === 6 && (
          <Step6 formData={formData} update={update} />
        )}

        {/* Submit-level error */}
        {errors._submit && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {errors._submit}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={goBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <span className="text-xs text-gray-400">Step {currentStep} of {STEPS.length}</span>

          <button
            type="button"
            onClick={goNext}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-60 transition"
          >
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
            ) : currentStep === STEPS.length ? (
              <><CheckCircle className="h-4 w-4" /> Submit Profile</>
            ) : (
              <>Continue <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: About You ─────────────────────────────────────────────────────────

function Step1({
  formData, errors, update, clearError,
}: {
  formData: FormData; errors: FieldError;
  update: <K extends keyof FormData>(f: K, v: FormData[K]) => void;
  clearError: (f: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-gray-900">Tell us about yourself</h2>
        <p className="text-sm text-gray-500 mt-0.5">This is what clients will see on your public profile.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="First Name" required error={errors.firstName}>
          <TextInput
            placeholder="John"
            value={formData.firstName}
            onChange={(v) => { update("firstName", v); clearError("firstName"); }}
            error={errors.firstName}
          />
        </Field>
        <Field label="Last Name" required error={errors.lastName}>
          <TextInput
            placeholder="Doe"
            value={formData.lastName}
            onChange={(v) => { update("lastName", v); clearError("lastName"); }}
            error={errors.lastName}
          />
        </Field>
      </div>

      <Field
        label="Professional Headline"
        hint="A short tagline clients will see first — keep it punchy."
      >
        <TextInput
          placeholder="e.g., Licensed Electrician · Residential & Commercial"
          value={formData.headline}
          onChange={(v) => { update("headline", v); clearError("headline"); }}
        />
      </Field>

      <Field
        label="About You"
        hint="Describe your experience, specialty, and what makes you the best choice."
      >
        <textarea
          rows={5}
          value={formData.bio}
          onChange={(e) => { update("bio", e.target.value); clearError("bio"); }}
          placeholder="I've been a licensed plumber for 12 years, specializing in residential repairs and new installations. I pride myself on clean work, punctuality, and transparent pricing..."
          className={`w-full px-4 py-3 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 transition border-gray-300 focus:ring-primary-200 focus:border-primary-400`}
        />
      </Field>
    </div>
  );
}

// ─── Step 2: Location ──────────────────────────────────────────────────────────

function Step2({
  formData, errors, update, clearError, isDetectingLocation, detectLocation,
  serviceAreaInput, setServiceAreaInput,
}: {
  formData: FormData; errors: FieldError;
  update: <K extends keyof FormData>(f: K, v: FormData[K]) => void;
  clearError: (f: string) => void;
  isDetectingLocation: boolean;
  detectLocation: () => void;
  serviceAreaInput: string;
  setServiceAreaInput: (v: string) => void;
}) {
  const addArea = (val: string) => {
    const t = val.trim();
    if (t && !formData.serviceAreas.includes(t))
      update("serviceAreas", [...formData.serviceAreas, t]);
    setServiceAreaInput("");
  };
  const removeArea = (area: string) =>
    update("serviceAreas", formData.serviceAreas.filter((a) => a !== area));

  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-gray-900">Where are you based?</h2>
        <p className="text-sm text-gray-500 mt-0.5">Clients search by location — make it easy to find you.</p>
      </div>

      <button
        type="button"
        onClick={detectLocation}
        disabled={isDetectingLocation}
        className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-primary-300 text-primary-600 text-sm font-medium rounded-lg hover:bg-primary-50 transition disabled:opacity-60"
      >
        {isDetectingLocation ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Detecting your location...</>
        ) : (
          <><Navigation className="h-4 w-4" /> Use my current location</>
        )}
      </button>

      <div className="relative flex items-center gap-2 text-xs text-gray-400">
        <div className="flex-1 h-px bg-gray-200" />
        <span>or enter manually</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="City" required error={errors.city}>
          <TextInput
            placeholder="Mumbai"
            value={formData.city}
            onChange={(v) => { update("city", v); clearError("city"); }}
            error={errors.city}
          />
        </Field>
        <Field label="State / Province">
          <TextInput
            placeholder="Maharashtra"
            value={formData.state}
            onChange={(v) => update("state", v)}
          />
        </Field>
      </div>

      <Field label="Country" required error={errors.country}>
        <TextInput
          placeholder="India"
          value={formData.country}
          onChange={(v) => { update("country", v); clearError("country"); }}
          error={errors.country}
        />
      </Field>

      {/* Areas you serve */}
      <div className="pt-4 border-t border-gray-100">
        <p className="text-sm font-semibold text-gray-700 mb-0.5">
          Areas you serve <span className="text-gray-400 font-normal">(optional)</span>
        </p>
        <p className="text-xs text-gray-400 mb-3">
          Add cities or neighbourhoods outside your base location that you&apos;re willing to travel to.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={serviceAreaInput}
            onChange={(e) => setServiceAreaInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === ",") && serviceAreaInput.trim()) {
                e.preventDefault();
                addArea(serviceAreaInput);
              }
            }}
            placeholder="e.g. Bengaluru, Chennai, Pune…"
            className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
          />
          <button
            type="button"
            onClick={() => serviceAreaInput.trim() && addArea(serviceAreaInput)}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-lg border border-gray-300 transition"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {formData.serviceAreas.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.serviceAreas.map((area) => (
              <span key={area} className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 border border-primary-200 text-primary-700 text-sm rounded-full font-medium">
                <MapPin className="h-3 w-3" />
                {area}
                <button type="button" onClick={() => removeArea(area)} className="hover:text-red-500 transition ml-0.5">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 3: Skills ────────────────────────────────────────────────────────────

function Step3({
  formData, errors, update, clearError,
  categories, loadingCategories, subcategoriesByCategory,
  addSkill, removeSkill,
  customSkillInput, setCustomSkillInput, customSkillRef,
}: {
  formData: FormData; errors: FieldError;
  update: <K extends keyof FormData>(f: K, v: FormData[K]) => void;
  clearError: (f: string) => void;
  categories: string[]; loadingCategories: boolean;
  subcategoriesByCategory: { category: string; subcategories: string[] }[];
  addSkill: (s: string) => void; removeSkill: (s: string) => void;
  customSkillInput: string; setCustomSkillInput: (v: string) => void;
  customSkillRef: React.RefObject<HTMLInputElement>;
}) {
  const subGroup = subcategoriesByCategory.find((g) => g.category === formData.selectedCategory);

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-gray-900">What type of service do you offer?</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Pick the category that best describes your work. This is how clients will find you.
        </p>
      </div>

      {/* Category — primary action: large tile grid */}
      {loadingCategories ? (
        <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading categories...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((cat) => {
            const selected = formData.selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  update("selectedCategory", cat);
                  update("skills", []);
                  clearError("selectedCategory");
                  clearError("skills");
                }}
                className={`flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-xl border-2 text-sm font-medium transition
                  ${selected
                    ? "border-primary-500 bg-primary-50 text-primary-700 shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:bg-gray-50"}`}
              >
                <Briefcase className={`h-5 w-5 ${selected ? "text-primary-500" : "text-gray-400"}`} />
                <span className="text-center leading-tight">{cat}</span>
                {selected && <CheckCircle className="h-4 w-4 text-primary-500" />}
              </button>
            );
          })}
        </div>
      )}
      <ErrorMsg msg={errors.selectedCategory} />

      {/* Specializations — revealed only after category is chosen */}
      {formData.selectedCategory && (
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Specializations{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Pick the specific services you offer within{" "}
                <span className="text-primary-600 font-medium">{formData.selectedCategory}</span>.
              </p>
            </div>
          </div>

          {subGroup && subGroup.subcategories.length > 0 && (
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto p-3 bg-gray-50 rounded-xl border border-gray-200">
              {subGroup.subcategories.map((skill) => {
                const checked = formData.skills.includes(skill);
                return (
                  <label
                    key={skill}
                    className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer text-sm transition select-none
                      ${checked
                        ? "bg-primary-50 border border-primary-200 text-primary-700 font-medium"
                        : "bg-white border border-gray-200 text-gray-700 hover:border-primary-300"}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => e.target.checked ? addSkill(skill) : removeSkill(skill)}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                    {skill}
                  </label>
                );
              })}
            </div>
          )}

          {/* Custom skill */}
          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Or add a custom specialization
            </label>
            <div className="flex gap-2">
              <input
                ref={customSkillRef}
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customSkillInput.trim()) {
                    e.preventDefault();
                    addSkill(customSkillInput);
                    setCustomSkillInput("");
                  }
                }}
                placeholder="e.g., Leak detection, Portrait photography..."
                className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
              />
              <button
                type="button"
                onClick={() => { if (customSkillInput.trim()) { addSkill(customSkillInput); setCustomSkillInput(""); } }}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-lg border border-gray-300 transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Selected skills */}
          {formData.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full font-medium"
                >
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 transition">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Step 4: Pricing ───────────────────────────────────────────────────────────

function Step4({
  formData, errors, update, clearError, updateService, removeService, addService,
}: {
  formData: FormData; errors: FieldError;
  update: <K extends keyof FormData>(f: K, v: FormData[K]) => void;
  clearError: (f: string) => void;
  updateService: (i: number, f: keyof ServiceFormData, v: string) => void;
  removeService: (i: number) => void;
  addService: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-gray-900">Your rates &amp; services</h2>
        <p className="text-sm text-gray-500 mt-0.5">Be transparent with pricing — clients appreciate it.</p>
      </div>

      {/* Hourly rate */}
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">Hourly Rate</p>
          {/* Currency selector */}
          <select
            value={formData.currency}
            onChange={(e) => update("currency", e.target.value)}
            className="text-xs font-medium border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 text-gray-700"
          >
            <option value="USD">USD ($)</option>
            <option value="INR">INR (₹)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="AED">AED (د.إ)</option>
            <option value="SGD">SGD (S$)</option>
            <option value="AUD">AUD (A$)</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label={`Min rate / hr`}>
            <TextInput
              type="number"
              placeholder="500"
              value={formData.hourlyRateMin}
              onChange={(v) => { update("hourlyRateMin", v); clearError("hourlyRateMin"); }}
              icon={<DollarSign className="h-4 w-4" />}
            />
          </Field>
          <Field label={`Max rate / hr — optional`}>
            <TextInput
              type="number"
              placeholder="2000"
              value={formData.hourlyRateMax}
              onChange={(v) => update("hourlyRateMax", v)}
              icon={<DollarSign className="h-4 w-4" />}
            />
          </Field>
        </div>
      </div>

      {/* Service packages */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">
            Service Packages <span className="text-gray-400 font-normal">(optional)</span>
          </p>
          <button
            type="button"
            onClick={addService}
            className="flex items-center gap-1.5 text-xs text-primary-600 font-medium hover:text-primary-700 transition"
          >
            <Plus className="h-3.5 w-3.5" /> Add package
          </button>
        </div>

        <div className="space-y-4">
          {formData.services.map((svc, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-xl relative bg-white">
              {formData.services.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeService(i)}
                  className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <div className="space-y-3">
                <TextInput
                  placeholder="Package title, e.g., Full House Wiring"
                  value={svc.title}
                  onChange={(v) => updateService(i, "title", v)}
                />
                <textarea
                  rows={2}
                  value={svc.description}
                  onChange={(e) => updateService(i, "description", e.target.value)}
                  placeholder="Briefly describe what's included..."
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                />
                <div className="grid grid-cols-3 gap-2">
                  <TextInput type="number" placeholder="Price min" value={svc.priceMin} onChange={(v) => updateService(i, "priceMin", v)} />
                  <TextInput type="number" placeholder="Price max" value={svc.priceMax} onChange={(v) => updateService(i, "priceMax", v)} />
                  <select
                    value={svc.priceUnit}
                    onChange={(e) => updateService(i, "priceUnit", e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                  >
                    <option value="per project">Per project</option>
                    <option value="per hour">Per hour</option>
                    <option value="per day">Per day</option>
                    <option value="per session">Per session</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 5: Contact Info ──────────────────────────────────────────────────────

function Step5({
  formData, errors, update, clearError,
}: {
  formData: FormData; errors: FieldError;
  update: <K extends keyof FormData>(f: K, v: FormData[K]) => void;
  clearError: (f: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-gray-900">How can clients reach you?</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          At least one contact method is required so clients can get in touch.
        </p>
      </div>

      <Field label="Email Address" required error={errors.email}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Mail className="h-4 w-4" />
          </span>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => { update("email", e.target.value); clearError("email"); }}
            placeholder="you@example.com"
            className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition
              ${errors.email ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-primary-200 focus:border-primary-400"}`}
          />
        </div>
      </Field>

      <Field label="Phone Number" hint="Include country code, e.g. +91 98765 43210">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Phone className="h-4 w-4" />
          </span>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition"
          />
        </div>
      </Field>

      <Field label="WhatsApp Number" hint="If different from your phone number">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">
            <MessageCircle className="h-4 w-4" />
          </span>
          <input
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition"
          />
        </div>
      </Field>

      <p className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
        🔒 Your contact details are only shared with clients who express interest in your services.
      </p>
    </div>
  );
}

// ─── Step 6: Online Links ──────────────────────────────────────────────────────

function Step6({
  formData, update,
}: {
  formData: FormData;
  update: <K extends keyof FormData>(f: K, v: FormData[K]) => void;
}) {
  const links: { key: keyof FormData; label: string; icon: React.ReactNode; placeholder: string }[] = [
    { key: "linkedin",  label: "LinkedIn",           icon: <Linkedin  className="h-4 w-4 text-[#0A66C2]" />, placeholder: "https://linkedin.com/in/yourprofile" },
    { key: "website",   label: "Website / Portfolio", icon: <Globe     className="h-4 w-4 text-gray-500"   />, placeholder: "https://yourwebsite.com" },
    { key: "instagram", label: "Instagram",           icon: <Instagram className="h-4 w-4 text-[#E1306C]" />, placeholder: "https://instagram.com/yourhandle" },
    { key: "twitter",   label: "Twitter / X",         icon: <Twitter   className="h-4 w-4 text-[#1DA1F2]" />, placeholder: "https://twitter.com/yourhandle" },
  ];

  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-gray-900">Online presence</h2>
        <p className="text-sm text-gray-500 mt-0.5">All optional — but clients love to see your work online.</p>
      </div>

      {links.map(({ key, label, icon, placeholder }) => (
        <Field key={key as string} label={label}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
            <input
              type="url"
              value={formData[key] as string}
              onChange={(e) => update(key, e.target.value as FormData[typeof key])}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition"
            />
          </div>
        </Field>
      ))}

      <p className="text-xs text-gray-400 pt-2">
        💡 Tip: A complete profile with links gets up to <strong>3× more inquiries</strong>.
      </p>
    </div>
  );
}
