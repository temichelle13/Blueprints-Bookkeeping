import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useSubmitContactForm, type ContactFormInput } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

// Exported schemas for React Hook Form validation
export const quickContactSchema = z.object({
  formType: z.literal("quick"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Please provide a little more detail"),
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
});

export type QuickContactValues = z.infer<typeof quickContactSchema>;
export type DetailedContactValues = z.infer<typeof detailedContactSchema>;

export function useContactMutation() {
  const { toast } = useToast();
  const mutation = useSubmitContactForm();

  const submit = async (data: ContactFormInput) => {
    try {
      await mutation.mutateAsync({ data });
      toast({
        title: "Inquiry Submitted",
        description: "Thank you for reaching out. We will be in touch shortly.",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your inquiry. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { submit, isPending: mutation.isPending };
}
