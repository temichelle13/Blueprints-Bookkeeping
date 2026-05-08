import { useSubscribeNewsletter } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";

interface SubscribeParams {
  email: string;
  signupSource: "footer" | "lead_magnet";
  website?: string;
  turnstileResponse: string;
}

export function useNewsletterMutation() {
  const { toast } = useToast();
  const mutation = useSubscribeNewsletter();

  const subscribe = async (data: SubscribeParams) => {
    try {
      const { website: _honeypot, ...payload } = data;
      const result = await mutation.mutateAsync({
        data: {
          ...payload,
          website: _honeypot,
          "cf-turnstile-response": data.turnstileResponse,
        } as any,
      });
      const eventName =
        data.signupSource === "lead_magnet"
          ? "Lead Magnet Download"
          : "Newsletter Signup";
      trackEvent(eventName, { source: data.signupSource });
      toast({
        title: "You're In!",
        description: result.message,
      });
      return true;
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "There was an error. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { subscribe, isPending: mutation.isPending };
}
