import { createFileRoute } from "@tanstack/react-router";
import { Star, Quote } from "lucide-react";
import { PageHeader, Section } from "@/components/PageShell";
import { useStore } from "@/lib/store";
import { useEffect } from "react";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Patient Testimonials — PhysioLife Clinic" },
      { name: "description", content: "Read real patient reviews of physiotherapy care at PhysioLife Clinic." },
      { property: "og:title", content: "Patient Testimonials — PhysioLife Clinic" },
      { property: "og:description", content: "What our patients say about their recovery." },
    ],
    links: [{ rel: "canonical", href: "/testimonials" }],
  }),
  component: TestimonialsPage,
});

const staticReviews = [
  { name: "Anna M.", rating: 5, text: "After three sessions my back pain was gone. Truly life-changing care — I should have come years ago." },
  { name: "Lukas R.", rating: 5, text: "Professional, warm and incredibly knowledgeable. Explained everything clearly and gave me real tools." },
  { name: "Sofia D.", rating: 5, text: "Helped me recover from knee surgery much faster than expected. I'm back to hiking already." },
  { name: "Marco T.", rating: 5, text: "I'd tried physio elsewhere with mixed results. Here, I felt heard from the first minute. Highly recommended." },
  { name: "Elena K.", rating: 4, text: "Very calming clinic, modern equipment, and a treatment plan that actually worked for my chronic neck pain." },
  { name: "David W.", rating: 5, text: "The home-visit service was a lifesaver after my hip operation. Couldn't fault the care." },
  { name: "Julia P.", rating: 5, text: "Thoughtful, attentive, and genuinely invested in your recovery. The whole experience felt premium." },
  { name: "Tomás G.", rating: 5, text: "Returned to football after a stubborn hamstring injury. Structured, science-based, and effective." },
];

function TestimonialsPage() {
  const fetchReviews = useStore((s) => s.fetchReviews);
  const allReviews = useStore((s) => s.reviews);
  
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const approvedReviews = allReviews.filter((r) => r.status === "approved");

  // Combine real-time approved reviews with the static fallback reviews
  const displayReviews = [
    ...approvedReviews.map((r) => ({
      name: r.name,
      rating: r.rating,
      text: r.text,
      isRealTime: true,
    })),
    ...staticReviews,
  ];

  return (
    <>
      <PageHeader eyebrow="Testimonials" title="What our patients say" subtitle="Real stories from people who got their movement — and confidence — back." />

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayReviews.map((r, i) => (
            <div key={i} className="relative rounded-2xl bg-card p-7 shadow-card border border-border/50">
              <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/15" />
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`h-4 w-4 ${j < r.rating ? "fill-current" : "opacity-30"}`} />
                  ))}
                </div>
                {"isRealTime" in r && (
                  <span className="text-[10px] font-semibold text-primary bg-primary-soft px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Verified Patient
                  </span>
                )}
              </div>
              <p className="mt-4 text-foreground/90">"{r.text}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft font-display font-semibold text-primary">
                  {r.name.charAt(0)}
                </div>
                <div className="text-sm font-semibold text-foreground">{r.name}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

