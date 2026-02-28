import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — ProConnect",
  description: "Learn how ProConnect collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "March 1, 2026";
const CONTACT_EMAIL = "support@proconnect.in";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <p className="text-sm text-primary-600 font-medium mb-2">Legal</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
          <p className="text-gray-500 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12 space-y-10 text-gray-700 leading-relaxed">

          <Section title="1. Overview">
            <p>
              ProConnect (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the ProConnect platform, a professional services
              discovery marketplace that connects clients with skilled service providers across India.
              This Privacy Policy explains what information we collect, how we use it, and the choices
              you have regarding your information.
            </p>
            <p>
              By using our platform, you agree to the collection and use of information in accordance
              with this policy. If you do not agree, please discontinue use of our services.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <SubSection title="2.1 Information you provide directly">
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Professionals:</strong> Name, email address, phone number, WhatsApp number, city, state, professional headline, biography, service categories, skills, hourly rates, and portfolio links provided during profile creation.</li>
                <li><strong>Clients:</strong> Email address collected during the contact-reveal flow (OTP verification) to authenticate your request to view a professional&apos;s contact details.</li>
                <li><strong>Communications:</strong> Messages, inquiries, or reviews you submit through the platform.</li>
              </ul>
            </SubSection>
            <SubSection title="2.2 Information collected automatically">
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>IP address:</strong> Logged during contact-reveal requests for rate-limiting and abuse prevention.</li>
                <li><strong>Usage data:</strong> Pages viewed, search queries, and interaction events collected via standard server logs.</li>
                <li><strong>Cookies &amp; local storage:</strong> We store your city preference in browser local storage to pre-fill the search bar. No third-party advertising cookies are used.</li>
              </ul>
            </SubSection>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-2">
              <li>To display professional profiles to prospective clients searching for services.</li>
              <li>To authenticate contact-reveal requests via one-time password (OTP) sent to your email.</li>
              <li>To enforce rate limits and prevent abuse of the contact-reveal system.</li>
              <li>To send transactional emails (OTP codes, booking-review invitations). We do not send unsolicited marketing emails.</li>
              <li>To notify professionals of new contact reveals (opt-in feature, disabled by default).</li>
              <li>To improve search relevance, platform stability, and user experience.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </Section>

          <Section title="4. Data Sharing">
            <p>
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
              Information is shared only in the following limited circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>Professional contact details</strong> (email, phone, WhatsApp) are shared only with clients who complete OTP verification — this is the core service you signed up for as a professional.</li>
              <li><strong>Service providers:</strong> We use Render (hosting), Railway (database), and Resend (transactional email). These providers process data only as directed by us and are bound by their own privacy and security standards.</li>
              <li><strong>Legal requirements:</strong> We may disclose information when required by law, court order, or to protect the rights and safety of our users.</li>
            </ul>
          </Section>

          <Section title="5. Data Retention">
            <p>
              Professional profiles are retained as long as the account is active. You may request deletion
              at any time (see Section 7). Contact-reveal logs (IP and email) are retained for 90 days
              for rate-limiting and fraud prevention, then deleted. OTP codes expire within 10 minutes and
              are purged from our systems after expiry.
            </p>
          </Section>

          <Section title="6. Data Security">
            <p>
              We implement industry-standard security measures including HTTPS encryption in transit,
              hashed/encrypted storage of sensitive tokens, and access controls on our database.
              However, no method of transmission over the internet is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </Section>

          <Section title="7. Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Update your professional profile at any time via your dashboard.</li>
              <li><strong>Deletion:</strong> Request permanent deletion of your profile and associated data by emailing {CONTACT_EMAIL}. We will process requests within 30 days.</li>
              <li><strong>Portability:</strong> Request your profile data in a structured, machine-readable format.</li>
              <li><strong>Opt-out:</strong> Opt out of lead-notification emails by contacting us — this feature is off by default.</li>
            </ul>
          </Section>

          <Section title="8. Cookies">
            <p>
              We use only functional cookies and browser local storage necessary for the platform to operate
              (e.g., authentication token in a secure cookie, city preference in local storage). We do not
              use analytics tracking cookies or advertising cookies. You may clear cookies and local storage
              via your browser settings at any time.
            </p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>
              Our platform is not directed at children under the age of 18. We do not knowingly collect
              personal information from minors. If you believe a minor has provided us with personal
              information, please contact us and we will delete it promptly.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will post the updated policy on
              this page with a revised &quot;Last updated&quot; date. Continued use of the platform after changes
              constitutes acceptance of the updated policy. For significant changes we will notify
              registered professionals by email.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm">
              <p className="font-semibold text-gray-900">ProConnect</p>
              <p className="text-gray-600 mt-1">Email: <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-600 hover:underline">{CONTACT_EMAIL}</a></p>
              <p className="text-gray-600">Website: <Link href="/" className="text-primary-600 hover:underline">proconnect.in</Link></p>
            </div>
          </Section>

        </div>

        {/* Footer nav */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
          <span className="mx-3 text-gray-300">·</span>
          <Link href="/" className="hover:text-gray-700 transition-colors">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      {children}
    </div>
  );
}
