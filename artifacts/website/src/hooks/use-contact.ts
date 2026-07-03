import { z } from "zod";
import {
  type ContactFormInput,
  useSubmitContactForm,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";

export const CONTACT_CONSENT_TEXT_VERSION = "contact-consent-2026-06-25.1";
export const CONTACT_CONSENT_SOURCE_PAGE = "/contact";

export const quickContactSchema = z.object({
  formType: z.literal("quick"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Please provide a little more detail"),
  emailConsent: z.boolean().refine((val) => val === true, {
    message: "Email consent is required so we can respond to your inquiry",
  }),
  smsConsent: z.boolean(),
  phoneConsent: z.boolean(),
  website: z.string().optional(),
  turnstileResponse: z.string().min(1, "Please complete the verification step"),
});

export const detailedContactSchema = z.object({
  formType: z.literal("detailed"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  businessName: z.string().min(2, "Business name is required"),
  industry: z.string().min(2, "Please select an industry"),
  servicesInterested: z.array(z.string()).min(1, "Select at least one service"),
  monthlyRevenueRange: z.string().optional(),
  biggestChallenge: z.string().min(10, "Please describe your challenge"),
  preferredContactMethod: z.string().optional(),
  emailConsent: z.boolean().refine((val) => val === true, {
    message: "Email consent is required so we can respond to your inquiry",
  }),
  smsConsent: z.boolean(),
  phoneConsent: z.boolean(),
  website: z.string().optional(),
  turnstileResponse: z.string().min(1, "Please complete the verification step"),
});

export type QuickContactValues = z.infer<typeof quickContactSchema>;
export type DetailedContactValues = z.infer<typeof detailedContactSchema>;

export function useContactMutation() {
  const { toast } = useToast();
  const mutation = useSubmitContactForm();

  const submit = async (
    data: QuickContactValues | DetailedContactValues,
  ): Promise<boolean> => {
    try {
      const payload: ContactFormInput =
        data.formType === "quick"
          ? {
              formType: "quick",
              name: data.name,
              email: data.email,
              message: data.message,
              consent: {
                email: data.emailConsent,
                sms: data.smsConsent,
                phone: data.phoneConsent,
                source: CONTACT_CONSENT_SOURCE_PAGE,
                legalTextVersion: CONTACT_CONSENT_TEXT_VERSION,
              },
              smsConsent: data.smsConsent,
              consentTextVersion: CONTACT_CONSENT_TEXT_VERSION,
              consentSourcePage: CONTACT_CONSENT_SOURCE_PAGE,
              website: data.website ?? "",
              "cf-turnstile-response": data.turnstileResponse,
            }
          : {
              formType: "detailed",
              name: data.name,
              email: data.email,
              phone: data.phone ?? null,
              businessName: data.businessName,
              industry: data.industry,
              servicesInterested: data.servicesInterested,
              monthlyRevenueRange: data.monthlyRevenueRange ?? null,
              biggestChallenge: data.biggestChallenge,
              preferredContactMethod: data.preferredContactMethod ?? null,
              consent: {
                email: data.emailConsent,
                sms: data.smsConsent,
                phone: data.phoneConsent,
                source: CONTACT_CONSENT_SOURCE_PAGE,
                legalTextVersion: CONTACT_CONSENT_TEXT_VERSION,
              },
              smsConsent: data.smsConsent,
              consentTextVersion: CONTACT_CONSENT_TEXT_VERSION,
              consentSourcePage: CONTACT_CONSENT_SOURCE_PAGE,
              website: data.website ?? "",
              "cf-turnstile-response": data.turnstileResponse,
            };
      await mutation.mutateAsync({ data: payload });
      trackEvent("Contact Form Submission", { form_type: data.formType });
      toast({
        title: "Inquiry Submitted",
        description: "Thank you for reaching out. We will be in touch shortly.",
      });
      return true;
    } catch (error) {
      toast({
        title: "Submission Failed",
        description:
          "There was an error submitting your inquiry. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { submit, isPending: mutation.isPending };
}
