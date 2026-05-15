import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartPulse, Bike, Stethoscope, Brain, Hand, Home, ArrowRight } from "lucide-react";
import { PageHeader, Section } from "@/components/PageShell";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — PhysioLife Clinic" },
      { name: "description", content: "Back & neck pain, sports injury, post-surgery rehab, neurological rehab, manual therapy and home visits." },
      { property: "og:title", content: "Services — PhysioLife Clinic" },
      { property: "og:description", content: "Specialised physiotherapy services tailored to your needs." },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const services = [
  { Icon: HeartPulse, title: "Back & Neck Pain", desc: "Targeted manual therapy and corrective exercise to relieve pain at the source — not just the symptom." },
  { Icon: Bike, title: "Sports Injury", desc: "Return-to-sport programs grounded in performance science. From acute injury to long-term resilience." },
  { Icon: Stethoscope, title: "Post-Surgery Rehab", desc: "Structured recovery for orthopedic and abdominal surgeries. Restore strength, mobility and confidence." },
  { Icon: Brain, title: "Neurological Rehab", desc: "Compassionate care for stroke, MS and Parkinson's. Functional improvement through specialised techniques." },
  { Icon: Hand, title: "Manual Therapy", desc: "Hands-on joint mobilisation and soft-tissue work to release tension and restore healthy movement patterns." },
  { Icon: Home, title: "Home Visits", desc: "Quality physiotherapy in the comfort of your home — ideal for limited mobility or post-operative recovery." },
];

function ServicesPage() {
  return (
    <>
      <PageHeader eyebrow="Services" title="Care for every kind of recovery" subtitle="Every treatment plan is custom-built around your body, your goals and the life you want to live." />

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ Icon, title, desc }) => (
            <article key={title} className="group flex flex-col rounded-2xl bg-card p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{desc}</p>
              <Link to="/appointment" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                Book this service <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
