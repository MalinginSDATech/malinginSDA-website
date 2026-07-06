import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { supabaseMember as supabase } from "../../supabase";

export function MemberLogin({ onAuthed, helperText }: { onAuthed: (u: User) => void; helperText?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError("");
    if (!form.email.trim() || !form.password) return setError("Enter your email and password.");
    setBusy(true);
    const { data, error } =
      tab === "login"
        ? await supabase.auth.signInWithPassword({ email: form.email.trim(), password: form.password })
        : await supabase.auth.signUp({
            email: form.email.trim(),
            password: form.password,
            options: { data: { full_name: form.name.trim() } },
          });
    setBusy(false);
    if (error) {
      console.error("Supabase auth error:", error);
      return setError(error.message || `Something went wrong (status ${error.status ?? "unknown"}). Check the browser console for details.`);
    }
    if (data.user) onAuthed(data.user);
    else if (tab === "signup") setError("Check your email to confirm your account, then sign in.");
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex bg-secondary rounded-xl p-1 mb-5">
        {(["login", "signup"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setError(""); }}
            className={`flex-1 py-2 rounded-lg font-[Lato] text-xs font-bold uppercase tracking-widest transition-all ${tab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            {t === "login" ? "Sign In" : "Sign Up"}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 mb-4">
          <AlertCircle size={14} className="text-red-600 shrink-0 mt-0.5" />
          <p className="font-[Lato] text-xs text-red-700">{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="space-y-3 mb-5">
        {tab === "signup" && (
          <div>
            <label className="font-[Lato] text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name"
              className="w-full bg-card border border-border rounded-xl px-4 py-3 font-[Lato] text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        )}
        <div>
          <label className="font-[Lato] text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@email.com"
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 font-[Lato] text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="font-[Lato] text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="••••••••"
              className="w-full bg-card border border-border rounded-xl pl-10 pr-10 py-3 font-[Lato] text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={submit}
        disabled={busy}
        className="w-full bg-primary text-primary-foreground font-[Lato] font-bold text-sm py-3.5 rounded-full tracking-wide hover:opacity-90 active:scale-95 transition-all mb-4 disabled:opacity-50"
      >
        {busy ? "Please wait…" : tab === "login" ? "Sign In" : "Create Account"}
      </button>

      {helperText && (
        <p className="font-[Lato] text-xs text-muted-foreground leading-relaxed text-center">
          {helperText}
        </p>
      )}
    </div>
  );
}
