import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { usePasswordReset } from "../hooks/authHook";
import { Link, useParams } from "react-router";

const email = "alex@company.com";

type Strength = "empty" | "weak" | "medium" | "strong";

const getStrength = (password: string): Strength => {
  if (password.length === 0) return "empty";
  const hasLength = password.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>_\-+=]/.test(password);
  const hasUpperLower = /[a-z]/.test(password) && /[A-Z]/.test(password);

  const score = [hasLength, hasNumberOrSymbol, hasUpperLower].filter(Boolean).length;

  if (score <= 1) return "weak";
  if (score === 2) return "medium";
  return "strong";
};

const strengthConfig: Record<Strength, { label: string; bars: number; color: string }> = {
  empty: { label: "Empty", bars: 0, color: "bg-secondary" },
  weak: { label: "Weak", bars: 1, color: "bg-primary/60" },
  medium: { label: "Medium", bars: 2, color: "bg-primary" },
  strong: { label: "Strong", bars: 3, color: "bg-primary" },
};

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {passwordReset, isPending} = usePasswordReset();
  const { token } = useParams<{ token: string }>();

  const strength = useMemo(() => getStrength(password), [password]);
  const { label, bars, color } = strengthConfig[strength];

  const hasMinLength = password.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>_\-+=]/.test(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  const canSubmit = hasMinLength && hasNumberOrSymbol && passwordsMatch;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (!token) {
      throw new Error("Reset token is missing");
    }
    console.log(token);
    passwordReset({password, token})
    console.log("New password set:", password);
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-7 sm:p-9 shadow-2xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] text-primary font-medium">
            Link verified for {email}
          </span>
        </div>

        <h1 className="mt-4 text-2xl font-semibold text-foreground font-serif">
          Set your new password
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Choose a strong password to protect your Taxi workspace and
          saved drafts.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                New password
              </Label>
              <span className="text-[10px] tracking-wide text-muted-foreground">
                STRENGTH: {label.toUpperCase()}
              </span>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="flex gap-1.5 pt-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${i < bars ? color : "bg-secondary"}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-medium text-muted-foreground">
              Confirm new password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter new password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-[11px] text-destructive pt-0.5">
                Passwords don't match
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-secondary p-4">
            <span className="text-[10px] font-semibold tracking-wide text-muted-foreground">
              PASSWORD REQUIREMENTS
            </span>
            <div className="mt-2.5 flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex items-center gap-1.5">
                {hasMinLength ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-muted-foreground/30" />
                )}
                <span className={`text-xs ${hasMinLength ? "text-foreground" : "text-muted-foreground"}`}>
                  8 or more characters
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {hasNumberOrSymbol ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-muted-foreground/30" />
                )}
                <span className={`text-xs ${hasNumberOrSymbol ? "text-foreground" : "text-muted-foreground"}`}>
                  1+ number or symbol
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-secondary p-4 flex gap-3">
            <ShieldAlert className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-foreground">
                Active Session Clearance
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                For your safety, setting a new password will automatically
                sign out all other devices and active sessions. Any prior
                reset links will be permanently invalidated.
              </p>
            </div>
          </div>

          {isPending ? <Button
            type="submit"
            disabled={true}
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium disabled:opacity-50"
          >
            Updating Password...
          </Button>
          :
          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium disabled:opacity-50"
          >
            Update Password &amp; Sign In <ArrowRight className="h-4 w-4" />
          </Button>}

          <Link className="text-primary text-[11px] text-center flex items-center justify-center" to="/login">Cancel and back to Sign In</Link>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;