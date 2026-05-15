import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Calendar } from "lucide-react";
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
  { title: "5 desk-job stretches to fix your posture", date: "May 8, 2026", excerpt: "Sitting all day quietly reshapes your spine. These five stretches take five minutes and reverse it.", color: "from-primary/30 to-accent/40" },
  { title: "Why your knee pain isn't really your knee", date: "April 22, 2026", excerpt: "Most knee pain originates higher up the chain. Here's how we trace it — and treat it — at the source.", color: "from-accent/40 to-primary-soft" },
  { title: "Returning to running after injury", date: "April 3, 2026", excerpt: "A safe four-week protocol to rebuild mileage without re-injury, used with our sports patients.", color: "from-primary-soft to-cream" },
  { title: "Sleep posture and lower back pain", date: "March 18, 2026", excerpt: "Small changes to how you sleep can make a big difference for chronic lower back discomfort.", color: "from-cream to-accent/40" },
  { title: "Manual therapy: what to expect", date: "March 1, 2026", excerpt: "A quick guide to your first hands-on session — and why it works so well for stiffness and tension.", color: "from-accent/40 to-primary/30" },
  { title: "Building strength after 50", date: "February 14, 2026", excerpt: "Resistance training is one of the most powerful tools for healthy ageing. Here's where to start.", color: "from-primary/30 to-cream" },
];

function BlogPage() {
  return (
    <>
      <PageHeader eyebrow="Health Tips" title="Move smarter, every day" subtitle="Evidence-based articles on recovery, prevention and the science of moving well." />

      <Section>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article key={p.title} className="group overflow-hidden rounded-2xl bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-soft">
              <div className={`h-44 bg-gradient-to-br ${p.color}`} />
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> {p.date}
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold leading-snug">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
                <button className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                  Read more <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
