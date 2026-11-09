import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowUpRight,
  Check,
  Clock,
  Construction,
  Copy,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const supportEmail = "arokoyueb11@gmail.com";

export default function FeedbackPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(supportEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error("Failed to copy email address:", error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 py-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border bg-card px-6 py-8 sm:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <MessageSquare className="size-3.5" />
            Feedback
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Feedback is still in the workshop
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            We're finishing the in-app feedback form. Until it's ready, email is
            the fastest way to reach the person who builds Taxi.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1.5">
              <Construction className="size-3.5 text-primary" />
              Work in progress
            </Badge>
            <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1.5">
              <Mail className="size-3.5 text-primary" />
              Email works today
            </Badge>
            <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1.5">
              <Clock className="size-3.5 text-primary" />
              Replies within a day
            </Badge>
          </div>
        </div>
      </section>

      {/* Work in progress */}
      <Card className="mx-auto w-full max-w-2xl gap-0 py-0">
        <CardContent className="flex flex-col items-center px-6 py-12 text-center sm:px-10">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Construction className="size-8" />
          </div>

          <Badge
            variant="outline"
            className="mt-6 gap-1.5 rounded-full px-3 py-1.5"
          >
            <Clock className="size-3.5 text-primary" />
            Coming soon
          </Badge>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-balance">
            This page is still a work in progress
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            We're putting the finishing touches on it, so the form isn't live
            yet. Bug reports, ideas, and honest notes are still very welcome —
            send them by email and they land directly with us.
          </p>

          <div className="mt-7 w-full max-w-sm space-y-2">
            <div className="flex items-center gap-2 rounded-4xl border bg-input/30 py-1.5 pr-1.5 pl-4">
              <Mail className="size-4 shrink-0 text-primary" />
              <a
                href={`mailto:${supportEmail}`}
                className="min-w-0 flex-1 truncate text-left text-sm font-medium underline-offset-4 hover:underline"
              >
                {supportEmail}
              </a>
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-muted-foreground hover:text-primary"
                onClick={() => void handleCopy()}
              >
                {copied ? (
                  <Check className="size-3.5 text-primary" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                <span className="sr-only">
                  {copied ? "Copied" : "Copy email address"}
                </span>
              </Button>
            </div>

            <Button
              className="w-full gap-2"
              nativeButton={false}
              render={
                <a
                  href={`mailto:${supportEmail}?subject=${encodeURIComponent(
                    "Feedback about Taxi"
                  )}`}
                />
              }
            >
              <Mail className="size-4" />
              Email us your feedback
            </Button>
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            Usually answered within one business day.
          </p>
        </CardContent>
      </Card>

      {/* Help link */}
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 rounded-2xl border bg-card px-5 py-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageSquare className="size-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Need an answer right now?</p>
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              The help centre covers accounts, billing, and rides.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-between gap-2 sm:w-auto sm:shrink-0"
          nativeButton={false}
          render={<Link to="/help" />}
        >
          Open help centre
          <ArrowUpRight className="size-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Previous feedback UI — commented out on purpose, NOT deleted.
// Restore it once the feedback form has a backend to submit to: uncomment the
// block below (strip the leading "// " from each line) and remove the
// work-in-progress page above.
// ---------------------------------------------------------------------------
//
// import { useState } from "react";
// import { Link } from "react-router";
// import {
//   ArrowUpRight,
//   Bug,
//   Check,
//   Clock,
//   Heart,
//   LifeBuoy,
//   Lightbulb,
//   Loader2,
//   Mail,
//   MessageSquare,
//   PenLine,
//   Send,
//   ShieldCheck,
//   Sparkles,
//   Star,
//   TriangleAlert,
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { toast } from "@/components/ui/toast";
// import { useGetMe } from "@/features/home/hooks/userHook";
// import { cn } from "@/lib/utils";
// 
// const MAX_MESSAGE = 1000;
// const MIN_MESSAGE = 10;
// const supportEmail = "arokoyueb11@gmail.com";
// 
// const feedbackTypes = [
//   {
//     value: "bug",
//     label: "Bug report",
//     icon: Bug,
//   },
//   {
//     value: "idea",
//     label: "Feature idea",
//     icon: Lightbulb,
//   },
//   {
//     value: "confusing",
//     label: "Confusing",
//     icon: TriangleAlert,
//   },
//   {
//     value: "praise",
//     label: "Just saying hi",
//     icon: Heart,
//   },
// ] as const;
// 
// type FeedbackType = (typeof feedbackTypes)[number]["value"];
// 
// const ratingLabels = {
//   1: "Needs work",
//   2: "Not great",
//   3: "It's okay",
//   4: "Really good",
//   5: "Love it",
// } as const;
// 
// const tips = [
//   {
//     icon: PenLine,
//     title: "Be specific",
//     description:
//       "What you were doing and what you expected helps us reproduce it in minutes.",
//   },
//   {
//     icon: MessageSquare,
//     title: "One thing per note",
//     description:
//       "Small, separate notes are easier to act on than one long list.",
//   },
//   {
//     icon: Mail,
//     title: "Got a screenshot?",
//     description: `Attach it by emailing ${supportEmail} and reference your note.`,
//   },
// ];
// 
// function FeedbackSuccess({
//   type,
//   rating,
//   contactEmail,
//   onReset,
// }: {
//   type: FeedbackType;
//   rating: number;
//   contactEmail: string | null;
//   onReset: () => void;
// }) {
//   const typeLabel =
//     feedbackTypes.find((item) => item.value === type)?.label ?? "Feedback";
// 
//   return (
//     <CardContent className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
//       <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
//         <Check className="size-7" />
//       </div>
// 
//       <h2 className="mt-5 text-xl font-semibold tracking-tight">
//         Got it — thank you
//       </h2>
//       <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
//         Your note went straight to the Taxi team. We read every piece of
//         feedback, even when we can't reply to all of it.
//       </p>
// 
//       <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
//         <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1.5">
//           <Sparkles className="size-3.5 text-primary" />
//           {typeLabel}
//         </Badge>
//         {rating > 0 && (
//           <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1.5">
//             <Star className="size-3.5 fill-primary text-primary" />
//             {rating}/5
//           </Badge>
//         )}
//         {contactEmail && (
//           <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1.5">
//             <Mail className="size-3.5 text-primary" />
//             Reply to {contactEmail}
//           </Badge>
//         )}
//       </div>
// 
//       <div className="mt-7 flex flex-col gap-2 sm:flex-row">
//         <Button onClick={onReset} className="gap-2">
//           <PenLine className="size-4" />
//           Send more feedback
//         </Button>
//         <Button variant="outline" nativeButton={false} render={<Link to="/help" />}>
//           Visit help center
//         </Button>
//       </div>
// 
//       <p className="mt-6 text-xs text-muted-foreground">
//         Usually answered within one business day.
//       </p>
//     </CardContent>
//   );
// }
// 
// export default function FeedbackPage() {
//   const { data: profileData } = useGetMe();
//   const user = profileData?.user;
// 
//   const [type, setType] = useState<FeedbackType>("idea");
//   const [rating, setRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [subject, setSubject] = useState("");
//   const [message, setMessage] = useState("");
//   const [contactMe, setContactMe] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
// 
//   const activeRating = hoverRating || rating;
//   const contactEmail = contactMe ? (user?.email ?? null) : null;
// 
//   const resetForm = () => {
//     setType("idea");
//     setRating(0);
//     setHoverRating(0);
//     setSubject("");
//     setMessage("");
//     setContactMe(true);
//     setError(null);
//     setSubmitted(false);
//   };
// 
//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (isSubmitting) return;
// 
//     if (message.trim().length < MIN_MESSAGE) {
//       const nextError = `Tell us a little more — at least ${MIN_MESSAGE} characters.`;
//       setError(nextError);
//       toast.add({
//         type: "error",
//         title: "A few more details, please",
//         description: nextError,
//         priority: "high",
//       });
//       return;
//     }
// 
//     setError(null);
//     setIsSubmitting(true);
// 
//     // No feedback endpoint yet — the UI confirms locally so the flow can be
//     // previewed end to end. Swap this for the API call when it lands.
//     window.setTimeout(() => {
//       setIsSubmitting(false);
//       setSubmitted(true);
//       toast.add({
//         type: "success",
//         title: "Feedback sent",
//         description: "Thanks for helping make Taxi better.",
//       });
//     }, 600);
//   };
// 
//   return (
//     <div className="mx-auto w-full max-w-5xl space-y-8 py-6">
//       {/* Hero */}
//       <section className="relative overflow-hidden rounded-3xl border bg-card px-6 py-8 sm:px-8">
//         <div
//           aria-hidden
//           className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-primary/10 blur-3xl"
//         />
//         <div className="relative max-w-2xl">
//           <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
//             <MessageSquare className="size-3.5" />
//             Feedback
//           </div>
//           <h1 className="text-3xl font-semibold tracking-tight">
//             Tell us what's working — and what isn't
//           </h1>
//           <p className="mt-2 text-sm leading-6 text-muted-foreground">
//             Bug reports, feature ideas, or a note about how Taxi feels. Every
//             submission lands with the person who builds it.
//           </p>
// 
//           <div className="mt-5 flex flex-wrap items-center gap-2">
//             <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1.5">
//               <Sparkles className="size-3.5 text-primary" />
//               Read by the maker
//             </Badge>
//             <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1.5">
//               <Clock className="size-3.5 text-primary" />
//               Replies within a day
//             </Badge>
//             <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1.5">
//               <ShieldCheck className="size-3.5 text-primary" />
//               Never shared
//             </Badge>
//           </div>
//         </div>
//       </section>
// 
//       <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
//         {/* Form / success */}
//         <Card className="gap-0 py-0">
//           {submitted ? (
//             <FeedbackSuccess
//               type={type}
//               rating={rating}
//               contactEmail={contactEmail}
//               onReset={resetForm}
//             />
//           ) : (
//             <form onSubmit={handleSubmit}>
//               <CardHeader className="border-b pb-5">
//                 <div className="flex items-center justify-between gap-4">
//                   <div>
//                     <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
//                       Share feedback
//                     </p>
//                     <h2 className="mt-1 text-lg font-semibold tracking-tight">
//                       What's on your mind?
//                     </h2>
//                     <p className="mt-1 text-sm text-muted-foreground">
//                       It takes about a minute. No account details needed beyond
//                       what's already on your profile.
//                     </p>
//                   </div>
//                   <div className="hidden size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
//                     <PenLine className="size-5" />
//                   </div>
//                 </div>
//               </CardHeader>
// 
//               <CardContent className="space-y-6 py-6">
//                 {/* Type */}
//                 <div className="space-y-2.5">
//                   <Label className="text-sm">What kind of feedback is this?</Label>
//                   <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
//                     {feedbackTypes.map((option) => {
//                       const isSelected = type === option.value;
// 
//                       return (
//                         <button
//                           key={option.value}
//                           type="button"
//                           aria-pressed={isSelected}
//                           onClick={() => setType(option.value)}
//                           className={cn(
//                             "flex flex-col items-start gap-2 rounded-xl border px-3 py-3 text-left text-xs font-medium transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
//                             isSelected
//                               ? "border-primary/40 bg-primary/10 text-primary"
//                               : "border-border bg-input/30 text-muted-foreground hover:bg-input/50 hover:text-foreground"
//                           )}
//                         >
//                           <option.icon className="size-4" />
//                           {option.label}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
// 
//                 {/* Rating */}
//                 <div className="rounded-xl border bg-muted/30 p-4">
//                   <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                     <div>
//                       <p className="text-sm font-medium">
//                         How's Taxi treating you?
//                       </p>
//                       <p className="mt-1 text-xs text-muted-foreground">
//                         Optional, but it helps us spot patterns.
//                       </p>
//                     </div>
// 
//                     <div className="flex items-center gap-3">
//                       <div
//                         role="group"
//                         aria-label="Rate your experience out of 5"
//                         className="flex items-center gap-1"
//                         onMouseLeave={() => setHoverRating(0)}
//                       >
//                         {[1, 2, 3, 4, 5].map((value) => {
//                           const isFilled = value <= activeRating;
// 
//                           return (
//                             <button
//                               key={value}
//                               type="button"
//                               aria-label={`${value} of 5 — ${
//                                 ratingLabels[value as 1 | 2 | 3 | 4 | 5]
//                               }`}
//                               aria-pressed={rating === value}
//                               onMouseEnter={() => setHoverRating(value)}
//                               onFocus={() => setHoverRating(value)}
//                               onBlur={() => setHoverRating(0)}
//                               onClick={() =>
//                                 setRating((current) =>
//                                   current === value ? 0 : value
//                                 )
//                               }
//                               className="rounded-md p-0.5 outline-none transition-transform hover:scale-110 focus-visible:ring-[3px] focus-visible:ring-ring/50"
//                             >
//                               <Star
//                                 className={cn(
//                                   "size-5 transition-colors",
//                                   isFilled
//                                     ? "fill-primary text-primary"
//                                     : "text-muted-foreground/40"
//                                 )}
//                               />
//                             </button>
//                           );
//                         })}
//                       </div>
//                       <span className="w-20 text-xs text-muted-foreground">
//                         {rating > 0
//                           ? ratingLabels[rating as 1 | 2 | 3 | 4 | 5]
//                           : "No rating"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
// 
//                 {/* Subject */}
//                 <div className="space-y-2">
//                   <Label htmlFor="feedback-subject" className="text-sm">
//                     Subject{" "}
//                     <span className="font-normal text-muted-foreground">
//                       (optional)
//                     </span>
//                   </Label>
//                   <Input
//                     id="feedback-subject"
//                     placeholder="A short summary, e.g. “Rewrite button does nothing”"
//                     value={subject}
//                     maxLength={120}
//                     onChange={(event) => setSubject(event.target.value)}
//                   />
//                 </div>
// 
//                 {/* Message */}
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between gap-4">
//                     <Label htmlFor="feedback-message" className="text-sm">
//                       Your feedback
//                     </Label>
//                     <span
//                       className={cn(
//                         "text-xs tabular-nums",
//                         message.length > MAX_MESSAGE * 0.9
//                           ? "text-primary"
//                           : "text-muted-foreground"
//                       )}
//                     >
//                       {message.length}/{MAX_MESSAGE}
//                     </span>
//                   </div>
//                   <Textarea
//                     id="feedback-message"
//                     rows={6}
//                     placeholder="What happened, what you expected, and anything you've already tried…"
//                     value={message}
//                     maxLength={MAX_MESSAGE}
//                     aria-invalid={error ? true : undefined}
//                     onChange={(event) => {
//                       setMessage(event.target.value);
//                       if (error) setError(null);
//                     }}
//                     className="min-h-36"
//                   />
//                   {error ? (
//                     <p className="text-xs text-destructive">{error}</p>
//                   ) : (
//                     <p className="text-xs text-muted-foreground">
//                       Screenshots or links are welcome — paste them in or email
//                       them over.
//                     </p>
//                   )}
//                 </div>
// 
//                 {/* Contact permission */}
//                 <div className="flex items-start gap-3 rounded-xl border bg-muted/30 p-3.5">
//                   <Checkbox
//                     id="feedback-contact"
//                     checked={contactMe}
//                     onCheckedChange={(checked) => setContactMe(checked === true)}
//                   />
//                   <div className="space-y-0.5">
//                     <Label
//                       htmlFor="feedback-contact"
//                       className="cursor-pointer text-sm font-medium"
//                     >
//                       I'm happy to be contacted about this
//                     </Label>
//                     <p className="text-xs leading-5 text-muted-foreground">
//                       {contactMe
//                         ? user?.email
//                           ? `We'll reply to ${user.email} if we need more detail.`
//                           : "We'll reply to the email on your account."
//                         : "We'll keep this note anonymous and won't follow up."}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
// 
//               <div className="flex flex-col-reverse gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
//                 <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
//                   <ShieldCheck className="size-3.5" />
//                   Only the Taxi team sees this.
//                 </p>
//                 <Button
//                   type="submit"
//                   className="gap-2 sm:shrink-0"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? (
//                     <Loader2 className="size-4 animate-spin" />
//                   ) : (
//                     <Send className="size-4" />
//                   )}
//                   {isSubmitting ? "Sending…" : "Send feedback"}
//                 </Button>
//               </div>
//             </form>
//           )}
//         </Card>
// 
//         {/* Sidebar */}
//         <aside className="space-y-4">
//           <Card className="gap-0 py-0">
//             <CardContent className="space-y-4 p-5">
//               <div className="flex items-center gap-2">
//                 <Sparkles className="size-4 text-primary" />
//                 <p className="text-sm font-medium">Make it count</p>
//               </div>
//               <ul className="space-y-4">
//                 {tips.map((tip) => (
//                   <li key={tip.title} className="flex gap-3">
//                     <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
//                       <tip.icon className="size-4" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium">{tip.title}</p>
//                       <p className="mt-1 text-xs leading-5 text-muted-foreground">
//                         {tip.description}
//                       </p>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </CardContent>
//           </Card>
// 
//           <Card className="gap-0 bg-primary/5 py-0 ring-primary/20">
//             <CardContent className="space-y-3 p-5">
//               <div className="flex items-center gap-2">
//                 <LifeBuoy className="size-4 text-primary" />
//                 <p className="text-sm font-medium">Need an answer now?</p>
//               </div>
//               <p className="text-xs leading-5 text-muted-foreground">
//                 Feedback isn't a support channel. For account or billing
//                 problems, the help center gets you sorted faster.
//               </p>
//               <Button
//                 variant="outline"
//                 className="w-full justify-between"
//                 nativeButton={false}
//                 render={<Link to="/help" />}
//               >
//                 Open help center
//                 <ArrowUpRight className="size-4 text-muted-foreground" />
//               </Button>
//             </CardContent>
//           </Card>
// 
//           <p className="px-1 text-center text-xs leading-5 text-muted-foreground">
//             Prefer email? Reach us at{" "}
//             <a
//               href={`mailto:${supportEmail}`}
//               className="font-medium text-primary underline-offset-4 hover:underline"
//             >
//               {supportEmail}
//             </a>
//             .
//           </p>
//         </aside>
//       </div>
//     </div>
//   );
// }
