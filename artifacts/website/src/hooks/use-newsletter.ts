import { useSubscribeNewsletter } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { queueLeadFailover } from "@/lib/lead-failover";

interface SubscribeParams {
  email: string;
  signupSource: "footer" | "lead_magnet";
  website?: string;
}

export function useNewsletterMutation() {
  const { toast } = useToast();
  const mutation = useSubscribeNewsletter();

  const subscribe = async (data: SubscribeParams) => {
    const { website: _honeypot, ...payload } = data;
    const requestBody = { ...payload, website: _honeypot };

    try {
      const result = await mutation.mutateAsync({
        data: requestBody as any,
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
      queueLeadFailover("newsletter", requestBody as Record<string, unknown>);
      toast({
        title: "Temporary Outage — Saved Safely",
        description:
          "Your signup was saved on this device and will retry automatically when service returns.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { subscribe, isPending: mutation.isPending };
}
