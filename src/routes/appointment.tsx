import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Calendar, Clock, Phone, ArrowLeft, ChevronRight } from "lucide-react";
import { PageHeader, Section } from "@/components/PageShell";
import emailjs from '@emailjs/browser'; // <-- Added EmailJS import

export const Route = createFileRoute("/appointment")({
  head: () => ({
    meta: [
      { title: "Book an Appointment — PhysioLife Clinic" },
      { name: "description", content: "Book your physiotherapy session online. Choose your service, preferred date and time." },
      { property: "og:title", content: "Book an Appointment — PhysioLife Clinic" },
      { property: "og:description", content: "Book your physiotherapy session online." },
    ],
    links: [{ rel: "canonical", href: "/appointment" }],
  }),
  component: AppointmentPage,
});

const services = [
  "Back & Neck Pain",
  "Sports Injury",
  "Post-Surgery Rehab",
  "Neurological Rehab",
  "Manual Therapy",
  "Home Visit",
];

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
];

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  service: z.string().min(1, "Please select a service"),
  date: z.string().min(1, "Please select a preferred date"),
  time: z.string().min(1, "Please select a preferred time"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

// ─── EmailJS Integration ──────────────────────────────────────────────────
// Replace these with the actual keys from your EmailJS dashboard
const EMAILJS_SERVICE_ID = "service_lznxegl";
const EMAILJS_TEMPLATE_ID = "template_oh19x18";
const EMAILJS_PUBLIC_KEY = "lw79mDJ28MM-HLw0h";

async function sendAppointmentEmail(data: FormData): Promise<void> {
  try {
    // 1. Send the Email via EmailJS (Keep this so you still get instant alerts!)
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        fullName: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        date: data.date,
        time: data.time,
        message: data.message || "No additional message provided.",
      },
      EMAILJS_PUBLIC_KEY
    );

    // 2. Save it permanently to your new MongoDB Database!
    const dbResponse = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!dbResponse.ok) {
      console.error("Failed to save to database");
    }

  } catch (error) {
    console.error("Error submitting appointment:", error);
    throw new Error("Failed to process appointment");
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────
function AppointmentPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      await sendAppointmentEmail(data);
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  // Today's date as yyyy-mm-dd for the min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <PageHeader
        eyebrow="Booking"
        title="Book your appointment"
        subtitle="Tell us a little about yourself and we'll confirm your session within 24 hours."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-3">
          {/* ── FORM ── */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-card p-8 shadow-card sm:p-10">
              {status === "success" ? (
                <div className="py-8 text-center">
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary-soft text-primary">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h2 className="mt-6 font-display text-2xl font-semibold">
                    Booking request received!
                  </h2>
                  <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
                    Thank you. We'll call or email you within 24 hours to confirm
                    your session.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
                  >
                    <ArrowLeft className="h-4 w-4" /> Book another session
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full name *" error={errors.name?.message}>
                      <input
                        {...register("name")}
                        placeholder="Jane Smith"
                        className={inputCls(!!errors.name)}
                      />
                    </Field>
                    <Field label="Email *" error={errors.email?.message}>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="jane@example.com"
                        className={inputCls(!!errors.email)}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Phone *" error={errors.phone?.message}>
                      <input
                        {...register("phone")}
                        type="tel"
                        placeholder="+00 000 000 0000"
                        className={inputCls(!!errors.phone)}
                      />
                    </Field>
                    <Field label="Service *" error={errors.service?.message}>
                      <select {...register("service")} className={inputCls(!!errors.service)} defaultValue="">
                        <option value="" disabled>Select a service</option>
                        {services.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Preferred date *" error={errors.date?.message}>
                      <input
                        {...register("date")}
                        type="date"
                        min={today}
                        className={inputCls(!!errors.date)}
                      />
                    </Field>
                    <Field label="Preferred time *" error={errors.time?.message}>
                      <select {...register("time")} className={inputCls(!!errors.time)} defaultValue="">
                        <option value="" disabled>Select a time</option>
                        {timeSlots.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label="Message (optional)">
                    <textarea
                      {...register("message")}
                      rows={4}
                      placeholder="Briefly describe your symptoms, medical history, or any questions…"
                      className={inputCls(false)}
                    />
                  </Field>

                  {status === "error" && (
                    <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      Something went wrong. Please try again or call us directly.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4" /> Submit booking request
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-muted-foreground">
                    By submitting you agree to our privacy policy. We never share
                    your data.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-5">
            <div className="rounded-2xl bg-primary-soft p-6">
              <h3 className="font-display text-lg font-semibold text-primary">What happens next?</h3>
              <ol className="mt-4 space-y-3">
                {[
                  "Submit your request below",
                  "We confirm within 24 hours by phone or email",
                  "Attend your 60-min initial assessment",
                  "Receive your personalised treatment plan",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl bg-card p-6 shadow-card">
              <h3 className="font-display text-base font-semibold">Clinic hours</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {[
                  ["Mon – Fri", "09:00 – 19:00"],
                  ["Saturday", "09:00 – 14:00"],
                  ["Sunday", "Closed"],
                ].map(([day, hrs]) => (
                  <li key={day} className="flex justify-between">
                    <span>{day}</span>
                    <span className="font-medium text-foreground">{hrs}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-card p-6 shadow-card">
              <h3 className="font-display text-base font-semibold">Prefer to call?</h3>
              <a
                href="tel:+00000000000"
                className="mt-3 flex items-center gap-3 text-primary hover:underline"
              >
                <Phone className="h-5 w-5" />
                <span className="text-sm font-medium">+00 000 000 0000</span>
              </a>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display text-base font-semibold">Session types</h3>
              <ul className="mt-3 space-y-2">
                {[
                  { label: "Initial assessment", duration: "60 min" },
                  { label: "Follow-up session", duration: "45 min" },
                  { label: "Home visit", duration: "60 min" },
                ].map(({ label, duration }) => (
                  <li key={label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> {label}
                    </span>
                    <span className="font-medium text-foreground">{duration}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function inputCls(hasError: boolean) {
  return `mt-2 w-full rounded-xl border ${
    hasError ? "border-destructive focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-primary/20"
  } bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors`;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}