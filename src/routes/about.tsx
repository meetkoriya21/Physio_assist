import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Award, Heart, Sparkles, GraduationCap, Phone } from "lucide-react";
import aboutImg from "@/assets/about.jpg";
import { PageHeader, Section } from "@/components/PageShell";

// ── UPDATE this to the real doctor's name ──────────────────────────────────
const DOCTOR_NAME = "Dr. Divya Prajapati"; // <-- change to real name

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About ${DOCTOR_NAME} — PhysioLife Clinic` },
      { name: "description", content: "Meet your physiotherapist. Years of experience, advanced certifications and a deeply patient-centred approach." },
      { property: "og:title", content: `About — PhysioLife Clinic` },
      { property: "og:description", content: "Meet your physiotherapist." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const qualifications = [
  "MSc in Physiotherapy",
  "Certified Manual Therapist (OMT)",
  "Sports Rehabilitation Specialist",
  "Neurological Rehabilitation Certified",
  "Member of European Physiotherapy Association",
  "Continuous postgraduate training in dry needling & taping",
];

const reasons = [
  { Icon: Heart, title: "Patient-first care", desc: "Every plan is built around your life and goals — not a template." },
  { Icon: Award, title: "Decade of expertise", desc: "10+ years of clinical practice across orthopedic and neurological cases." },
  { Icon: Sparkles, title: "Modern techniques", desc: "Evidence-based manual therapy combined with the latest rehab science." },
];

const stats = [
  { value: "10+", label: "Years of clinical practice" },
  { value: "2k+", label: "Patients helped" },
  { value: "4.9★", label: "Average patient rating" },
  { value: "6", label: "Specialist certifications" },
];

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={`Hi, I'm ${DOCTOR_NAME}`}
        subtitle="A physiotherapist devoted to helping you move better, recover faster and live without limits."
      />

      <Section>
        {/* Stats bar */}
        <div className="mb-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="rounded-2xl bg-primary-soft px-5 py-4 text-center">
              <div className="font-display text-2xl font-bold text-primary">{value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Photo */}
          <div className="relative">
            <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
            <img
              src={aboutImg}
              alt={`${DOCTOR_NAME} portrait`}
              width={1024}
              height={1280}
              loading="lazy"
              className="relative rounded-3xl object-cover shadow-soft"
            />
          </div>

          {/* Bio */}
          <div>
            <h2 className="font-display text-3xl font-semibold">My approach</h2>
            <div className="mt-5 space-y-4 text-muted-foreground">
              <p>
                I founded PhysioLife Clinic to offer something patients told me they couldn't
                easily find: unhurried sessions, real listening, and a clinician who treats the
                cause, not just the symptom.
              </p>
              <p>
                Whether you're recovering from surgery, managing chronic pain, or returning to
                sport, we'll design a programme that fits your body, your schedule and your goals.
              </p>
              <p>
                I believe physiotherapy works best when you feel genuinely heard — so every
                appointment starts with listening, not assumptions.
              </p>
            </div>

            <h3 className="mt-10 flex items-center gap-2 font-display text-xl font-semibold">
              <GraduationCap className="h-5 w-5 text-primary" /> Qualifications
            </h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {qualifications.map((q) => (
                <li key={q} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" /> {q}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/appointment"
                className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.03]"
              >
                Book your first session
              </Link>
              <a
                href="tel:+00000000000"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
              >
                <Phone className="h-4 w-4" /> Call us
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* Why choose me */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Why choose me
            </span>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Care that goes further
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {reasons.map(({ Icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-card p-7 shadow-card">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/appointment"
              className="inline-flex items-center rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.03]"
            >
              Book your first session
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
