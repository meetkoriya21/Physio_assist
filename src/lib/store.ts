// src/lib/store.ts
import { create } from "zustand";
import { supabase } from "./supabase";

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
  paymentId?: string;
  paymentStatus?: "paid" | "unpaid";
  amount?: number;
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

export type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  status: "pending" | "approved" | "rejected";
  tokenUsed: boolean;
  createdAt: string;
};

const BLOG_COLORS = [
  "from-primary/30 to-accent/40","from-accent/40 to-primary-soft",
  "from-primary-soft to-cream","from-cream to-accent/40",
  "from-accent/40 to-primary/30","from-primary/30 to-cream",
];

const SEED_BLOGS = [
  { title:"5 desk-job stretches to fix your posture", category:"Posture", date:"May 8, 2026", read_time:"4", excerpt:"Sitting all day quietly reshapes your spine. These five stretches take five minutes and reverse it.", status:"published", color:"from-primary/30 to-accent/40" },
  { title:"Why your knee pain isn't really your knee", category:"Pain", date:"April 22, 2026", read_time:"6", excerpt:"Most knee pain originates higher up the chain. Here's how we trace it — and treat it — at the source.", status:"published", color:"from-accent/40 to-primary-soft" },
  { title:"Returning to running after injury", category:"Sports", date:"April 3, 2026", read_time:"7", excerpt:"A safe four-week protocol to rebuild mileage without re-injury, used with our sports patients.", status:"published", color:"from-primary-soft to-cream" },
  { title:"Sleep posture and lower back pain", category:"Recovery", date:"March 18, 2026", read_time:"5", excerpt:"Small changes to how you sleep can make a big difference for chronic lower back discomfort.", status:"published", color:"from-cream to-accent/40" },
  { title:"Manual therapy: what to expect", category:"Treatment", date:"March 1, 2026", read_time:"4", excerpt:"A quick guide to your first hands-on session — and why it works so well for stiffness and tension.", status:"published", color:"from-accent/40 to-primary/30" },
  { title:"Building strength after 50", category:"Wellness", date:"February 14, 2026", read_time:"8", excerpt:"Resistance training is one of the most powerful tools for healthy ageing. Here's where to start.", status:"published", color:"from-primary/30 to-cream" },
];

type Store = {
  appointments: Appointment[];
  fetchAppointments: () => Promise<void>;
  addAppointment: (data: Omit<Appointment,"id"|"status"|"submittedAt">) => Promise<void>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  removeAppointment: (id: string) => Promise<void>;

  blogs: BlogPost[];
  fetchBlogs: () => Promise<void>;
  addBlog: (data: Omit<BlogPost,"id"|"color">) => Promise<void>;
  updateBlog: (id: string, data: Omit<BlogPost,"id"|"color">) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;

  reviews: Review[];
  fetchReviews: () => Promise<void>;
  updateReviewStatus: (id: string, status: "approved"|"rejected") => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
};

export const useStore = create<Store>((set, get) => ({

  appointments: [],
  fetchAppointments: async () => {
    const { data, error } = await supabase.from("appointments").select("*").order("submitted_at",{ascending:false});
    if (error) { console.error("fetchAppointments:",error.message); return; }
    set({ appointments:(data??[]).map((row:any)=>({
      id:row.id, name:row.name, email:row.email, phone:row.phone,
      service:row.service, date:row.date, time:row.time,
      message:row.message??"", status:row.status as AppointmentStatus,
      submittedAt:new Date(row.submitted_at).toLocaleString("en-GB",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),
      paymentId:row.payment_id??undefined, paymentStatus:row.payment_status??"unpaid", amount:row.amount??undefined,
    }))});
  },
  addAppointment: async (data) => {
    const { error } = await supabase.from("appointments").insert({
      name:data.name, email:data.email, phone:data.phone, service:data.service,
      date:data.date, time:data.time, message:data.message, status:"pending",
      payment_id:data.paymentId??null, payment_status:data.paymentStatus??"unpaid", amount:data.amount??null,
    });
    if (error) { console.error("addAppointment:",error.message); return; }
    await get().fetchAppointments();
  },
  updateAppointmentStatus: async (id, status) => {
    const { error } = await supabase.from("appointments").update({status}).eq("id",id);
    if (error) { console.error("updateAppointmentStatus:",error.message); return; }
    set(state=>({appointments:state.appointments.map(a=>a.id===id?{...a,status}:a)}));
  },
  removeAppointment: async (id) => {
    const { error } = await supabase.from("appointments").delete().eq("id",id);
    if (error) { console.error("removeAppointment:",error.message); return; }
    set(state=>({appointments:state.appointments.filter(a=>a.id!==id)}));
  },

  blogs: [],
  fetchBlogs: async () => {
    const { data, error } = await supabase.from("blogs").select("*").order("created_at",{ascending:false});
    if (error) { console.error("fetchBlogs:",error.message); return; }
    if ((data??[]).length===0) { await supabase.from("blogs").insert(SEED_BLOGS); await get().fetchBlogs(); return; }
    set({ blogs:(data??[]).map((row:any)=>({
      id:row.id, title:row.title, category:row.category, date:row.date,
      readTime:row.read_time, excerpt:row.excerpt,
      status:row.status as "published"|"draft", color:row.color??BLOG_COLORS[0],
    }))});
  },
  addBlog: async (data) => {
    const colorIndex=get().blogs.length%BLOG_COLORS.length;
    const { error } = await supabase.from("blogs").insert({title:data.title,category:data.category,date:data.date,read_time:data.readTime,excerpt:data.excerpt,status:data.status,color:BLOG_COLORS[colorIndex]});
    if (error) { console.error("addBlog:",error.message); return; }
    await get().fetchBlogs();
  },
  updateBlog: async (id, data) => {
    const { error } = await supabase.from("blogs").update({title:data.title,category:data.category,date:data.date,read_time:data.readTime,excerpt:data.excerpt,status:data.status}).eq("id",id);
    if (error) { console.error("updateBlog:",error.message); return; }
    await get().fetchBlogs();
  },
  deleteBlog: async (id) => {
    const { error } = await supabase.from("blogs").delete().eq("id",id);
    if (error) { console.error("deleteBlog:",error.message); return; }
    set(state=>({blogs:state.blogs.filter(b=>b.id!==id)}));
  },

  reviews: [],
  fetchReviews: async () => {
    // Only fetch reviews that have actual content (token used or submitted)
    const { data, error } = await supabase.from("reviews").select("*")
      .not("text","eq","")
      .order("created_at",{ascending:false});
    if (error) { console.error("fetchReviews:",error.message); return; }
    set({ reviews:(data??[]).map((row:any)=>({
      id:row.id, name:row.name, rating:row.rating,
      text:row.text, status:row.status,
      tokenUsed:row.token_used??false,
      createdAt:new Date(row.created_at).toLocaleString("en-GB",{day:"numeric",month:"short",year:"numeric"}),
    }))});
  },
  updateReviewStatus: async (id, status) => {
    const { error } = await supabase.from("reviews").update({status}).eq("id",id);
    if (error) { console.error("updateReviewStatus:",error.message); return; }
    set(state=>({reviews:state.reviews.map(r=>r.id===id?{...r,status}:r)}));
  },
  deleteReview: async (id) => {
    const { error } = await supabase.from("reviews").delete().eq("id",id);
    if (error) { console.error("deleteReview:",error.message); return; }
    set(state=>({reviews:state.reviews.filter(r=>r.id!==id)}));
  },
}));
