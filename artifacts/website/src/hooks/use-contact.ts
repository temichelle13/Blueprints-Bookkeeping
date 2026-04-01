import { z } from "zod";
import {
  type ContactFormInput,
  useSubmitContactForm,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";

export const CONTACT_CONSENT_TEXT_VERSION = "contact-consent-2026-03-31.1";
export const CONTACT_CONSENT_SOURCE_PAGE = "/contact";

export const quickContactSchema = z.object({
  formType: z.literal("quick"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Please provide a little more detail"),
  smsConsent: z.boolean().refine((val) => val === true, {
    message: "You must consent to receive text messages and phone calls",
  }),
  website: z.string().optional(),
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
  smsConsent: z.boolean().refine((val) => val === true, {
    message: "You must consent to receive text messages and phone calls",
  }),
  website: z.string().optional(),
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
              smsConsent: data.smsConsent,
              consentTextVersion: CONTACT_CONSENT_TEXT_VERSION,
              consentSourcePage: CONTACT_CONSENT_SOURCE_PAGE,
              website: data.website ?? "",
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
              smsConsent: data.smsConsent,
              consentTextVersion: CONTACT_CONSENT_TEXT_VERSION,
              consentSourcePage: CONTACT_CONSENT_SOURCE_PAGE,
              website: data.website ?? "",
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
