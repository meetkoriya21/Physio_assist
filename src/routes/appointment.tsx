import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Calendar, Clock, Phone, ArrowLeft, CreditCard, Lock } from "lucide-react";
import { PageHeader, Section } from "@/components/PageShell";
import { useStore } from "@/lib/store";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export const Route = createFileRoute("/appointment")({
  head: () => ({
    meta: [
      { title: "Book an Appointment — PhysioLife Clinic" },
      { name: "description", content: "Book your physiotherapy session online." },
    ],
    links: [{ rel: "canonical", href: "/appointment" }],
  }),
  component: AppointmentPage,
});

// ── Stripe setup ──────────────────────────────────────────────────────────────
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const SERVICES = [
  "Back & Neck Pain", "Sports Injury", "Post-Surgery Rehab",
  "Neurological Rehab", "Manual Therapy", "Home Visit",
];

const ALL_SLOTS = [
  "09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00","17:00","18:00",
];

const schema = z.object({
  name:    z.string().min(2, "Please enter your full name"),
  email:   z.string().email("Please enter a valid email"),
  phone:   z.string().min(7, "Please enter a valid phone number"),
  service: z.string().min(1, "Please select a service"),
  date:    z.string().min(1, "Please select a date"),
  time:    z.string().min(1, "Please select a time"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

// ── Card Element styles ───────────────────────────────────────────────────────
const cardStyle = {
  style: {
    base: {
      fontSize: "14px",
      color: "#111827",
      fontFamily: "'Segoe UI', sans-serif",
      "::placeholder": { color: "#9CA3AF" },
    },
    invalid: { color: "#EF4444" },
  },
};

// ── Payment Form ──────────────────────────────────────────────────────────────
function PaymentForm({
  formData,
  onSuccess,
  onBack,
}: {
  formData: FormData;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const stripe   = useStripe();
  const elements = useElements();
  const addAppointment = useStore((s) => s.addAppointment);

  const [paying,  setPaying]  = useState(false);
  const [error,   setError]   = useState("");

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setError("");
    setPaying(true);

    try {
      // 1. Create payment intent on server
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:    formData.name,
          email:   formData.email,
          service: formData.service,
          date:    formData.date,
          time:    formData.time,
        }),
      });

      const { clientSecret, error: serverError } = await res.json();
      if (serverError) throw new Error(serverError);

      // 2. Confirm card payment
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name:  formData.name,
              email: formData.email,
            },
          },
        }
      );

      if (stripeError) throw new Error(stripeError.message);

      if (paymentIntent?.status === "succeeded") {
        // 3. Save appointment to Supabase with payment info
        await addAppointment({
          name:    formData.name,
          email:   formData.email,
          phone:   formData.phone,
          service: formData.service,
          date:    formData.date,
          time:    formData.time,
          message: formData.message ?? "",
          paymentId:     paymentIntent.id,
          paymentStatus: "paid",
          amount:        75,
        });

        // 4. Send confirmation email
        fetch("/api/book-appointment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }).catch(() => {});

        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again.");
      setPaying(false);
    }
  };

  const fieldBox: React.CSSProperties = {
    border: "1.5px solid #E5E7EB",
    borderRadius: 10,
    padding: "12px 14px",
    background: "#fff",
    marginTop: 6,
  };

  return (
    <div>
      {/* Order summary */}
      <div className="rounded-2xl bg-primary-soft p-5 mb-6">
        <h3 className="font-semibold text-primary mb-3">Booking Summary</h3>
        <div className="space-y-1.5 text-sm text-foreground">
          <div className="flex justify-between"><span className="text-muted-foreground">Patient</span><span className="font-medium">{formData.name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="font-medium">{formData.service}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{formData.date}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium">{formData.time}</span></div>
          <div className="mt-3 pt-3 border-t border-primary/20 flex justify-between text-base font-bold text-primary">
            <span>Total</span><span>€75.00</span>
          </div>
        </div>
      </div>

      {/* Card details */}
      <div className="space-y-4 mb-6">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" /> Payment Details
        </h3>

        {error && (
          <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
        )}

        <div>
          <label className="text-sm font-medium text-foreground">Card number</label>
          <div style={fieldBox}><CardNumberElement options={cardStyle} /></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">Expiry date</label>
            <div style={fieldBox}><CardExpiryElement options={cardStyle} /></div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">CVC</label>
            <div style={fieldBox}><CardCvcElement options={cardStyle} /></div>
          </div>
        </div>
      </div>

      {/* Test card hint */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-700 mb-6">
        🧪 <strong>Test mode:</strong> Use card <strong>4242 4242 4242 4242</strong>, any future date, any CVC.
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={paying}
          className="flex-1 rounded-full border border-border bg-background px-6 py-3.5 text-sm font-medium text-foreground hover:border-primary hover:text-primary disabled:opacity-50"
        >
          <ArrowLeft className="inline h-4 w-4 mr-1" /> Back
        </button>
        <button
          onClick={handlePay}
          disabled={paying || !stripe}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {paying ? (
            <><span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> Processing…</>
          ) : (
            <><Lock className="h-4 w-4" /> Pay €75 & Confirm</>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
        <Lock className="h-3 w-3" /> Secured by Stripe. Your card details are never stored.
      </p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function AppointmentPage() {
  const [step, setStep]           = useState<"form" | "payment" | "success">("form");
  const [formData, setFormData]   = useState<FormData | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const today       = new Date().toISOString().split("T")[0];
  const watchedDate = watch("date");

  // ✅ Fetch booked slots when date changes
  useEffect(() => {
    if (!watchedDate) return;
    setLoadingSlots(true);
    fetch(`/api/booked-slots?date=${watchedDate}`)
      .then(r => r.json())
      .then(data => { setBookedSlots(data.bookedSlots || []); setLoadingSlots(false); })
      .catch(() => setLoadingSlots(false));
  }, [watchedDate]);

  const onSubmit = (data: FormData) => {
    setFormData(data);
    setStep("payment");
  };

  const handleSuccess = () => {
    setStep("success");
    reset();
  };

  return (
    <>
      <PageHeader
        eyebrow="Booking"
        title="Book your appointment"
        subtitle="Secure your session with online payment — €75 per session."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-card p-8 shadow-card sm:p-10">

              {/* ── Step indicator ── */}
              {step !== "success" && (
                <div className="flex items-center gap-3 mb-8">
                  {[{n:1,label:"Your details"},{n:2,label:"Payment"}].map((s,i)=>(
                    <div key={s.n} className="flex items-center gap-3">
                      <div className={`flex items-center gap-2`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step==="form"&&s.n===1||step==="payment"&&s.n===2?"bg-primary text-primary-foreground":step==="payment"&&s.n===1?"bg-primary/20 text-primary":"bg-muted text-muted-foreground"}`}>
                          {step==="payment"&&s.n===1?"✓":s.n}
                        </div>
                        <span className={`text-sm font-medium ${step==="form"&&s.n===1||step==="payment"&&s.n===2?"text-primary":"text-muted-foreground"}`}>{s.label}</span>
                      </div>
                      {i===0&&<div className="flex-1 h-px bg-border w-8"/>}
                    </div>
                  ))}
                </div>
              )}

              {/* ── Success ── */}
              {step === "success" && (
                <div className="py-8 text-center">
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary-soft text-primary">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h2 className="mt-6 font-display text-2xl font-semibold">Booking confirmed!</h2>
                  <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
                    Payment of <strong>€75</strong> received. We'll send a confirmation email shortly.
                  </p>
                  <button
                    onClick={() => setStep("form")}
                    className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
                  >
                    <ArrowLeft className="h-4 w-4" /> Book another session
                  </button>
                </div>
              )}

              {/* ── Step 1: Form ── */}
              {step === "form" && (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full name *" error={errors.name?.message}>
                      <input {...register("name")} placeholder="Jane Smith" className={inputCls(!!errors.name)} />
                    </Field>
                    <Field label="Email *" error={errors.email?.message}>
                      <input {...register("email")} type="email" placeholder="jane@example.com" className={inputCls(!!errors.email)} />
                    </Field>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Phone *" error={errors.phone?.message}>
                      <input {...register("phone")} type="tel" placeholder="+00 000 000 0000" className={inputCls(!!errors.phone)} />
                    </Field>
                    <Field label="Service *" error={errors.service?.message}>
                      <select {...register("service")} defaultValue="" className={inputCls(!!errors.service)}>
                        <option value="" disabled>Select a service</option>
                        {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Preferred date *" error={errors.date?.message}>
                      <input {...register("date")} type="date" min={today} className={inputCls(!!errors.date)} />
                    </Field>
                    <Field label="Preferred time *" error={errors.time?.message}>
                      <div className="mt-2 grid grid-cols-5 gap-2">
                        {loadingSlots ? (
                          <div className="col-span-5 text-sm text-muted-foreground py-2">Loading available slots…</div>
                        ) : (
                          ALL_SLOTS.map(slot => {
                            const isBooked = bookedSlots.includes(slot);
                            return (
                              <label key={slot} className={`relative flex items-center justify-center rounded-lg border text-xs font-medium py-2 cursor-pointer transition-all
                                ${isBooked
                                  ? "border-muted bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                                  : "border-input hover:border-primary hover:bg-primary-soft"
                                }`}>
                                <input
                                  type="radio"
                                  value={slot}
                                  disabled={isBooked}
                                  {...register("time")}
                                  className="sr-only peer"
                                />
                                <span className="peer-checked:text-primary peer-checked:font-bold">{slot}</span>
                                {isBooked && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] rounded-full px-1">Full</span>}
                              </label>
                            );
                          })
                        )}
                      </div>
                      {errors.time && <p className="mt-1 text-xs text-destructive">{errors.time.message}</p>}
                    </Field>
                  </div>
                  <Field label="Message (optional)">
                    <textarea {...register("message")} rows={3} placeholder="Describe your symptoms…" className={inputCls(false)} />
                  </Field>

                  {/* Price badge */}
                  <div className="rounded-2xl bg-primary-soft p-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-primary">Session fee</div>
                      <div className="text-xs text-muted-foreground">Initial assessment · 60 min</div>
                    </div>
                    <div className="text-2xl font-bold text-primary">€75</div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
                  >
                    <CreditCard className="h-4 w-4" /> Continue to Payment
                  </button>
                  <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Lock className="h-3 w-3" /> You'll complete payment on the next step
                  </p>
                </form>
              )}

              {/* ── Step 2: Payment ── */}
              {step === "payment" && formData && (
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    formData={formData}
                    onSuccess={handleSuccess}
                    onBack={() => setStep("form")}
                  />
                </Elements>
              )}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">
            <div className="rounded-2xl bg-primary-soft p-6">
              <h3 className="font-display text-lg font-semibold text-primary">How it works</h3>
              <ol className="mt-4 space-y-3">
                {["Fill in your details","Proceed to secure payment","Pay €75 online","Booking confirmed instantly!"].map((step,i)=>(
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i+1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl bg-card p-6 shadow-card">
              <h3 className="font-display text-base font-semibold">Clinic hours</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {[["Mon – Fri","09:00 – 19:00"],["Saturday","09:00 – 14:00"],["Sunday","Closed"]].map(([day,hrs])=>(
                  <li key={day} className="flex justify-between"><span>{day}</span><span className="font-medium text-foreground">{hrs}</span></li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-card p-6 shadow-card">
              <h3 className="font-display text-base font-semibold">Prefer to call?</h3>
              <a href="tel:+00000000000" className="mt-3 flex items-center gap-3 text-primary hover:underline">
                <Phone className="h-5 w-5" />
                <span className="text-sm font-medium">+00 000 000 0000</span>
              </a>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display text-base font-semibold">Session types</h3>
              <ul className="mt-3 space-y-2">
                {[{label:"Initial assessment",duration:"60 min"},{label:"Follow-up session",duration:"45 min"},{label:"Home visit",duration:"60 min"}].map(({label,duration})=>(
                  <li key={label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground"><Clock className="h-3.5 w-3.5" />{label}</span>
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

function inputCls(hasError: boolean) {
  return `mt-2 w-full rounded-xl border ${hasError?"border-destructive focus:ring-destructive/20":"border-input focus:border-primary focus:ring-primary/20"} bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-colors`;
}

function Field({ label, error, children }: { label:string; error?:string; children:React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
