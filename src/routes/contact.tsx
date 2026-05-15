import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { PageHeader, Section } from "@/components/PageShell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — PhysioLife Clinic" },
      { name: "description", content: "Get in touch with PhysioLife Clinic. Phone, email, address and WhatsApp." },
      { property: "og:title", content: "Contact — PhysioLife Clinic" },
      { property: "og:description", content: "Reach out — we usually reply within a few hours." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHeader eyebrow="Contact" title="Let's get in touch" subtitle="Questions, bookings or just need advice? We usually reply within a few hours." />

      <Section>
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl bg-card p-8 shadow-card sm:p-10">
              {sent ? (
                <div className="text-center py-8">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-soft text-primary">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h2 className="mt-6 font-display text-2xl font-semibold">Message sent</h2>
                  <p className="mt-3 text-muted-foreground">Thank you — we'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="grid gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input label="Full name" name="name" required />
                    <Input label="Email" name="email" type="email" required />
                  </div>
                  <Input label="Subject" name="subject" required />
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <textarea rows={5} required className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <button type="submit" className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]">
                    Send message <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-2 space-y-4">
            <InfoCard Icon={MapPin} title="Visit us" lines={["PhysioLife Clinic", "Europe (city to update)"]} />
            <InfoCard Icon={Phone} title="Call us" lines={["+00 000 000 0000", "Mon–Fri · 9:00–19:00"]} />
            <InfoCard Icon={Mail} title="Email" lines={["info@physioclinic.com"]} />
            <a href="https://wa.me/000000000000" target="_blank" rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-[oklch(0.65_0.18_145)] p-5 text-white shadow-card transition-transform hover:scale-[1.02]">
              <MessageCircle className="h-6 w-6" />
              <div>
                <div className="font-display font-semibold">Chat on WhatsApp</div>
                <div className="text-xs opacity-90">Fastest way to reach us</div>
              </div>
            </a>
          </div>
        </div>

        {/* Map */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-secondary shadow-card">
          <div className="grid h-80 place-items-center bg-gradient-hero text-center">
            <div>
              <MapPin className="mx-auto h-10 w-10 text-primary" />
              <p className="mt-3 font-display text-lg font-semibold">Google Maps embed placeholder</p>
              <p className="mt-1 text-sm text-muted-foreground">Replace with your clinic's embed once the address is confirmed.</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function Input({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">{label}</label>
      <input id={name} name={name} type={type} required={required}
        className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
    </div>
  );
}

function InfoCard({ Icon, title, lines }: { Icon: any; title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-card">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="font-display font-semibold">{title}</div>
          {lines.map((l, i) => <div key={i} className="text-sm text-muted-foreground">{l}</div>)}
        </div>
      </div>
    </div>
  );
}
