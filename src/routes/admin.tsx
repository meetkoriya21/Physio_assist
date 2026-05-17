import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, type Appointment, type AppointmentStatus, type BlogPost } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  component: AdminPanel,
});

// ── Credentials (change these) ────────────────────────────────────────────────
const ADMIN_EMAIL = "admin@physioclinic.com";
const ADMIN_PASSWORD = "physio@2026";

const CATEGORIES = ["Posture", "Pain", "Sports", "Recovery", "Treatment", "Wellness", "Nutrition", "Exercise"];

// ── Shared ────────────────────────────────────────────────────────────────────
const inp: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #D1FAE5", fontSize: 14, outline: "none", boxSizing: "border-box", color: "#111827", background: "#F9FEFB", fontFamily: "inherit" };
const lbl: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 };

function Toast({ msg }: { msg: string }) {
  if (!msg) return null;
  return <div style={{ position: "fixed", top: 24, right: 24, background: "#0F6E56", color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, zIndex: 300, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>{msg}</div>;
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const map = { pending: { bg: "#FEF9C3", text: "#854D0E" }, accepted: { bg: "#D1FAE5", text: "#065F46" }, rejected: { bg: "#FEE2E2", text: "#B91C1C" } };
  const c = map[status];
  return <span style={{ background: c.bg, color: c.text, fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 6, textTransform: "capitalize" }}>{status}</span>;
}

function ConfirmModal({ title, body, onConfirm, onCancel }: { title: string; body: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 250 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 380, textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>{title}</h3>
        <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>{body}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={onCancel} style={{ padding: "10px 24px", borderRadius: 10, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: "10px 24px", borderRadius: 10, background: "#DC2626", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

// ── Login ─────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError("");
    if (!email || !password) { setError("Please enter both email and password."); return; }
    setLoading(true);
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) { onLogin(); }
      else { setError("Invalid email or password."); setLoading(false); }
    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0faf5 0%, #e6f4ed 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 8px 40px rgba(15,110,86,0.12)", padding: "48px 40px", width: 420, maxWidth: "90vw" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#1D9E75", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 12h3l3-9 4 18 3-9h5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#0F4A3A" }}>PhysioLife Clinic</div>
            <div style={{ fontSize: 12, color: "#6B9E8A" }}>Admin Portal</div>
          </div>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0F2E24", marginBottom: 6 }}>Welcome back</h2>
        <p style={{ fontSize: 14, color: "#6B9E8A", marginBottom: 28 }}>Sign in to manage appointments and blog posts.</p>
        {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#B91C1C", marginBottom: 18 }}>{error}</div>}
        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Email address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="admin@physioclinic.com" style={inp} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={lbl}>Password</label>
          <div style={{ position: "relative" }}>
            <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="••••••••••" style={{ ...inp, paddingRight: 56 }} />
            <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6B9E8A", fontSize: 13, fontWeight: 600 }}>{showPass ? "Hide" : "Show"}</button>
          </div>
        </div>
        <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: 13, borderRadius: 12, background: loading ? "#6EC4A7" : "#1D9E75", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Signing in…" : "Sign in to Admin"}
        </button>
        <p style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", marginTop: 20 }}>Not linked on the website. Access via <strong>/admin</strong></p>
      </div>
    </div>
  );
}

// ── Blog Form ─────────────────────────────────────────────────────────────────
function BlogForm({ blog, onSave, onCancel }: { blog?: BlogPost; onSave: (b: Omit<BlogPost, "id" | "color">) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(blog?.title || "");
  const [category, setCategory] = useState(blog?.category || "Posture");
  const [date, setDate] = useState(blog?.date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
  const [readTime, setReadTime] = useState(blog?.readTime || "5");
  const [excerpt, setExcerpt] = useState(blog?.excerpt || "");
  const [status, setStatus] = useState<"published" | "draft">(blog?.status || "draft");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!title.trim() || !excerpt.trim()) { setError("Title and excerpt are required."); return; }
    onSave({ title, category, date, readTime, excerpt, status });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "36px 32px", width: 560, maxWidth: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0F2E24", marginBottom: 24 }}>{blog ? "Edit Blog Post" : "New Blog Post"}</h3>
        {error && <div style={{ background: "#FEF2F2", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#B91C1C", marginBottom: 16 }}>{error}</div>}
        <div style={{ marginBottom: 16 }}><label style={lbl}>Title *</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Blog post title…" style={inp} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div><label style={lbl}>Category</label><select value={category} onChange={e => setCategory(e.target.value)} style={inp}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label style={lbl}>Read time (mins)</label><input type="number" value={readTime} onChange={e => setReadTime(e.target.value)} min={1} max={60} style={inp} /></div>
        </div>
        <div style={{ marginBottom: 16 }}><label style={lbl}>Publish date</label><input value={date} onChange={e => setDate(e.target.value)} placeholder="May 16, 2026" style={inp} /></div>
        <div style={{ marginBottom: 16 }}><label style={lbl}>Excerpt *</label><textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3} placeholder="Short description shown on blog listing page…" style={{ ...inp, resize: "vertical" }} /></div>
        <div style={{ marginBottom: 24 }}>
          <label style={lbl}>Status</label>
          <div style={{ display: "flex", gap: 12 }}>
            {(["published", "draft"] as const).map(s => (
              <button key={s} onClick={() => setStatus(s)} style={{ padding: "8px 20px", borderRadius: 8, border: `2px solid ${status === s ? "#1D9E75" : "#E5E7EB"}`, background: status === s ? "#E6F4ED" : "#fff", color: status === s ? "#0F6E56" : "#6B7280", fontWeight: 600, fontSize: 13, cursor: "pointer", textTransform: "capitalize" }}>{s}</button>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 12, color: "#6B9E8A", marginBottom: 20 }}>
          💡 Set status to <strong>Published</strong> to make it visible on the blog page immediately.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ padding: "11px 24px", borderRadius: 10, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: "11px 24px", borderRadius: 10, background: "#1D9E75", color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>{blog ? "Save Changes" : "Create Post"}</button>
        </div>
      </div>
    </div>
  );
}

// ── Appointment Detail Modal ──────────────────────────────────────────────────
function ApptModal({ appt, onAccept, onReject, onClose }: { appt: Appointment; onAccept: () => void; onReject: () => void; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "36px 32px", width: 520, maxWidth: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div><h3 style={{ fontSize: 20, fontWeight: 700, color: "#0F2E24", marginBottom: 6 }}>Appointment Details</h3><StatusBadge status={appt.status} /></div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9CA3AF" }}>✕</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 20 }}>
          {[["Patient name", appt.name], ["Email", appt.email], ["Phone", appt.phone], ["Service", appt.service], ["Preferred date", appt.date], ["Preferred time", appt.time]].map(([label, value]) => (
            <div key={label}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{value}</div>
            </div>
          ))}
        </div>
        {appt.message && (
          <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Patient message</div>
            <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{appt.message}</div>
          </div>
        )}
        <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 24 }}>Submitted: {appt.submittedAt}</div>
        <div style={{ display: "flex", gap: 12 }}>
          {appt.status !== "accepted" && <button onClick={onAccept} style={{ flex: 1, padding: 12, borderRadius: 10, background: "#1D9E75", color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>✓ Accept</button>}
          {appt.status !== "rejected" && <button onClick={onReject} style={{ flex: 1, padding: 12, borderRadius: 10, background: "#fff", color: "#B91C1C", fontWeight: 700, fontSize: 14, border: "2px solid #FEE2E2", cursor: "pointer" }}>✕ Reject</button>}
          <button onClick={onClose} style={{ flex: 1, padding: 12, borderRadius: 10, background: "#F3F4F6", color: "#374151", fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Appointments Tab ──────────────────────────────────────────────────────────
function AppointmentsTab({ showToast }: { showToast: (m: string) => void }) {
  // ✅ Read directly from store — live updates when patients submit
  const appointments = useStore((s) => s.appointments);
  const updateAppointmentStatus = useStore((s) => s.updateAppointmentStatus);
  const removeAppointment = useStore((s) => s.removeAppointment);

  const [selected, setSelected] = useState<Appointment | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | AppointmentStatus>("all");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const updateStatus = (id: string, status: AppointmentStatus) => {
    updateAppointmentStatus(id, status);
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
    showToast(status === "accepted" ? "✓ Appointment accepted!" : "Appointment rejected.");
  };

  const removeAppt = (id: string) => {
    removeAppointment(id);
    setSelected(null);
    setDeleteId(null);
    showToast("Appointment removed.");
  };

  const filtered = appointments.filter(a => {
    const m = a.name.toLowerCase().includes(search.toLowerCase()) || a.service.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
    return m && (filterStatus === "all" || a.status === filterStatus);
  });

  const counts = {
    pending: appointments.filter(a => a.status === "pending").length,
    accepted: appointments.filter(a => a.status === "accepted").length,
    rejected: appointments.filter(a => a.status === "rejected").length,
  };

  return (
    <div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {[{ label: "Pending", value: counts.pending, icon: "🕐", bg: "#FEF9C3", text: "#854D0E" }, { label: "Accepted", value: counts.accepted, icon: "✅", bg: "#D1FAE5", text: "#065F46" }, { label: "Rejected", value: counts.rejected, icon: "❌", bg: "#FEE2E2", text: "#B91C1C" }].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 12px rgba(15,110,86,0.06)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
            <div><div style={{ fontSize: 26, fontWeight: 800, color: s.text }}>{s.value}</div><div style={{ fontSize: 13, color: "#6B9E8A", fontWeight: 500 }}>{s.label}</div></div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, service, email…" style={{ flex: 1, minWidth: 200, padding: "10px 16px", borderRadius: 10, border: "1.5px solid #D1FAE5", fontSize: 14, outline: "none", background: "#fff", color: "#111827" }} />
        <div style={{ display: "flex", gap: 8 }}>
          {(["all", "pending", "accepted", "rejected"] as const).map(f => (
            <button key={f} onClick={() => setFilterStatus(f)} style={{ padding: "9px 14px", borderRadius: 8, border: `1.5px solid ${filterStatus === f ? "#1D9E75" : "#E5E7EB"}`, background: filterStatus === f ? "#1D9E75" : "#fff", color: filterStatus === f ? "#fff" : "#6B7280", fontWeight: 600, fontSize: 13, cursor: "pointer", textTransform: "capitalize" }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(15,110,86,0.06)", overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center", color: "#9CA3AF", fontSize: 15 }}>
            {appointments.length === 0 ? "No appointment requests yet. They'll appear here when patients book." : "No appointments match your filter."}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F0FAF5", borderBottom: "1px solid #E6F4ED" }}>
                {["Patient", "Service", "Date & Time", "Submitted", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "14px 18px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#0F6E56", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F0FAF5" : "none" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F9FEFB")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
                >
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>{a.email}</div>
                  </td>
                  <td style={{ padding: "14px 18px" }}><span style={{ background: "#E6F4ED", color: "#0F6E56", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 6 }}>{a.service}</span></td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{a.date}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>{a.time}</div>
                  </td>
                  <td style={{ padding: "14px 18px", fontSize: 12, color: "#9CA3AF", whiteSpace: "nowrap" }}>{a.submittedAt}</td>
                  <td style={{ padding: "14px 18px" }}><StatusBadge status={a.status} /></td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <button onClick={() => setSelected(a)} style={{ padding: "6px 12px", borderRadius: 7, border: "1.5px solid #D1FAE5", background: "#fff", color: "#0F6E56", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>View</button>
                      {a.status === "pending" && <>
                        <button onClick={() => updateStatus(a.id, "accepted")} style={{ padding: "6px 12px", borderRadius: 7, border: "none", background: "#1D9E75", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>✓</button>
                        <button onClick={() => updateStatus(a.id, "rejected")} style={{ padding: "6px 12px", borderRadius: 7, border: "none", background: "#FEE2E2", color: "#B91C1C", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>✕</button>
                      </>}
                      <button onClick={() => setDeleteId(a.id)} style={{ padding: "6px 12px", borderRadius: 7, border: "1.5px solid #E5E7EB", background: "#fff", color: "#6B7280", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && <ApptModal appt={selected} onAccept={() => updateStatus(selected.id, "accepted")} onReject={() => updateStatus(selected.id, "rejected")} onClose={() => setSelected(null)} />}
      {deleteId !== null && <ConfirmModal title="Remove this appointment?" body="This will permanently delete the appointment record." onConfirm={() => removeAppt(deleteId)} onCancel={() => setDeleteId(null)} />}
    </div>
  );
}

// ── Blog Tab ──────────────────────────────────────────────────────────────────
function BlogTab({ showToast }: { showToast: (m: string) => void }) {
  // ✅ Read/write directly from store — changes appear on /blog instantly
  const blogs = useStore((s) => s.blogs);
  const addBlog = useStore((s) => s.addBlog);
  const updateBlog = useStore((s) => s.updateBlog);
  const deleteBlog = useStore((s) => s.deleteBlog);

  const [showForm, setShowForm] = useState(false);
  const [editBlog, setEditBlog] = useState<BlogPost | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");

  const filtered = blogs.filter(b => {
    const m = b.title.toLowerCase().includes(search.toLowerCase()) || b.category.toLowerCase().includes(search.toLowerCase());
    return m && (filterStatus === "all" || b.status === filterStatus);
  });

  const handleAdd = (data: Omit<BlogPost, "id" | "color">) => { addBlog(data); setShowForm(false); showToast(data.status === "published" ? "✓ Blog published! Now live on /blog" : "✓ Draft saved."); };
  const handleEdit = (data: Omit<BlogPost, "id" | "color">) => { updateBlog(editBlog!.id, data); setEditBlog(undefined); showToast(data.status === "published" ? "✓ Post updated and live on /blog!" : "✓ Draft updated."); };
  const handleDelete = (id: string) => { deleteBlog(id); setDeleteId(null); showToast("Blog post deleted."); };

  return (
    <div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {[{ label: "Total Posts", value: blogs.length, icon: "📄", bg: "#E6F4ED", text: "#0F6E56" }, { label: "Published", value: blogs.filter(b => b.status === "published").length, icon: "✅", bg: "#D1FAE5", text: "#065F46" }, { label: "Drafts", value: blogs.filter(b => b.status === "draft").length, icon: "✏️", bg: "#FEF9C3", text: "#854D0E" }].map(s => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 12px rgba(15,110,86,0.06)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
            <div><div style={{ fontSize: 26, fontWeight: 800, color: s.text }}>{s.value}</div><div style={{ fontSize: 13, color: "#6B9E8A", fontWeight: 500 }}>{s.label}</div></div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search blogs…" style={{ flex: 1, minWidth: 200, padding: "10px 16px", borderRadius: 10, border: "1.5px solid #D1FAE5", fontSize: 14, outline: "none", background: "#fff", color: "#111827" }} />
        <div style={{ display: "flex", gap: 8 }}>
          {(["all", "published", "draft"] as const).map(f => (
            <button key={f} onClick={() => setFilterStatus(f)} style={{ padding: "9px 14px", borderRadius: 8, border: `1.5px solid ${filterStatus === f ? "#1D9E75" : "#E5E7EB"}`, background: filterStatus === f ? "#1D9E75" : "#fff", color: filterStatus === f ? "#fff" : "#6B7280", fontWeight: 600, fontSize: 13, cursor: "pointer", textTransform: "capitalize" }}>{f}</button>
          ))}
        </div>
        <button onClick={() => setShowForm(true)} style={{ padding: "10px 20px", borderRadius: 10, background: "#1D9E75", color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>+ New Post</button>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(15,110,86,0.06)", overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center", color: "#9CA3AF", fontSize: 15 }}>No posts found. <button onClick={() => setShowForm(true)} style={{ color: "#1D9E75", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 15 }}>Create one?</button></div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F0FAF5", borderBottom: "1px solid #E6F4ED" }}>
                {["Title", "Category", "Date", "Read time", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "14px 18px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#0F6E56", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F0FAF5" : "none" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F9FEFB")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
                >
                  <td style={{ padding: "14px 18px", maxWidth: 260 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.title}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.excerpt}</div>
                  </td>
                  <td style={{ padding: "14px 18px" }}><span style={{ background: "#E6F4ED", color: "#0F6E56", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 6 }}>{b.category}</span></td>
                  <td style={{ padding: "14px 18px", fontSize: 13, color: "#6B7280", whiteSpace: "nowrap" }}>{b.date}</td>
                  <td style={{ padding: "14px 18px", fontSize: 13, color: "#6B7280" }}>{b.readTime} min</td>
                  <td style={{ padding: "14px 18px" }}><span style={{ background: b.status === "published" ? "#D1FAE5" : "#FEF9C3", color: b.status === "published" ? "#065F46" : "#854D0E", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6, textTransform: "capitalize" }}>{b.status}</span></td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setEditBlog(b)} style={{ padding: "6px 14px", borderRadius: 7, border: "1.5px solid #D1FAE5", background: "#fff", color: "#0F6E56", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                      <button onClick={() => setDeleteId(b.id)} style={{ padding: "6px 14px", borderRadius: 7, border: "1.5px solid #FEE2E2", background: "#fff", color: "#B91C1C", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deleteId !== null && <ConfirmModal title="Delete this post?" body="This action cannot be undone." onConfirm={() => handleDelete(deleteId)} onCancel={() => setDeleteId(null)} />}
      {showForm && <BlogForm onSave={handleAdd} onCancel={() => setShowForm(false)} />}
      {editBlog && <BlogForm blog={editBlog} onSave={handleEdit} onCancel={() => setEditBlog(undefined)} />}
    </div>
  );
}

// ── Dashboard Shell ───────────────────────────────────────────────────────────
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<"appointments" | "blogs">("appointments");
  const [toast, setToast] = useState("");
  const pendingCount = useStore((s) => s.appointments.filter(a => a.status === "pending").length);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  return (
    <div style={{ minHeight: "100vh", background: "#F4FAF7", fontFamily: "'Segoe UI', sans-serif" }}>
      <Toast msg={toast} />

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E6F4ED", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "#1D9E75", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 12h3l3-9 4 18 3-9h5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#0F2E24" }}>PhysioLife Admin</div>
            <div style={{ fontSize: 11, color: "#6B9E8A" }}>Clinic Management Portal</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ fontSize: 13, color: "#1D9E75", textDecoration: "none", fontWeight: 600 }}>↗ View Website</a>
          <button onClick={onLogout} style={{ padding: "7px 16px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Sign out</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E6F4ED", padding: "0 32px", display: "flex", gap: 4 }}>
        {([
          { key: "appointments", label: "📅  Appointments", badge: pendingCount },
          { key: "blogs", label: "✍️  Blog Posts", badge: 0 },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding: "16px 20px", background: "none", border: "none", borderBottom: `3px solid ${activeTab === t.key ? "#1D9E75" : "transparent"}`, color: activeTab === t.key ? "#0F6E56" : "#6B7280", fontWeight: activeTab === t.key ? 700 : 500, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s" }}>
            {t.label}
            {t.badge > 0 && (
              <span style={{ background: "#EF4444", color: "#fff", fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 20, minWidth: 20, textAlign: "center" }}>{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0F2E24", marginBottom: 4 }}>
            {activeTab === "appointments" ? "Patient Appointments" : "Blog Management"}
          </h1>
          <p style={{ fontSize: 14, color: "#6B9E8A" }}>
            {activeTab === "appointments"
              ? "Patient booking requests appear here in real time when submitted from the website."
              : "Published posts appear immediately on the /blog page. Drafts are only visible here."}
          </p>
        </div>
        {activeTab === "appointments" ? <AppointmentsTab showToast={showToast} /> : <BlogTab showToast={showToast} />}
      </div>
    </div>
  );
}

// ── Entry Point ───────────────────────────────────────────────────────────────
function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(false);
  return loggedIn ? <Dashboard onLogout={() => setLoggedIn(false)} /> : <LoginPage onLogin={() => setLoggedIn(true)} />;
}
