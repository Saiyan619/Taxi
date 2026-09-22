import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mic, SlidersHorizontal, Lock, Star } from "lucide-react";
import { Link } from "react-router";
import { useRegister } from "../hooks/authHook";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { registerUser, isPending, isError} = useRegister();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegistration =  (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      name: username,
      email: email,
      password: password
    }

     registerUser(payload);
  }

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border border-border">
        <div className="relative bg-secondary p-8 sm:p-10 flex flex-col justify-between overflow-hidden">
          <div className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 rounded-full opacity-30 blur-3xl bg-primary/60" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-[11px] tracking-wide text-primary font-medium">
                Your thoughtful AI writing companion
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight">
              Write with confidence, in a
              <br />
              <span className="italic text-primary font-serif">
                fraction of the time.
              </span>
            </h1>

            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
              Dump your thoughts naturally. Taxi formats, refines, and
              articulates messy voice notes and rough rambles into
              thoughtful prose that still sounds 100% like you.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex gap-3">
                <div className="mt-0.5 h-8 w-8 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mic className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Talk or type freely
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Speak your raw thoughts or type rapid bullet points
                    without worrying about grammar or flow.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-0.5 h-8 w-8 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Choose your tone
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Instantly adjust from friendly Slack message to
                    executive email with one tap.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-0.5 h-8 w-8 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Private and confidential
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your words are never used to train public AI models.
                    What you write stays yours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-10 rounded-xl border border-border bg-card p-4">
            <p className="text-xs italic text-muted-foreground leading-relaxed">
              "Taxi cut my email drafting time in half and completely
              eliminated the anxiety of sending sensitive messages."
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                — Product Director
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3 w-3 fill-primary text-primary"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-8 sm:p-10 flex flex-col justify-center">
          <div className="max-w-sm w-full mx-auto">
            <h2 className="text-2xl font-semibold text-foreground">
              Create your free account
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Start polishing your writing today. No credit card required.
            </p>

            <form onSubmit={handleRegistration} className="mt-6 space-y-4">

              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-xs text-muted-foreground">
                  Username
                </Label>
                <Input
                  id="username"
                  // name="username"
                  placeholder="alexmorgan"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-muted-foreground">
                  Work or personal email
                </Label>
                <Input
                  id="email"
                  // name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  required
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground h-11"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs text-muted-foreground">
                    Password
                  </Label>
                  <span className="text-[11px] text-muted-foreground">
                    At least 6 characters
                  </span>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    // name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a secure password"
                    required
                    minLength={6}
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
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Checkbox
                  id="terms"
                  checked={agreed}
                  onCheckedChange={(v) => setAgreed(v === true)}
                  className="mt-0.5 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="terms" className="text-xs text-muted-foreground font-normal leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy.
                  </a>
                </Label>
              </div>

              {isPending ? <Button
                type="submit"
                disabled={true}
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium disabled:opacity-50"
              >
                Signing Up...
              </Button> : <Button
                type="submit"
                disabled={!agreed}
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium disabled:opacity-50"
              >
                Get Started Free →
              </Button>}

              <p className="text-center text-xs text-muted-foreground pt-1">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;