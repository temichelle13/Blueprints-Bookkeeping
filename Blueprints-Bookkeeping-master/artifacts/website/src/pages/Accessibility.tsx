import { usePageTitle } from "@/hooks/use-page-title";
import { SEO } from "@/components/SEO";
import {
  breadcrumbSchema,
  localBusinessSchema,
  professionalServiceSchema,
} from "@/lib/seo-schemas";

export default function Accessibility() {
  usePageTitle("Accessibility Statement");
  const BASE_URL = "https://blueprintsandbookkeeping.com";
  const jsonLd = [
    localBusinessSchema(),
    professionalServiceSchema({ url: `${BASE_URL}/accessibility` }),
    breadcrumbSchema([
      { name: "Home", url: BASE_URL },
      { name: "Accessibility Statement", url: `${BASE_URL}/accessibility` },
    ]),
  ];

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Accessibility Statement"
        path="/accessibility"
        description="Blueprints & Bookkeeping is committed to ensuring digital accessibility for people with disabilities. Learn about our accessibility features and how to report issues."
        jsonLd={jsonLd}
      />

      <section className="py-16 mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="accent-bar mb-6" />
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Accessibility Statement
          </h1>
          <p className="text-muted-foreground text-sm">
            Last updated: March 2026
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="glass-card rounded-2xl p-8 space-y-6 text-[15px] leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              Our Commitment
            </h2>
            <p>
              Blueprints & Bookkeeping is committed to ensuring digital
              accessibility for people with disabilities. We are continually
              improving the user experience for everyone and applying the
              relevant accessibility standards to ensure we provide equal access
              to all of our users.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              Conformance Status
            </h2>
            <p className="mb-3">
              The{" "}
              <a
                href="https://www.w3.org/WAI/standards-guidelines/wcag/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Web Content Accessibility Guidelines (WCAG)
              </a>{" "}
              defines requirements for designers and developers to improve
              accessibility for people with disabilities. It defines three
              levels of conformance: Level A, Level AA, and Level AAA.
            </p>
            <p>
              Blueprints & Bookkeeping is partially conformant with WCAG 2.1
              Level AA. Partially conformant means that some parts of the
              content do not fully conform to the accessibility standard.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              Accessibility Features
            </h2>
            <p className="mb-3">
              Our website includes the following accessibility features:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <span className="text-white font-medium">
                  Keyboard Navigation
                </span>{" "}
                — All interactive elements can be accessed using keyboard
                shortcuts
              </li>
              <li>
                <span className="text-white font-medium">
                  Screen Reader Support
                </span>{" "}
                — Semantic HTML and ARIA labels for assistive technologies
              </li>
              <li>
                <span className="text-white font-medium">Color Contrast</span> —
                Text and interactive elements meet WCAG AA contrast requirements
              </li>
              <li>
                <span className="text-white font-medium">
                  Responsive Design
                </span>{" "}
                — Content adapts to different screen sizes and zoom levels
              </li>
              <li>
                <span className="text-white font-medium">Clear Structure</span>{" "}
                — Proper heading hierarchy and logical page structure
              </li>
              <li>
                <span className="text-white font-medium">Alternative Text</span>{" "}
                — Descriptive alt text for images and graphics
              </li>
              <li>
                <span className="text-white font-medium">Form Labels</span> —
                Clear labels and instructions for all form fields
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              Known Limitations
            </h2>
            <p className="mb-3">
              Despite our best efforts to ensure accessibility, there may be
              some limitations. Below are known issues we are working to
              address:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>
                Some third-party embedded content (e.g., Calendly scheduling)
                may not be fully accessible
              </li>
              <li>
                Certain complex interactive components may require additional
                testing and improvements
              </li>
              <li>
                PDF documents may not be fully accessible and we are working to
                provide accessible alternatives
              </li>
            </ul>
            <p className="mt-3">
              We are actively working to improve these areas and ensure full
              accessibility compliance.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              Third-Party Content
            </h2>
            <p>
              Some content on our website may be provided by third-party
              services (such as Calendly for scheduling). While we strive to
              select accessible third-party services, we may not have direct
              control over their accessibility. We encourage you to contact us
              if you encounter accessibility barriers with any third-party
              content.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              Feedback and Contact Information
            </h2>
            <p className="mb-3">
              We welcome your feedback on the accessibility of our website. If
              you encounter any accessibility barriers or have suggestions for
              improvement, please let us know:
            </p>
            <div className="mt-3 pl-4 border-l border-accent/30 space-y-1">
              <p className="text-white font-medium">
                Blueprints & Bookkeeping LLC
              </p>
              <p>Roseburg, Oregon</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:tea@blueprintsandbookkeeping.com"
                  className="text-accent hover:underline"
                >
                  tea@blueprintsandbookkeeping.com
                </a>
              </p>
              <p>
                Phone:{" "}
                <a
                  href="tel:+15413198654"
                  className="text-accent hover:underline"
                >
                  (541) 319-8654
                </a>
              </p>
            </div>
            <p className="mt-4">
              We aim to respond to accessibility feedback within 5 business
              days.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              Alternative Access
            </h2>
            <p>
              If you are unable to access any content or use any features on our
              website due to accessibility barriers, please contact us directly.
              We will work with you to provide the information or service you
              need through an alternative method that is accessible to you, such
              as phone support, email, or alternative document formats.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              Technical Specifications
            </h2>
            <p className="mb-3">
              Our website accessibility relies on the following technologies to
              work with the particular combination of web browser and any
              assistive technologies or plugins installed on your computer:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>HTML5</li>
              <li>WAI-ARIA (Accessible Rich Internet Applications)</li>
              <li>CSS</li>
              <li>JavaScript</li>
            </ul>
            <p className="mt-3">
              These technologies are relied upon for conformance with the
              accessibility standards used.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              Assessment and Testing
            </h2>
            <p>
              This website has been tested using a combination of automated
              accessibility testing tools and manual review. We continue to
              conduct ongoing accessibility audits and improvements.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">
              Formal Complaints
            </h2>
            <p>
              If you are not satisfied with our response to your accessibility
              concern, you may file a complaint with the appropriate regulatory
              authority in your jurisdiction.
            </p>
          </section>

          <section className="pt-6 border-t border-white/10">
            <p className="text-xs text-muted-foreground/70">
              This statement was created on March 22, 2026, and is reviewed
              regularly to ensure it remains accurate and up-to-date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
