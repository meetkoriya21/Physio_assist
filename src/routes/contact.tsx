import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, Clock, Instagram, Facebook, Linkedin,
} from "lucide-react";
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

// ─── EmailJS config ───────────────────────────────────────────────────────────
// Follow same steps as in appointment.tsx to enable real email delivery.
const EMAILJS_SERVICE_ID = "";
const EMAILJS_TEMPLATE_ID_CONTACT = "YOUR_CONTACT_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

// ─── REPLACE with your real clinic info ──────────────────────────────────────
const CLINIC_PHONE = "+91 9173621405";
const CLINIC_PHONE_HREF = "tel:+00000000000";
const CLINIC_EMAIL = "info@physioclinic.com";
const CLINIC_EMAIL_HREF = "mailto:info@physioclinic.com";
const CLINIC_WHATSAPP = "https://wa.me/91 917621405"; // replace 00000000000 with full number incl. country code
const CLINIC_ADDRESS_LINE1 = "PhysioLife Clinic";
const CLINIC_ADDRESS_LINE2 = "123 Wellness Street, City";
// Google Maps embed URL — replace src value after setting your address in Google Maps → Share → Embed a map
const MAPS_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.4062789!2d-0.1276!3d51.5074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDMwJzI2LjYiTiAwwrAwNyc0MC4wIlc!5e0!3m2!1sen!2suk!4v1234567890";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(2, "Please enter a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

async function sendContactEmail(data: FormData): Promise<void> {
  // Uncomment once you add your real EmailJS keys:
  /*
  const payload = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID_CONTACT,
    user_id: EMAILJS_PUBLIC_KEY,
    template_params: {
      from_name: data.name,
      from_email: data.email,
      subject: data.subject,
      message: data.message,
    },
  };
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("EmailJS error");
  */
  await new Promise((r) => setTimeout(r, 800));
}

function ContactPage() {
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
      await sendContactEmail(data);
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's get in touch"
        subtitle="Questions, bookings or just need advice? We usually reply within a few hours."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-5">
          {/* ── CONTACT FORM ── */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl bg-card p-8 shadow-card sm:p-10">
              <h2 className="font-display text-xl font-semibold">Send us a message</h2>

              {status === "success" ? (
                <div className="py-10 text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-soft text-primary">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold">Message sent!</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Thank you — we'll get back to you within a few hours.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-sm font-medium text-primary hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 grid gap-5">
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

                  <Field label="Subject *" error={errors.subject?.message}>
                    <input
                      {...register("subject")}
                      placeholder="How can we help?"
                      className={inputCls(!!errors.subject)}
                    />
                  </Field>

                  <Field label="Message *" error={errors.message?.message}>
                    <textarea
                      {...register("message")}
                      rows={5}
                      placeholder="Write your message here…"
                      className={inputCls(!!errors.message)}
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
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send message <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── CONTACT INFO ── */}
          <div className="lg:col-span-2 space-y-4">
            <InfoCard
              Icon={MapPin}
              title="Visit us"
              lines={[CLINIC_ADDRESS_LINE1, CLINIC_ADDRESS_LINE2]}
            />
            <InfoCard
              Icon={Phone}
              title="Call us"
              href={CLINIC_PHONE_HREF}
              lines={[CLINIC_PHONE, "Mon–Fri · 09:00–19:00", "Sat · 09:00–14:00"]}
            />
            <InfoCard
              Icon={Clock}
              title="Opening hours"
              lines={["Mon – Fri: 09:00 – 19:00", "Saturday: 09:00 – 14:00", "Sunday: Closed"]}
            />
            <InfoCard
              Icon={Mail}
              title="Email"
              href={CLINIC_EMAIL_HREF}
              lines={[CLINIC_EMAIL]}
            />

            <a
              href={CLINIC_WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-[oklch(0.65_0.18_145)] p-5 text-white shadow-card transition-transform hover:scale-[1.02]"
            >
              <MessageCircle className="h-6 w-6 flex-shrink-0" />
              <div>
                <div className="font-display font-semibold">Chat on WhatsApp</div>
                <div className="text-xs opacity-90">Fastest way to reach us</div>
              </div>
            </a>

            {/* Social links */}
            <div className="rounded-2xl bg-card p-5 shadow-card">
              <h4 className="font-display text-sm font-semibold">Follow us</h4>
              <div className="mt-3 flex gap-3">
                {[
                  { Icon: Instagram, href: "#", label: "Instagram" },
                  { Icon: Facebook, href: "#", label: "Facebook" },
                  { Icon: Linkedin, href: "#", label: "LinkedIn" },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary shadow-card transition-transform hover:scale-110"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── GOOGLE MAP ── */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-border shadow-card">
          {/* Replace the src below with your real Google Maps embed URL */}
          {/* How: Google Maps → search your address → Share → Embed a map → copy src */}
          <iframe
            title="PhysioLife Clinic location"
            src={MAPS_EMBED_URL}
            width="100%"
            height="380"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Section>
    </>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function inputCls(hasError: boolean) {
  return `mt-2 w-full rounded-xl border ${
    hasError
      ? "border-destructive focus:ring-destructive/20"
      : "border-input focus:border-primary focus:ring-primary/20"
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
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function InfoCard({
  Icon,
  title,
  lines,
  href,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  lines: string[];
  href?: string;
}) {
  const content = (
    <div className="rounded-2xl bg-card p-5 shadow-card">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="font-display font-semibold">{title}</div>
          {lines.map((l, i) => (
            <div key={i} className="text-sm text-muted-foreground">{l}</div>
          ))}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block transition-opacity hover:opacity-90">
        {content}
      </a>
    );
  }
  return content;
}
