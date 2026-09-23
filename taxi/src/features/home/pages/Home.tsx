import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sparkles, Plus, Loader2 } from "lucide-react";
import { useAuth } from '@/stores/authStore'
import { useGetMe } from '../hooks/userHook'
import { useEffect } from "react";
import { useGenerateContent } from "@/features/ai/hooks/aiHook";
// Tone presets — swap for whatever your backend actually supports, or load
// custom user-defined tones and append them after these.
const tonePresets = [
  { value: "executive-memo", label: "Executive Memo" },
  { value: "casual-sync", label: "Casual Sync" },
  { value: "work-email", label: "Work Email" },
  { value: "friendly-note", label: "Friendly Note" },
];


const PLACEHOLDER = `hey how are you doing ive been trying to talk to you now but i can't because it seems you're busy
i just wanted to say i love your works and also i noticed that your were in search for a frontend dev, i just wanted to say i think im the man for the job
please i need this job and ill really appreciate if you just give my resume a chance to be looked at
and i promise to deliver if i do get this job, thank you`;


export default function Home() {
  const [draft, setDraft] = React.useState("");
  const [tone, setTone] = React.useState<string[]>(["work-email"]);
  // console.log(tone)
  const [result, setResult] = React.useState<string | null>(null);
  const token = useAuth((state) => state.accessTk)
  const {generate, isPending, data} = useGenerateContent()
    // console.log('token:', token)
    const { data: user, refetch } = useGetMe();

    // function getUser() {
    //   refetch().then((res) => {
    //     console.log('user:', res.data);
    //   });
    // }

    const generateAIContent = () => {
      generate({ raw_text: draft, tone: tone[0] })
      setResult(data?.data?.result)
      console.log('data:', data?.data?.result)
    }

    useEffect(() => {
      user && console.log('user:', user);
    }, [user])
    

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
          {isPending ? <Button
            onClick={generateAIContent}
            disabled={true}
            className="gap-1.5"
          >
             <>
                <Loader2 className="size-4 animate-spin" />
                Generating...
              </>
          </Button>
          :
          <Button
            onClick={generateAIContent}
            className="gap-1.5"
          >
             <>
                <Sparkles className="size-4" />
                Generate
              </>

          </Button>}
        </div>
      </div>

      {/* Tone selector */}
      <div className="flex flex-wrap items-center gap-2">
        <ToggleGroup
          value={tone}
          onValueChange={(value) => value && setTone(value)}
          className="flex flex-wrap gap-2"
        >
          {tonePresets.map((preset) => (
            <ToggleGroupItem
              key={preset.value}
              value={preset.value}
              className="h-9 rounded-full border border-border px-4 text-sm data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
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
              />
            }
          >
            <Plus className="size-4" />
            <span className="sr-only">Add custom tone</span>
          </TooltipTrigger>
          <TooltipContent>Add a custom tone</TooltipContent>
        </Tooltip>
      </div>

      {/* Generated result */}
      {result && (
        <div className="rounded-2xl border border-primary/30 bg-card p-5 shadow-sm">
          <span className="text-xs font-medium uppercase tracking-wide text-primary">
            Rewritten
          </span>
          <p className="mt-3 min-h-56 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {result}
          </p>
        </div>
      )}
    </div>
  );
}


