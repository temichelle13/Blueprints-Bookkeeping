import { z } from "zod";
import { useSubmitContactForm } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";

export const quickContactSchema = z.object({
  formType: z.literal("quick"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Please provide a little more detail"),
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
  website: z.string().optional(),
});

export type QuickContactValues = z.infer<typeof quickContactSchema>;
export type DetailedContactValues = z.infer<typeof detailedContactSchema>;

export function useContactMutation() {
  const { toast } = useToast();
  const mutation = useSubmitContactForm();

  const submit = async (data: QuickContactValues | DetailedContactValues): Promise<boolean> => {
    try {
      const { website: _honeypot, ...formData } = data as any;
      await mutation.mutateAsync({ data: { ...formData, website: _honeypot } as any });
      trackEvent("Contact Form Submission", { form_type: data.formType });
      toast({
        title: "Inquiry Submitted",
        description: "Thank you for reaching out. We will be in touch shortly.",
      });
      return true;
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your inquiry. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { submit, isPending: mutation.isPending };
}
