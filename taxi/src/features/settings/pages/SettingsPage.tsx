import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Check,
  CreditCard,
  Database,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCreateBillingPortal } from "@/features/billing/hooks/billingHook";
import {
  useDeleteAllGeneratedContent,
  useGetGeneratedContent,
} from "@/features/ai/hooks/aiHook";
import { useGetMe, useUpdateUser } from "@/features/home/hooks/userHook";

// Writing preferences would be implemented in V2.
// const toneOptions = [
//   { value: "job-outreach", label: "Job Outreach" },
//   { value: "work-email", label: "Work Email" },
//   { value: "friendly-note", label: "Friendly Note" },
//   { value: "executive-memo", label: "Executive Memo" },
// ];

function SettingSectionHeading({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: typeof UserRound;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

// Writing preferences would be implemented in V2.
// function PreferenceRow({
//   icon: Icon,
//   title,
//   description,
//   children,
// }: {
//   icon: typeof UserRound;
//   title: string;
//   description: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
//       <div className="flex items-start gap-3">
//         <Icon className="mt-0.5 size-4 text-muted-foreground" />
//         <div>
//           <p className="text-sm font-medium">{title}</p>
//           <p className="mt-1 max-w-lg text-sm leading-5 text-muted-foreground">
//             {description}
//           </p>
//         </div>
//       </div>
//       <div className="shrink-0 sm:min-w-44">{children}</div>
//     </div>
//   );
// }

export default function SettingsPage() {
  const { data: profileData, isLoading: isProfileLoading } = useGetMe();
  const { updateUser, isPending: isUpdatingUser } = useUpdateUser();
  const { openPortal, isPending: isPortalPending } = useCreateBillingPortal();
  const { refetch: refetchGeneratedContent } = useGetGeneratedContent();
  const { deleteAllContent, isPending: isDeletingAll } =
    useDeleteAllGeneratedContent();
  const [name, setName] = useState("");
  // Writing preferences would be implemented in V2.
  // const [defaultTone, setDefaultTone] = useState("job-outreach");
  // const [theme, setTheme] = useState("system");
  const [isDeleteHistoryDialogOpen, setIsDeleteHistoryDialogOpen] =
    useState(false);
  const user = profileData?.user;

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  const handleProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || isUpdatingUser) return;
    void updateUser(trimmedName);
  };

  const handleDeleteHistory = async () => {
    try {
      await deleteAllContent();
      await refetchGeneratedContent();
      setIsDeleteHistoryDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete writing history:", error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 py-6">
      <div className="flex flex-col gap-4 border-b pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            Personal workspace
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Manage your profile, writing preferences, account security, and
            saved Taxi data.
          </p>
        </div>
        <Badge variant="outline" className="w-fit gap-1.5 rounded-full px-3 py-1.5">
          <Check className="size-3.5 text-primary" />
          Changes save automatically
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <SettingSectionHeading
            icon={UserRound}
            eyebrow="Profile"
            title="Your account"
            description="Keep the personal details used across your Taxi workspace up to date."
          />
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="settings-name">Display name</Label>
              <Input
                id="settings-name"
                placeholder={isProfileLoading ? "Loading profile..." : "Your name"}
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={isProfileLoading || isUpdatingUser}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-email">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="settings-email"
                  value={user?.email ?? ""}
                  readOnly
                  disabled
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Contact support to change your login email.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Email verified</p>
                <p className="text-xs text-muted-foreground">
                  Your account email is verified.
                </p>
              </div>
            </div>
            <Badge className="rounded-full">Verified</Badge>
          </div>
          <form onSubmit={handleProfileSubmit} className="flex justify-end">
            <Button disabled={!name.trim() || isProfileLoading || isUpdatingUser}>
              {isUpdatingUser ? "Saving..." : "Save profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/*
        Writing preferences would be implemented in V2.
        <Card>
          <CardHeader>
            <SettingSectionHeading
              icon={Palette}
              eyebrow="Writing preferences"
              title="Make Taxi feel like yours"
              description="Choose the defaults you want to see when you start a new rewrite."
            />
          </CardHeader>
          <CardContent className="divide-y">
            <PreferenceRow
              icon={Sparkles}
              title="Default writing tone"
              description="The tone selected automatically when you open the composer."
            >
              <div className="relative">
                <select
                  aria-label="Default writing tone"
                  value={defaultTone}
                  onChange={(event) => setDefaultTone(event.target.value)}
                  className="h-9 w-full appearance-none rounded-4xl border border-border bg-input/30 px-3 pr-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {toneOptions.map((tone) => (
                    <option key={tone.value} value={tone.value}>
                      {tone.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </PreferenceRow>
            <PreferenceRow
              icon={Palette}
              title="Appearance"
              description="Choose whether Taxi follows your device theme or stays light or dark."
            >
              <div className="relative">
                <select
                  aria-label="Appearance"
                  value={theme}
                  onChange={(event) => setTheme(event.target.value)}
                  className="h-9 w-full appearance-none rounded-4xl border border-border bg-input/30 px-3 pr-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="system">System default</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </PreferenceRow>
            <PreferenceRow
              icon={Bell}
              title="Result behavior"
              description="Choose what Taxi should do after a rewrite is ready."
            >
              <Button variant="outline" className="w-full justify-between font-normal">
                Show result on page
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            </PreferenceRow>
            <PreferenceRow
              icon={Sparkles}
              title="Custom tones"
              description="Create and manage tones tailored to the way you write."
            >
              <Button variant="outline" className="w-full">
                Manage custom tones
              </Button>
            </PreferenceRow>
          </CardContent>
        </Card>
      */}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <SettingSectionHeading
              icon={LockKeyhole}
              eyebrow="Security"
              title="Protect your account"
              description="Manage your password and sign-in security."
            />
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              render={<Link to="/forgot-password" />}
            >
              <KeyRound className="size-4 text-muted-foreground" />
              Change password
            </Button>
            {/* Sign out of other sessions would be implemented in V2. */}
            {/* <Button variant="outline" className="w-full justify-start gap-3">
              <LockKeyhole className="size-4 text-muted-foreground" />
              Sign out of other sessions
            </Button> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <SettingSectionHeading
              icon={CreditCard}
              eyebrow="Billing"
              title="Your plan"
              description="View your plan and manage payment details through BACHS."
            />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <div>
                <p className="font-medium">Pro plan</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  50 rewrites per month
                </p>
              </div>
              <Badge variant="secondary" className="rounded-full">Active</Badge>
            </div>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => void openPortal()}
              disabled={isPortalPending}
            >
              {isPortalPending ? "Opening billing..." : "Manage billing"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-destructive/30">
        <CardHeader>
          <SettingSectionHeading
            icon={Database}
            eyebrow="Data & privacy"
            title="Manage your saved data"
            description="Your generated rewrites are saved so you can revisit them later."
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Trash2 className="mt-0.5 size-4 text-destructive" />
              <div>
                <p className="text-sm font-medium">Delete writing history</p>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  Permanently remove all saved articulations from your account.
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              className="shrink-0"
              onClick={() => setIsDeleteHistoryDialogOpen(true)}
              disabled={isDeletingAll}
            >
              <Trash2 className="size-4" />
              Delete history
            </Button>
          </div>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Database className="size-3.5" />
            Account deletion and data export can be added here later.
          </p>
        </CardContent>
      </Card>

      <p className="flex items-center justify-center gap-2 pb-4 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5" />
        Your account details are private and only visible to you.
      </p>

      <AlertDialog
        open={isDeleteHistoryDialogOpen}
        onOpenChange={(open) => {
          if (!isDeletingAll) {
            setIsDeleteHistoryDialogOpen(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete all writing history?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes every saved rewrite from your account.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingAll}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => void handleDeleteHistory()}
              disabled={isDeletingAll}
            >
              {isDeletingAll && <Loader2 className="size-4 animate-spin" />}
              {isDeletingAll ? "Deleting..." : "Delete all history"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
