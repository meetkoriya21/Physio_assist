import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Calendar, Send } from "lucide-react";
import { PageHeader, Section } from "@/components/PageShell";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Health Tips & Blog — PhysioLife Clinic" },
      { name: "description", content: "Practical physiotherapy advice, injury prevention and recovery tips from a clinical expert." },
      { property: "og:title", content: "Health Tips — PhysioLife Clinic" },
      { property: "og:description", content: "Expert physiotherapy advice you can apply today." },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
});

const posts = [
  {
    title: "5 desk-job stretches to fix your posture",
    date: "May 8, 2026",
    readTime: "4 min read",
    tag: "Posture",
    excerpt: "Sitting all day quietly reshapes your spine. These five stretches take five minutes and reverse it.",
    color: "from-primary/30 to-accent/40",
  },
  {
    title: "Why your knee pain isn't really your knee",
    date: "April 22, 2026",
    readTime: "6 min read",
    tag: "Pain",
    excerpt: "Most knee pain originates higher up the chain. Here's how we trace it — and treat it — at the source.",
    color: "from-accent/40 to-primary-soft",
  },
  {
    title: "Returning to running after injury",
    date: "April 3, 2026",
    readTime: "7 min read",
    tag: "Sports",
    excerpt: "A safe four-week protocol to rebuild mileage without re-injury, used with our sports patients.",
    color: "from-primary-soft to-cream",
  },
  {
    title: "Sleep posture and lower back pain",
    date: "March 18, 2026",
    readTime: "5 min read",
    tag: "Recovery",
    excerpt: "Small changes to how you sleep can make a big difference for chronic lower back discomfort.",
    color: "from-cream to-accent/40",
  },
  {
    title: "Manual therapy: what to expect",
    date: "March 1, 2026",
    readTime: "4 min read",
    tag: "Treatment",
    excerpt: "A quick guide to your first hands-on session — and why it works so well for stiffness and tension.",
    color: "from-accent/40 to-primary/30",
  },
  {
    title: "Building strength after 50",
    date: "February 14, 2026",
    readTime: "8 min read",
    tag: "Wellness",
    excerpt: "Resistance training is one of the most powerful tools for healthy ageing. Here's where to start.",
    color: "from-primary/30 to-cream",
  },
];

function BlogPage() {
  const [email, setEmail] = useState("");
  const [nlStatus, setNlStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setNlStatus("loading");
    // Wire up to Mailchimp / ConvertKit / EmailJS here
    await new Promise((r) => setTimeout(r, 700));
    setNlStatus("success");
    setEmail("");
  };

  return (
    <>
      <PageHeader
        eyebrow="Health Tips"
        title="Move smarter, every day"
        subtitle="Evidence-based articles on recovery, prevention and the science of moving well."
      />

      <Section>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article
              key={p.title}
              className="group overflow-hidden rounded-2xl bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <div className={`relative h-44 bg-gradient-to-br ${p.color}`}>
                <span className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-0.5 text-xs font-semibold text-primary backdrop-blur-sm">
                  {p.tag}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {p.date}
                  </span>
                  <span>·</span>
                  <span>{p.readTime}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
                <button
                  onClick={() => alert(`Full article: "${p.title}" — coming soon! Subscribe to be notified.`)}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  Read more <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* NEWSLETTER */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:py-24">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Newsletter
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Get health tips in your inbox
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join 1,200+ readers. No spam — just one useful article every two weeks.
          </p>

          {nlStatus === "success" ? (
            <div className="mt-8 rounded-2xl bg-primary-soft px-6 py-4 text-primary">
              ✓ You're subscribed! Watch your inbox.
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 rounded-full border border-input bg-background px-5 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                disabled={nlStatus === "loading"}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-60"
              >
                {nlStatus === "loading" ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Subscribe
              </button>
            </form>
          )}

          {nlStatus === "error" && (
            <p className="mt-3 text-sm text-destructive">
              Something went wrong. Please try again.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
