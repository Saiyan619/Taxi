import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Copy,
  Check,
  Inbox,
  TriangleAlert,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  useDeleteAllGeneratedContent,
  useDeleteGeneratedContent,
  useGetGeneratedContent,
} from "@/features/ai/hooks/aiHook";

type Generation = {
  id: string;
  title: string;
  rawText: string;
  result: string;
  tone: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

// Same preset list as the composer, used to turn a tone value like
// "work-email" into a human label like "Work Email".
const tonePresets: Record<string, string> = {
  "executive-memo": "Executive Memo",
  "casual-sync": "Casual Sync",
  "work-email": "Work Email",
  "friendly-note": "Friendly Note",
};

function toneLabel(tone: string) {
  return (
    tonePresets[tone] ||
    tone
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

function formatDate(iso: string) {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Button variant="ghost" size="icon" className="size-7" onClick={handleCopy}>
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      <span className="sr-only">Copy result</span>
    </Button>
  );
}

const ArticulationsPage = () => {
  const { generatedData, isLoading, isError, refetch } = useGetGeneratedContent();
  console.log("Generated Content Data:", generatedData);
  const { deleteContent, isPending: isDeleting } = useDeleteGeneratedContent();
  const { deleteAllContent, isPending: isDeletingAll } =
    useDeleteAllGeneratedContent();

  // Adjust this line if your hook actually resolves to `generatedData.data`
  // instead of the array itself — everything else works either way once
  // `generations` is a plain array of the shape shown in your sample JSON.
  const generations: Generation[] = generatedData ?? [];

  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Generation | null>(null);
  // id of the generation the single-delete confirmation is open for — also
  // doubles as "which card is mid-delete" so only that one shows a spinner.
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(
    null
  );
  // Separate from the single-delete flow on purpose — wiping everything
  // deserves its own confirmation copy rather than sharing the "delete this
  // one" dialog and having to branch its text/behavior.
  const [confirmDeleteAll, setConfirmDeleteAll] = React.useState(false);

  const isBusy = isDeleting || isDeletingAll;

  const filtered = generations.filter((g) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      g.title.toLowerCase().includes(q) ||
      g.rawText.toLowerCase().includes(q) ||
      toneLabel(g.tone).toLowerCase().includes(q)
    );
  });

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteContent({ id: confirmDeleteId });
      if (selected?.id === confirmDeleteId) setSelected(null);
      refetch();
    } catch (err) {
      console.error("Failed to delete generation:", err);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleConfirmDeleteAll = async () => {
    try {
      await deleteAllContent();
      setSelected(null);
      refetch();
    } catch (err) {
      console.error("Failed to delete all generations:", err);
    } finally {
      setConfirmDeleteAll(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 py-6 px-4 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Your generations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything Taxi has rewritten for you so far.
          </p>
        </div>

        {generations.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 self-start text-destructive hover:bg-destructive/10 hover:text-destructive"
            disabled={isBusy}
            onClick={() => setConfirmDeleteAll(true)}
          >
            {isDeletingAll ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            Delete all
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, draft, or tone..."
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="gap-3">
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="mt-2 h-3 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="mt-2 h-3 w-5/6" />
                <Skeleton className="mt-2 h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-destructive/40 py-16 text-center">
          <TriangleAlert className="size-8 text-destructive" />
          <p className="text-sm font-medium text-foreground">
            Couldn't load your generations
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-16 text-center">
          <Inbox className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">
            {generations.length === 0
              ? "Nothing generated yet"
              : "No matches"}
          </p>
          <p className="max-w-xs text-xs text-muted-foreground">
            {generations.length === 0
              ? "Rewrite your first draft and it'll show up here."
              : "Try a different search term."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => {
            const isDeletingThis = isDeleting && confirmDeleteId === g.id;
            return (
              <Card
                key={g.id}
                onClick={() => setSelected(g)}
                className="cursor-pointer gap-3 transition-colors hover:border-primary/40"
              >
                <CardHeader className="flex flex-row items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {g.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(g.createdAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {toneLabel(g.tone)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-destructive"
                      disabled={isDeletingThis || isDeletingAll}
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteId(g.id);
                      }}
                    >
                      {isDeletingThis ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {g.result}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Full generation detail */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="pr-6">{selected.title}</DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {toneLabel(selected.tone)}
                  </Badge>
                  <span>{formatDate(selected.createdAt)}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Original
                  </span>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                    {selected.rawText}
                  </p>
                </div>

                <div className="rounded-xl border border-primary/30 bg-card p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-primary">
                      Rewritten
                    </span>
                    <CopyButton text={selected.result} />
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                    {selected.result}
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:justify-between">
                <Button
                  variant="ghost"
                  className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  disabled={isBusy && confirmDeleteId === selected.id}
                  onClick={() => setConfirmDeleteId(selected.id)}
                >
                  {isDeleting && confirmDeleteId === selected.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                  Delete
                </Button>
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Single delete confirmation */}
      <AlertDialog
        open={!!confirmDeleteId}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this generation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove it from your history. This
              can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="gap-1.5 bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete-all confirmation */}
      <AlertDialog
        open={confirmDeleteAll}
        onOpenChange={(open) => !open && setConfirmDeleteAll(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete all {generations.length} generation
              {generations.length === 1 ? "" : "s"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This wipes your entire generation history and can't be
              undone. Consider copying anything you still need first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingAll}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteAll}
              disabled={isDeletingAll}
              className="gap-1.5 bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeletingAll ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Delete all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ArticulationsPage;