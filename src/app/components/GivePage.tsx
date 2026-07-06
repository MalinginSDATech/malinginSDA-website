import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { ArrowLeft, QrCode, Phone, MessageCircle, AlertCircle, Send, Check, Shield } from "lucide-react";
import { supabaseMember as supabase, isSupabaseReady } from "../../supabase";
import { GIVING_PURPOSES, DEPARTMENTS } from "../../constants";
import { MemberLogin } from "./MemberLogin";

interface Props {
  onBack: () => void;
  onGoToAdmin: () => void;
}

interface Transaction { id: string; donor_name: string; donor_email: string; amount: number; type: string; description: string; date: string; note: string }
interface GivingSubmission { id: string; purpose: string; amount: number; note: string; status: string; created_at: string }
interface GiveSettings { gcash_name: string; gcash_number: string; phone: string; qr_code_url: string }

function DeclareGivingForm({ user, onSubmitted }: { user: User; onSubmitted: () => void }) {
  const [purpose, setPurpose] = useState(GIVING_PURPOSES[0]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [recipientName, setRecipientName] = useState("");
  const [eventName, setEventName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const changePurpose = (p: string) => {
    setPurpose(p);
    setDepartment(DEPARTMENTS[0]); setRecipientName(""); setEventName("");
  };

  const submit = async () => {
    setError("");
    const value = parseFloat(amount);
    if (!value || value <= 0) return setError("Enter the amount you sent.");
    if (purpose === "Benevolence (Someone in Need)" && !recipientName.trim()) return setError("Enter the name of who this is for.");

    let combinedNote = note.trim();
    if (purpose === "Department Fund") combinedNote = `Department: ${department}${combinedNote ? " · " + combinedNote : ""}`;
    if (purpose === "Benevolence (Someone in Need)") combinedNote = `For: ${recipientName.trim()}${combinedNote ? " · " + combinedNote : ""}`;
    if (purpose === "Event" && eventName.trim()) combinedNote = `Event: ${eventName.trim()}${combinedNote ? " · " + combinedNote : ""}`;

    setBusy(true);
    const { error } = await supabase.from("giving_submissions").insert({
      user_email: user.email, user_name: user.user_metadata?.full_name || user.email, purpose, amount: value, note: combinedNote,
    });
    setBusy(false);
    if (error) return setError("Failed to submit. Please try again.");
    setAmount(""); setNote(""); setRecipientName(""); setEventName(""); setDone(true);
    setTimeout(() => setDone(false), 3000);
    onSubmitted();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-4 space-y-3">
      <h3 className="font-[Playfair_Display] text-base font-semibold text-foreground">Declare Your Giving</h3>
      <p className="font-[Lato] text-xs text-muted-foreground leading-relaxed">
        After sending your tithe or offering, let the treasurer know what it was for and how much you sent.
      </p>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 -my-1">
          <AlertCircle size={13} className="text-red-600 shrink-0 mt-0.5" />
          <p className="font-[Lato] text-xs text-red-700">{error}</p>
        </div>
      )}
      {done && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2 -my-1">
          <Check size={13} className="text-green-600 shrink-0" />
          <p className="font-[Lato] text-xs text-green-700">Submitted — the treasurer will review it.</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Purpose</label>
          <select
            value={purpose}
            onChange={(e) => changePurpose(e.target.value)}
            className="w-full border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm bg-background focus:outline-none focus:border-primary"
          >
            {GIVING_PURPOSES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Amount (₱)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm bg-background focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {purpose === "Department Fund" && (
        <div>
          <label className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Which department?</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm bg-background focus:outline-none focus:border-primary"
          >
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
      )}

      {purpose === "Benevolence (Someone in Need)" && (
        <div>
          <label className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Who is this for?</label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Full name"
            className="w-full border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm bg-background focus:outline-none focus:border-primary"
          />
        </div>
      )}

      {purpose === "Event" && (
        <div>
          <label className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Which event? (optional)</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g. Youth Camp 2026"
            className="w-full border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm bg-background focus:outline-none focus:border-primary"
          />
        </div>
      )}

      <div>
        <label className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Note (optional)</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Any other details"
          className="w-full border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm bg-background focus:outline-none focus:border-primary"
        />
      </div>

      <button
        onClick={submit}
        disabled={busy}
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-[Lato] font-bold text-xs py-3 rounded-full hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
      >
        <Send size={13} /> {busy ? "Submitting…" : "Submit Declaration"}
      </button>
    </div>
  );
}

function GiveScreen({ user }: { user: User }) {
  const [items, setItems] = useState<Transaction[]>([]);
  const [submissions, setSubmissions] = useState<GivingSubmission[]>([]);
  const [giveSettings, setGiveSettings] = useState<GiveSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = () => {
    supabase
      .from("giving_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setSubmissions(data ?? []));
  };

  useEffect(() => {
    supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const own = (data ?? []).filter((t) => t.donor_email?.toLowerCase() === user.email?.toLowerCase());
        setItems(own);
        setLoading(false);
      });
    supabase.from("give_settings").select("*").eq("id", "main").maybeSingle()
      .then(({ data }) => setGiveSettings(data));
    fetchSubmissions();
  }, [user.id]);

  const total = items.reduce((s, t) => s + (Number(t.amount) || 0), 0);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-6 pb-10">
      <p className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Malingin SDA Church</p>
      <h2 className="font-[Playfair_Display] text-2xl font-semibold text-foreground mb-6">Give & Tithe</h2>

      {/* GCash QR */}
      <div className="bg-card border border-border rounded-xl p-5 mb-4 text-center">
        <p className="font-[Lato] text-xs text-muted-foreground uppercase tracking-widest mb-3">GCash QR Code</p>
        {giveSettings?.qr_code_url ? (
          <img src={giveSettings.qr_code_url} alt="GCash QR Code" className="w-44 h-44 object-contain rounded-xl mx-auto mb-3" />
        ) : (
          <div className="w-44 h-44 bg-secondary border-2 border-dashed border-border rounded-xl mx-auto flex flex-col items-center justify-center gap-2 mb-3">
            <QrCode size={36} className="text-muted-foreground/40" />
            <p className="font-[Lato] text-xs text-muted-foreground italic">QR Code to be posted</p>
          </div>
        )}
        {giveSettings?.gcash_name && (
          <p className="font-[Lato] text-sm font-bold text-foreground mb-1">{giveSettings.gcash_name}</p>
        )}
        {giveSettings?.gcash_number && (
          <p className="font-[Lato] text-sm text-muted-foreground mb-2">{giveSettings.gcash_number}</p>
        )}
        <p className="font-[Lato] text-xs text-muted-foreground leading-relaxed">
          Scan using your GCash app to send your tithe or offering directly to the church.
        </p>
      </div>

      <DeclareGivingForm user={user} onSubmitted={fetchSubmissions} />

      {submissions.length > 0 && (
        <div className="mb-6">
          <h3 className="font-[Playfair_Display] text-base font-semibold text-foreground mb-2">Your Declarations</h3>
          <div className="space-y-2">
            {submissions.map((s) => (
              <div key={s.id} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
                <div className="shrink-0 text-right w-20">
                  <p className="font-[Playfair_Display] text-sm font-bold text-primary">₱{Number(s.amount).toLocaleString()}</p>
                  <p className="font-[Lato] text-[9px] text-muted-foreground uppercase tracking-widest">{s.purpose}</p>
                </div>
                <div className="flex-1 min-w-0 border-l border-border pl-3">
                  <p className="font-[Lato] text-xs text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString()}{s.note ? ` · ${s.note}` : ""}
                  </p>
                </div>
                <span className={`text-[9px] font-[Lato] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${s.status === "Reviewed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Treasurer contact */}
      <div className="space-y-3 mb-6">
        <h3 className="font-[Playfair_Display] text-base font-semibold text-foreground">Contact Treasurer</h3>
        <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <Phone size={15} className="text-primary" />
          </div>
          <div>
            <p className="font-[Lato] text-xs text-muted-foreground">Phone / GCash</p>
            <p className={`font-[Lato] text-sm ${giveSettings?.phone ? "text-foreground font-bold" : "text-muted-foreground italic"}`}>
              {giveSettings?.phone || "To be announced"}
            </p>
          </div>
        </div>
        <a
          href="https://www.facebook.com/malingin.church"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:bg-secondary transition-colors"
        >
          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <MessageCircle size={15} className="text-primary" />
          </div>
          <div>
            <p className="font-[Lato] text-xs text-muted-foreground">Message on Facebook</p>
            <p className="font-[Lato] text-sm font-bold text-foreground">Malingin SDA Church</p>
          </div>
        </a>
      </div>

      {/* Transaction log */}
      <div className="bg-secondary border border-border rounded-xl p-4 mb-4">
        <p className="font-[Lato] text-xs font-bold text-foreground mb-1">Your Transaction Log</p>
        <p className="font-[Lato] text-xs text-muted-foreground leading-relaxed">
          Your giving records are logged and verified by the church treasurer under <strong className="text-foreground">{user.email}</strong>.
          {items.length > 0 && <> Total recorded: <strong className="text-foreground">₱{total.toLocaleString()}</strong></>}
        </p>
      </div>

      {loading ? (
        <p className="text-center font-[Lato] text-sm text-muted-foreground py-10">Loading…</p>
      ) : items.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-xl py-10 flex flex-col items-center gap-2">
          <QrCode size={24} className="text-muted-foreground/30" />
          <p className="font-[Lato] text-sm text-muted-foreground">No transactions recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <div key={t.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className="shrink-0 text-right w-20">
                <p className="font-[Playfair_Display] text-base font-bold text-primary">₱{Number(t.amount).toLocaleString()}</p>
                <p className="font-[Lato] text-[9px] text-muted-foreground uppercase tracking-widest">{t.type}</p>
              </div>
              <div className="flex-1 min-w-0 border-l border-border pl-3">
                <p className="font-[Lato] text-xs text-muted-foreground">{t.date}{t.description ? ` · ${t.description}` : ""}</p>
                {t.note && <p className="font-[Lato] text-xs text-muted-foreground/70 italic mt-0.5">{t.note}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function GivePage({ onBack, onGoToAdmin }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    if (!isSupabaseReady) { setChecking(false); return; }
    supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setChecking(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.email) { setIsAdminUser(false); return; }
    supabase.from("admin_emails").select("email").ilike("email", user.email).maybeSingle()
      .then(({ data }) => setIsAdminUser(!!data));
  }, [user?.email]);

  return (
    <div className="min-h-full flex flex-col">
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-border flex items-center gap-3 px-5 py-3">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
        >
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div>
          <p className="font-[Playfair_Display] font-semibold text-sm text-foreground">Give / Tithe</p>
          <p className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest">
            {user ? "Signed In" : "Sign in to continue"}
          </p>
        </div>
        {user && (
          <div className="ml-auto flex flex-col items-end gap-1">
            <div className="flex items-center gap-3">
              {isAdminUser && (
                <button
                  onClick={onGoToAdmin}
                  className="flex items-center gap-1 font-[Lato] text-xs font-bold text-primary hover:opacity-80"
                >
                  <Shield size={12} /> Go to Admin Page
                </button>
              )}
              <button
                onClick={() => supabase.auth.signOut()}
                className="font-[Lato] text-xs text-muted-foreground hover:text-foreground"
              >
                Sign Out
              </button>
            </div>
            <p className="font-[Lato] text-xs font-bold text-foreground">
              {user.user_metadata?.full_name || user.email}
            </p>
          </div>
        )}
      </div>

      {checking ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="font-[Lato] text-sm text-muted-foreground">Loading…</p>
        </div>
      ) : user ? (
        <GiveScreen user={user} />
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-8 pb-10">
          <p className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Secure Access</p>
          <h2 className="font-[Playfair_Display] text-2xl font-semibold text-foreground mb-1">Give & Tithe</h2>
          <p className="font-[Lato] text-sm text-muted-foreground mb-8 leading-relaxed">
            Sign in to view your giving history and transaction records managed by the church treasurer.
          </p>
          <MemberLogin
            onAuthed={setUser}
            helperText="Your transaction log is matched by the email address on this account — it will only show entries the treasurer has logged under this exact email."
          />
        </div>
      )}
    </div>
  );
}
