import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Check,
  ShieldCheck,
  Mic,
  SlidersHorizontal,
  Copy,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Lock,
} from "lucide-react";
import { useSearchParams } from "react-router";
import { useVerifyEmail } from "../hooks/authHook";

const EmailVerifyPage = () => {
  const email = "alex@company.com";
  const [progress, setProgress] = useState(0);
  const [searchParams] = useSearchParams();
  const { verifyEmail, isPending, isError } = useVerifyEmail();

  const token = searchParams.get("token");

  const runVerification = () => {
    if (token) {
      verifyEmail({ token });
    }
  };

  useEffect(() => {
    console.log("Verification token:", token);
    runVerification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, verifyEmail]);

  // Indeterminate-feeling progress bar while pending; snaps to 100 once resolved.
  useEffect(() => {
    if (!isPending) {
      setProgress(100);
      return;
    }
    const interval = setInterval(() => {
      setProgress((p) => (p >= 90 ? 90 : p + 10));
    }, 250);
    return () => clearInterval(interval);
  }, [isPending]);

  const handleContinue = () => {
    // TODO: replace with your router's navigation, e.g. navigate("/login")
    window.location.href = "/login";
  };

  const handleRetry = () => {
    setProgress(0);
    runVerification();
  };

  const isSuccess = !isPending && !isError;

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="h-1 w-10 rounded-full bg-muted" />
        </div>

        {/* Status icon */}
        <div className="flex justify-center">
          <div
            className={`relative h-16 w-16 rounded-full bg-background border flex items-center justify-center ${
              isError ? "border-destructive/30" : "border-border"
            }`}
          >
            <div
              className={`h-11 w-11 rounded-full flex items-center justify-center transition-colors ${
                isPending
                  ? "bg-muted"
                  : isError
                  ? "bg-destructive"
                  : "bg-primary"
              }`}
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
              ) : isError ? (
                <AlertTriangle
                  className="h-5 w-5 text-destructive-foreground"
                  strokeWidth={2.5}
                />
              ) : (
                <Check
                  className="h-5 w-5 text-primary-foreground"
                  strokeWidth={3}
                />
              )}
            </div>
            {isSuccess && (
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-card border border-border flex items-center justify-center">
                <ShieldCheck className="h-3 w-3 text-primary" />
              </div>
            )}
          </div>
        </div>

        {/* Heading + description */}
        {isPending ? (
          <>
            <h1 className="mt-6 text-center text-2xl font-semibold text-foreground">
              Verifying your email
            </h1>
            <p className="mt-3 text-center text-sm text-muted-foreground leading-relaxed">
              Hang tight while we confirm{" "}
              <span className="font-semibold text-foreground">{email}</span>.
              This should only take a moment.
            </p>
          </>
        ) : isError ? (
          <>
            <h1 className="mt-6 text-center text-2xl font-semibold text-foreground">
              We couldn't verify your email
            </h1>
            <p className="mt-3 text-center text-sm text-muted-foreground leading-relaxed">
              {token
                ? "This link may be expired, already used, or invalid. Request a new verification email to try again."
                : "No verification token was found in this link. Check the URL or request a new verification email."}
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-6 text-center text-2xl font-semibold text-foreground">
              Email verified successfully
            </h1>
            <p className="mt-3 text-center text-sm text-muted-foreground leading-relaxed">
              Your email{" "}
              <span className="font-semibold text-foreground">{email}</span>{" "}
              has been verified. Your Taxi workspace is primed and ready to
              transform chaotic brain-dumps into polished prose.
            </p>
          </>
        )}

        {/* Progress bar while pending */}
        {isPending && (
          <div className="mt-6 space-y-1.5">
            <Progress value={progress} className="h-1.5" />
            <p className="text-center text-[11px] text-muted-foreground">
              Checking verification link...
            </p>
          </div>
        )}

        {/* CTA */}
        {isError ? (
          <div className="mt-6 space-y-2">
            <Button
              onClick={handleRetry}
              variant="destructive"
              className="w-full h-11 font-medium"
            >
              <RefreshCw className="h-4 w-4" /> Resend verification link
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Still stuck?{" "}
              <a href="#" className="text-primary hover:underline">
                Contact support
              </a>
            </p>
          </div>
        ) : (
          <Button
            onClick={handleContinue}
            disabled={isPending}
            className="mt-6 w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Please wait...
              </>
            ) : (
              "Sign in to Taxi →"
            )}
          </Button>
        )}

        {/* Info card: skeleton while pending, locked on error, full content once verified */}
        <div className="mt-6 rounded-xl border border-border bg-secondary p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wide text-primary">
              WHAT YOU CAN DO RIGHT AWAY
            </span>
            <span className="text-[11px] text-muted-foreground">
              {isSuccess ? "READY • 01/03" : "LOCKED • 00/03"}
            </span>
          </div>

          {isPending ? (
            <div className="mt-4 space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-7 w-7 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-1.5 pt-0.5">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="mt-4 flex items-center gap-3 py-2">
              <div className="h-7 w-7 shrink-0 rounded-lg bg-muted flex items-center justify-center">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                These unlock once your email is verified.
              </p>
            </div>
          ) : (
            <ul className="mt-4 space-y-4">
              <li className="flex gap-3">
                <div className="mt-0.5 h-7 w-7 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mic className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">
                    Dump raw voice notes or chaotic notes
                  </span>{" "}
                  without punctuation, structure, or hesitation.
                </p>
              </li>

              <li className="flex gap-3">
                <div className="mt-0.5 h-7 w-7 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">
                    Select from 5+ natural tone styles
                  </span>{" "}
                  including Executive Memo, Casual Sync, and Work Email.
                </p>
              </li>

              <li className="flex gap-3">
                <div className="mt-0.5 h-7 w-7 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Copy className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">
                    One-tap copy
                  </span>{" "}
                  directly to Slack, Outlook, Apple Notes, or your active
                  editor.
                </p>
              </li>
            </ul>
          )}
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3 w-3 text-primary" />
          Zero training guarantee: your drafts are encrypted and strictly
          private.
        </p>
      </div>
    </div>
  );
};

export default EmailVerifyPage;