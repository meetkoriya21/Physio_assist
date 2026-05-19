import FAQ from '@/components/FAQ';
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowRight, Activity, HeartPulse, Bike, Stethoscope, Brain, Hand, Home, Star, Plus, Minus, Send, CheckCircle2 } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PhysioLife Clinic — Expert Physiotherapy Care in Europe" },
      { name: "description", content: "Move freely, live fully. Personalised physiotherapy for back pain, sports injury, post-surgery and neurological rehab." },
      { property: "og:title", content: "PhysioLife Clinic — Expert Physiotherapy Care" },
      { property: "og:description", content: "Personalised physiotherapy from a caring expert in Europe." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const services = [
  { Icon: HeartPulse, title: "Back & Neck Pain",    desc: "Targeted relief and lasting posture correction." },
  { Icon: Bike,       title: "Sports Injury",        desc: "Get back in the game with evidence-based recovery." },
  { Icon: Stethoscope,title: "Post-Surgery Rehab",   desc: "Structured recovery to restore strength and mobility." },
  { Icon: Brain,      title: "Neurological Rehab",   desc: "Compassionate, specialised neuro care." },
];

const faqs = [
  { q: "Do I need a referral to book?",        a: "No referral needed. You can book a session directly through our appointment page." },
  { q: "How long is a session?",               a: "Initial assessments last 60 minutes. Follow-ups are typically 45 minutes." },
  { q: "Do you offer home visits?",            a: "Yes — home visits are available within the local area for patients with mobility limitations." },
  { q: "Are sessions covered by insurance?",   a: "Most European private health insurers cover physiotherapy. We provide detailed receipts for reimbursement." },
];

// ── Star Rating Input ─────────────────────────────────────────────────────────
function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star className={`h-7 w-7 ${(hovered||value)>=i ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </button>
      ))}
    </div>
  );
}

// ── Review Submit Form ────────────────────────────────────────────────────────
function ReviewForm() {
  const addReview = useStore((s) => s.addReview);
  const [name,    setName]    = useState("");
  const [rating,  setRating]  = useState(5);
  const [text,    setText]    = useState("");
  const [status,  setStatus]  = useState<"idle"|"loading"|"success"|"error">("idle");
  const [error,   setError]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !text.trim()) { setError("Please fill in your name and review."); return; }
    if (rating === 0) { setError("Please select a star rating."); return; }
    setStatus("loading");
    try {
      await addReview({ name: name.trim(), rating, text: text.trim() });
      setStatus("success");
      setName(""); setText(""); setRating(5);
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-primary-soft p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="font-display text-xl font-semibold text-primary mb-2">Thank you for your review!</h3>
        <p className="text-sm text-muted-foreground">Your review has been submitted and will appear after approval.</p>
        <button onClick={() => setStatus("idle")} className="mt-4 text-sm font-semibold text-primary hover:underline">Leave another review</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-card p-8 shadow-card space-y-5">
      <div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-1">Share your experience</h3>
        <p className="text-sm text-muted-foreground">Your review helps others find the right care.</p>
      </div>

      {error && <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}

      <div>
        <label className="text-sm font-medium text-foreground">Your name *</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Anna M."
          className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground block mb-2">Rating *</label>
        <StarInput value={rating} onChange={setRating} />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">Your review *</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
          placeholder="Tell us about your experience…"
          className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <><span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> Submitting…</>
        ) : (
          <><Send className="h-4 w-4" /> Submit Review</>
        )}
      </button>
      <p className="text-center text-xs text-muted-foreground">Reviews are shown after approval by our team.</p>
    </form>
  );
}

// ── Home Page ─────────────────────────────────────────────────────────────────
function HomePage() {
  const fetchReviews = useStore((s) => s.fetchReviews);
  const allReviews   = useStore((s) => s.reviews);

  // ✅ Only show approved reviews on homepage
  const approvedReviews = allReviews.filter((r) => r.status === "approved");

  useEffect(() => { fetchReviews(); }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center animate-fade-up">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              <Activity className="h-3.5 w-3.5" /> Trusted Physiotherapy
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
              Expert <span className="text-primary">Physiotherapy</span> Care
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Personalised, hands-on therapy that helps you move freely and live fully. Recover from pain, injury or surgery with a clinician who genuinely listens.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/appointment" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.03]">
                Book Appointment <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/services" className="inline-flex items-center rounded-full border border-border bg-background px-7 py-3.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">
                Our Services
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div><div className="font-display text-2xl font-bold text-foreground">10+</div> years experience</div>
              <div className="h-8 w-px bg-border" />
              <div><div className="font-display text-2xl font-bold text-foreground">2k+</div> patients helped</div>
              <div className="h-8 w-px bg-border" />
              <div><div className="font-display text-2xl font-bold text-foreground">4.9★</div> average rating</div>
            </div>
          </div>
          <div className="relative animate-scale-in">
            <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
            <div className="absolute -bottom-6 -right-6 h-40 w-40 rounded-full bg-accent/40 blur-2xl" />
            <img src={heroImg} alt="Physiotherapist treating a patient" width={1536} height={1152} className="relative rounded-3xl object-cover shadow-soft" />
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">About the clinic</span>
        <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">A calmer path back to your best self</h2>
        <p className="mt-5 text-lg text-muted-foreground">
          At PhysioLife Clinic, we combine evidence-based physiotherapy with a warm, attentive approach. Every plan is shaped around your goals — whether that's running again, lifting your child without pain, or simply sleeping through the night.
        </p>
      </section>

      {/* SERVICES */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">What we treat</span>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Featured Services</h2>
            </div>
            <Link to="/services" className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex">
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ Icon, title, desc }) => (
              <div key={title} className="group rounded-2xl bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS — dynamic from Supabase ── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Patient stories</span>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Loved by patients across the city</h2>
        </div>

        {/* Approved reviews grid */}
        {approvedReviews.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 text-sm">No reviews yet — be the first to share your experience!</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 mb-16">
            {approvedReviews.map((r) => (
              <div key={r.id} className="rounded-2xl bg-card p-7 shadow-card">
                <div className="flex gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-current" : "text-muted-foreground"}`} />
                  ))}
                </div>
                <p className="mt-4 text-foreground/90">"{r.text}"</p>
                <div className="mt-5 text-sm font-semibold text-muted-foreground">— {r.name}</div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ Submit review form */}
        <div className="mx-auto max-w-xl">
          <ReviewForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">FAQ</span>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Common questions</h2>
          </div>
          <div className="mt-10 space-y-3">
            {faqs.map((f, i) => <FAQItem key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-primary px-8 py-16 text-center shadow-soft sm:px-16">
          <h2 className="font-display text-3xl font-semibold text-primary-foreground sm:text-4xl">Ready to feel better?</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">Book a session today and take the first step toward pain-free movement.</p>
          <Link to="/appointment" className="mt-8 inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 text-sm font-semibold text-primary shadow-soft transition-transform hover:scale-[1.03]">
            Book Appointment <ArrowRight className="h-4 w-4" />
          </Link>
          <FAQ />
        </div>
      </section>
    </>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
        <span className="font-medium text-foreground">{q}</span>
        {open ? <Minus className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
      </button>
      {open && <div className="px-6 pb-5 text-sm text-muted-foreground">{a}</div>}
    </div>
  );
}

void Hand; void Home;
