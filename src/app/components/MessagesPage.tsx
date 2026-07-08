import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { ArrowLeft, Send, AlertCircle, MessageSquare, Heart, Mail, Receipt, Check } from "lucide-react";
import { supabaseMember as supabase, isSupabaseReady } from "../../supabase";
import { MemberLogin } from "./MemberLogin";

interface Props {
  onBack: () => void;
}

type ReplyKind = "message" | "prayer" | "inquiry" | "giving";

interface ReplyItem {
  id: string;
  kind: ReplyKind;
  title: string;
  body: string;
  status: string;
  admin_reply: string | null;
  created_at: string;
}

const KIND_LABEL: Record<ReplyKind, string> = {
  message: "Message", prayer: "Prayer Request", inquiry: "Inquiry", giving: "Giving Declaration",
};

const INQUIRY_TYPE_LABELS: Record<string, string> = {
  visitation: "Church Visit", "host-service": "Host a Service", event: "Hold an Event", "group-request": "Request a Group", others: "Other",
};

function KindIcon({ kind }: { kind: ReplyKind }) {
  const size = 13;
  if (kind === "prayer") return <Heart size={size} />;
  if (kind === "inquiry") return <Mail size={size} />;
  if (kind === "giving") return <Receipt size={size} />;
  return <MessageSquare size={size} />;
}

function MessagesScreen({ user }: { user: User }) {
  const [items, setItems] = useState<ReplyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const fetchAll = async () => {
    const email = user.email;
    if (!email) { setItems([]); setLoading(false); return; }
    const [msgs, prayers, inquiries, givings] = await Promise.all([
      supabase.from("messages").select("id, subject, body, status, admin_reply, created_at").eq("requester_email", email).order("created_at", { ascending: false }),
      supabase.from("prayer_requests").select("id, request, status, admin_reply, created_at").eq("requester_email", email).order("created_at", { ascending: false }),
      supabase.from("inquiries").select("id, inquiry_type, inquiry_type_other, status, admin_reply, created_at").eq("requester_email", email).order("created_at", { ascending: false }),
      supabase.from("giving_submissions").select("id, purpose, amount, status, admin_reply, created_at").eq("user_email", email).order("created_at", { ascending: false }),
    ]);

    const combined: ReplyItem[] = [
      ...(msgs.data ?? []).map((m) => ({
        id: m.id, kind: "message" as const, title: m.subject || "General Question", body: m.body,
        status: m.status, admin_reply: m.admin_reply, created_at: m.created_at,
      })),
      ...(prayers.data ?? []).map((p) => ({
        id: p.id, kind: "prayer" as const, title: "Prayer Request", body: p.request,
        status: p.status, admin_reply: p.admin_reply, created_at: p.created_at,
      })),
      ...(inquiries.data ?? []).map((i) => ({
        id: i.id, kind: "inquiry" as const,
        title: i.inquiry_type === "others" ? (i.inquiry_type_other || "Inquiry") : INQUIRY_TYPE_LABELS[i.inquiry_type] ?? i.inquiry_type,
        body: "", status: i.status, admin_reply: i.admin_reply, created_at: i.created_at,
      })),
      ...(givings.data ?? []).map((g) => ({
        id: g.id, kind: "giving" as const, title: `${g.purpose} · ₱${Number(g.amount).toLocaleString()}`,
        body: "", status: g.status, admin_reply: g.admin_reply, created_at: g.created_at,
      })),
    ];
    combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setItems(combined);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, [user.email]);

  const sendMessage = async () => {
    if (!body.trim()) return setError("Write your message first.");
    setError("");
    setSubmitting(true);
    const { error } = await supabase.from("messages").insert({
      requester_email: user.email, requester_name: user.user_metadata?.full_name || user.email,
      subject: subject.trim() || null, body: body.trim(),
    });
    setSubmitting(false);
    if (error) return setError("Failed to send. Please try again.");
    setSubject(""); setBody(""); setSent(true);
    setTimeout(() => setSent(false), 3000);
    fetchAll();
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-6 pb-10">
      <p className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Malingin SDA Church</p>
      <h2 className="font-[Playfair_Display] text-2xl font-semibold text-foreground mb-6">Messages</h2>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 space-y-3">
        <h3 className="font-[Playfair_Display] text-base font-semibold text-foreground">Ask a Question</h3>
        <p className="font-[Lato] text-xs text-muted-foreground leading-relaxed">
          Have a question or something to tell the church admins? Send it here.
        </p>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 -my-1">
            <AlertCircle size={13} className="text-red-600 shrink-0 mt-0.5" />
            <p className="font-[Lato] text-xs text-red-700">{error}</p>
          </div>
        )}
        {sent && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2 -my-1">
            <Check size={13} className="text-green-600 shrink-0" />
            <p className="font-[Lato] text-xs text-green-700">Sent — an admin will reply here.</p>
          </div>
        )}

        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject (optional)"
          className="w-full border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm bg-background focus:outline-none focus:border-primary"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Your question or message…"
          rows={3}
          className="w-full border border-border rounded-xl px-3 py-2.5 font-[Lato] text-sm bg-background focus:outline-none focus:border-primary resize-none"
        />
        <button
          onClick={sendMessage}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-[Lato] font-bold text-xs py-3 rounded-full hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
        >
          <Send size={13} /> {submitting ? "Sending…" : "Send Message"}
        </button>
      </div>

      <h3 className="font-[Playfair_Display] text-base font-semibold text-foreground mb-3">Your Messages & Replies</h3>
      {loading ? (
        <p className="text-center font-[Lato] text-sm text-muted-foreground py-10">Loading…</p>
      ) : items.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-xl py-10 flex flex-col items-center gap-2">
          <MessageSquare size={24} className="text-muted-foreground/30" />
          <p className="font-[Lato] text-sm text-muted-foreground">Nothing here yet — prayer requests, inquiries, giving declarations, and messages you've sent while logged in will show up here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={`${item.kind}-${item.id}`} className="bg-card border border-border rounded-xl p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                    <KindIcon kind={item.kind} />
                    <span className="font-[Lato] text-[10px] uppercase tracking-widest">{KIND_LABEL[item.kind]}</span>
                  </div>
                  <p className="font-[Playfair_Display] text-sm font-semibold text-foreground leading-tight">{item.title}</p>
                  {item.body && <p className="font-[Lato] text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.body}</p>}
                </div>
                <span className="font-[Lato] text-[10px] text-muted-foreground shrink-0">{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
              {item.admin_reply && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <p className="font-[Lato] text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Church Reply</p>
                  <p className="font-[Lato] text-sm text-foreground leading-relaxed">{item.admin_reply}</p>
                </div>
              )}
              {!item.admin_reply && (
                <p className="font-[Lato] text-[11px] text-muted-foreground italic">Status: {item.status}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MessagesPage({ onBack }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isSupabaseReady) { setChecking(false); return; }
    supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setChecking(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-full flex flex-col">
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-border flex items-center gap-3 px-5 py-3">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div>
          <p className="font-[Playfair_Display] font-semibold text-sm text-foreground">Messages</p>
          <p className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest">
            {user ? "Signed In" : "Sign in to continue"}
          </p>
        </div>
        {user && (
          <button
            onClick={() => supabase.auth.signOut()}
            className="ml-auto font-[Lato] text-xs text-muted-foreground hover:text-foreground"
          >
            Sign Out
          </button>
        )}
      </div>

      {checking ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="font-[Lato] text-sm text-muted-foreground">Loading…</p>
        </div>
      ) : user ? (
        <MessagesScreen user={user} />
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-8 pb-10">
          <p className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Secure Access</p>
          <h2 className="font-[Playfair_Display] text-2xl font-semibold text-foreground mb-1">Messages</h2>
          <p className="font-[Lato] text-sm text-muted-foreground mb-8 leading-relaxed">
            Sign in to send a message and see replies to your prayer requests, inquiries, and giving declarations in one place.
          </p>
          <MemberLogin
            onAuthed={setUser}
            helperText="Everything here is matched to the email address on this account."
          />
        </div>
      )}
    </div>
  );
}
