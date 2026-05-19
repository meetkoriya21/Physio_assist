import { createFileRoute, useSearch, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Star, CheckCircle2, XCircle, Send, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/review")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || "",
  }),
  head: () => ({
    meta: [{ title: "Leave a Review — PhysioLife Clinic" }],
  }),
  component: ReviewPage,
});

type PageState = "loading" | "no_token" | "invalid" | "already_used" | "form" | "success";

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent!"];
  return (
    <div className="space-y-2 text-center">
      <div className="flex gap-2 justify-center">
        {[1,2,3,4,5].map(i => (
          <button key={i} type="button"
            onClick={() => onChange(i)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Star className={`h-10 w-10 transition-colors ${(hovered || value) >= i ? "fill-primary text-primary" : "text-muted-foreground/40"}`} />
          </button>
        ))}
      </div>
      {(hovered || value) > 0 && (
        <p className="text-sm font-medium text-primary">{labels[hovered || value]}</p>
      )}
    </div>
  );
}

function ReviewPage() {
  const { token } = useSearch({ from: "/review" });

  const [pageState,   setPageState]   = useState<PageState>("loading");
  const [reviewId,    setReviewId]    = useState("");
  const [patientName, setPatientName] = useState("");
  const [rating,      setRating]      = useState(5);
  const [text,        setText]        = useState("");
  const [error,       setError]       = useState("");
  const [submitting,  setSubmitting]  = useState(false);

  useEffect(() => {
    if (!token || token.trim() === "") {
      setPageState("no_token");
      return;
    }

    // Query Supabase for the token
    supabase
      .from("reviews")
      .select("id, name, token_used, status")
      .eq("token", token.trim())
      .maybeSingle() // use maybeSingle instead of single — returns null if not found, no error
      .then(({ data, error: queryError }) => {
        if (queryError) {
          console.error("Token query error:", queryError.message);
          setPageState("invalid");
          return;
        }

        if (!data) {
          // Token not found in DB
          setPageState("invalid");
          return;
        }

        if (data.token_used === true) {
          setPageState("already_used");
          return;
        }

        // Valid unused token
        setReviewId(data.id);
        setPatientName(data.name || "");
        setPageState("form");
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!text.trim()) { setError("Please write your review."); return; }
    if (rating === 0) { setError("Please select a star rating."); return; }
    setSubmitting(true);

    const { error: updateError } = await supabase
      .from("reviews")
      .update({
        rating,
        text:       text.trim(),
        token_used: true,
        status:     "pending",
      })
      .eq("id", reviewId);

    if (updateError) {
      console.error("Review update error:", updateError.message);
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    setPageState("success");
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (pageState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Validating your review link…</p>
        </div>
      </div>
    );
  }

  // ── No token ──────────────────────────────────────────────────────────────
  if (pageState === "no_token") {
    return <ErrorScreen
      title="No Review Link"
      message="Review links are sent via email after your appointment is confirmed by our team."
    />;
  }

  // ── Invalid token ─────────────────────────────────────────────────────────
  if (pageState === "invalid") {
    return <ErrorScreen
      title="Link Not Found"
      message="This review link is not valid or has expired. Please check the confirmation email we sent you after your appointment was accepted."
    />;
  }

  // ── Already used ──────────────────────────────────────────────────────────
  if (pageState === "already_used") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center rounded-3xl bg-card p-10 shadow-card">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-semibold mb-3">Already Submitted</h2>
          <p className="text-muted-foreground text-sm mb-6">
            You've already submitted a review using this link. Each link can only be used once. Thank you for your feedback!
          </p>
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────
  if (pageState === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center rounded-3xl bg-card p-10 shadow-card">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary-soft text-primary mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="font-display text-2xl font-semibold mb-3">Thank you, {patientName}! 🎉</h2>
          <p className="text-muted-foreground text-sm mb-2">Your review has been submitted successfully.</p>
          <p className="text-muted-foreground text-sm mb-8">It will appear on our website after approval. We really appreciate your feedback!</p>
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // ── Review Form ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-16">
      <div className="max-w-lg w-full">

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-4">
            ✅ Verified Patient Review
          </div>
          <h1 className="font-display text-3xl font-semibold text-foreground mb-3">
            How was your session?
          </h1>
          <p className="text-muted-foreground text-sm">
            Hi <strong>{patientName}</strong>! Your honest feedback helps us improve and helps others find the right care.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl bg-card p-8 shadow-card space-y-6">

          {error && (
            <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
          )}

          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground block text-center">Your rating *</label>
            <StarInput value={rating} onChange={setRating} />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">Your review *</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="Tell us about your experience — what helped most, how you felt after the session…"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">{text.length}/500</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
            ) : (
              <><Send className="h-4 w-4" /> Submit Review</>
            )}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            🔒 This link is personal to you and can only be used once.
          </p>
        </form>
      </div>
    </div>
  );
}

function ErrorScreen({ title, message }: { title: string; message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center rounded-3xl bg-card p-10 shadow-card">
        <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h2 className="font-display text-2xl font-semibold mb-3">{title}</h2>
        <p className="text-muted-foreground text-sm mb-8">{message}</p>
        <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
