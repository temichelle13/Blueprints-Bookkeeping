import { usePageTitle } from "@/hooks/use-page-title";
import { Link } from "wouter";

export default function Privacy() {
  usePageTitle("Privacy Policy");

  return (
    <div className="pt-24 pb-20">
      <section className="py-16 mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="accent-bar mb-6" />
          <h1 className="text-4xl font-display font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm">Last updated: March 2026</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="glass-card rounded-2xl p-8 space-y-6 text-[15px] leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-white font-bold text-lg mb-3">1. Who We Are</h2>
            <p>Blueprints & Bookkeeping LLC ("we," "our," or "us") is a financial consulting firm based in Roseburg, Oregon. We provide bookkeeping, business planning, and related services to clients nationwide. This Privacy Policy explains how we collect, use, and protect information when you visit our website or engage with our services.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect information you voluntarily provide, including:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Name, email address, and phone number submitted through our contact form</li>
              <li>Business name, industry, and financial details shared for service inquiries</li>
              <li>Email address submitted for newsletter signup</li>
            </ul>
            <p className="mt-3">We do not collect payment information directly — payment processing is handled by secure third-party providers (Stripe).</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Respond to your inquiries and provide our services</li>
              <li>Send newsletters and financial tips you have subscribed to</li>
              <li>Improve our website and service offerings</li>
              <li>Comply with applicable legal obligations</li>
            </ul>
            <p className="mt-3">We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">4. Email Communications</h2>
            <p>If you subscribe to our newsletter, we will send you periodic emails containing financial tips, business insights, and updates about our services. You may unsubscribe at any time by clicking the unsubscribe link in any email or visiting our <Link href="/unsubscribe" className="text-accent hover:underline">unsubscribe page</Link>.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">5. Data Retention</h2>
            <p>We retain contact inquiry information for as long as necessary to provide our services and comply with legal obligations. Newsletter subscriber information is retained until you unsubscribe. You may request deletion of your data at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">6. Security</h2>
            <p>We implement industry-standard security measures to protect your information, including encrypted data transmission (HTTPS) and secure database storage. While we take reasonable precautions, no internet transmission is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">7. Cookies</h2>
            <p>Our website may use essential cookies to maintain website functionality. We do not use advertising or tracking cookies. You can configure your browser to refuse cookies, though this may affect certain website features.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">8. Your Rights Under Oregon Law</h2>
            <p className="mb-3">Under the Oregon Consumer Privacy Act (OCPA), Oregon residents have specific rights regarding their personal data. As an Oregon-based business, we respect and uphold these rights. You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><span className="text-white font-medium">Right to Know / Access</span> — Confirm whether we are processing your personal data and obtain a copy of it.</li>
              <li><span className="text-white font-medium">Right to Correct</span> — Request correction of inaccurate personal data we hold about you.</li>
              <li><span className="text-white font-medium">Right to Delete</span> — Request deletion of personal data you have provided to us or that we have obtained about you.</li>
              <li><span className="text-white font-medium">Right to Data Portability</span> — Obtain a copy of your personal data in a portable and readily usable format, to the extent technically feasible.</li>
              <li><span className="text-white font-medium">Right to Opt Out</span> — Opt out of the processing of your personal data for purposes of sale, targeted advertising, or certain types of profiling.</li>
              <li><span className="text-white font-medium">Right to Appeal</span> — Appeal a decision we make regarding your privacy rights request.</li>
            </ul>
            <p className="mt-4">To exercise any of these rights, please contact us at <a href="mailto:tea@blueprintsandbookkeeping.com" className="text-accent hover:underline">tea@blueprintsandbookkeeping.com</a>. We will respond to your request within 45 days. If we need additional time, we will notify you and may extend the response period by an additional 45 days.</p>
            <p className="mt-3">If we deny your request, you may appeal the decision by contacting us at the same email address. We will respond to your appeal within 45 days.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">9. Global Privacy Control (GPC)</h2>
            <p className="mb-3">We respect the <a href="https://globalprivacycontrol.org/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Global Privacy Control (GPC)</a> signal. GPC is a browser-level setting that lets you tell websites you do not want your personal data sold or shared. When we detect the GPC signal from your browser, we treat it as a valid opt-out request and will not engage in any discretionary tracking or data sharing for your visit.</p>
            <p className="mb-3">To enable GPC, you can use a supported browser or browser extension that sends the <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">Sec-GPC</code> header automatically. Supported options include:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Firefox (built-in setting under Privacy & Security)</li>
              <li>Brave (enabled by default)</li>
              <li>DuckDuckGo browser and extension</li>
              <li>Privacy Badger extension</li>
            </ul>
            <p className="mt-3">No action is needed beyond enabling GPC in your browser — our site automatically detects and honors the signal on every request.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">10. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please reach out:</p>
            <div className="mt-3 pl-4 border-l border-accent/30 space-y-1">
              <p>Blueprints & Bookkeeping LLC</p>
              <p>Roseburg, Oregon</p>
              <p><a href="mailto:tea@blueprintsandbookkeeping.com" className="text-accent hover:underline">tea@blueprintsandbookkeeping.com</a></p>
              <p><a href="tel:+15413198654" className="text-accent hover:underline">(541) 319-8654</a></p>
            </div>
          </section>
        </div>

        <div className="text-center">
          <Link href="/" className="text-accent hover:underline text-sm">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
