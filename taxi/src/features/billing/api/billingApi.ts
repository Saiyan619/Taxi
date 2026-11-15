import apiClient from "@/api/axios";

export type BillingPlan = "pro" | "ultra";

export type BillingStatus = {
  subscription: {
    plan: BillingPlan | null;
    status: string;
    hasAccess: boolean;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: string | null;
  } | null;
};

export const getBillingStatus = async () => {
  const response = await apiClient.get<BillingStatus>("/payment/status");
  return response.data;
};

export const createCheckout = async (plan: BillingPlan, attemptId: string) => {
  console.log("[billing] Creating checkout request", {
    plan,
    attemptId,
    endpoint: "/payment/checkout",
  });
  const response = await apiClient.post<{ checkout_url: string }>("/payment/checkout", {
    plan,
    attemptId,
  });
  console.log("[billing] Checkout response received", {
    status: response.status,
    hasCheckoutUrl: Boolean(response.data.checkout_url),
  });
  return response.data;
};

export const createBillingPortal = async () => {
  const response = await apiClient.post<{ url: string }>("/payment/portal");
  return response.data;
};
