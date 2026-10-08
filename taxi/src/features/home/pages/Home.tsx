import * as React from "react";
import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Check, Copy, Sparkles, Plus, Loader2 } from "lucide-react";
// import { useAuth } from "@/stores/authStore";
import { useGetMe } from "../hooks/userHook";
import { useGenerateContent } from "@/features/ai/hooks/aiHook";
import SpeechToTxt from "@/features/ai/components/SpeechToTxt";

const tonePresets = [
  {
    value: "job-outreach",
    label: "Job Outreach",
    description: "Messages to hiring managers, founders, and recruiters.",
  },
  {
    value: "follow-up",
    label: "Follow-Up",
    description: "Friendly nudges when you have not heard back.",
  },
  {
    value: "work-email",
    label: "Work Email",
    description: "Clear, professional emails for everyday work.",
  },
  {
    value: "executive-memo",
    label: "Executive Memo",
    description: "Bottom-line-first writing for leaders and decisions.",
  },
  {
    value: "polite-decline",
    label: "Polite Decline",
    description: "Say no while keeping the relationship strong.",
  },
  {
    value: "apology",
    label: "Apology",
    description: "Own a mistake without over-apologizing.",
  },
  {
    value: "friendly-note",
    label: "Friendly Note",
    description: "Warm messages for friends and family.",
  },
  {
    value: "casual-sync",
    label: "Casual Sync",
    description: "Quick, chat-style messages for teammates.",
  },
  {
    value: "firm-but-calm",
    label: "Firm but Calm",
    description: "Handle complaints and disagreements constructively.",
  },
  {
    value: "ask-a-favor",
    label: "Ask a Favor",
    description: "Make referral, introduction, or advice requests.",
  },
  {
    value: "reconnect",
    label: "Reconnect",
    description: "Reach out to someone you have not spoken to recently.",
  },
  {
    value: "negotiation",
    label: "Negotiation",
    description: "Make confident salary and money asks.",
  },
  {
    value: "social-post",
    label: "Social Post",
    description: "Write posts and replies for X and LinkedIn.",
  },
];

const PLACEHOLDER = `hey how are you doing ive been trying to talk to you now but i can't because it seems you're busy
i just wanted to say i love your works and also i noticed that your were in search for a frontend dev, i just wanted to say i think im the man for the job
please i need this job and ill really appreciate if you just give my resume a chance to be looked at
and i promise to deliver if i do get this job, thank you`;

// Turns "Gen Z Bestie" into "gen-z-bestie" so it's a safe, unique-ish value
// for the toggle group / backend without you having to type a slug yourself.
function slugify(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function Home() {
  const [draft, setDraft] = React.useState("");
  const [tone, setTone] = React.useState<string[]>(["job-outreach"]);
  const [result, setResult] = React.useState<string | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);
  const [copyError, setCopyError] = React.useState<string | null>(null);
  const { generate, Generated_result, isPending } = useGenerateContent();

  // Custom, user-defined tones — kept separate from the presets so we never
  // mutate the static list, just merge the two when rendering.
  const [customTones, setCustomTones] = React.useState<
    { value: string; label: string }[]
  >([]);
  const [isAddToneOpen, setIsAddToneOpen] = React.useState(false);
  const [newTone, setNewTone] = React.useState("");

  const allTones = [...tonePresets, ...customTones];

  // const token = useAuth((state) => state.accessTk);
  const { data: user } = useGetMe();

  const generateAIContent = () => {
    generate({ raw_text: draft, tone: tone[0] });
  };

  const copyResult = async () => {
    setCopyError(null);

    try {
      await navigator.clipboard.writeText(result ?? "");
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy rewritten result.", error);
      setCopyError("Unable to copy. Please select the text and copy it manually.");
    }
  };

  // `data` only updates once the mutation resolves, so sync `result` off of
  // it rather than reading it synchronously right after calling generate().
  useEffect(() => {
    if (Generated_result) {
      setResult(Generated_result);
    }
  }, [Generated_result]);

  const handleAddTone = () => {
    const label = newTone.trim();
    if (!label) return;

    const value = slugify(label) || `custom-${Date.now()}`;

    // If it collides with an existing value (preset or another custom tone),
    // just select the existing one instead of creating a dupe.
    const alreadyExists = allTones.some((t) => t.value === value);
    if (!alreadyExists) {
      setCustomTones((prev) => [...prev, { value, label }]);
    }

    setTone([value]);
    setNewTone("");
    setIsAddToneOpen(false);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 py-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          What's on your mind, {user?.user?.name || "User"}?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Dump your raw thoughts below. Taxi will rewrite them in the tone
          you pick.
        </p>
      </div>

      {/* Main composer card */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={PLACEHOLDER}
          className="min-h-56 resize-none border-none bg-transparent p-0 text-sm leading-relaxed shadow-none focus-visible:ring-0"
        />

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {draft.length} characters
          </span>
          <div className="flex items-center gap-2">
            <SpeechToTxt value={draft} onChange={setDraft} />
            <Button
              onClick={generateAIContent}
              disabled={isPending || !draft.trim()}
              className="gap-1.5"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Tone selector */}
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-foreground">Choose a tone</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Pick the situation that best matches your message.
          </p>
        </div>

        <ToggleGroup
          value={tone}
          onValueChange={(value) => value && setTone(value)}
          className="flex flex-wrap justify-start gap-2"
        >
          {allTones.map((preset) => (
            <ToggleGroupItem
              key={preset.value}
              value={preset.value}
              title={tonePresets.find((item) => item.value === preset.value)?.description}
              aria-label={`${preset.label}${
                "description" in preset && preset.description
                  ? `: ${preset.description}`
                  : ""
              }`}
              className="h-auto min-h-9 rounded-full border border-border px-3 py-2 text-sm data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {preset.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="size-9 rounded-full"
                onClick={() => setIsAddToneOpen(true)}
              />
            }
          >
            <Plus className="size-4" />
            <span className="sr-only">Add custom tone</span>
          </TooltipTrigger>
          <TooltipContent>Add a custom tone</TooltipContent>
        </Tooltip>

        {tone[0] && (
          <p className="text-xs text-muted-foreground">
            {tonePresets.find((preset) => preset.value === tone[0])?.description ||
              "Your custom tone will guide the rewrite."}
          </p>
        )}
      </div>

      {/* Custom tone modal */}
      <div className="flex items-center justify-center">
        <Dialog open={isAddToneOpen} onOpenChange={setIsAddToneOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create a custom tone</DialogTitle>
            <DialogDescription>
              Can't find the tone you're after? Name it and Taxi will
              rewrite your draft to match.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Label htmlFor="custom-tone-input">Tone name</Label>
            <Input
              id="custom-tone-input"
              autoFocus
              value={newTone}
              onChange={(e) => setNewTone(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTone();
                }
              }}
              placeholder="e.g. Sarcastic, Gen Z, Legal brief"
            />
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button onClick={handleAddTone} disabled={!newTone.trim()}>
              Add tone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>

      {/* Generated result */}
      {result && (
        <div className="rounded-2xl border border-primary/30 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-primary">
              Rewritten
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyResult}
              aria-label={isCopied ? "Copied rewritten result" : "Copy rewritten result"}
              className="gap-1.5 text-muted-foreground"
            >
              {isCopied ? (
                <Check className="size-3.5" />
              ) : (
                <Copy className="size-3.5" />
              )}
              {isCopied ? "Copied" : "Copy"}
            </Button>
          </div>
          <p className="mt-3 min-h-56 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {result}
          </p>
          {copyError && (
            <p role="alert" className="mt-2 text-xs text-destructive">
              {copyError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}