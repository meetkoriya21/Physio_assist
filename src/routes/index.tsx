import FAQ from '@/components/FAQ';
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Activity, HeartPulse, Bike, Stethoscope, Brain, Hand, Home, Plus, Minus } from "lucide-react";
import heroImg from "@/assets/hero.jpg";

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
  { Icon: HeartPulse,  title: "Back & Neck Pain",   desc: "Targeted relief and lasting posture correction." },
  { Icon: Bike,        title: "Sports Injury",       desc: "Get back in the game with evidence-based recovery." },
  { Icon: Stethoscope, title: "Post-Surgery Rehab",  desc: "Structured recovery to restore strength and mobility." },
  { Icon: Brain,       title: "Neurological Rehab",  desc: "Compassionate, specialised neuro care." },
];

const faqs = [
  { q: "Do I need a referral to book?",       a: "No referral needed. You can book directly through our appointment page." },
  { q: "How long is a session?",              a: "Initial assessments last 60 minutes. Follow-ups are typically 45 minutes." },
  { q: "Do you offer home visits?",           a: "Yes — home visits are available for patients with mobility limitations." },
  { q: "Are sessions covered by insurance?",  a: "Most European private health insurers cover physiotherapy. We provide receipts for reimbursement." },
];

function HomePage() {

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
