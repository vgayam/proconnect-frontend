import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — ProConnect",
  description: "Read the terms and conditions governing your use of the ProConnect platform.",
};

const LAST_UPDATED = "March 1, 2026";
const CONTACT_EMAIL = "support@proconnect.in";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <p className="text-sm text-primary-600 font-medium mb-2">Legal</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Terms of Service</h1>
          <p className="text-gray-500 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12 space-y-10 text-gray-700 leading-relaxed">

          <Section title="1. Acceptance of Terms">
            <p>
              By accessing or using ProConnect (&quot;the Platform&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), you agree to be
              bound by these Terms of Service and our <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
              If you do not agree to all of these terms, you may not use the Platform.
            </p>
            <p>
              These terms apply to all users, including clients who search for services and professionals who
              create profiles to offer their services.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              ProConnect is a professional services discovery platform that allows independent service
              providers (&quot;Professionals&quot;) to create public profiles and allows prospective clients
              (&quot;Clients&quot;) to discover and contact those professionals. ProConnect is a discovery
              platform only — we are not a party to any service agreement between Clients and Professionals,
              and we do not employ, endorse, or guarantee the work of any Professional listed on the Platform.
            </p>
          </Section>

          <Section title="3. User Accounts &amp; Registration">
            <ul className="list-disc pl-5 space-y-2">
              <li>You must be at least 18 years of age to create a profile on the Platform.</li>
              <li>Each professional may maintain only one profile. Creating duplicate profiles is prohibited and may result in all associated profiles being removed.</li>
              <li>You are responsible for maintaining the confidentiality of your authentication credentials and for all activity that occurs under your account.</li>
              <li>You agree to provide accurate, complete, and current information when creating or updating your profile.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms or that we reasonably believe are being used fraudulently.</li>
            </ul>
          </Section>

          <Section title="4. Professional Listings">
            <p>Professionals agree that their publicly listed profile:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Accurately represents the services they offer and their qualifications.</li>
              <li>Does not include false, misleading, or deceptive information.</li>
              <li>Does not infringe any third-party intellectual property rights (e.g., using others&apos; work as your own in portfolios).</li>
              <li>Does not offer illegal services or services that violate applicable law.</li>
            </ul>
            <p className="mt-3">
              We reserve the right to remove or unpublish any listing that violates these terms, without prior notice.
            </p>
          </Section>

          <Section title="5. Contact Reveal &amp; Communication">
            <p>
              Clients who wish to view a Professional&apos;s contact details (email, phone, WhatsApp) must
              complete an email OTP verification. By completing this process:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>You confirm that you are a genuine prospective client contacting the Professional for legitimate service enquiries.</li>
              <li>You agree not to use revealed contact information for spam, harassment, unsolicited marketing, or any purpose other than contacting the Professional about their listed services.</li>
              <li>You acknowledge that ProConnect logs your email address and IP for rate-limiting and abuse prevention.</li>
            </ul>
          </Section>

          <Section title="6. Prohibited Conduct">
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Scrape, crawl, or systematically extract data from the Platform without written permission.</li>
              <li>Use automated tools to create accounts, submit forms, or access the Platform at scale.</li>
              <li>Attempt to circumvent rate limits, OTP verification, or any other security measure.</li>
              <li>Post fake reviews, testimonials, or ratings.</li>
              <li>Impersonate another person, business, or entity.</li>
              <li>Use the Platform to engage in any fraudulent, deceptive, or harmful activity.</li>
              <li>Transmit any malware, viruses, or malicious code through the Platform.</li>
            </ul>
          </Section>

          <Section title="7. Intellectual Property">
            <p>
              The ProConnect brand, logo, design, and original platform content are owned by ProConnect
              and protected by applicable intellectual property laws. You may not use our trademarks or
              branding without prior written consent.
            </p>
            <p>
              By submitting content to the Platform (e.g., profile text, portfolio descriptions), you grant
              ProConnect a non-exclusive, royalty-free, worldwide licence to display and distribute that
              content on the Platform for the purpose of operating the service. You retain ownership of
              your content and may request its removal at any time.
            </p>
          </Section>

          <Section title="8. Disclaimer of Warranties">
            <p>
              The Platform is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind,
              express or implied. We do not warrant that the Platform will be uninterrupted, error-free,
              or free from harmful components. We do not verify the qualifications, licences, or identity
              of Professionals listed on the Platform. Clients engage Professionals entirely at their own risk.
            </p>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>
              To the fullest extent permitted by applicable law, ProConnect shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages arising from your use of
              or inability to use the Platform, including but not limited to damages arising from reliance
              on Professional listings, disputes between Clients and Professionals, or loss of data.
            </p>
            <p>
              Our total aggregate liability to you for any claim arising out of or relating to these terms
              or the Platform shall not exceed ₹1,000 (Indian Rupees one thousand).
            </p>
          </Section>

          <Section title="10. Indemnification">
            <p>
              You agree to indemnify and hold harmless ProConnect, its officers, directors, and employees
              from any claims, damages, losses, or expenses (including legal fees) arising out of your
              use of the Platform, your content, your violation of these terms, or your violation of any
              third-party rights.
            </p>
          </Section>

          <Section title="11. Governing Law">
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of India.
              Any disputes arising under or in connection with these terms shall be subject to the exclusive
              jurisdiction of the courts of Bengaluru, Karnataka, India.
            </p>
          </Section>

          <Section title="12. Changes to Terms">
            <p>
              We reserve the right to modify these Terms at any time. Changes will be posted on this page
              with an updated &quot;Last updated&quot; date. Continued use of the Platform after changes are posted
              constitutes your acceptance of the revised Terms. For material changes, we will notify
              registered Professionals via email.
            </p>
          </Section>

          <Section title="13. Contact">
            <p>For questions about these Terms of Service, please contact:</p>
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm">
              <p className="font-semibold text-gray-900">ProConnect</p>
              <p className="text-gray-600 mt-1">Email: <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-600 hover:underline">{CONTACT_EMAIL}</a></p>
              <p className="text-gray-600">Website: <Link href="/" className="text-primary-600 hover:underline">proconnect.in</Link></p>
            </div>
          </Section>

        </div>

        {/* Footer nav */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
          <span className="mx-3 text-gray-300">·</span>
          <Link href="/" className="hover:text-gray-700 transition-colors">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
