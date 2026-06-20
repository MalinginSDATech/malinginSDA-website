import { useState } from "react";
import { ArrowLeft, Send, Lock, Globe, Users } from "lucide-react";

interface Props {
  onBack: () => void;
}

type Visibility = "public" | "private-member" | "private-elder" | "private-group";

const VISIBILITY_OPTIONS: { value: Visibility; icon: React.ReactNode; label: string; desc: string }[] = [
  { value: "public", icon: <Globe size={16} />, label: "Public", desc: "Shared with the whole congregation during service" },
  { value: "private-member", icon: <Lock size={16} />, label: "Private — Member", desc: "Prayed by an assigned member privately" },
  { value: "private-elder", icon: <Lock size={16} />, label: "Private — Elder", desc: "Brought to a church elder for prayer" },
  { value: "private-group", icon: <Users size={16} />, label: "Private — Group", desc: "Prayed over by a small prayer group" },
];

export function PrayerPage({ onBack }: Props) {
  const [form, setForm] = useState({ request: "", from: "", visibility: "public" as Visibility });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.request.trim()) return;
    setSubmitted(true);
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
            onClick={() => { setSubmitted(false); setForm({ request: "", from: "", visibility: "public" }); }}
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

        {/* Visibility */}
        <div className="mb-8">
          <label className="font-[Lato] text-xs text-muted-foreground uppercase tracking-widest block mb-3">
            How would you like this prayed?
          </label>
          <div className="space-y-2">
            {VISIBILITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setForm({ ...form, visibility: opt.value })}
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
        </div>

        <button
          onClick={handleSubmit}
          disabled={!form.request.trim()}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-[Lato] font-bold text-sm py-3.5 rounded-full tracking-wide hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={15} />
          Submit Prayer Request
        </button>

        <p className="font-[Lato] text-xs text-muted-foreground text-center mt-4 leading-relaxed">
          All requests are handled with care and confidentiality by our church leadership.
        </p>
      </div>
    </div>
  );
}
