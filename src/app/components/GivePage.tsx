import { useState } from "react";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Facebook, QrCode, Phone, MessageCircle } from "lucide-react";

interface Props {
  onBack: () => void;
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-8 pb-10">
      <p className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Secure Access</p>
      <h2 className="font-[Playfair_Display] text-2xl font-semibold text-foreground mb-1">Give & Tithe</h2>
      <p className="font-[Lato] text-sm text-muted-foreground mb-8 leading-relaxed">
        Sign in to view your giving history and transaction records managed by the church treasurer.
      </p>

      {/* Social login */}
      <div className="space-y-3 mb-6">
        <button
          onClick={onLogin}
          className="w-full flex items-center justify-center gap-3 bg-card border border-border rounded-xl py-3 font-[Lato] text-sm font-bold text-foreground hover:bg-secondary active:scale-[0.98] transition-all"
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <button
          onClick={onLogin}
          className="w-full flex items-center justify-center gap-3 bg-foreground text-background rounded-xl py-3 font-[Lato] text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <AppleIcon />
          Continue with Apple
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-border" />
        <span className="font-[Lato] text-xs text-muted-foreground uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Tabs */}
      <div className="flex bg-secondary rounded-xl p-1 mb-5">
        {(["login", "signup"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg font-[Lato] text-xs font-bold uppercase tracking-widest transition-all ${tab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            {t === "login" ? "Sign In" : "Sign Up"}
          </button>
        ))}
      </div>

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
        onClick={onLogin}
        className="w-full bg-primary text-primary-foreground font-[Lato] font-bold text-sm py-3.5 rounded-full tracking-wide hover:opacity-90 active:scale-95 transition-all mb-4"
      >
        {tab === "login" ? "Sign In" : "Create Account"}
      </button>

      {tab === "login" && (
        <button className="w-full text-center font-[Lato] text-xs text-accent">
          Forgot password?
        </button>
      )}
    </div>
  );
}

function GiveScreen() {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-6 pb-10">
      <p className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Malingin SDA Church</p>
      <h2 className="font-[Playfair_Display] text-2xl font-semibold text-foreground mb-6">Give & Tithe</h2>

      {/* GCash QR */}
      <div className="bg-card border border-border rounded-xl p-5 mb-4 text-center">
        <p className="font-[Lato] text-xs text-muted-foreground uppercase tracking-widest mb-3">GCash QR Code</p>
        <div className="w-44 h-44 bg-secondary border-2 border-dashed border-border rounded-xl mx-auto flex flex-col items-center justify-center gap-2 mb-3">
          <QrCode size={36} className="text-muted-foreground/40" />
          <p className="font-[Lato] text-xs text-muted-foreground italic">QR Code to be posted</p>
        </div>
        <p className="font-[Lato] text-xs text-muted-foreground leading-relaxed">
          Scan using your GCash app to send your tithe or offering directly to the church.
        </p>
      </div>

      {/* Treasurer contact */}
      <div className="space-y-3 mb-6">
        <h3 className="font-[Playfair_Display] text-base font-semibold text-foreground">Contact Treasurer</h3>
        <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <Phone size={15} className="text-primary" />
          </div>
          <div>
            <p className="font-[Lato] text-xs text-muted-foreground">Phone / GCash</p>
            <p className="font-[Lato] text-sm text-muted-foreground italic">To be announced</p>
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

      {/* Transaction log notice */}
      <div className="bg-secondary border border-border rounded-xl p-4">
        <p className="font-[Lato] text-xs font-bold text-foreground mb-1">Your Transaction Log</p>
        <p className="font-[Lato] text-xs text-muted-foreground leading-relaxed">
          Your giving records are logged and verified by the church treasurer. Your log will appear here once entries have been added.
        </p>
      </div>

      {/* Empty log placeholder */}
      <div className="mt-4 bg-card border border-dashed border-border rounded-xl py-10 flex flex-col items-center gap-2">
        <QrCode size={24} className="text-muted-foreground/30" />
        <p className="font-[Lato] text-sm text-muted-foreground">No transactions recorded yet.</p>
      </div>
    </div>
  );
}

export function GivePage({ onBack }: Props) {
  const [loggedIn, setLoggedIn] = useState(false);

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
            {loggedIn ? "Signed In" : "Sign in to continue"}
          </p>
        </div>
        {loggedIn && (
          <button
            onClick={() => setLoggedIn(false)}
            className="ml-auto font-[Lato] text-xs text-muted-foreground hover:text-foreground"
          >
            Sign Out
          </button>
        )}
      </div>

      {loggedIn ? <GiveScreen /> : <LoginScreen onLogin={() => setLoggedIn(true)} />}
    </div>
  );
}
