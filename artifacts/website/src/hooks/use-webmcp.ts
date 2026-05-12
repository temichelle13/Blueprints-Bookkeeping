import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { getApiRoot } from "@/lib/api";
import {
  CONTACT_CONSENT_TEXT_VERSION,
  CONTACT_CONSENT_SOURCE_PAGE,
} from "@/hooks/use-contact";

interface WebMCPInputSchema {
  type: string;
  properties: Record<string, unknown>;
  required?: string[];
}

interface WebMCPTool {
  name: string;
  description: string;
  inputSchema: WebMCPInputSchema;
  execute: (input: Record<string, unknown>) => Promise<string>;
}

declare global {
  interface Navigator {
    modelContext?: {
      provideContext: (tools: WebMCPTool[]) => void;
    };
  }
}

const STANDARD_CALENDLY_URL =
  "https://calendly.com/tea-blueprintsandbookkeeping/30min";
const EMERGENCY_CALENDLY_URL =
  "https://calendly.com/tea-blueprintsandbookkeeping/emergency-or-other-expedited-request";

export function useWebMCP(): void {
  const [, navigate] = useLocation();
  const navigateRef = useRef(navigate);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    if (typeof navigator.modelContext?.provideContext !== "function") {
      return;
    }

    const apiBase = getApiRoot();

    const tools: WebMCPTool[] = [
      {
        name: "navigate_to_page",
        description:
          "Navigate to a specific page on the Blueprints & Bookkeeping website.",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "The page path to navigate to.",
              enum: [
                "/",
                "/services",
                "/industries",
                "/about",
                "/pricing",
                "/about/credentials",
                "/results",
                "/blog",
                "/contact",
                "/faq",
                "/schedule",
                "/get-started",
                "/tax-partners",
                "/referral",
                "/business-planning",
                "/services/bookkeeping",
                "/services/business-plans",
                "/oregon-bookkeeper",
              ],
            },
          },
          required: ["path"],
        },
        execute: async (input) => {
          const path = input.path as string;
          navigateRef.current(path);
          return `Navigated to ${path}`;
        },
      },
      {
        name: "get_site_info",
        description:
          "Get information about Blueprints & Bookkeeping — the business, services, contact details, and scheduling links.",
        inputSchema: {
          type: "object",
          properties: {},
        },
        execute: async () => {
          return JSON.stringify({
            business: "Blueprints & Bookkeeping, LLC",
            owner: "Tea Larson-Hetrick",
            location: "Roseburg, OR (serving clients nationwide)",
            email: "tea@blueprintsandbookkeeping.com",
            phone: "(541) 319-8654",
            services: [
              {
                name: "Advanced Bookkeeping",
                description:
                  "Ongoing monthly bookkeeping, QuickBooks Online management, and reconciliation. Specializing in niche industries including crypto, ag/timber, SaaS, independent contractors, gig-workers, and rural businesses.",
              },
              {
                name: "Business Plans",
                description:
                  "Startup plans, management reports and financials, LivePlan-powered forecasting, target market analysis, growth potential analysis, and full business plan design.",
              },
            ],
            scheduling: {
              standard: STANDARD_CALENDLY_URL,
              emergency: EMERGENCY_CALENDLY_URL,
            },
            maxClients: 20,
          });
        },
      },
      {
        name: "schedule_consultation",
        description:
          "Navigate to the scheduling page to book a consultation with Blueprints & Bookkeeping.",
        inputSchema: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["standard", "emergency"],
              description:
                "Consultation type: 'standard' for a 30-minute introductory meeting, 'emergency' for an expedited 15-minute meeting.",
            },
          },
        },
        execute: async (input) => {
          navigateRef.current("/schedule");
          const url =
            input.type === "emergency"
              ? EMERGENCY_CALENDLY_URL
              : STANDARD_CALENDLY_URL;
          return `Navigated to the schedule page. Direct booking link: ${url}`;
        },
      },
      {
        name: "submit_contact_inquiry",
        description:
          "Submit a quick contact inquiry to Blueprints & Bookkeeping on behalf of the user. The user must explicitly consent to receiving email responses.",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Full name of the person submitting the inquiry.",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email address for follow-up.",
            },
            message: {
              type: "string",
              description: "The inquiry message (at least 10 characters).",
            },
            emailConsent: {
              type: "boolean",
              const: true,
              description:
                "Whether the user consents to receive email responses. Must be true to submit.",
            },
          },
          required: ["name", "email", "message", "emailConsent"],
        },
        execute: async (input) => {
          if (!input.emailConsent) {
            return "Error: emailConsent must be true to submit the contact form. Please confirm the user agrees to receive email responses.";
          }
          try {
            const response = await fetch(`${apiBase}/contact`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                formType: "quick",
                name: input.name,
                email: input.email,
                message: input.message,
                // The API contract expects both a nested consent object and
              // top-level convenience fields; this mirrors use-contact.ts.
              consent: {
                  email: true,
                  sms: false,
                  phone: false,
                  source: CONTACT_CONSENT_SOURCE_PAGE,
                  legalTextVersion: CONTACT_CONSENT_TEXT_VERSION,
                },
                smsConsent: false,
                consentTextVersion: CONTACT_CONSENT_TEXT_VERSION,
                consentSourcePage: CONTACT_CONSENT_SOURCE_PAGE,
                website: "",
              }),
            });
            if (!response.ok) {
              const body = await response.text().catch(() => "");
              return `Error: Failed to submit contact inquiry (HTTP ${response.status}). ${body}`.trim();
            }
            return "Contact inquiry submitted successfully. Blueprints & Bookkeeping will follow up by email.";
          } catch (err) {
            return `Error: Could not reach the server. ${err instanceof Error ? err.message : String(err)}`;
          }
        },
      },
      {
        name: "subscribe_to_newsletter",
        description:
          "Subscribe an email address to the Blueprints & Bookkeeping newsletter.",
        inputSchema: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "Email address to subscribe.",
            },
          },
          required: ["email"],
        },
        execute: async (input) => {
          try {
            const response = await fetch(`${apiBase}/newsletter/subscribe`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: input.email,
                signupSource: "footer",
              }),
            });
            if (!response.ok) {
              const body = await response.text().catch(() => "");
              return `Error: Failed to subscribe (HTTP ${response.status}). ${body}`.trim();
            }
            const data = (await response.json()) as { message?: string };
            return data.message ?? "Successfully subscribed to the newsletter.";
          } catch (err) {
            return `Error: Could not reach the server. ${err instanceof Error ? err.message : String(err)}`;
          }
        },
      },
    ];

    navigator.modelContext.provideContext(tools);
  }, []);
}
