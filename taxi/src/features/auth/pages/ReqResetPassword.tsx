import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  Mail,
  ShieldCheck,
  ArrowLeft,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { useRequestPasswordReset } from "../hooks/authHook";

const ReqResetPassword = () => {
  const [email, setEmail] = useState("");
  const {reqPasswordReset, isPending} = useRequestPasswordReset();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    reqPasswordReset({ email });
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-2xl">
        <div className="flex justify-center">
          <div className="h-14 w-14 rounded-full bg-secondary border border-border flex items-center justify-center">
            <RotateCcw className="h-5 w-5 text-primary" />
          </div>
        </div>

        <h1 className="mt-5 text-center text-2xl font-semibold text-foreground font-serif">
          Reset your password
        </h1>

        <p className="mt-3 text-center text-sm text-muted-foreground leading-relaxed">
          Enter the email associated with your Taxi account. We'll send
          you a secure, single-use link to choose a new password.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                Work or personal email
              </Label>
              <span className="text-[10px] tracking-wide text-muted-foreground">
                REQUIRED
              </span>
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                // name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                required
                className="bg-background border-border text-foreground placeholder:text-muted-foreground h-11 pl-9"
              />
            </div>
          </div>

          {isPending ? <Button
            type="submit"
            disabled={true}
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            Sending Link....
            <ArrowRight className="h-4 w-4" />
          </Button>
          :
          <Button
            type="submit"
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            Send Reset Link
            <ArrowRight className="h-4 w-4" />
          </Button>}
        </form>

        <div className="mt-6 rounded-xl border border-border bg-secondary p-4 flex gap-3">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-foreground">
              Guaranteed Safe Recovery
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
              For your protection, reset links are single-use and expire
              automatically in 15 minutes.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-6 text-xs text-muted-foreground">
        <a href="#" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Remember your password?{" "}
          <span className="text-primary hover:underline">
            Return to Sign In
          </span>
        </a>
        <a href="#" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
          <HelpCircle className="h-3.5 w-3.5" />
          Need help? Contact support
        </a>
      </div>
    </div>
  );
};

export default ReqResetPassword;