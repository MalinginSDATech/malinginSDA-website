import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { ArrowLeft, Send, Lock, Globe, Users, AlertCircle, Heart } from "lucide-react";
import { supabaseMember as supabase } from "../../supabase";
import { MemberLogin } from "./MemberLogin";

interface Props {
  onBack: () => void;
}

type Visibility = "public" | "private-member" | "private-elder" | "private-group";

interface MyPrayerRequest { id: string; request: string; status: string; admin_reply: string | null; created_at: string }

const VISIBILITY_OPTIONS: { value: Visibility; icon: React.ReactNode; label: string; desc: string }[] = [
  { value: "public", icon: <Globe size={16} />, label: "Public", desc: "Shared with the whole congregation during service" },
  { value: "private-member", icon: <Lock size={16} />, label: "Private — Member", desc: "Prayed by an assigned member privately" },
  { value: "private-elder", icon: <Lock size={16} />, label: "Private — Elder", desc: "Brought to a church elder for prayer" },
  { value: "private-group", icon: <Users size={16} />, label: "Private — Group", desc: "Prayed over by a small prayer group" },
];

const PRIVATE_TARGET_PLACEHOLDER: Record<Visibility, string> = {
  public: "",
  "private-member": "Which member would you like to pray for this?",
  "private-elder": "Which elder would you like to pray for this?",
  "private-group": "Which group would you like to pray for this?",
};

const blank_form = { request: "", from: "", visibility: "public" as Visibility, contactInfo: "", wantsVisit: false, privateTarget: "" };

export function PrayerPage({ onBack }: Props) {
  const [form, setForm] = useState(blank_form);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [myRequests, setMyRequests] = useState<MyPrayerRequest[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const fetchMyRequests = async () => {
    if (!user?.email) { setMyRequests([]); return; }
    const { data } = await supabase
      .from("prayer_requests")
      .select("id, request, status, admin_reply, created_at")
      .eq("requester_email", user.email)
      .order("created_at", { ascending: false });
    setMyRequests(data ?? []);
  };
  useEffect(() => { fetchMyRequests(); }, [user?.email]);

  const handleSubmit = async () => {
    if (!form.request.trim()) return;
    setError("");
    setSubmitting(true);
    const { error } = await supabase.from("prayer_requests").insert({
      request: form.request.trim(), from_name: form.from.trim(), visibility: form.visibility,
      contact_info: form.wantsVisit ? form.contactInfo.trim() : null,
      wants_visit: form.wantsVisit,
      private_target: form.visibility !== "public" ? form.privateTarget.trim() : null,
      requester_email: user?.email ?? null,
    });
    setSubmitting(false);
    if (error) return setError("Failed to submit. Please try again.");
    setSubmitted(true);
    if (user) fetchMyRequests();
  };

  if (submitted) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-border flex items-center gap-3 px-5 py-3">
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <p className="font-[Playfair_Display] font-semibold text-sm text-foreground">Prayer Request</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-3xl">🙏</span>
          </div>
          <h2 className="font-[Playfair_Display] text-xl font-semibold text-foreground">Prayer Received</h2>
          <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed">
            Your prayer request has been submitted. Our members and leaders will hold this in prayer with love and faith.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm(blank_form); }}
            className="mt-4 bg-primary text-primary-foreground font-[Lato] font-bold text-sm px-8 py-3 rounded-full hover:opacity-90 active:scale-95 transition-all"
          >
            Submit Another
          </button>
          <button onClick={onBack} className="font-[Lato] text-sm text-muted-foreground">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-border flex items-center gap-3 px-5 py-3">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div>
          <p className="font-[Playfair_Display] font-semibold text-sm text-foreground">Prayer Request</p>
          <p className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest">Malingin SDA Church</p>
        </div>
      </div>

      <div className="px-5 pt-6 pb-10">
        <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed mb-6">
          Share your prayer request with us. Our congregation carries one another's burdens in faith and love.
        </p>

        {/* Prayer request box */}
        <div className="mb-4">
          <label className="font-[Lato] text-xs text-muted-foreground uppercase tracking-widest block mb-2">
            Your Prayer Request <span className="text-primary">*</span>
          </label>
          <textarea
            value={form.request}
            onChange={(e) => setForm({ ...form, request: e.target.value })}
            placeholder="Share what's on your heart..."
            rows={5}
            className="w-full bg-card border border-border rounded-xl px-4 py-3 font-[Lato] text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none leading-relaxed"
          />
          <p className="font-[Lato] text-xs text-muted-foreground mt-1 text-right">{form.request.length} characters</p>
        </div>

        {/* From */}
        <div className="mb-6">
          <label className="font-[Lato] text-xs text-muted-foreground uppercase tracking-widest block mb-2">
            From (optional)
          </label>
          <input
            type="text"
            value={form.from}
            onChange={(e) => setForm({ ...form, from: e.target.value })}
            placeholder="Your name, or leave blank for anonymous"
            className="w-full bg-card border border-border rounded-xl px-4 py-3 font-[Lato] text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Personal visit request */}
        <div className="mb-6">
          <button
            onClick={() => setForm({ ...form, wantsVisit: !form.wantsVisit })}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-all text-left ${
              form.wantsVisit ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-secondary"
            }`}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${form.wantsVisit ? "border-primary bg-primary" : "border-border"}`}>
              {form.wantsVisit && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span className={`font-[Lato] text-sm font-bold ${form.wantsVisit ? "text-primary" : "text-foreground"}`}>
              I'd like to be personally visited and prayed for
            </span>
          </button>
          {form.wantsVisit && (
            <input
              type="text"
              value={form.contactInfo}
              onChange={(e) => setForm({ ...form, contactInfo: e.target.value })}
              placeholder="Phone number, email, or Facebook profile"
              className="mt-2 w-full bg-card border border-border rounded-xl px-4 py-3 font-[Lato] text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
          )}
        </div>

        {/* Visibility */}
        <div className="mb-8">
          <label className="font-[Lato] text-xs text-muted-foreground uppercase tracking-widest block mb-3">
            How would you like this prayed?
          </label>
          <div className="space-y-2">
            {VISIBILITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setForm({ ...form, visibility: opt.value, privateTarget: opt.value === "public" ? "" : form.privateTarget })}
                className={`w-full flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-all text-left ${
                  form.visibility === opt.value
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-secondary"
                }`}
              >
                <div className={`shrink-0 ${form.visibility === opt.value ? "text-primary" : "text-muted-foreground"}`}>
                  {opt.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-[Lato] text-sm font-bold ${form.visibility === opt.value ? "text-primary" : "text-foreground"}`}>
                    {opt.label}
                  </p>
                  <p className="font-[Lato] text-xs text-muted-foreground leading-snug">{opt.desc}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${form.visibility === opt.value ? "border-primary" : "border-border"}`}>
                  {form.visibility === opt.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
              </button>
            ))}
          </div>
          {form.visibility !== "public" && (
            <div className="mt-3">
              <label className="font-[Lato] text-xs text-muted-foreground uppercase tracking-widest block mb-2">
                {PRIVATE_TARGET_PLACEHOLDER[form.visibility]} (optional)
              </label>
              <input
                type="text"
                value={form.privateTarget}
                onChange={(e) => setForm({ ...form, privateTarget: e.target.value })}
                placeholder="Name of member, elder, or group"
                className="w-full bg-card border border-border rounded-xl px-4 py-3 font-[Lato] text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          )}
        </div>

        {/* Login to be notified of acknowledgement */}
        <div className="mb-6 bg-secondary/50 border border-border rounded-xl p-4">
          {user ? (
            <p className="font-[Lato] text-xs text-foreground leading-relaxed">
              Signed in as <span className="font-bold">{user.email}</span> — any reply from the church will appear below.{" "}
              <button onClick={() => supabase.auth.signOut()} className="underline text-muted-foreground">Sign out</button>
            </p>
          ) : showLogin ? (
            <MemberLogin
              onAuthed={(u) => { setUser(u); setShowLogin(false); }}
              helperText="Log in or register so you can see if your prayer request has been acknowledged."
            />
          ) : (
            <button onClick={() => setShowLogin(true)} className="font-[Lato] text-xs text-primary underline text-left leading-relaxed">
              Want to Know if your Prayer Request has been Acknowledged? Login/Register here.
            </button>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 mb-3">
            <AlertCircle size={14} className="text-red-600 shrink-0 mt-0.5" />
            <p className="font-[Lato] text-xs text-red-700">{error}</p>
          </div>
        )}
        <button
          onClick={handleSubmit}
          disabled={!form.request.trim() || submitting}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-[Lato] font-bold text-sm py-3.5 rounded-full tracking-wide hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={15} />
          {submitting ? "Submitting…" : "Submit Prayer Request"}
        </button>

        <p className="font-[Lato] text-xs text-muted-foreground text-center mt-4 leading-relaxed">
          All requests are handled with care and confidentiality by our church leadership.
        </p>

        {user && myRequests.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border">
            <p className="font-[Lato] text-xs text-muted-foreground uppercase tracking-widest mb-3">Your Prayer Requests</p>
            <div className="space-y-3">
              {myRequests.map((r) => (
                <div key={r.id} className="bg-card border border-border rounded-xl p-4">
                  <p className="font-[Lato] text-sm text-foreground leading-relaxed">{r.request}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground">{r.status}</span>
                    <span className="font-[Lato] text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  {r.admin_reply && (
                    <div className="mt-2 bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-start gap-2">
                      <Heart size={12} className="text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-[Lato] text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Church Reply</p>
                        <p className="font-[Lato] text-sm text-foreground leading-relaxed">{r.admin_reply}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
