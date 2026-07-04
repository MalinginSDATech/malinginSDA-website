import { useState, useEffect, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ArrowLeft, LogOut, Plus, Pencil, Trash2, Save, Shield, Upload,
  Megaphone, Calendar, BookOpen, CreditCard, Receipt, Users,
  Eye, EyeOff, ChevronDown, Check, X,
} from "lucide-react";
import { supabase, isSupabaseReady } from "../../supabase";

interface Props { onBack: () => void }

// ── Types ──────────────────────────────────────────────────────────────────────

interface Announcement { id: string; title: string; body: string; active: boolean; created_at: string }
interface ChurchEvent   { id: string; title: string; tag: string; day: string; month: string; year: string; location: string; description: string; active: boolean }
interface Sermon        { id: string; title: string; speaker: string; date: string; series: string; video_url: string; excerpt: string; active: boolean }
interface GiveSettings  { gcash_name: string; gcash_number: string; phone: string; qr_code_url: string }
interface Transaction   { id: string; donor_name: string; donor_email: string; amount: number; type: string; description: string; date: string; note: string }

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

const EVENT_TAGS = ["Youth", "Church", "Outreach", "Worship", "District", "Conference"];
const blank_event = { title: "", tag: "Church", day: "", month: "", year: "", location: "", description: "", active: true };

function EventsTab() {
  const [items, setItems] = useState<ChurchEvent[]>([]);
  const [form, setForm] = useState(blank_event);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast, notify } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => { setForm(blank_event); setEditing(null); setShowForm(false); };

  const save = async () => {
    if (!form.title.trim() || !form.day || !form.month) return notify("Title and date are required.", "error");
    const { error } = editing
      ? await supabase.from("events").update(form).eq("id", editing)
      : await supabase.from("events").insert(form);
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
    setForm({ title: e.title, tag: e.tag, day: e.day, month: e.month, year: e.year, location: e.location, description: e.description, active: e.active });
    setEditing(e.id); setShowForm(true);
  };

  return (
    <div className="space-y-4">
      {toast && <Toast {...toast} />}
      <div className="flex items-center justify-between">
        <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground">Events</h3>
        <button onClick={() => { setShowForm((s) => !s); setEditing(null); setForm(blank_event); }}
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

const blank_sermon = { title: "", speaker: "", date: "", series: "Pag-uswag (2026)", video_url: "", excerpt: "", active: true };

function SermonsTab() {
  const [items, setItems] = useState<Sermon[]>([]);
  const [form, setForm] = useState(blank_sermon);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast, notify } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from("sermons").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => { setForm(blank_sermon); setEditing(null); setShowForm(false); };

  const save = async () => {
    if (!form.title.trim() || !form.speaker.trim()) return notify("Title and speaker are required.", "error");
    const { error } = editing
      ? await supabase.from("sermons").update(form).eq("id", editing)
      : await supabase.from("sermons").insert(form);
    if (error) return notify("Failed to save.", "error");
    notify(editing ? "Sermon updated." : "Sermon added.");
    resetForm(); fetchItems();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this sermon?")) return;
    await supabase.from("sermons").delete().eq("id", id);
    notify("Deleted."); fetchItems();
  };

  const startEdit = (s: Sermon) => {
    setForm({ title: s.title, speaker: s.speaker, date: s.date, series: s.series, video_url: s.video_url, excerpt: s.excerpt, active: s.active });
    setEditing(s.id); setShowForm(true);
  };

  return (
    <div className="space-y-4">
      {toast && <Toast {...toast} />}
      <div className="flex items-center justify-between">
        <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground">Sermons</h3>
        <button onClick={() => { setShowForm((s) => !s); setEditing(null); setForm(blank_sermon); }}
          className="flex items-center gap-1.5 bg-primary text-white font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:opacity-90">
          <Plus size={13} /> New
        </button>
      </div>

      {showForm && (
        <div className="bg-secondary/60 border border-border rounded-2xl p-5 space-y-3">
          <p className="font-[Lato] text-xs font-bold uppercase tracking-widest text-muted-foreground">{editing ? "Edit" : "New"} Sermon</p>
          <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <Field label="Speaker" value={form.speaker} onChange={(v) => setForm({ ...form, speaker: v })} placeholder="Pastor Ur Caro" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} placeholder="July 5, 2026" />
            <Field label="Series" value={form.series} onChange={(v) => setForm({ ...form, series: v })} placeholder="Pag-uswag (2026)" />
          </div>
          <Field label="Video URL (YouTube / Facebook / Drive)" value={form.video_url} onChange={(v) => setForm({ ...form, video_url: v })} placeholder="https://youtu.be/..." />
          <Textarea label="Excerpt / Summary" value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} placeholder="Brief description..." />
          <Toggle checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label="Publish" />
          <div className="flex gap-2 pt-1">
            <button onClick={save} className="flex items-center gap-1.5 bg-primary text-white font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:opacity-90"><Save size={13} /> Save</button>
            <button onClick={resetForm} className="font-[Lato] text-xs text-muted-foreground px-4 py-2 rounded-full hover:bg-border transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-center font-[Lato] text-sm text-muted-foreground py-12">No sermons yet.</p>
      ) : items.map((s) => (
        <div key={s.id} className="bg-card border border-border rounded-2xl p-4 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge label={s.series} color="violet" />{!s.active && <Badge label="Hidden" color="red" />}
            </div>
            <p className="font-[Playfair_Display] text-sm font-semibold text-foreground">{s.title}</p>
            <p className="font-[Lato] text-xs text-muted-foreground mt-0.5">{s.date} · {s.speaker}</p>
            {s.video_url && <p className="font-[Lato] text-[10px] text-primary mt-1 truncate">{s.video_url}</p>}
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button onClick={() => startEdit(s)} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-blue-50 hover:text-blue-600"><Pencil size={13} /></button>
            <button onClick={() => del(s.id)} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-red-50 hover:text-red-600"><Trash2 size={13} /></button>
          </div>
        </div>
      ))}
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
      const path = `qr/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from("uploads").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("uploads").getPublicUrl(path);
      setSettings((s) => ({ ...s, qr_code_url: publicUrl }));
      notify("QR Code uploaded.");
    } catch { notify("Upload failed. Paste a URL manually instead.", "error"); }
    finally { setUploading(false); }
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
          <img src={settings.qr_code_url} alt="GCash QR" className="w-32 h-32 object-contain border border-border rounded-xl" />
        )}
      </div>

      <button onClick={save} className="flex items-center gap-2 bg-primary text-white font-[Lato] text-sm font-bold px-6 py-3 rounded-full hover:opacity-90">
        <Save size={15} /> Save Settings
      </button>
    </div>
  );
}

// ── Transactions ───────────────────────────────────────────────────────────────

const TX_TYPES = ["Tithe", "Offering", "Donation", "Building Fund", "Welfare", "Other"];
const blank_tx = { donor_name: "", donor_email: "", amount: 0, type: "Tithe", description: "", date: "", note: "" };

function TransactionsTab() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [form, setForm] = useState<Omit<Transaction, "id">>(blank_tx);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast, notify } = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from("transactions").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => { setForm(blank_tx); setEditing(null); setShowForm(false); };

  const save = async () => {
    if (!form.donor_name.trim() || !form.amount) return notify("Name and amount are required.", "error");
    const payload = { ...form, amount: Number(form.amount) };
    const { error } = editing
      ? await supabase.from("transactions").update(payload).eq("id", editing)
      : await supabase.from("transactions").insert(payload);
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
            <Field label="Donor Email (optional)" value={form.donor_email} onChange={(v) => setForm({ ...form, donor_email: v })} type="email" placeholder="email@gmail.com" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount (₱)" value={String(form.amount || "")} onChange={(v) => setForm({ ...form, amount: parseFloat(v) || 0 })} type="number" placeholder="0.00" />
            <div>
              <label className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm bg-background focus:outline-none focus:border-primary">
                {TX_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} placeholder="July 5, 2026" />
            <Field label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} placeholder="Sabbath tithe…" />
          </div>
          <Field label="Note (optional)" value={form.note} onChange={(v) => setForm({ ...form, note: v })} placeholder="Any additional note" />
          <div className="flex gap-2 pt-1">
            <button onClick={save} className="flex items-center gap-1.5 bg-primary text-white font-[Lato] text-xs font-bold px-4 py-2 rounded-full hover:opacity-90"><Save size={13} /> Save</button>
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
  const [mobileTabOpen, setMobileTabOpen]   = useState(false);
  const [authMode, setAuthMode]             = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail]           = useState("");
  const [authPassword, setAuthPassword]     = useState("");
  const [authConfirm, setAuthConfirm]       = useState("");
  const [authError, setAuthError]           = useState("");
  const [authBusy, setAuthBusy]             = useState(false);

  const superAdminEmail = import.meta.env.VITE_SUPER_ADMIN_EMAIL ?? "";

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
      const { data } = await supabase.from("admin_emails").select("email").eq("email", trimmedEmail).maybeSingle();
      if (!data) return setAuthError("This email is not on the authorized list. Ask the website creator to add it first.");
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
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left font-[Lato] text-sm transition-all ${activeTab === tab.id ? "bg-primary text-white font-bold" : "text-muted-foreground hover:bg-border hover:text-foreground"}`}>
                <Icon size={15} />{tab.label}
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
              </div>
              <ChevronDown size={15} className={`text-muted-foreground transition-transform ${mobileTabOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileTabOpen && (
              <div className="mt-1 bg-card border border-border rounded-xl overflow-hidden shadow-lg">
                {visibleTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMobileTabOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-4 py-3 text-left font-[Lato] text-sm border-b border-border last:border-b-0 ${activeTab === tab.id ? "bg-primary/10 text-primary font-bold" : "text-foreground hover:bg-secondary"}`}>
                      <Icon size={14} />{tab.label}
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
          {activeTab === "transactions"  && <TransactionsTab />}
          {activeTab === "admins" && isSuperAdmin && <AdminsTab superAdminEmail={superAdminEmail} />}
        </main>
      </div>
    </div>
  );
}
