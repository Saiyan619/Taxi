import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  X,
  ArrowDown,
  CheckCircle2,
} from "lucide-react";
import { useLogin } from "../hooks/authHook";
import { Link } from "react-router";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser, isPending } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      email: email,
      password: password
    }

    await loginUser(payload);

  }

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6 items-center">
        <div className="relative p-2 sm:p-4">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[11px] tracking-wide text-muted-foreground font-medium">
              Your thoughts, effortlessly articulated
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight">
            Say what you mean without
            <br />
            <span className="italic text-primary font-serif">
              spending 20 minutes drafting it.
            </span>
          </h1>

          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-md">
            Speak, scribble, or dump messy bullet points. Taxi rewrites
            your rough drafts into polished, natural prose—preserving
            your authentic voice without sounding robotic or stiff.
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-card p-5 max-w-md">
            <div className="flex items-center gap-2">
              <X className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Messy brain dump
              </span>
            </div>
            <div className="mt-3 rounded-xl bg-background border border-border p-4">
              <p className="text-sm italic text-muted-foreground leading-relaxed">
                "hey so i was thinking about the deadline next tuesday
                and honestly i dont think we can get all the backend
                edge cases tested properly without pushing it back like
                two days..."
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <ArrowDown className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium tracking-wide text-primary">
                Rewritten in seconds
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs text-primary">
                Natural, clear &amp; decisive
              </span>
            </div>

            <div className="mt-3 rounded-xl bg-secondary border border-border p-4">
              <p className="text-sm text-foreground leading-relaxed">
                "To ensure we thoroughly test all edge cases and avoid
                bugs in production, I recommend pushing our release
                back two days to Thursday."
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-2xl">
          <h2 className="text-2xl font-semibold text-foreground">
            Welcome back
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to pick up right where you left off.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-muted-foreground">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  // name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground h-11 pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs text-muted-foreground">
                  Password
                </Label>
                <Link to="/forgot-password" className="text-primary text-[11px] hover:underline">
                                Forgot password?
              </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  // name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground h-11 pl-9 pr-10"
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

            {isPending ? <Button type="submit" disabled={true} className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
              Signing in...
            </Button>
            :
            <Button type="submit" className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
              Sign in to Taxi →
            </Button>}

            <p className="text-center text-xs text-muted-foreground pt-1">
              New to Taxi?{" "}
              <a href="#" className="text-primary hover:underline">
                Create an account
              </a>
              <Link to="/home" className="text-primary hover:underline">
                                Go home
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;