import { useState } from "react";
import { Check, Crown, Loader2, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  useBillingStatus,
  useCreateBillingPortal,
  useCreateCheckout,
} from "../hooks/billingHook";
import type { BillingPlan } from "../api/billingApi";

type UpgradeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const plans: Array<{
  id: BillingPlan;
  name: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
}> = [
  {
    id: "pro",
    name: "Pro",
    price: "$20",
    description: "For consistent everyday writing.",
    features: ["50 rewrites per month", "All writing tones", "Saved rewrite history"],
    featured: true,
  },
  {
    id: "ultra",
    name: "Ultra",
    price: "$50",
    description: "For unlimited rewriting.",
    features: ["Unlimited rewrites", "All writing tones", "Saved rewrite history"],
  },
];

export function UpgradeDialog({ open, onOpenChange }: UpgradeDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState<BillingPlan | null>(null);
  const { billing, isLoading } = useBillingStatus();
  const { checkout, isPending: isCheckoutPending } = useCreateCheckout();
  const { openPortal, isPending: isPortalPending } = useCreateBillingPortal();

  const hasActiveSubscription = Boolean(
    billing?.subscription?.hasAccess,
  );

  const choosePlan = async (plan: BillingPlan) => {
    setSelectedPlan(plan);
    await checkout(plan);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-none gap-8 overflow-y-auto rounded-3xl p-6 sm:w-[calc(100%-3rem)] sm:p-9 lg:max-w-5xl">
        <DialogHeader className="items-center pr-8 text-center sm:pr-0">
          <div className="mb-1 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </div>
          <DialogTitle className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Upgrade your writing
          </DialogTitle>
          <DialogDescription>
            Choose the plan that fits how often you rewrite.
          </DialogDescription>
        </DialogHeader>

        {hasActiveSubscription ? (
          <div className="mx-auto w-full max-w-2xl rounded-3xl border bg-muted/20 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Crown className="size-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">You already have an active plan</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage your subscription, payment method, or cancellation in
                  the billing portal.
                </p>
              </div>
            </div>
            <Button
              className="mt-6 w-full sm:w-auto"
              onClick={() => void openPortal()}
              disabled={isPortalPending}
            >
              {isPortalPending && <Loader2 className="size-4 animate-spin" />}
              {isPortalPending ? "Opening billing..." : "Manage billing"}
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            <div className="flex min-h-[22rem] flex-col rounded-3xl border bg-background p-6">
              <div className="mb-7">
                <p className="text-sm font-medium text-muted-foreground">Starter</p>
                <p className="mt-3 text-4xl font-semibold tracking-tight">$0</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Try Taxi at your own pace.
                </p>
              </div>
              <ul className="mb-8 flex-1 space-y-3.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-primary" />Continue as free</li>
                <li className="flex items-start gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-primary" />Basic rewriting access</li>
              </ul>
              <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                Continue as free
              </Button>
            </div>

            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id && isCheckoutPending;
              return (
                <div
                  key={plan.id}
                  className={`relative flex min-h-[22rem] flex-col rounded-3xl border bg-background p-6 ${
                    plan.featured
                      ? "border-primary shadow-[0_12px_35px_-18px_var(--primary)]"
                      : ""
                  }`}
                >
                  {plan.featured && (
                    <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-sm">
                      Most popular
                    </span>
                  )}
                  <div className="mb-7">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-muted-foreground">{plan.name}</p>
                      {plan.id === "ultra" && <Sparkles className="size-4 text-primary" />}
                    </div>
                    <p className="mt-3 text-4xl font-semibold tracking-tight">
                      {plan.price}
                      <span className="text-sm font-normal tracking-normal text-muted-foreground">/month</span>
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{plan.description}</p>
                  </div>
                  <ul className="mb-8 flex-1 space-y-3.5 text-sm text-muted-foreground">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => void choosePlan(plan.id)}
                    disabled={isCheckoutPending || isLoading}
                    className="w-full"
                  >
                    {isSelected && <Loader2 className="size-4 animate-spin" />}
                    {isSelected ? "Preparing checkout..." : `Choose ${plan.name}`}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
