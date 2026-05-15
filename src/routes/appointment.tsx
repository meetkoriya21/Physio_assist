import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Calendar } from "lucide-react";
import { PageHeader, Section } from "@/components/PageShell";

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

function AppointmentPage() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <PageHeader eyebrow="Booking" title="Book your appointment" subtitle="Tell us a little about yourself and we'll confirm your session within 24 hours." />

      <Section>
        <div className="mx-auto max-w-3xl rounded-3xl bg-card p-8 shadow-card sm:p-12">
          {submitted ? (
            <div className="text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-soft text-primary">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="mt-6 font-display text-2xl font-semibold">Request received</h2>
              <p className="mt-3 text-muted-foreground">Thank you. We'll be in touch shortly to confirm your appointment.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Phone" name="phone" type="tel" required />
              <div>
                <label className="text-sm font-medium text-foreground">Service</label>
                <select required className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Select a service</option>
                  {services.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <Field label="Preferred date" name="date" type="date" required />
              <Field label="Preferred time" name="time" type="time" required />
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-foreground">Message (optional)</label>
                <textarea rows={4} className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Briefly describe your symptoms or goals..." />
              </div>
              <button type="submit" className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]">
                <Calendar className="h-4 w-4" /> Submit booking request
              </button>
            </form>
          )}
        </div>
      </Section>
    </>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-foreground">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
