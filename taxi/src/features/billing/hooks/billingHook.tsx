import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/components/ui/toast";
import {
  createBillingPortal,
  createCheckout,
  getBillingStatus,
  type BillingPlan,
} from "../api/billingApi";

const billingStatusKey = ["billing-status"];

const showBillingError = (title: string, error: unknown) => {
  const message = axios.isAxiosError(error)
    ? error.response?.data?.message ?? error.message
    : "Please try again.";
  toast.add({
    type: "error",
    title,
    description: message,
    priority: "high",
  });
};

export const useBillingStatus = () => {
  const query = useQuery({
    queryKey: billingStatusKey,
    queryFn: getBillingStatus,
    staleTime: Infinity,           // Data will never be considered stale
    gcTime: Infinity, 
  });

  return {
    ...query,
    billing: query.data,
  };
};

export const useCreateCheckout = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ plan, attemptId }: { plan: BillingPlan; attemptId: string }) =>
      createCheckout(plan, attemptId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: billingStatusKey });
      window.location.assign(data.checkout_url);
    },
    onError: (error) => showBillingError("Unable to start checkout", error),
  });

  return {
    ...mutation,
    checkout: mutation.mutateAsync,
  };
};

export const useCreateBillingPortal = () => {
  const mutation = useMutation({
    mutationFn: createBillingPortal,
    onSuccess: (data) => window.location.assign(data.url),
    onError: (error) => showBillingError("Unable to open billing", error),
  });

  return {
    ...mutation,
    openPortal: mutation.mutateAsync,
  };
};
