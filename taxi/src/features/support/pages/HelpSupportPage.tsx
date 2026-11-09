import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowUpRight,
  AtSign,
  Check,
  ChevronDown,
  Clock,
  Copy,
  LifeBuoy,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const phoneDisplay = "0816 961 5422";
const phoneRaw = "08169615422";
const email = "arokoyueb11@gmail.com";
const twitterHandle = "@Niyi_dev";

const contactChannels = [
  {
    label: "Call or text",
    value: phoneDisplay,
    description:
      "The quickest way to reach us for urgent ride, account, or billing issues.",
    action: "Call now",
    href: `tel:${phoneRaw}`,
    icon: Phone,
  },
  {
    label: "Email",
    value: email,
    description:
      "Best for account changes, receipts, and anything that needs a screenshot.",
    action: "Send email",
    href: `mailto:${email}`,
    icon: Mail,
  },
  {
    label: "Twitter / X",
    value: twitterHandle,
    description:
      "Send a DM for quick questions, feedback, or a nudge on an open issue.",
    action: "Open profile",
    href: "https://twitter.com/Niyi_dev",
    external: true,
    icon: AtSign,
  },
] as const;

const faqs = [
  {
    question: "How do I reset my password?",
    answer: (
      <>
        Open the{" "}
        <Link
          to="/forgot-password"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          forgot password
        </Link>{" "}
        page and enter your account email. We'll send you a secure link to
        choose a new password.
      </>
    ),
  },
  {
    question: "How do I delete my writing history?",
    answer: (
      <>
        Go to{" "}
        <Link
          to="/settings"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Settings
        </Link>{" "}
        → Data &amp; privacy and choose <strong>Delete history</strong>. This
        permanently removes every saved rewrite from your account and can't be
        undone.
      </>
    ),
  },
  {
    question: "Can I change the email on my account?",
    answer:
      "Your login email is tied to your account for security, so it can't be changed from Settings. Email or call us with the new address and we'll help you move it over.",
  },
  {
    question: "How do I manage my plan or billing?",
    answer: (
      <>
        Open{" "}
        <Link
          to="/settings"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Settings
        </Link>{" "}
        → Billing and choose <strong>Manage billing</strong>. You'll be taken to
        the secure BACHS portal to update payment details, change plans, or
        cancel.
      </>
    ),
  },
];

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error("Failed to copy contact detail:", error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="text-muted-foreground hover:text-primary"
      onClick={() => void handleCopy()}
    >
      {copied ? (
        <Check className="size-3.5 text-primary" />
      ) : (
        <Copy className="size-3.5" />
      )}
      <span className="sr-only">{copied ? "Copied" : `Copy ${label}`}</span>
    </Button>
  );
}

export default function HelpSupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 py-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border bg-card px-6 py-8 sm:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <LifeBuoy className="size-3.5" />
              Help &amp; support
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              How can we help?
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Questions about your account, billing, or a rewrite? Reach the
              Taxi team directly — pick whichever channel works best for you.
            </p>
          </div>

          <div className="w-full max-w-xs shrink-0 rounded-2xl border bg-background/70 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="size-4 text-primary" />
              Straight to the team
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              No bots and no ticket queues. Messages land directly with the
              person who builds Taxi.
            </p>
          </div>
        </div>
      </section>

      {/* Contact channels */}
      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Get in touch
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">
              Contact us
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Tap a card to call, email, or send a DM.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {contactChannels.map((channel) => (
            <Card
              key={channel.label}
              className="group h-full gap-0 py-0 transition-colors hover:ring-primary/30"
            >
              <CardContent className="flex h-full flex-col gap-5 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <channel.icon className="size-5" />
                  </div>
                  <CopyButton value={channel.value} label={channel.label} />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    {channel.label}
                  </p>
                  <p className="break-all text-base font-semibold tracking-tight">
                    {channel.value}
                  </p>
                  <p className="pt-1 text-sm leading-5 text-muted-foreground">
                    {channel.description}
                  </p>
                </div>

                <Button
                  variant="outline"
                  nativeButton={false}
                  className="mt-auto w-full justify-between group-hover:border-primary/40"
                  render={
                    <a
                      href={channel.href}
                      {...("external" in channel && channel.external
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                    />
                  }
                >
                  {channel.action}
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Quick answers
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">
              Frequently asked questions
            </h2>
          </div>
          <Badge
            variant="outline"
            className="w-fit gap-1.5 rounded-full px-3 py-1.5"
          >
            <Clock className="size-3.5 text-primary" />
            Under a minute read
          </Badge>
        </div>

        <Card className="gap-0 py-0">
          <CardContent className="divide-y p-0">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <Collapsible
                  key={faq.question}
                  open={isOpen}
                  onOpenChange={(open) => setOpenFaq(open ? index : null)}
                >
                  <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/50">
                    <span className="text-sm font-medium">{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                        isOpen && "rotate-180 text-primary"
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-5 pb-4 text-sm leading-6 text-muted-foreground">
                    {faq.answer}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </CardContent>
        </Card>
      </section>

      {/* Still stuck */}
      <Card className="gap-0 bg-primary/5 py-0 ring-primary/20">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageSquare className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium">Still stuck?</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Send us the details and we'll help you get unstuck.
              </p>
            </div>
          </div>
          <Button
            className="gap-2 sm:shrink-0"
            nativeButton={false}
            render={<a href={`mailto:${email}`} />}
          >
            <Mail className="size-4" />
            Email support
          </Button>
        </CardContent>
      </Card>

      <p className="flex items-center justify-center gap-2 pb-4 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5" />
        Conversations with support stay between you and the Taxi team.
      </p>
    </div>
  );
}
