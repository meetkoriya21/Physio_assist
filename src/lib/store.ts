// src/lib/store.ts
// ─────────────────────────────────────────────────────────────────────────────
// Shared state with localStorage persistence
// Data survives page refresh, tab close, and navigation between pages
// Install: bun add zustand
// ─────────────────────────────────────────────────────────────────────────────
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── Types ─────────────────────────────────────────────────────────────────────
export type AppointmentStatus = "pending" | "accepted" | "rejected";

export type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message: string;
  status: AppointmentStatus;
  submittedAt: string;
};

export type BlogPost = {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  status: "published" | "draft";
  color: string;
};

// ── Seed blogs (shown by default, admin can edit/delete) ──────────────────────
const SEED_BLOGS: BlogPost[] = [
  { id: "seed-1", title: "5 desk-job stretches to fix your posture", category: "Posture", date: "May 8, 2026", readTime: "4", excerpt: "Sitting all day quietly reshapes your spine. These five stretches take five minutes and reverse it.", status: "published", color: "from-primary/30 to-accent/40" },
  { id: "seed-2", title: "Why your knee pain isn't really your knee", category: "Pain", date: "April 22, 2026", readTime: "6", excerpt: "Most knee pain originates higher up the chain. Here's how we trace it — and treat it — at the source.", status: "published", color: "from-accent/40 to-primary-soft" },
  { id: "seed-3", title: "Returning to running after injury", category: "Sports", date: "April 3, 2026", readTime: "7", excerpt: "A safe four-week protocol to rebuild mileage without re-injury, used with our sports patients.", status: "published", color: "from-primary-soft to-cream" },
  { id: "seed-4", title: "Sleep posture and lower back pain", category: "Recovery", date: "March 18, 2026", readTime: "5", excerpt: "Small changes to how you sleep can make a big difference for chronic lower back discomfort.", status: "published", color: "from-cream to-accent/40" },
  { id: "seed-5", title: "Manual therapy: what to expect", category: "Treatment", date: "March 1, 2026", readTime: "4", excerpt: "A quick guide to your first hands-on session — and why it works so well for stiffness and tension.", status: "published", color: "from-accent/40 to-primary/30" },
  { id: "seed-6", title: "Building strength after 50", category: "Wellness", date: "February 14, 2026", readTime: "8", excerpt: "Resistance training is one of the most powerful tools for healthy ageing. Here's where to start.", status: "published", color: "from-primary/30 to-cream" },
];

const BLOG_COLORS = [
  "from-primary/30 to-accent/40",
  "from-accent/40 to-primary-soft",
  "from-primary-soft to-cream",
  "from-cream to-accent/40",
  "from-accent/40 to-primary/30",
  "from-primary/30 to-cream",
];

// ── Store with persist middleware ─────────────────────────────────────────────
type Store = {
  // Appointments
  appointments: Appointment[];
  addAppointment: (data: Omit<Appointment, "id" | "status" | "submittedAt">) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  removeAppointment: (id: string) => void;

  // Blogs
  blogs: BlogPost[];
  addBlog: (data: Omit<BlogPost, "id" | "color">) => void;
  updateBlog: (id: string, data: Omit<BlogPost, "id" | "color">) => void;
  deleteBlog: (id: string) => void;
};

export const useStore = create<Store>()(
  // ✅ persist saves everything to localStorage automatically
  persist(
    (set, get) => ({
      // ── Appointments ──────────────────────────────────────────────────────
      appointments: [],

      addAppointment: (data) =>
        set((state) => ({
          appointments: [
            {
              ...data,
              id: `appt-${Date.now()}`,
              status: "pending" as AppointmentStatus,
              submittedAt: new Date().toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
            ...state.appointments,
          ],
        })),

      updateAppointmentStatus: (id, status) =>
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, status } : a
          ),
        })),

      removeAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
        })),

      // ── Blogs ─────────────────────────────────────────────────────────────
      blogs: SEED_BLOGS,

      addBlog: (data) =>
        set((state) => ({
          blogs: [
            {
              ...data,
              id: `blog-${Date.now()}`,
              color: BLOG_COLORS[state.blogs.length % BLOG_COLORS.length],
            },
            ...state.blogs,
          ],
        })),

      updateBlog: (id, data) =>
        set((state) => ({
          blogs: state.blogs.map((b) =>
            b.id === id ? { ...b, ...data } : b
          ),
        })),

      deleteBlog: (id) =>
        set((state) => ({
          blogs: state.blogs.filter((b) => b.id !== id),
        })),
    }),
    {
      name: "physiolife-store", // localStorage key
      // Only persist what matters — skip derived/computed values
      partialize: (state) => ({
        appointments: state.appointments,
        blogs: state.blogs,
      }),
    }
  )
);