import { useSubscribeNewsletter, type NewsletterSubscribeInput } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export function useNewsletterMutation() {
  const { toast } = useToast();
  const mutation = useSubscribeNewsletter();

  const subscribe = async (data: NewsletterSubscribeInput) => {
    try {
      const result = await mutation.mutateAsync({ data });
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
