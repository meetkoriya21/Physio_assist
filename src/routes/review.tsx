import { createFileRoute, useSearch, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Star, CheckCircle2, XCircle, Send } from "lucide-react";
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

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-2 justify-center">
      {[1,2,3,4,5].map(i => (
        <button key={i} type="button" onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110">
          <Star className={`h-10 w-10 ${(hovered||value)>=i ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </button>
      ))}
    </div>
  );
}

function ReviewPage() {
  const { token } = useSearch({ from: "/review" });

  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [alreadyUsed, setAlreadyUsed] = useState(false);
  const [reviewId, setReviewId] = useState<string>("");
  const [patientName, setPatientName] = useState("");

  const [rating, setRating]   = useState(5);
  const [text, setText]       = useState("");
  const [error, setError]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  // ── Validate token on load ────────────────────────────────────────────────
  useEffect(() => {
    if (!token) { setValidating(false); return; }

    supabase
      .from("reviews")
      .select("id, name, token_used")
      .eq("token", token)
      .single()
      .then(({ data, error }) => {
        setValidating(false);
        if (error || !data) { setTokenValid(false); return; }
        if (data.token_used) { setAlreadyUsed(true); return; }
        setTokenValid(true);
        setReviewId(data.id);
        setPatientName(data.name || "");
      });
  }, [token]);

  // ── Submit review ─────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!text.trim()) { setError("Please write your review."); return; }
    if (rating === 0)  { setError("Please select a star rating."); return; }

    setSubmitting(true);

    // Update the review row with actual content + mark token used
    const { error: updateError } = await supabase
      .from("reviews")
      .update({
        rating,
        text: text.trim(),
        token_used: true,
        status: "pending", // admin still approves before showing
      })
      .eq("id", reviewId);

    if (updateError) {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Validating your review link…</p>
        </div>
      </div>
    );
  }

  // ── No token ──────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center rounded-3xl bg-card p-10 shadow-card">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="font-display text-2xl font-semibold mb-3">Invalid Link</h2>
          <p className="text-muted-foreground text-sm mb-6">
            This review link is invalid. Review links are sent via email after your appointment is confirmed.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // ── Token invalid ─────────────────────────────────────────────────────────
  if (!tokenValid && !alreadyUsed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center rounded-3xl bg-card p-10 shadow-card">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="font-display text-2xl font-semibold mb-3">Link Not Found</h2>
          <p className="text-muted-foreground text-sm mb-6">
            This review link is not valid. Please check the email we sent you after your appointment confirmation.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // ── Already used ──────────────────────────────────────────────────────────
  if (alreadyUsed) {
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
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center rounded-3xl bg-card p-10 shadow-card">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary-soft text-primary mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="font-display text-2xl font-semibold mb-3">Thank you, {patientName}! 🎉</h2>
          <p className="text-muted-foreground text-sm mb-2">
            Your review has been submitted successfully.
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            It will appear on our website after approval by our team. We really appreciate your feedback!
          </p>
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // ── Review Form ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-lg w-full">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-widest mb-4">
            ✅ Verified Patient Review
          </div>
          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
            How was your session?
          </h1>
          <p className="text-muted-foreground text-sm">
            Hi <strong>{patientName}</strong>! Your honest feedback helps us improve and helps others find the right care.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-3xl bg-card p-8 shadow-card space-y-6">

          {error && (
            <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
          )}

          {/* Star rating */}
          <div className="text-center space-y-3">
            <label className="text-sm font-semibold text-foreground block">Your rating *</label>
            <StarInput value={rating} onChange={setRating} />
            <p className="text-xs text-muted-foreground">
              {rating === 1 ? "😞 Poor" : rating === 2 ? "😐 Fair" : rating === 3 ? "🙂 Good" : rating === 4 ? "😊 Very Good" : "🤩 Excellent!"}
            </p>
          </div>

          {/* Review text */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">Your review *</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
              placeholder="Tell us about your experience — what helped most, how you felt after the session…"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">{text.length}/500 characters</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <><span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> Submitting…</>
            ) : (
              <><Send className="h-4 w-4" /> Submit Review</>
            )}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            🔒 This link is personal to you and can only be used once.<br/>
            Your review will be visible after approval.
          </p>
        </form>
      </div>
    </div>
  );
}
