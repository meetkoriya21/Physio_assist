import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useStore, type Appointment, type AppointmentStatus, type BlogPost } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  component: AdminPanel,
});

const ADMIN_EMAIL    = "admin@physioclinic.com";
const ADMIN_PASSWORD = "physio@2026";
const CATEGORIES     = ["Posture","Pain","Sports","Recovery","Treatment","Wellness","Nutrition","Exercise"];
const AUTH_KEY       = "physiolife_admin_auth";

const inp: React.CSSProperties = { width:"100%", padding:"10px 14px", borderRadius:10, border:"1.5px solid #D1FAE5", fontSize:14, outline:"none", boxSizing:"border-box", color:"#111827", background:"#F9FEFB", fontFamily:"inherit" };
const lbl: React.CSSProperties = { display:"block", fontSize:13, fontWeight:600, color:"#374151", marginBottom:6 };

async function sendStatusEmail(appt: Appointment, action: "accepted" | "rejected") {
  try {
    await fetch("/api/appointment-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name:appt.name, email:appt.email, phone:appt.phone, service:appt.service, date:appt.date, time:appt.time, message:appt.message, action }),
    });
  } catch (err) { console.warn("Email send failed:", err); }
}

function Toast({ msg }: { msg: string }) {
  if (!msg) return null;
  return <div style={{ position:"fixed", top:16, right:16, left:16, background:"#0F6E56", color:"#fff", padding:"12px 16px", borderRadius:12, fontSize:13, fontWeight:600, zIndex:300, boxShadow:"0 4px 20px rgba(0,0,0,0.2)", textAlign:"center" }}>{msg}</div>;
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const map = { pending:{bg:"#FEF9C3",text:"#854D0E"}, accepted:{bg:"#D1FAE5",text:"#065F46"}, rejected:{bg:"#FEE2E2",text:"#B91C1C"} };
  const c = map[status];
  return <span style={{ background:c.bg, color:c.text, fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:6, textTransform:"capitalize", whiteSpace:"nowrap" }}>{status}</span>;
}

function ConfirmModal({ title, body, onConfirm, onCancel }: { title:string; body:string; onConfirm:()=>void; onCancel:()=>void }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:250, padding:16 }}>
      <div style={{ background:"#fff", borderRadius:16, padding:24, width:"100%", maxWidth:360, textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ fontSize:32, marginBottom:10 }}>🗑️</div>
        <h3 style={{ fontSize:16, fontWeight:700, color:"#111827", marginBottom:6 }}>{title}</h3>
        <p style={{ fontSize:13, color:"#6B7280", marginBottom:20 }}>{body}</p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:"10px", borderRadius:10, border:"1.5px solid #E5E7EB", background:"#fff", color:"#374151", fontWeight:600, cursor:"pointer", fontSize:13 }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:"10px", borderRadius:10, background:"#DC2626", color:"#fff", fontWeight:700, border:"none", cursor:"pointer", fontSize:13 }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Login ─────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleLogin = () => {
    setError("");
    if (!email || !password) { setError("Please enter both fields."); return; }
    setLoading(true);
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // ✅ Save login to localStorage so refresh doesn't log out
        localStorage.setItem(AUTH_KEY, "true");
        onLogin();
      } else {
        setError("Invalid email or password.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#f0faf5 0%,#e6f4ed 100%)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',sans-serif", padding:16 }}>
      <div style={{ background:"#fff", borderRadius:20, boxShadow:"0 8px 40px rgba(15,110,86,0.12)", padding:"40px 28px", width:"100%", maxWidth:420 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:"#1D9E75", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 12h3l3-9 4 18 3-9h5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:15, color:"#0F4A3A" }}>PhysioLife Clinic</div>
            <div style={{ fontSize:12, color:"#6B9E8A" }}>Admin Portal</div>
          </div>
        </div>
        <h2 style={{ fontSize:22, fontWeight:700, color:"#0F2E24", marginBottom:6 }}>Welcome back</h2>
        <p style={{ fontSize:13, color:"#6B9E8A", marginBottom:24 }}>Sign in to manage appointments and blog posts.</p>
        {error && <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:8, padding:"10px 12px", fontSize:13, color:"#B91C1C", marginBottom:16 }}>{error}</div>}
        <div style={{ marginBottom:14 }}>
          <label style={lbl}>Email address</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="admin@physioclinic.com" style={inp} />
        </div>
        <div style={{ marginBottom:22 }}>
          <label style={lbl}>Password</label>
          <div style={{ position:"relative" }}>
            <input type={showPass?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="••••••••••" style={{ ...inp, paddingRight:56 }} />
            <button onClick={()=>setShowPass(!showPass)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#6B9E8A", fontSize:13, fontWeight:600 }}>{showPass?"Hide":"Show"}</button>
          </div>
        </div>
        <button onClick={handleLogin} disabled={loading} style={{ width:"100%", padding:13, borderRadius:12, background:loading?"#6EC4A7":"#1D9E75", color:"#fff", fontWeight:700, fontSize:15, border:"none", cursor:loading?"not-allowed":"pointer" }}>
          {loading?"Signing in…":"Sign in"}
        </button>
        <p style={{ fontSize:11, color:"#9CA3AF", textAlign:"center", marginTop:16 }}>Access via <strong>/admin</strong> — not linked on website</p>
      </div>
    </div>
  );
}

// ── Blog Form ─────────────────────────────────────────────────────────────────
function BlogForm({ blog, onSave, onCancel }: { blog?:BlogPost; onSave:(b:Omit<BlogPost,"id"|"color">)=>void; onCancel:()=>void }) {
  const [title, setTitle]       = useState(blog?.title||"");
  const [category, setCategory] = useState(blog?.category||"Posture");
  const [date, setDate]         = useState(blog?.date||new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}));
  const [readTime, setReadTime] = useState(blog?.readTime||"5");
  const [excerpt, setExcerpt]   = useState(blog?.excerpt||"");
  const [status, setStatus]     = useState<"published"|"draft">(blog?.status||"draft");
  const [error, setError]       = useState("");
  const [saving, setSaving]     = useState(false);

  const handleSave = async () => {
    if (!title.trim()||!excerpt.trim()) { setError("Title and excerpt are required."); return; }
    setSaving(true);
    await onSave({ title, category, date, readTime, excerpt, status });
    setSaving(false);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:200 }}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0", padding:"24px 20px", width:"100%", maxWidth:600, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 -8px 40px rgba(0,0,0,0.2)" }}>
        <div style={{ width:40, height:4, background:"#E5E7EB", borderRadius:2, margin:"0 auto 20px" }} />
        <h3 style={{ fontSize:18, fontWeight:700, color:"#0F2E24", marginBottom:20 }}>{blog?"Edit Blog Post":"New Blog Post"}</h3>
        {error && <div style={{ background:"#FEF2F2", borderRadius:8, padding:"10px 12px", fontSize:13, color:"#B91C1C", marginBottom:14 }}>{error}</div>}
        <div style={{ marginBottom:14 }}><label style={lbl}>Title *</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Blog post title…" style={inp} /></div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
          <div><label style={lbl}>Category</label><select value={category} onChange={e=>setCategory(e.target.value)} style={inp}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
          <div><label style={lbl}>Read time (min)</label><input type="number" value={readTime} onChange={e=>setReadTime(e.target.value)} min={1} max={60} style={inp} /></div>
        </div>
        <div style={{ marginBottom:14 }}><label style={lbl}>Date</label><input value={date} onChange={e=>setDate(e.target.value)} style={inp} /></div>
        <div style={{ marginBottom:14 }}><label style={lbl}>Excerpt *</label><textarea value={excerpt} onChange={e=>setExcerpt(e.target.value)} rows={3} placeholder="Short description…" style={{ ...inp, resize:"vertical" }} /></div>
        <div style={{ marginBottom:14 }}>
          <label style={lbl}>Status</label>
          <div style={{ display:"flex", gap:10 }}>
            {(["published","draft"] as const).map(s=>(
              <button key={s} onClick={()=>setStatus(s)} style={{ flex:1, padding:"9px", borderRadius:8, border:`2px solid ${status===s?"#1D9E75":"#E5E7EB"}`, background:status===s?"#E6F4ED":"#fff", color:status===s?"#0F6E56":"#6B7280", fontWeight:600, fontSize:13, cursor:"pointer", textTransform:"capitalize" }}>{s}</button>
            ))}
          </div>
        </div>
        <p style={{ fontSize:12, color:"#6B9E8A", marginBottom:16 }}>💡 <strong>Published</strong> = live on /blog immediately</p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:"12px", borderRadius:10, border:"1.5px solid #E5E7EB", background:"#fff", color:"#374151", fontWeight:600, fontSize:14, cursor:"pointer" }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ flex:1, padding:"12px", borderRadius:10, background:saving?"#6EC4A7":"#1D9E75", color:"#fff", fontWeight:700, fontSize:14, border:"none", cursor:saving?"not-allowed":"pointer" }}>
            {saving?"Saving…":blog?"Save":"Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Appointment Detail Modal ──────────────────────────────────────────────────
function ApptModal({ appt, onAccept, onReject, onClose }: { appt:Appointment; onAccept:()=>void; onReject:()=>void; onClose:()=>void }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:200 }}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0", padding:"24px 20px", width:"100%", maxWidth:600, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 -8px 40px rgba(0,0,0,0.2)" }}>
        <div style={{ width:40, height:4, background:"#E5E7EB", borderRadius:2, margin:"0 auto 20px" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h3 style={{ fontSize:18, fontWeight:700, color:"#0F2E24" }}>Appointment</h3>
          <StatusBadge status={appt.status} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
          {[["Patient",appt.name],["Email",appt.email],["Phone",appt.phone],["Service",appt.service],["Date",appt.date],["Time",appt.time]].map(([label,value])=>(
            <div key={label} style={{ background:"#F9FAFB", borderRadius:10, padding:"10px 12px" }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:3 }}>{label}</div>
              <div style={{ fontSize:13, fontWeight:600, color:"#111827", wordBreak:"break-all" }}>{value}</div>
            </div>
          ))}
        </div>
        {appt.message && (
          <div style={{ background:"#F9FAFB", borderRadius:10, padding:"12px", marginBottom:16 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", marginBottom:6 }}>Message</div>
            <div style={{ fontSize:13, color:"#374151", lineHeight:1.6 }}>{appt.message}</div>
          </div>
        )}
        <div style={{ fontSize:11, color:"#9CA3AF", marginBottom:16 }}>Submitted: {appt.submittedAt}</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {appt.status!=="accepted" && <button onClick={onAccept} style={{ flex:1, minWidth:120, padding:12, borderRadius:10, background:"#1D9E75", color:"#fff", fontWeight:700, fontSize:13, border:"none", cursor:"pointer" }}>✓ Accept & Email</button>}
          {appt.status!=="rejected" && <button onClick={onReject} style={{ flex:1, minWidth:120, padding:12, borderRadius:10, background:"#fff", color:"#B91C1C", fontWeight:700, fontSize:13, border:"2px solid #FEE2E2", cursor:"pointer" }}>✕ Reject & Email</button>}
          <button onClick={onClose} style={{ flex:1, minWidth:80, padding:12, borderRadius:10, background:"#F3F4F6", color:"#374151", fontWeight:600, fontSize:13, border:"none", cursor:"pointer" }}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Appointments Tab ──────────────────────────────────────────────────────────
function AppointmentsTab({ showToast }: { showToast:(m:string)=>void }) {
  const appointments            = useStore((s) => s.appointments);
  const fetchAppointments       = useStore((s) => s.fetchAppointments);
  const updateAppointmentStatus = useStore((s) => s.updateAppointmentStatus);
  const removeAppointment       = useStore((s) => s.removeAppointment);

  const [selected, setSelected]         = useState<Appointment|null>(null);
  const [filterStatus, setFilterStatus] = useState<"all"|AppointmentStatus>("all");
  const [search, setSearch]             = useState("");
  const [deleteId, setDeleteId]         = useState<string|null>(null);
  const [loading, setLoading]           = useState(true);

  useEffect(() => { fetchAppointments().then(()=>setLoading(false)); }, []);

  const updateStatus = async (appt: Appointment, status: AppointmentStatus) => {
    await updateAppointmentStatus(appt.id, status);
    setSelected(prev => prev?.id===appt.id ? { ...prev, status } : prev);
    await sendStatusEmail(appt, status);
    showToast(status==="accepted" ? `✓ Accepted! Email sent to ${appt.email}` : `Rejected. Email sent to ${appt.email}`);
  };

  const removeAppt = async (id:string) => { await removeAppointment(id); setSelected(null); setDeleteId(null); showToast("Appointment removed."); };

  const filtered = appointments.filter(a => {
    const m = a.name.toLowerCase().includes(search.toLowerCase()) || a.service.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
    return m && (filterStatus==="all" || a.status===filterStatus);
  });

  const counts = { pending:appointments.filter(a=>a.status==="pending").length, accepted:appointments.filter(a=>a.status==="accepted").length, rejected:appointments.filter(a=>a.status==="rejected").length };

  return (
    <div>
      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
        {[{label:"Pending",value:counts.pending,icon:"🕐",bg:"#FEF9C3",text:"#854D0E"},{label:"Accepted",value:counts.accepted,icon:"✅",bg:"#D1FAE5",text:"#065F46"},{label:"Rejected",value:counts.rejected,icon:"❌",bg:"#FEE2E2",text:"#B91C1C"}].map(s=>(
          <div key={s.label} style={{ background:"#fff", borderRadius:12, padding:"12px 10px", boxShadow:"0 2px 8px rgba(15,110,86,0.06)", textAlign:"center" }}>
            <div style={{ fontSize:22, marginBottom:4 }}>{s.icon}</div>
            <div style={{ fontSize:22, fontWeight:800, color:s.text, lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:11, color:"#6B9E8A", fontWeight:500, marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, service, email…" style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1.5px solid #D1FAE5", fontSize:13, outline:"none", background:"#fff", color:"#111827", boxSizing:"border-box", marginBottom:10 }} />

      {/* Filter */}
      <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
        {(["all","pending","accepted","rejected"] as const).map(f=>(
          <button key={f} onClick={()=>setFilterStatus(f)} style={{ padding:"7px 14px", borderRadius:8, border:`1.5px solid ${filterStatus===f?"#1D9E75":"#E5E7EB"}`, background:filterStatus===f?"#1D9E75":"#fff", color:filterStatus===f?"#fff":"#6B7280", fontWeight:600, fontSize:12, cursor:"pointer", textTransform:"capitalize" }}>{f}</button>
        ))}
      </div>

      {/* Cards — mobile friendly */}
      {loading ? (
        <div style={{ padding:"40px 0", textAlign:"center", color:"#9CA3AF" }}>Loading…</div>
      ) : filtered.length===0 ? (
        <div style={{ padding:"40px 0", textAlign:"center", color:"#9CA3AF", fontSize:14 }}>
          {appointments.length===0 ? "No appointments yet. They'll appear when patients book." : "No results found."}
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.map(a=>(
            <div key={a.id} style={{ background:"#fff", borderRadius:14, padding:"14px", boxShadow:"0 2px 8px rgba(15,110,86,0.06)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:"#111827" }}>{a.name}</div>
                  <div style={{ fontSize:12, color:"#9CA3AF" }}>{a.email}</div>
                </div>
                <StatusBadge status={a.status} />
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:8 }}>
                <span style={{ background:"#E6F4ED", color:"#0F6E56", fontSize:11, fontWeight:600, padding:"3px 8px", borderRadius:6 }}>{a.service}</span>
                <span style={{ fontSize:12, color:"#6B7280" }}>📅 {a.date} · {a.time}</span>
              </div>
              <div style={{ fontSize:11, color:"#9CA3AF", marginBottom:10 }}>Submitted: {a.submittedAt}</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <button onClick={()=>setSelected(a)} style={{ flex:1, minWidth:60, padding:"8px", borderRadius:8, border:"1.5px solid #D1FAE5", background:"#fff", color:"#0F6E56", fontSize:12, fontWeight:600, cursor:"pointer" }}>View</button>
                {a.status==="pending" && <>
                  <button onClick={()=>updateStatus(a,"accepted")} style={{ flex:1, minWidth:60, padding:"8px", borderRadius:8, border:"none", background:"#1D9E75", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>✓ Accept</button>
                  <button onClick={()=>updateStatus(a,"rejected")} style={{ flex:1, minWidth:60, padding:"8px", borderRadius:8, border:"none", background:"#FEE2E2", color:"#B91C1C", fontSize:12, fontWeight:700, cursor:"pointer" }}>✕ Reject</button>
                </>}
                <button onClick={()=>setDeleteId(a.id)} style={{ flex:1, minWidth:60, padding:"8px", borderRadius:8, border:"1.5px solid #E5E7EB", background:"#fff", color:"#6B7280", fontSize:12, fontWeight:600, cursor:"pointer" }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && <ApptModal appt={selected} onAccept={()=>updateStatus(selected,"accepted")} onReject={()=>updateStatus(selected,"rejected")} onClose={()=>setSelected(null)} />}
      {deleteId!==null && <ConfirmModal title="Remove appointment?" body="This will permanently delete the record." onConfirm={()=>removeAppt(deleteId)} onCancel={()=>setDeleteId(null)} />}
    </div>
  );
}

// ── Blog Tab ──────────────────────────────────────────────────────────────────
function BlogTab({ showToast }: { showToast:(m:string)=>void }) {
  const blogs      = useStore((s) => s.blogs);
  const fetchBlogs = useStore((s) => s.fetchBlogs);
  const addBlog    = useStore((s) => s.addBlog);
  const updateBlog = useStore((s) => s.updateBlog);
  const deleteBlog = useStore((s) => s.deleteBlog);

  const [showForm, setShowForm]         = useState(false);
  const [editBlog, setEditBlog]         = useState<BlogPost|undefined>();
  const [deleteId, setDeleteId]         = useState<string|null>(null);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState<"all"|"published"|"draft">("all");
  const [loading, setLoading]           = useState(true);

  useEffect(() => { fetchBlogs().then(()=>setLoading(false)); }, []);

  const filtered = blogs.filter(b => {
    const m = b.title.toLowerCase().includes(search.toLowerCase()) || b.category.toLowerCase().includes(search.toLowerCase());
    return m && (filterStatus==="all" || b.status===filterStatus);
  });

  const handleAdd    = async (data:Omit<BlogPost,"id"|"color">) => { await addBlog(data); setShowForm(false); showToast(data.status==="published"?"✓ Published! Live on /blog":"✓ Draft saved."); };
  const handleEdit   = async (data:Omit<BlogPost,"id"|"color">) => { await updateBlog(editBlog!.id,data); setEditBlog(undefined); showToast("✓ Blog updated!"); };
  const handleDelete = async (id:string) => { await deleteBlog(id); setDeleteId(null); showToast("Deleted."); };

  return (
    <div>
      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
        {[{label:"Total",value:blogs.length,icon:"📄",bg:"#E6F4ED",text:"#0F6E56"},{label:"Published",value:blogs.filter(b=>b.status==="published").length,icon:"✅",bg:"#D1FAE5",text:"#065F46"},{label:"Drafts",value:blogs.filter(b=>b.status==="draft").length,icon:"✏️",bg:"#FEF9C3",text:"#854D0E"}].map(s=>(
          <div key={s.label} style={{ background:"#fff", borderRadius:12, padding:"12px 10px", boxShadow:"0 2px 8px rgba(15,110,86,0.06)", textAlign:"center" }}>
            <div style={{ fontSize:22, marginBottom:4 }}>{s.icon}</div>
            <div style={{ fontSize:22, fontWeight:800, color:s.text, lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:11, color:"#6B9E8A", fontWeight:500, marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + New */}
      <div style={{ display:"flex", gap:8, marginBottom:10 }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search blogs…" style={{ flex:1, padding:"10px 14px", borderRadius:10, border:"1.5px solid #D1FAE5", fontSize:13, outline:"none", background:"#fff", color:"#111827" }} />
        <button onClick={()=>setShowForm(true)} style={{ padding:"10px 14px", borderRadius:10, background:"#1D9E75", color:"#fff", fontWeight:700, fontSize:13, border:"none", cursor:"pointer", whiteSpace:"nowrap" }}>+ New</button>
      </div>

      {/* Filter */}
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {(["all","published","draft"] as const).map(f=>(
          <button key={f} onClick={()=>setFilterStatus(f)} style={{ padding:"7px 14px", borderRadius:8, border:`1.5px solid ${filterStatus===f?"#1D9E75":"#E5E7EB"}`, background:filterStatus===f?"#1D9E75":"#fff", color:filterStatus===f?"#fff":"#6B7280", fontWeight:600, fontSize:12, cursor:"pointer", textTransform:"capitalize" }}>{f}</button>
        ))}
      </div>

      {/* Blog Cards */}
      {loading ? (
        <div style={{ padding:"40px 0", textAlign:"center", color:"#9CA3AF" }}>Loading…</div>
      ) : filtered.length===0 ? (
        <div style={{ padding:"40px 0", textAlign:"center", color:"#9CA3AF", fontSize:14 }}>No posts. <button onClick={()=>setShowForm(true)} style={{ color:"#1D9E75", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>Create one?</button></div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.map(b=>(
            <div key={b.id} style={{ background:"#fff", borderRadius:14, padding:"14px", boxShadow:"0 2px 8px rgba(15,110,86,0.06)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                <div style={{ flex:1, marginRight:8 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:"#111827", lineHeight:1.3 }}>{b.title}</div>
                  <div style={{ fontSize:12, color:"#9CA3AF", marginTop:2 }}>{b.excerpt.slice(0,80)}…</div>
                </div>
                <span style={{ background:b.status==="published"?"#D1FAE5":"#FEF9C3", color:b.status==="published"?"#065F46":"#854D0E", fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:6, textTransform:"capitalize", whiteSpace:"nowrap", flexShrink:0 }}>{b.status}</span>
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:10 }}>
                <span style={{ background:"#E6F4ED", color:"#0F6E56", fontSize:11, fontWeight:600, padding:"3px 8px", borderRadius:6 }}>{b.category}</span>
                <span style={{ fontSize:12, color:"#6B7280" }}>📅 {b.date} · {b.readTime} min</span>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>setEditBlog(b)} style={{ flex:1, padding:"8px", borderRadius:8, border:"1.5px solid #D1FAE5", background:"#fff", color:"#0F6E56", fontSize:12, fontWeight:600, cursor:"pointer" }}>Edit</button>
                <button onClick={()=>setDeleteId(b.id)} style={{ flex:1, padding:"8px", borderRadius:8, border:"1.5px solid #FEE2E2", background:"#fff", color:"#B91C1C", fontSize:12, fontWeight:600, cursor:"pointer" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId!==null && <ConfirmModal title="Delete this post?" body="This cannot be undone." onConfirm={()=>handleDelete(deleteId)} onCancel={()=>setDeleteId(null)} />}
      {showForm && <BlogForm onSave={handleAdd} onCancel={()=>setShowForm(false)} />}
      {editBlog && <BlogForm blog={editBlog} onSave={handleEdit} onCancel={()=>setEditBlog(undefined)} />}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ onLogout }: { onLogout:()=>void }) {
  const [activeTab, setActiveTab] = useState<"appointments"|"blogs">("appointments");
  const [toast, setToast]         = useState("");
  const [menuOpen, setMenuOpen]   = useState(false);
  const pendingCount = useStore((s) => s.appointments.filter(a=>a.status==="pending").length);
  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(""),4000); };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    onLogout();
  };

  return (
    <div style={{ minHeight:"100vh", background:"#F4FAF7", fontFamily:"'Segoe UI',sans-serif" }}>
      <Toast msg={toast} />

      {/* Header */}
      <div style={{ background:"#fff", borderBottom:"1px solid #E6F4ED", padding:"0 16px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"#1D9E75", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 12h3l3-9 4 18 3-9h5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:13, color:"#0F2E24", lineHeight:1.2 }}>PhysioLife</div>
            <div style={{ fontSize:10, color:"#6B9E8A" }}>Admin</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <a href="/" style={{ fontSize:12, color:"#1D9E75", textDecoration:"none", fontWeight:600 }}>↗ Website</a>
          <button onClick={handleLogout} style={{ padding:"6px 12px", borderRadius:8, border:"1.5px solid #E5E7EB", background:"#fff", color:"#374151", fontSize:12, fontWeight:600, cursor:"pointer" }}>Sign out</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background:"#fff", borderBottom:"1px solid #E6F4ED", display:"flex" }}>
        {([{key:"appointments",label:"📅 Appointments",badge:pendingCount},{key:"blogs",label:"✍️ Blog Posts",badge:0}] as const).map(t=>(
          <button key={t.key} onClick={()=>setActiveTab(t.key)} style={{ flex:1, padding:"14px 8px", background:"none", border:"none", borderBottom:`3px solid ${activeTab===t.key?"#1D9E75":"transparent"}`, color:activeTab===t.key?"#0F6E56":"#6B7280", fontWeight:activeTab===t.key?700:500, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
            {t.label}
            {t.badge>0 && <span style={{ background:"#EF4444", color:"#fff", fontSize:10, fontWeight:700, padding:"1px 6px", borderRadius:20 }}>{t.badge}</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding:"16px" }}>
        <div style={{ marginBottom:16 }}>
          <h1 style={{ fontSize:18, fontWeight:700, color:"#0F2E24", marginBottom:2 }}>
            {activeTab==="appointments" ? "Patient Appointments" : "Blog Management"}
          </h1>
          <p style={{ fontSize:12, color:"#6B9E8A" }}>
            {activeTab==="appointments" ? "Accept or reject — patient gets email automatically." : "Published posts go live on /blog instantly."}
          </p>
        </div>
        {activeTab==="appointments" ? <AppointmentsTab showToast={showToast} /> : <BlogTab showToast={showToast} />}
      </div>
    </div>
  );
}

// ── Entry Point — persists login across refresh ───────────────────────────────
function AdminPanel() {
  // ✅ Check localStorage on load — stays logged in after refresh
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === "true";
  });

  return loggedIn
    ? <Dashboard onLogout={() => setLoggedIn(false)} />
    : <LoginPage onLogin={() => setLoggedIn(true)} />;
}
