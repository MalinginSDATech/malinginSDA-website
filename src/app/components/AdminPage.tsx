import { useState, useEffect, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ArrowLeft, LogOut, Plus, Pencil, Trash2, Save, Shield, Upload,
  Megaphone, Calendar, BookOpen, CreditCard, Receipt, Users, Inbox,
  Eye, EyeOff, ChevronDown, ChevronUp, Check, X, ArrowRightCircle, Mail, Heart, Sparkles,
} from "lucide-react";
import { supabase, isSupabaseReady } from "../../supabase";
import { GIVING_PURPOSES } from "../../constants";

interface Props { onBack: () => void }

// ── Types ──────────────────────────────────────────────────────────────────────

interface Announcement { id: string; title: string; body: string; active: boolean; created_at: string }
interface CrusadeSession { label: string; topic: string; speaker: string }
interface CrusadeDay { date: string; sessions: CrusadeSession[] }
interface ChurchEvent   { id: string; title: string; tag: string; day: string; month: string; year: string; location: string; description: string; image_url: string; active: boolean; crusade_start: string; crusade_end: string; crusade_schedule: CrusadeDay[] }
interface Sermon        { id: string; title: string; speaker: string; date: string; series: string; video_url: string; excerpt: string; status: string; active: boolean; service_date: string; day_type: string; year: string }
interface SermonSeriesRow { year: string; series_name: string }
interface GiveSettings  { gcash_name: string; gcash_number: string; phone: string; qr_code_url: string }
interface Transaction   { id: string; donor_name: string; donor_email: string; amount: number; type: string; description: string; date: string; note: string }
interface GivingSubmission { id: string; user_email: string; user_name: string; purpose: string; amount: number; note: string; status: string; created_at: string }
interface Inquiry {
  id: string; name: string; phone: string; email: string; org: string; inquiry_type: string;
  services: string[]; events: string[]; groups_wanted: string[]; outside_church: boolean;
  event_date: string; event_location: string; notes: string; status: string; created_at: string;
}
interface PrayerRequest { id: string; request: string; from_name: string; visibility: string; status: string; created_at: string }

const INQUIRY_LABELS: Record<string, string> = {
  visitation: "Church Visit", "host-service": "Host a Service", event: "Hold an Event", "group-request": "Request a Group",
};
const INQUIRY_STATUSES = ["New", "Contacted", "Resolved"];
const PRAYER_STATUSES = ["New", "Prayed"];

// ── Shared UI ──────────────────────────────────────────────────────────────────

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] px-5 py-3 rounded-2xl shadow-xl font-[Lato] text-sm text-white flex items-center gap-2 ${type === "success" ? "bg-green-600" : "bg-red-600"}`}>
      {type === "success" ? <Check size={14} /> : <X size={14} />}
      {msg}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div>
      <label className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">{label}</label>
      <div className="relative">
        <input
          type={isPass ? (show ? "text" : "password") : type}
          value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm text-foreground bg-background focus:outline-none focus:border-primary transition-colors pr-9"
        />
        {isPass && (
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 3, placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string;
}) {
  return (
    <div>
      <label className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder}
        className="w-full border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm text-foreground bg-background focus:outline-none focus:border-primary transition-colors resize-none" />
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <span className="font-[Lato] text-xs text-muted-foreground">{label}</span>
      <div onClick={() => onChange(!checked)} className={`w-10 h-6 rounded-full transition-colors relative ${checked ? "bg-primary" : "bg-border"}`}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-1"}`} />
      </div>
    </label>
  );
}

function Badge({ label, color = "blue" }: { label: string; color?: string }) {
  const map: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700", green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700", amber: "bg-amber-100 text-amber-700", violet: "bg-violet-100 text-violet-700",
  };
  return <span className={`text-[10px] font-[Lato] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${map[color] ?? map.blue}`}>{label}</span>;
}

function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const notify = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);
  return { toast, notify };
}

// ── Announcements ──────────────────────────────────────────────────────────────

function AnnouncementsTab() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [form, setForm] = useState({ title: "", body: "", active: true });
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast, notify } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => { setForm({ title: "", body: "", active: true }); setEditing(null); setShowForm(false); };

  const save = async () => {
    if (!form.title.trim()) return notify("Title is required.", "error");
    const { error } = editing
      ? await supabase.from("announcements").update(form).eq("id", editing)
      : await supabase.from("announcements").insert(form);
    if (error) return notify("Failed to save.", "error");
    notify(editing ? "Updated." : "Posted.");
    resetForm(); fetchItems();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    await supabase.from("announcements").delete().eq("id", id);
    notify("Deleted."); fetchItems();
  };

  const startEdit = (a: Announcement) => {
    setForm({ title: a.title, body: a.body, active: a.active });
    setEditing(a.id); setShowForm(true);
  };

  return (
    <div className="space-y-4">
      {toast && <Toast {...toast} />}
      <div className="flex items-center justify-between">
        <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground">Announcements</h3>
        <button onClick={() => { setShowForm((s) => !s); setEditing(null); setForm({ title: "", body: "", active: true }); }}
          className="flex items-center gap-1.5 bg-primary text-white font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:opacity-90">
          <Plus size={13} /> New
        </button>
      </div>

      {showForm && (
        <div className="bg-secondary/60 border border-border rounded-2xl p-5 space-y-3">
          <p className="font-[Lato] text-xs font-bold uppercase tracking-widest text-muted-foreground">{editing ? "Edit" : "New"} Announcement</p>
          <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Announcement title" />
          <Textarea label="Body" value={form.body} onChange={(v) => setForm({ ...form, body: v })} rows={4} placeholder="Write the announcement..." />
          <Toggle checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label="Publish publicly" />
          <div className="flex gap-2 pt-1">
            <button onClick={save} className="flex items-center gap-1.5 bg-primary text-white font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:opacity-90"><Save size={13} /> Save</button>
            <button onClick={resetForm} className="font-[Lato] text-xs text-muted-foreground px-4 py-2 rounded-full hover:bg-border transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-center font-[Lato] text-sm text-muted-foreground py-12">No announcements yet.</p>
      ) : items.map((a) => (
        <div key={a.id} className="bg-card border border-border rounded-2xl p-4 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {a.active ? <Badge label="Published" color="green" /> : <Badge label="Draft" color="red" />}
            </div>
            <p className="font-[Playfair_Display] text-sm font-semibold text-foreground">{a.title}</p>
            <p className="font-[Lato] text-xs text-muted-foreground mt-1 line-clamp-2">{a.body}</p>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button onClick={() => startEdit(a)} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-blue-50 hover:text-blue-600"><Pencil size={13} /></button>
            <button onClick={() => del(a.id)} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-red-50 hover:text-red-600"><Trash2 size={13} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Events ─────────────────────────────────────────────────────────────────────

const EVENT_TAGS = ["Youth", "Church", "Outreach", "Worship", "District", "Conference", "Crusade"];
const blank_event = {
  title: "", tag: "Church", day: "", month: "", year: "", location: "", description: "", image_url: "", active: true,
  crusade_start: "", crusade_end: "", crusade_schedule: [] as CrusadeDay[],
};
const newEventId = () => (crypto as { randomUUID: () => string }).randomUUID();

function crusadeDateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const d = new Date(start + "T00:00:00");
  const last = new Date(end + "T00:00:00");
  while (d <= last) { dates.push(isoDate(d)); d.setDate(d.getDate() + 1); }
  return dates;
}

function EventsTab() {
  const [items, setItems] = useState<ChurchEvent[]>([]);
  const [form, setForm] = useState(blank_event);
  const [formId, setFormId] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast, notify } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => { setForm(blank_event); setFormId(""); setEditing(null); setShowForm(false); };

  const save = async () => {
    if (!form.title.trim() || !form.day || !form.month) return notify("Title and date are required.", "error");
    // crusade_start/crusade_end are `date` columns — Postgres rejects "" (only a real date or NULL).
    const payload = { ...form, crusade_start: form.crusade_start || null, crusade_end: form.crusade_end || null };
    const { error } = editing
      ? await supabase.from("events").update(payload).eq("id", editing)
      : await supabase.from("events").insert({ id: formId, ...payload });
    if (error) return notify("Failed to save.", "error");
    notify(editing ? "Event updated." : "Event added.");
    resetForm(); fetchItems();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await supabase.from("events").delete().eq("id", id);
    notify("Deleted."); fetchItems();
  };

  const startEdit = (e: ChurchEvent) => {
    setForm({
      title: e.title, tag: e.tag, day: e.day, month: e.month, year: e.year, location: e.location, description: e.description, image_url: e.image_url ?? "", active: e.active,
      crusade_start: e.crusade_start ?? "", crusade_end: e.crusade_end ?? "", crusade_schedule: e.crusade_schedule ?? [],
    });
    setFormId(e.id); setEditing(e.id); setShowForm(true);
  };

  const generateCrusadeDays = () => {
    if (!form.crusade_start || !form.crusade_end) return notify("Set a start and end date first.", "error");
    const existing = new Map(form.crusade_schedule.map((d) => [d.date, d]));
    const days = crusadeDateRange(form.crusade_start, form.crusade_end).map(
      (date) => existing.get(date) ?? { date, sessions: [{ label: "Evening Service", topic: "", speaker: "" }] }
    );
    setForm({ ...form, crusade_schedule: days });
  };

  const updateSession = (dayIdx: number, sessIdx: number, patch: Partial<CrusadeSession>) => {
    const schedule = form.crusade_schedule.map((d, i) => i !== dayIdx ? d : {
      ...d, sessions: d.sessions.map((s, j) => j !== sessIdx ? s : { ...s, ...patch }),
    });
    setForm({ ...form, crusade_schedule: schedule });
  };

  const addSession = (dayIdx: number) => {
    const schedule = form.crusade_schedule.map((d, i) => i !== dayIdx ? d : {
      ...d, sessions: [...d.sessions, { label: "", topic: "", speaker: "" }],
    });
    setForm({ ...form, crusade_schedule: schedule });
  };

  const removeSession = (dayIdx: number, sessIdx: number) => {
    const schedule = form.crusade_schedule.map((d, i) => i !== dayIdx ? d : {
      ...d, sessions: d.sessions.filter((_, j) => j !== sessIdx),
    });
    setForm({ ...form, crusade_schedule: schedule });
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const path = `events/${formId}`;
      const { error } = await supabase.storage.from("uploads").upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("uploads").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: `${publicUrl}?v=${Date.now()}` }));
      notify("Image uploaded.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      notify(`Upload failed: ${msg}`, "error");
    } finally { setUploading(false); }
  };

  return (
    <div className="space-y-4">
      {toast && <Toast {...toast} />}
      <div className="flex items-center justify-between">
        <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground">Events</h3>
        <button onClick={() => { setShowForm((s) => !s); setEditing(null); setForm(blank_event); setFormId(newEventId()); }}
          className="flex items-center gap-1.5 bg-primary text-white font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:opacity-90">
          <Plus size={13} /> New
        </button>
      </div>

      {showForm && (
        <div className="bg-secondary/60 border border-border rounded-2xl p-5 space-y-3">
          <p className="font-[Lato] text-xs font-bold uppercase tracking-widest text-muted-foreground">{editing ? "Edit" : "New"} Event</p>
          <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <div>
            <label className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Tag</label>
            <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}
              className="w-full border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm bg-background focus:outline-none focus:border-primary">
              {EVENT_TAGS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Day" value={form.day} onChange={(v) => setForm({ ...form, day: v })} placeholder="5" />
            <Field label="Month" value={form.month} onChange={(v) => setForm({ ...form, month: v })} placeholder="Dec" />
            <Field label="Year" value={form.year} onChange={(v) => setForm({ ...form, year: v })} placeholder="2026" />
          </div>
          <Field label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} placeholder="Malingin SDA Church" />
          <Textarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />

          {form.tag === "Crusade" && (
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <p className="font-[Lato] text-xs font-bold uppercase tracking-widest text-muted-foreground">Crusade Schedule</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Start Date</label>
                  <input type="date" value={form.crusade_start} onChange={(e) => setForm({ ...form, crusade_start: e.target.value })}
                    className="w-full border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm bg-background focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">End Date</label>
                  <input type="date" value={form.crusade_end} onChange={(e) => setForm({ ...form, crusade_end: e.target.value })}
                    className="w-full border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm bg-background focus:outline-none focus:border-primary" />
                </div>
              </div>
              <button onClick={generateCrusadeDays}
                className="flex items-center gap-1.5 bg-secondary border border-border font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:bg-border">
                <Sparkles size={13} /> {form.crusade_schedule.length > 0 ? "Regenerate Days" : "Generate Days"}
              </button>
              <p className="font-[Lato] text-[11px] text-muted-foreground">
                Regenerating keeps topics/speakers already entered for dates still in range.
              </p>

              {form.crusade_schedule.map((day, dayIdx) => (
                <div key={day.date} className="border border-border rounded-xl p-3 space-y-2">
                  <p className="font-[Lato] text-xs font-bold text-foreground">{day.date}</p>
                  {day.sessions.map((sess, sessIdx) => (
                    <div key={sessIdx} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                      <input value={sess.label} onChange={(e) => updateSession(dayIdx, sessIdx, { label: e.target.value })}
                        placeholder="Session (e.g. Health Lecture)"
                        className="border border-border rounded-lg px-2.5 py-1.5 font-[Lato] text-xs bg-background focus:outline-none focus:border-primary" />
                      <input value={sess.topic} onChange={(e) => updateSession(dayIdx, sessIdx, { topic: e.target.value })}
                        placeholder="Topic"
                        className="border border-border rounded-lg px-2.5 py-1.5 font-[Lato] text-xs bg-background focus:outline-none focus:border-primary" />
                      <input value={sess.speaker} onChange={(e) => updateSession(dayIdx, sessIdx, { speaker: e.target.value })}
                        placeholder="Speaker"
                        className="border border-border rounded-lg px-2.5 py-1.5 font-[Lato] text-xs bg-background focus:outline-none focus:border-primary" />
                      <button onClick={() => removeSession(dayIdx, sessIdx)} className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center hover:bg-red-50 hover:text-red-600"><Trash2 size={12} /></button>
                    </div>
                  ))}
                  <button onClick={() => addSession(dayIdx)} className="font-[Lato] text-[11px] text-accent font-bold flex items-center gap-1">
                    <Plus size={11} /> Add another session this day
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Event Image (optional)</label>
            <Field label="Image URL (paste from Imgur / Google Drive / etc.)" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} placeholder="https://..." />
            <div className="flex items-center gap-3 mt-2">
              <label className="flex items-center gap-1.5 bg-card border border-border font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:bg-secondary cursor-pointer">
                <Upload size={13} />{uploading ? "Uploading…" : "Upload Image"}
                <input type="file" accept="image/*" hidden disabled={uploading}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ""; }} />
              </label>
              {form.image_url && (
                <img src={form.image_url} alt="Event preview" className="w-16 h-16 object-cover rounded-lg border border-border" />
              )}
            </div>
          </div>

          <Toggle checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label="Show publicly" />
          <div className="flex gap-2 pt-1">
            <button onClick={save} className="flex items-center gap-1.5 bg-primary text-white font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:opacity-90"><Save size={13} /> Save</button>
            <button onClick={resetForm} className="font-[Lato] text-xs text-muted-foreground px-4 py-2 rounded-full hover:bg-border transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-center font-[Lato] text-sm text-muted-foreground py-12">No events yet.</p>
      ) : items.map((e) => (
        <div key={e.id} className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3">
          <div className="shrink-0 text-center w-12">
            <p className="font-[Playfair_Display] text-2xl font-bold text-primary leading-none">{e.day}</p>
            <p className="font-[Lato] text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">{e.month}</p>
            <p className="font-[Lato] text-[9px] text-muted-foreground">{e.year}</p>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge label={e.tag} color="blue" />{!e.active && <Badge label="Hidden" color="red" />}
            </div>
            <p className="font-[Playfair_Display] text-sm font-semibold text-foreground">{e.title}</p>
            <p className="font-[Lato] text-xs text-muted-foreground mt-0.5">{e.location}</p>
          </div>
          {e.image_url && <img src={e.image_url} alt="" className="w-12 h-12 object-cover rounded-lg border border-border shrink-0" />}
          <div className="flex gap-1.5 shrink-0">
            <button onClick={() => startEdit(e)} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-blue-50 hover:text-blue-600"><Pencil size={13} /></button>
            <button onClick={() => del(e.id)} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-red-50 hover:text-red-600"><Trash2 size={13} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Sermons ────────────────────────────────────────────────────────────────────

const pad2 = (n: number) => String(n).padStart(2, "0");
const isoDate = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const todayIso = () => isoDate(new Date());

// Every Wednesday (Midweek), Friday (Vesper), and Saturday (Sabbath) of a calendar year.
function generateServiceDates(year: number): { service_date: string; day_type: string }[] {
  const out: { service_date: string; day_type: string }[] = [];
  const d = new Date(year, 0, 1);
  while (d.getFullYear() === year) {
    const dow = d.getDay();
    if (dow === 3) out.push({ service_date: isoDate(d), day_type: "Wednesday" });
    if (dow === 5) out.push({ service_date: isoDate(d), day_type: "Friday" });
    if (dow === 6) out.push({ service_date: isoDate(d), day_type: "Saturday" });
    d.setDate(d.getDate() + 1);
  }
  return out;
}

const DAY_TYPE_LABEL: Record<string, string> = { Wednesday: "Midweek", Friday: "Vesper", Saturday: "Sabbath" };
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function SermonRow({ sermon, onSaved, onDeleted }: { sermon: Sermon; onSaved: () => void; onDeleted: () => void }) {
  const [speaker, setSpeaker] = useState(sermon.speaker ?? "");
  const [title, setTitle] = useState(sermon.title ?? "");
  const [expanded, setExpanded] = useState(false);
  const [videoUrl, setVideoUrl] = useState(sermon.video_url ?? "");
  const [excerpt, setExcerpt] = useState(sermon.excerpt ?? "");
  const [active, setActive] = useState(sermon.active);

  const isPast = sermon.service_date < todayIso();

  const saveField = async (patch: Partial<Sermon>) => {
    await supabase.from("sermons").update(patch).eq("id", sermon.id);
    onSaved();
  };

  const del = async () => {
    if (!confirm("Remove this date from the schedule?")) return;
    await supabase.from("sermons").delete().eq("id", sermon.id);
    onDeleted();
  };

  return (
    <div className="border border-border rounded-xl bg-card">
      <div className="flex items-center gap-2 p-2.5">
        <div className="shrink-0 w-24">
          <p className="font-[Lato] text-xs font-bold text-foreground">{sermon.service_date}</p>
          <p className="font-[Lato] text-[9px] text-muted-foreground uppercase tracking-widest">{DAY_TYPE_LABEL[sermon.day_type] ?? sermon.day_type}</p>
        </div>
        <input
          value={speaker}
          onChange={(e) => setSpeaker(e.target.value)}
          onBlur={() => speaker !== (sermon.speaker ?? "") && saveField({ speaker })}
          placeholder="Speaker"
          className="flex-1 min-w-0 border border-border rounded-lg px-2.5 py-1.5 font-[Lato] text-xs bg-background focus:outline-none focus:border-primary"
        />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => title !== (sermon.title ?? "") && saveField({ title })}
          placeholder="Topic (optional)"
          className="flex-1 min-w-0 border border-border rounded-lg px-2.5 py-1.5 font-[Lato] text-xs bg-background focus:outline-none focus:border-primary"
        />
        {isPast && <Badge label="Past" color="blue" />}
        {!active && <Badge label="Hidden" color="red" />}
        <button onClick={() => setExpanded((e) => !e)} className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0 hover:bg-border">
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
        <button onClick={del} className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0 hover:bg-red-50 hover:text-red-600"><Trash2 size={12} /></button>
      </div>

      {expanded && (
        <div className="border-t border-border p-2.5 space-y-2">
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            onBlur={() => videoUrl !== (sermon.video_url ?? "") && saveField({ video_url: videoUrl })}
            placeholder="Video link — YouTube or Google Drive (Supabase storage isn't used for video)"
            className="w-full border border-border rounded-lg px-2.5 py-1.5 font-[Lato] text-xs bg-background focus:outline-none focus:border-primary"
          />
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            onBlur={() => excerpt !== (sermon.excerpt ?? "") && saveField({ excerpt })}
            placeholder="Excerpt / summary (shown once this date has passed)"
            rows={2}
            className="w-full border border-border rounded-lg px-2.5 py-1.5 font-[Lato] text-xs bg-background focus:outline-none focus:border-primary resize-none"
          />
          <Toggle checked={active} onChange={(v) => { setActive(v); saveField({ active: v }); }} label="Show publicly" />
        </div>
      )}
    </div>
  );
}

function SermonsTab() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(String(currentYear));
  const [seriesName, setSeriesName] = useState("");
  const [items, setItems] = useState<Sermon[]>([]);
  const [openMonths, setOpenMonths] = useState<Record<string, boolean>>({});
  const [generating, setGenerating] = useState(false);
  const { toast, notify } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from("sermons").select("*").eq("year", year).order("service_date", { ascending: true });
    setItems(data ?? []);
  };
  const fetchSeries = async () => {
    const { data } = await supabase.from("sermon_series").select("*").eq("year", year).maybeSingle();
    setSeriesName(data?.series_name ?? "");
  };
  useEffect(() => { fetchItems(); fetchSeries(); }, [year]);

  const saveSeries = async () => {
    const { error } = await supabase.from("sermon_series").upsert({ year, series_name: seriesName });
    if (error) return notify("Failed to save series name.", "error");
    notify("Series name saved.");
  };

  const generateSchedule = async () => {
    setGenerating(true);
    const dates = generateServiceDates(Number(year));
    const rows = dates.map((d) => ({
      title: "", speaker: "", date: "", series: seriesName, video_url: "", excerpt: "",
      status: "Upcoming", active: true, ...d, year,
    }));
    const { error } = await supabase.from("sermons").upsert(rows, { onConflict: "service_date", ignoreDuplicates: true });
    setGenerating(false);
    if (error) return notify(`Failed to generate schedule: ${error.message}`, "error");
    notify(`Generated ${dates.length} dates for ${year}.`);
    fetchItems();
  };

  const grouped = items.reduce<Record<string, Sermon[]>>((acc, s) => {
    const month = MONTH_NAMES[Number(s.service_date.slice(5, 7)) - 1];
    (acc[month] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {toast && <Toast {...toast} />}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground">Sermons</h3>
        <div className="flex items-center gap-2">
          <select value={year} onChange={(e) => setYear(e.target.value)}
            className="border border-border rounded-xl px-3 py-2 font-[Lato] text-xs bg-background focus:outline-none focus:border-primary">
            {Array.from({ length: 5 }, (_, i) => currentYear - 1 + i).map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-secondary/60 border border-border rounded-2xl p-4 space-y-3">
        <p className="font-[Lato] text-xs font-bold uppercase tracking-widest text-muted-foreground">{year} Series Name</p>
        <div className="flex gap-2">
          <input value={seriesName} onChange={(e) => setSeriesName(e.target.value)} placeholder="e.g. Pag-uswag"
            className="flex-1 border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm bg-background focus:outline-none focus:border-primary" />
          <button onClick={saveSeries} className="flex items-center gap-1.5 bg-primary text-white font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:opacity-90"><Save size={13} /> Save</button>
        </div>
        <button onClick={generateSchedule} disabled={generating}
          className="flex items-center gap-1.5 bg-card border border-border font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:bg-background disabled:opacity-50">
          <Sparkles size={13} /> {generating ? "Generating…" : `Generate ${year}'s Wed/Fri/Sat Schedule`}
        </button>
        <p className="font-[Lato] text-[11px] text-muted-foreground leading-relaxed">
          Creates one row per Wednesday (Midweek), Friday (Vesper), and Saturday (Sabbath) in {year}. Safe to click again — existing dates are left untouched, only missing ones are added.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-center font-[Lato] text-sm text-muted-foreground py-12">No schedule generated for {year} yet.</p>
      ) : (
        <div className="space-y-2">
          {MONTH_NAMES.filter((m) => grouped[m]?.length).map((month) => {
            const rows = grouped[month];
            const filled = rows.filter((r) => r.speaker?.trim()).length;
            const open = openMonths[month] ?? month === MONTH_NAMES[new Date().getMonth()];
            return (
              <div key={month} className="border border-border rounded-xl overflow-hidden">
                <button onClick={() => setOpenMonths((o) => ({ ...o, [month]: !open }))}
                  className="w-full flex items-center justify-between px-4 py-3 bg-secondary/40 hover:bg-secondary/70 transition-colors">
                  <span className="font-[Lato] text-sm font-bold text-foreground">{month} {year}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest">{filled}/{rows.length} filled</span>
                    {open ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                  </span>
                </button>
                {open && (
                  <div className="p-2 space-y-1.5 bg-background">
                    {rows.map((s) => <SermonRow key={s.id} sermon={s} onSaved={fetchItems} onDeleted={fetchItems} />)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Give Settings ──────────────────────────────────────────────────────────────

function GiveSettingsTab() {
  const [settings, setSettings] = useState<GiveSettings>({ gcash_name: "", gcash_number: "", phone: "", qr_code_url: "" });
  const [uploading, setUploading] = useState(false);
  const { toast, notify } = useToast();

  useEffect(() => {
    supabase.from("give_settings").select("*").eq("id", "main").single().then(({ data }) => {
      if (data) setSettings(data as GiveSettings);
    });
  }, []);

  const save = async () => {
    const { error } = await supabase.from("give_settings").upsert({ id: "main", ...settings });
    if (error) return notify("Failed to save.", "error");
    notify("Give settings saved.");
  };

  const uploadQR = async (file: File) => {
    setUploading(true);
    try {
      // Fixed path so re-uploads overwrite the same file instead of piling up orphans.
      const path = "qr/gcash-qr";
      const { error } = await supabase.storage.from("uploads").upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("uploads").getPublicUrl(path);
      const bustedUrl = `${publicUrl}?v=${Date.now()}`; // bust CDN/browser cache so the new image shows immediately
      const nextSettings = { ...settings, qr_code_url: bustedUrl };
      setSettings(nextSettings);
      const { error: saveError } = await supabase.from("give_settings").upsert({ id: "main", ...nextSettings });
      if (saveError) throw saveError;
      notify("QR Code uploaded and saved.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      notify(`Upload failed: ${msg}`, "error");
    } finally { setUploading(false); }
  };

  const deleteQR = async () => {
    if (!confirm("Remove the QR code image?")) return;
    await supabase.storage.from("uploads").remove(["qr/gcash-qr"]);
    const nextSettings = { ...settings, qr_code_url: "" };
    setSettings(nextSettings);
    const { error } = await supabase.from("give_settings").upsert({ id: "main", ...nextSettings });
    if (error) return notify("Failed to remove.", "error");
    notify("QR Code removed.");
  };

  return (
    <div className="space-y-5">
      {toast && <Toast {...toast} />}
      <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground">Give / Tithe Settings</h3>

      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <p className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground font-bold">GCash Info</p>
        <Field label="GCash Account Name" value={settings.gcash_name} onChange={(v) => setSettings((s) => ({ ...s, gcash_name: v }))} placeholder="Malingin SDA Church" />
        <Field label="GCash Number" value={settings.gcash_number} onChange={(v) => setSettings((s) => ({ ...s, gcash_number: v }))} placeholder="09XX XXX XXXX" />
        <Field label="Phone Number (optional)" value={settings.phone} onChange={(v) => setSettings((s) => ({ ...s, phone: v }))} placeholder="09XX XXX XXXX" />
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <p className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground font-bold">QR Code</p>
        <Field label="QR Code Image URL (paste from Imgur / Google Drive / etc.)" value={settings.qr_code_url} onChange={(v) => setSettings((s) => ({ ...s, qr_code_url: v }))} placeholder="https://..." />
        <div className="flex items-center gap-3">
          <span className="font-[Lato] text-xs text-muted-foreground">or upload from device:</span>
          <label className={`flex items-center gap-2 cursor-pointer bg-secondary border border-border px-4 py-2 rounded-full font-[Lato] text-xs font-bold hover:bg-border transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            <Upload size={13} />{uploading ? "Uploading…" : "Upload Image"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadQR(e.target.files[0])} />
          </label>
        </div>
        {settings.qr_code_url && (
          <div className="flex items-center gap-3">
            <img src={settings.qr_code_url} alt="GCash QR" className="w-32 h-32 object-contain border border-border rounded-xl" />
            <button onClick={deleteQR} className="flex items-center gap-1.5 bg-secondary border border-border font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:bg-red-50 hover:text-red-600">
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}
      </div>

      <button onClick={save} className="flex items-center gap-2 bg-primary text-white font-[Lato] text-sm font-bold px-6 py-3 rounded-full hover:opacity-90">
        <Save size={15} /> Save Settings
      </button>
    </div>
  );
}

// ── Transactions ───────────────────────────────────────────────────────────────

const blank_tx = { donor_name: "", donor_email: "", amount: 0, type: "Tithe", description: "", date: "", note: "" };

function TransactionsTab({ prefill, onConsumePrefill }: { prefill: Omit<Transaction, "id"> | null; onConsumePrefill: () => void }) {
  const [items, setItems] = useState<Transaction[]>([]);
  const [form, setForm] = useState<Omit<Transaction, "id">>(blank_tx);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast, notify } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from("transactions").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { fetchItems(); }, []);

  useEffect(() => {
    if (!prefill) return;
    setForm(prefill); setEditing(null); setShowForm(true);
    onConsumePrefill();
  }, [prefill, onConsumePrefill]);

  const resetForm = () => { setForm(blank_tx); setEditing(null); setShowForm(false); };

  const save = async () => {
    const email = form.donor_email.trim();
    if (!form.donor_name.trim() || !form.amount) return notify("Name and amount are required.", "error");
    if (!email) return notify("Donor email is required — it's how the member sees this in their own Give page.", "error");

    setSaving(true);
    const { data: profile, error: lookupError } = await supabase.from("member_profiles").select("id").ilike("email", email).maybeSingle();
    if (lookupError) {
      setSaving(false);
      return notify(`Couldn't verify that email (${lookupError.message}). Has the latest supabase-setup.sql been run?`, "error");
    }
    if (!profile) {
      setSaving(false);
      return notify("No registered account matches that email. Ask them to sign up on the Give page first.", "error");
    }

    const payload = { ...form, donor_email: email, amount: Number(form.amount) };
    const { error } = editing
      ? await supabase.from("transactions").update(payload).eq("id", editing)
      : await supabase.from("transactions").insert(payload);
    setSaving(false);
    if (error) return notify("Failed to save.", "error");
    notify(editing ? "Transaction updated." : "Transaction logged.");
    resetForm(); fetchItems();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this transaction?")) return;
    await supabase.from("transactions").delete().eq("id", id);
    notify("Deleted."); fetchItems();
  };

  const startEdit = (t: Transaction) => {
    setForm({ donor_name: t.donor_name, donor_email: t.donor_email, amount: t.amount, type: t.type, description: t.description, date: t.date, note: t.note });
    setEditing(t.id); setShowForm(true);
  };

  const total = items.reduce((s, t) => s + (Number(t.amount) || 0), 0);

  return (
    <div className="space-y-4">
      {toast && <Toast {...toast} />}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground">Transactions</h3>
          <p className="font-[Lato] text-xs text-muted-foreground">Total recorded: <strong className="text-foreground">₱{total.toLocaleString()}</strong></p>
        </div>
        <button onClick={() => { setShowForm((s) => !s); setEditing(null); setForm(blank_tx); }}
          className="flex items-center gap-1.5 bg-primary text-white font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:opacity-90">
          <Plus size={13} /> Log
        </button>
      </div>

      {showForm && (
        <div className="bg-secondary/60 border border-border rounded-2xl p-5 space-y-3">
          <p className="font-[Lato] text-xs font-bold uppercase tracking-widest text-muted-foreground">{editing ? "Edit" : "New"} Transaction</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Donor Name" value={form.donor_name} onChange={(v) => setForm({ ...form, donor_name: v })} placeholder="Full name" />
            <Field label="Donor Email" value={form.donor_email} onChange={(v) => setForm({ ...form, donor_email: v })} type="email" placeholder="email@gmail.com" />
          </div>
          <p className="font-[Lato] text-[11px] text-muted-foreground -mt-1.5">
            Required — must be the exact email of an existing Give page account. This entry will only ever appear in that member's own transaction log, never anyone else's. Checked on save.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount (₱)" value={String(form.amount || "")} onChange={(v) => setForm({ ...form, amount: parseFloat(v) || 0 })} type="number" placeholder="0.00" />
            <div>
              <label className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm bg-background focus:outline-none focus:border-primary">
                {GIVING_PURPOSES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} placeholder="July 5, 2026" />
            <Field label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} placeholder="Sabbath tithe…" />
          </div>
          <Field label="Note (optional)" value={form.note} onChange={(v) => setForm({ ...form, note: v })} placeholder="Any additional note" />
          <div className="flex gap-2 pt-1">
            <button onClick={save} disabled={saving} className="flex items-center gap-1.5 bg-primary text-white font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 disabled:opacity-50">
              <Save size={13} /> {saving ? "Checking…" : "Save"}
            </button>
            <button onClick={resetForm} className="font-[Lato] text-xs text-muted-foreground px-4 py-2 rounded-full hover:bg-border transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-center font-[Lato] text-sm text-muted-foreground py-12">No transactions logged yet.</p>
      ) : items.map((t) => (
        <div key={t.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="shrink-0 text-right w-20">
            <p className="font-[Playfair_Display] text-base font-bold text-primary">₱{Number(t.amount).toLocaleString()}</p>
            <p className="font-[Lato] text-[9px] text-muted-foreground uppercase tracking-widest">{t.type}</p>
          </div>
          <div className="flex-1 min-w-0 border-l border-border pl-3">
            <p className="font-[Playfair_Display] text-sm font-semibold text-foreground leading-tight">{t.donor_name}</p>
            <p className="font-[Lato] text-xs text-muted-foreground">{t.date}{t.description ? ` · ${t.description}` : ""}</p>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button onClick={() => startEdit(t)} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-blue-50 hover:text-blue-600"><Pencil size={13} /></button>
            <button onClick={() => del(t.id)} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-red-50 hover:text-red-600"><Trash2 size={13} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Giving Submissions (member self-reported) ───────────────────────────────────

function SubmissionsTab({ onConvert, onChange }: { onConvert: (payload: Omit<Transaction, "id">) => void; onChange: () => void }) {
  const [items, setItems] = useState<GivingSubmission[]>([]);
  const { toast, notify } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from("giving_submissions").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { fetchItems(); }, []);

  const markReviewed = async (id: string) => {
    await supabase.from("giving_submissions").update({ status: "Reviewed" }).eq("id", id);
    fetchItems(); onChange();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    await supabase.from("giving_submissions").delete().eq("id", id);
    notify("Deleted."); fetchItems(); onChange();
  };

  const convert = (s: GivingSubmission) => {
    onConvert({
      donor_name: s.user_name || s.user_email, donor_email: s.user_email, amount: s.amount,
      type: s.purpose, description: s.note ?? "", date: "", note: "",
    });
    markReviewed(s.id);
  };

  return (
    <div className="space-y-4">
      {toast && <Toast {...toast} />}
      <div>
        <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground">Giving Submissions</h3>
        <p className="font-[Lato] text-xs text-muted-foreground leading-relaxed">
          Members declare what they gave and what it was for after sending payment. Review each one and log it as an official transaction once you've confirmed receipt.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-center font-[Lato] text-sm text-muted-foreground py-12">No submissions yet.</p>
      ) : items.map((s) => (
        <div key={s.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="shrink-0 text-right w-20">
            <p className="font-[Playfair_Display] text-base font-bold text-primary">₱{Number(s.amount).toLocaleString()}</p>
            <p className="font-[Lato] text-[9px] text-muted-foreground uppercase tracking-widest">{s.purpose}</p>
          </div>
          <div className="flex-1 min-w-0 border-l border-border pl-3">
            <p className="font-[Playfair_Display] text-sm font-semibold text-foreground leading-tight">{s.user_name || s.user_email}</p>
            <p className="font-[Lato] text-xs text-muted-foreground">{s.user_email} · {new Date(s.created_at).toLocaleDateString()}{s.note ? ` · ${s.note}` : ""}</p>
          </div>
          <Badge label={s.status} color={s.status === "Reviewed" ? "green" : "amber"} />
          <div className="flex gap-1.5 shrink-0">
            <button onClick={() => convert(s)} title="Log as transaction" className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-blue-50 hover:text-blue-600"><ArrowRightCircle size={13} /></button>
            <button onClick={() => del(s.id)} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-red-50 hover:text-red-600"><Trash2 size={13} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Inquiries ──────────────────────────────────────────────────────────────────

function InquiriesTab({ onChange }: { onChange: () => void }) {
  const [items, setItems] = useState<Inquiry[]>([]);
  const { toast, notify } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { fetchItems(); }, []);

  const setStatus = async (id: string, status: string) => {
    await supabase.from("inquiries").update({ status }).eq("id", id);
    fetchItems(); onChange();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    await supabase.from("inquiries").delete().eq("id", id);
    notify("Deleted."); fetchItems(); onChange();
  };

  return (
    <div className="space-y-4">
      {toast && <Toast {...toast} />}
      <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground">Church Inquiries</h3>

      {items.length === 0 ? (
        <p className="text-center font-[Lato] text-sm text-muted-foreground py-12">No inquiries yet.</p>
      ) : items.map((i) => (
        <div key={i.id} className="bg-card border border-border rounded-2xl p-4 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-[Playfair_Display] text-sm font-semibold text-foreground">{i.name}</p>
              <p className="font-[Lato] text-xs text-muted-foreground">
                {[i.phone, i.email, i.org].filter(Boolean).join(" · ") || "No contact details given"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge label={INQUIRY_LABELS[i.inquiry_type] ?? i.inquiry_type} color="blue" />
              <button onClick={() => del(i.id)} className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center hover:bg-red-50 hover:text-red-600"><Trash2 size={12} /></button>
            </div>
          </div>

          {(i.services?.length > 0 || i.events?.length > 0 || i.groups_wanted?.length > 0) && (
            <p className="font-[Lato] text-xs text-muted-foreground">
              {[...(i.services ?? []), ...(i.events ?? []), ...(i.groups_wanted ?? [])].join(", ")}
            </p>
          )}
          {i.outside_church && <p className="font-[Lato] text-xs text-muted-foreground">Outside Malingin Church</p>}
          {(i.event_date || i.event_location) && (
            <p className="font-[Lato] text-xs text-muted-foreground">{[i.event_date, i.event_location].filter(Boolean).join(" · ")}</p>
          )}
          {i.notes && <p className="font-[Lato] text-xs text-muted-foreground italic">"{i.notes}"</p>}

          <div className="flex items-center justify-between pt-1">
            <p className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest">{new Date(i.created_at).toLocaleDateString()}</p>
            <select
              value={i.status}
              onChange={(e) => setStatus(i.id, e.target.value)}
              className="border border-border rounded-lg px-2 py-1 font-[Lato] text-xs bg-background focus:outline-none focus:border-primary"
            >
              {INQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Prayer Requests ──────────────────────────────────────────────────────────────

function PrayerRequestsTab({ onChange }: { onChange: () => void }) {
  const [items, setItems] = useState<PrayerRequest[]>([]);
  const { toast, notify } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from("prayer_requests").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { fetchItems(); }, []);

  const setStatus = async (id: string, status: string) => {
    await supabase.from("prayer_requests").update({ status }).eq("id", id);
    fetchItems(); onChange();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this prayer request?")) return;
    await supabase.from("prayer_requests").delete().eq("id", id);
    notify("Deleted."); fetchItems(); onChange();
  };

  return (
    <div className="space-y-4">
      {toast && <Toast {...toast} />}
      <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground">Prayer Requests</h3>

      {items.length === 0 ? (
        <p className="text-center font-[Lato] text-sm text-muted-foreground py-12">No prayer requests yet.</p>
      ) : items.map((p) => (
        <div key={p.id} className="bg-card border border-border rounded-2xl p-4 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <p className="font-[Lato] text-sm text-foreground leading-relaxed flex-1">{p.request}</p>
            <button onClick={() => del(p.id)} className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center hover:bg-red-50 hover:text-red-600 shrink-0"><Trash2 size={12} /></button>
          </div>
          <p className="font-[Lato] text-xs text-muted-foreground">From: {p.from_name || "Anonymous"} · {p.visibility.replace("-", " ")}</p>
          <div className="flex items-center justify-between pt-1">
            <p className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest">{new Date(p.created_at).toLocaleDateString()}</p>
            <select
              value={p.status}
              onChange={(e) => setStatus(p.id, e.target.value)}
              className="border border-border rounded-lg px-2 py-1 font-[Lato] text-xs bg-background focus:outline-none focus:border-primary"
            >
              {PRAYER_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Manage Admins (super admin only) ───────────────────────────────────────────

function AdminsTab({ superAdminEmail }: { superAdminEmail: string }) {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const { toast, notify } = useToast();

  const fetchEmails = async () => {
    const { data } = await supabase.from("admin_emails").select("email");
    setEmails(data?.map((r) => r.email) ?? []);
  };
  useEffect(() => { fetchEmails(); }, []);

  const addAdmin = async () => {
    const email = newEmail.trim().toLowerCase();
    if (!email.includes("@")) return notify("Enter a valid email.", "error");
    if (emails.includes(email)) return notify("Already an admin.", "error");
    const { error } = await supabase.from("admin_emails").insert({ email });
    if (error) return notify("Failed to add.", "error");
    setNewEmail(""); notify(`${email} added. They can now register at /#admin.`); fetchEmails();
  };

  const removeAdmin = async (email: string) => {
    if (email === superAdminEmail) return notify("Cannot remove the super admin.", "error");
    if (!confirm(`Remove ${email}?`)) return;
    const { error } = await supabase.from("admin_emails").delete().eq("email", email);
    if (error) return notify("Failed.", "error");
    notify("Admin removed."); fetchEmails();
  };

  return (
    <div className="space-y-4">
      {toast && <Toast {...toast} />}
      <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground">Manage Admins</h3>
      <p className="font-[Lato] text-xs text-muted-foreground leading-relaxed">
        Add a person's email here first. Then share the <strong className="text-foreground">/#admin</strong> URL — they go to Register and use that exact email to create their password.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center gap-3">
        <Shield size={15} className="text-amber-600 shrink-0" />
        <div>
          <p className="font-[Lato] text-xs font-bold text-amber-800">Super Admin</p>
          <p className="font-[Lato] text-xs text-amber-700">{superAdminEmail}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addAdmin()} placeholder="newadmin@email.com"
          className="flex-1 border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm bg-background focus:outline-none focus:border-primary" />
        <button onClick={addAdmin} className="flex items-center gap-1.5 bg-primary text-white font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:opacity-90">
          <Plus size={13} /> Add
        </button>
      </div>

      {emails.filter((e) => e !== superAdminEmail).length === 0 ? (
        <p className="text-center font-[Lato] text-sm text-muted-foreground py-8">No additional admins yet.</p>
      ) : emails.filter((e) => e !== superAdminEmail).map((email) => (
        <div key={email} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center justify-between gap-3">
          <p className="font-[Lato] text-sm text-foreground">{email}</p>
          <button onClick={() => removeAdmin(email)} className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center hover:bg-red-50 hover:text-red-600">
            <Trash2 size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Tab config ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "events",        label: "Events",         icon: Calendar },
  { id: "sermons",       label: "Sermons",         icon: BookOpen },
  { id: "give",          label: "Give Settings",   icon: CreditCard },
  { id: "transactions",  label: "Transactions",    icon: Receipt },
  { id: "submissions",   label: "Giving Submissions", icon: Inbox },
  { id: "inquiries",     label: "Inquiries",       icon: Mail },
  { id: "prayers",       label: "Prayer Requests", icon: Heart },
  { id: "admins",        label: "Admins",          icon: Users },
];

// ── Main AdminPage ─────────────────────────────────────────────────────────────

export function AdminPage({ onBack }: Props) {
  const [user, setUser]                     = useState<User | null>(null);
  const [authLoading, setAuthLoading]       = useState(true);
  const [isAdmin, setIsAdmin]               = useState(false);
  const [isSuperAdmin, setIsSuperAdmin]     = useState(false);
  const [checkingAdmin, setCheckingAdmin]   = useState(false);
  const [activeTab, setActiveTab]           = useState("announcements");
  const [txPrefill, setTxPrefill]           = useState<Omit<Transaction, "id"> | null>(null);
  const [mobileTabOpen, setMobileTabOpen]   = useState(false);
  const [authMode, setAuthMode]             = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail]           = useState("");
  const [authPassword, setAuthPassword]     = useState("");
  const [authConfirm, setAuthConfirm]       = useState("");
  const [authError, setAuthError]           = useState("");
  const [authBusy, setAuthBusy]             = useState(false);
  const [pendingCounts, setPendingCounts]   = useState<Record<string, number>>({});

  const superAdminEmail = import.meta.env.VITE_SUPER_ADMIN_EMAIL ?? "";

  const refreshPendingCounts = useCallback(async () => {
    const [sub, inq, pr] = await Promise.all([
      supabase.from("giving_submissions").select("id", { count: "exact", head: true }).eq("status", "Pending"),
      supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "New"),
      supabase.from("prayer_requests").select("id", { count: "exact", head: true }).eq("status", "New"),
    ]);
    setPendingCounts({ submissions: sub.count ?? 0, inquiries: inq.count ?? 0, prayers: pr.count ?? 0 });
  }, []);

  const checkAdmin = useCallback(async (u: User) => {
    setCheckingAdmin(true);
    const isSA = u.email === superAdminEmail;
    if (isSA) {
      await supabase.from("admin_emails").upsert({ email: u.email }, { onConflict: "email" });
      setIsAdmin(true); setIsSuperAdmin(true);
    } else {
      const { data } = await supabase.from("admin_emails").select("email").eq("email", u.email ?? "").maybeSingle();
      if (data) { setIsAdmin(true); setIsSuperAdmin(false); }
      else {
        setIsAdmin(false);
        setAuthError("Your account is not authorized. Contact the website creator to get access.");
      }
    }
    setCheckingAdmin(false);
  }, [superAdminEmail]);

  useEffect(() => { if (isAdmin) refreshPendingCounts(); }, [isAdmin, refreshPendingCounts]);

  useEffect(() => {
    if (!isSupabaseReady) { setAuthLoading(false); return; }
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      setIsAdmin(false); setIsSuperAdmin(false); setAuthError("");
      if (u) await checkAdmin(u);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, [checkAdmin]);

  const signIn = async () => {
    setAuthBusy(true); setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email: authEmail.trim(), password: authPassword });
    if (error) setAuthError(error.message === "Invalid login credentials" ? "Wrong email or password." : error.message);
    setAuthBusy(false);
  };

  const register = async () => {
    setAuthError("");
    if (authPassword !== authConfirm) return setAuthError("Passwords do not match.");
    if (authPassword.length < 6) return setAuthError("Password must be at least 6 characters.");
    const trimmedEmail = authEmail.trim().toLowerCase();

    const isSA = trimmedEmail === superAdminEmail;
    if (!isSA) {
      const { data: allowed, error: checkError } = await supabase.rpc("is_authorized_admin_email", { check_email: trimmedEmail });
      if (checkError) return setAuthError(`Couldn't verify authorization: ${checkError.message}`);
      if (!allowed) return setAuthError("This email is not on the authorized list. Ask the website creator to add it first.");
    }

    setAuthBusy(true);
    const { error } = await supabase.auth.signUp({ email: trimmedEmail, password: authPassword });
    if (error) setAuthError(error.message);
    setAuthBusy(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null); setIsAdmin(false); setIsSuperAdmin(false); setAuthError("");
  };

  // ── Not configured ──────────────────────────────────────────────────────────

  if (!isSupabaseReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
        <div className="max-w-md w-full text-center">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Shield size={24} className="text-amber-600" />
          </div>
          <h2 className="font-[Playfair_Display] text-xl font-semibold text-foreground mb-3">Supabase not configured</h2>
          <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed mb-6">
            Fill in your Supabase credentials in <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">.env.local</code> to enable the admin panel.
          </p>
          <div className="bg-secondary rounded-2xl p-5 text-left space-y-2 mb-6">
            <p className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Setup Steps</p>
            {[
              "Go to supabase.com → create a free account → New project",
              "Copy Project URL and anon key (Project Settings → API)",
              "Run supabase-setup.sql in the SQL Editor",
              "Create a Storage bucket named 'uploads' (set to Public)",
              "Fill in .env.local with your URL, anon key, and your email",
              "Restart the dev server: npm run dev",
              "Open /#admin → Register tab → create your account",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="font-[Lato] text-[10px] font-bold text-primary bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <p className="font-[Lato] text-xs text-foreground">{step}</p>
              </div>
            ))}
          </div>
          <button onClick={onBack} className="flex items-center gap-2 font-[Lato] text-sm text-muted-foreground hover:text-foreground mx-auto">
            <ArrowLeft size={15} /> Back to site
          </button>
        </div>
      </div>
    );
  }

  // ── Loading ─────────────────────────────────────────────────────────────────

  if (authLoading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-[Lato] text-sm text-muted-foreground">Verifying access…</p>
        </div>
      </div>
    );
  }

  // ── Login / Register ────────────────────────────────────────────────────────

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
        <div className="max-w-sm w-full">
          <button onClick={onBack} className="flex items-center gap-1.5 font-[Lato] text-xs text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft size={14} /> Back to site
          </button>
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
            <Shield size={22} className="text-primary" />
          </div>
          <p className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Admin Access</p>
          <h1 className="font-[Playfair_Display] text-2xl font-semibold text-foreground mb-6">Malingin Church</h1>

          <div className="flex bg-secondary rounded-2xl p-1 mb-6">
            {(["login", "register"] as const).map((mode) => (
              <button key={mode} onClick={() => { setAuthMode(mode); setAuthError(""); }}
                className={`flex-1 py-2 rounded-xl font-[Lato] text-sm font-bold transition-all ${authMode === mode ? "bg-card shadow text-foreground" : "text-muted-foreground"}`}>
                {mode === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
              <X size={14} className="text-red-500 mt-0.5 shrink-0" />
              <p className="font-[Lato] text-xs text-red-700 leading-relaxed">{authError}</p>
            </div>
          )}

          <div className="space-y-3">
            <Field label="Email" value={authEmail} onChange={setAuthEmail} type="email" placeholder="your@email.com" />
            <Field label="Password" value={authPassword} onChange={setAuthPassword} type="password" placeholder="••••••••" />
            {authMode === "register" && (
              <Field label="Confirm Password" value={authConfirm} onChange={setAuthConfirm} type="password" placeholder="••••••••" />
            )}
          </div>

          <button onClick={authMode === "login" ? signIn : register} disabled={authBusy}
            className="mt-5 w-full py-3.5 rounded-2xl bg-primary text-white font-[Lato] font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50">
            {authBusy ? "Please wait…" : authMode === "login" ? "Sign In" : "Create Account"}
          </button>

          <p className="font-[Lato] text-[10px] text-muted-foreground text-center mt-6 leading-relaxed">
            {authMode === "login"
              ? "Only registered admins can access this panel."
              : "Your email must be authorized by the website creator first."}
          </p>
        </div>
      </div>
    );
  }

  // ── Not authorized ──────────────────────────────────────────────────────────

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
        <div className="max-w-sm w-full text-center">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Shield size={22} className="text-red-500" />
          </div>
          <h2 className="font-[Playfair_Display] text-xl font-semibold text-foreground mb-3">Not Authorized</h2>
          <p className="font-[Lato] text-sm text-muted-foreground mb-1">Signed in as:</p>
          <p className="font-[Lato] text-sm font-bold text-foreground mb-4">{user.email}</p>
          {authError && <p className="font-[Lato] text-xs text-red-600 mb-6 leading-relaxed">{authError}</p>}
          <div className="flex flex-col gap-2">
            <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 bg-secondary border border-border rounded-2xl py-3 font-[Lato] text-sm font-bold text-foreground hover:bg-border">
              <LogOut size={15} /> Sign out
            </button>
            <button onClick={onBack} className="flex items-center justify-center gap-1.5 font-[Lato] text-xs text-muted-foreground hover:text-foreground py-2">
              <ArrowLeft size={14} /> Back to site
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ───────────────────────────────────────────────────────────────

  const visibleTabs = isSuperAdmin ? TABS : TABS.filter((t) => t.id !== "admins");
  const activeTabData = visibleTabs.find((t) => t.id === activeTab) ?? visibleTabs[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary shrink-0">
          <ArrowLeft size={17} className="text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-[Playfair_Display] font-semibold text-sm text-foreground leading-tight">Admin Panel</p>
          <p className="font-[Lato] text-[10px] text-muted-foreground truncate">{user.email}</p>
        </div>
        {isSuperAdmin && <Badge label="Super Admin" color="violet" />}
        <button onClick={handleSignOut} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary shrink-0" title="Sign out">
          <LogOut size={16} className="text-muted-foreground" />
        </button>
      </div>

      <div className="flex min-h-[calc(100vh-57px)]">
        <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-border bg-secondary/30 p-3 gap-1">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const count = pendingCounts[tab.id] ?? 0;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left font-[Lato] text-sm transition-all ${activeTab === tab.id ? "bg-primary text-white font-bold" : "text-muted-foreground hover:bg-border hover:text-foreground"}`}>
                <Icon size={15} />
                <span className="flex-1">{tab.label}</span>
                {count > 0 && (
                  <span className={`min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${activeTab === tab.id ? "bg-white text-primary" : "bg-red-500 text-white"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        <main className="flex-1 min-w-0 px-4 md:px-8 py-6">
          <div className="md:hidden mb-5">
            <button onClick={() => setMobileTabOpen((o) => !o)}
              className="w-full flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3">
              <div className="flex items-center gap-2.5 font-[Lato] text-sm font-bold text-foreground">
                {(() => { const Icon = activeTabData.icon; return <Icon size={15} />; })()}
                {activeTabData.label}
                {(pendingCounts[activeTabData.id] ?? 0) > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center bg-red-500 text-white">
                    {pendingCounts[activeTabData.id]}
                  </span>
                )}
              </div>
              <ChevronDown size={15} className={`text-muted-foreground transition-transform ${mobileTabOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileTabOpen && (
              <div className="mt-1 bg-card border border-border rounded-xl overflow-hidden shadow-lg">
                {visibleTabs.map((tab) => {
                  const Icon = tab.icon;
                  const count = pendingCounts[tab.id] ?? 0;
                  return (
                    <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMobileTabOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-4 py-3 text-left font-[Lato] text-sm border-b border-border last:border-b-0 ${activeTab === tab.id ? "bg-primary/10 text-primary font-bold" : "text-foreground hover:bg-secondary"}`}>
                      <Icon size={14} />
                      <span className="flex-1">{tab.label}</span>
                      {count > 0 && (
                        <span className="min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center bg-red-500 text-white">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {activeTab === "announcements" && <AnnouncementsTab />}
          {activeTab === "events"        && <EventsTab />}
          {activeTab === "sermons"       && <SermonsTab />}
          {activeTab === "give"          && <GiveSettingsTab />}
          {activeTab === "transactions"  && <TransactionsTab prefill={txPrefill} onConsumePrefill={() => setTxPrefill(null)} />}
          {activeTab === "submissions"   && <SubmissionsTab onConvert={(payload) => { setTxPrefill(payload); setActiveTab("transactions"); }} onChange={refreshPendingCounts} />}
          {activeTab === "inquiries"     && <InquiriesTab onChange={refreshPendingCounts} />}
          {activeTab === "prayers"       && <PrayerRequestsTab onChange={refreshPendingCounts} />}
          {activeTab === "admins" && isSuperAdmin && <AdminsTab superAdminEmail={superAdminEmail} />}
        </main>
      </div>
    </div>
  );
}
