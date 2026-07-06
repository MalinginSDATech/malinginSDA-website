import React from "react";
import { Phone, Mail, MapPin, Facebook, ChevronRight, ArrowLeft } from "lucide-react";
import { FadeUp } from "./FadeUp";
import communityPhoto from "../../imports/malingin_community.jpg";
import maayoPic from "../../imports/MaAYO_pic.jpg";
import choralePic from "../../imports/Chorale_pic.jpg";

type PageId = "main" | "maayo" | "chorale" | "about" | "give" | "prayer" | "inquiry" | "connect";

const MINISTRIES = [
  {
    id: "maayo" as PageId,
    name: "MaAYO",
    fullName: "Malingin Adventist Youth Organization",
    desc: "Every Saturday · AYF Program · 2:30 PM",
    badge: "Youth Ministry",
    photo: maayoPic,
  },
  {
    id: "chorale" as PageId,
    name: "Advent Chorale",
    fullName: "Malingin Advent Chorale",
    desc: "Music & Worship Ministry",
    badge: "Music Ministry",
    photo: choralePic,
  },
];

const CONTACTS = [
  {
    icon: Phone,
    label: "Phone",
    value: "To be announced",
    sub: null,
    href: null,
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconColor: "text-blue-700",
    hoverBg: null,
  },
  {
    icon: Mail,
    label: "Email",
    value: "sdamalingin@gmail.com",
    sub: null,
    href: "mailto:sdamalingin@gmail.com",
    bg: "bg-amber-50",
    border: "border-amber-200",
    iconColor: "text-amber-700",
    hoverBg: "hover:bg-amber-50 hover:border-amber-300",
  },
  {
    icon: Facebook,
    label: "Facebook",
    value: "Malingin Seventh-Day Adventist Church",
    sub: null,
    href: "https://www.facebook.com/malingin.church",
    bg: "bg-sky-50",
    border: "border-sky-200",
    iconColor: "text-sky-700",
    hoverBg: "hover:bg-sky-50 hover:border-sky-300",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Brgy. Malingin, Bago City",
    sub: "Negros Occidental, Philippines",
    href: null,
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    iconColor: "text-emerald-700",
    hoverBg: null,
  },
];

export function ConnectPage({ onBack, onNavigate }: { onBack: () => void; onNavigate: (p: PageId) => void }) {
  return (
    <div className="min-h-screen bg-background pb-16">

      {/* Sticky back header */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-sm border-b border-border flex items-center gap-3 px-5 py-3">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div>
          <p className="font-[Playfair_Display] font-semibold text-sm text-foreground">Connect</p>
          <p className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest">Ministries · Prayer · Community</p>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="relative" style={{ height: "50vh", minHeight: 300 }}>
        <img
          src={communityPhoto}
          alt="Malingin SDA Church community"
          className="absolute inset-0 w-full h-full object-cover object-[center_65%]"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(13,20,35,0.94) 0%, rgba(13,20,35,0.45) 55%, transparent 100%)" }}
        />
        <div className="absolute bottom-0 px-5 pb-8 md:px-14">
          <p className="font-[Lato] text-[10px] text-white/50 uppercase tracking-[0.25em] mb-2">Malingin SDA Church</p>
          <h1
            className="font-[Playfair_Display] text-white font-semibold leading-tight"
            style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)" }}
          >
            Connect<br />
            <span className="italic">with Us</span>
          </h1>
          <p className="font-[Lato] text-white/55 text-sm mt-2 max-w-sm leading-relaxed">
            Ministries · Prayer · Fellowship · Community
          </p>
        </div>
      </div>

      {/* ── MINISTRIES ── */}
      <div
        className="px-5 md:px-14 py-12"
        style={{ background: "linear-gradient(180deg, #FBF7EE 0%, #F5F1E6 100%)" }}
      >
        <FadeUp>
          <div className="mb-7">
            <p className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              Groups & Organizations
            </p>
            <h2
              className="font-[Playfair_Display] text-foreground font-semibold"
              style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)" }}
            >
              Ministries
            </h2>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MINISTRIES.map((m, i) => (
            <FadeUp key={m.id} delay={i * 80}>
              <button
                onClick={() => onNavigate(m.id)}
                className="w-full relative overflow-hidden rounded-2xl shadow-lg group text-left"
                style={{ aspectRatio: "4/3" }}
              >
                <img
                  src={m.photo}
                  alt={m.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(13,20,35,0.92) 10%, rgba(13,20,35,0.1) 70%, transparent 100%)" }}
                />
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/15 backdrop-blur-sm text-white text-[10px] font-[Lato] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/25">
                    {m.badge}
                  </span>
                </div>
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-[Playfair_Display] text-white text-xl font-semibold leading-tight">{m.name}</p>
                    <p className="font-[Lato] text-white/60 text-xs mt-1">{m.fullName}</p>
                    <p className="font-[Lato] text-white/45 text-[10px] mt-0.5 uppercase tracking-wide">{m.desc}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                    <ChevronRight size={16} className="text-white" />
                  </div>
                </div>
              </button>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* ── GET INVOLVED ── */}
      <div
        className="px-5 md:px-14 py-12"
        style={{ background: "linear-gradient(135deg, #1A4B8C 0%, #0d2650 100%)" }}
      >
        <FadeUp>
          <p className="font-[Lato] text-[10px] uppercase tracking-widest text-white/30 mb-1">Take a Step</p>
          <h2
            className="font-[Playfair_Display] text-white font-semibold mb-7"
            style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)" }}
          >
            Get Involved
          </h2>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FadeUp delay={0}>
            <button
              onClick={() => onNavigate("prayer")}
              className="w-full rounded-2xl p-6 bg-white/[0.07] border border-white/15 hover:bg-white/[0.13] transition-all duration-300 text-left group"
            >
              <span className="text-3xl block mb-4">🙏</span>
              <p className="font-[Playfair_Display] text-white text-base font-semibold leading-tight mb-2">
                Submit a Prayer Request
              </p>
              <p className="font-[Lato] text-white/50 text-xs leading-relaxed mb-4">
                Share your burdens with us. Our church family prays together every week.
              </p>
              <div className="flex items-center gap-1.5">
                <span className="font-[Lato] text-white/50 text-[11px] uppercase tracking-widest">Send a request</span>
                <ChevronRight size={12} className="text-white/50 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </FadeUp>
          <FadeUp delay={80}>
            <button
              onClick={() => onNavigate("inquiry")}
              className="w-full rounded-2xl p-6 bg-white/[0.07] border border-white/15 hover:bg-white/[0.13] transition-all duration-300 text-left group"
            >
              <span className="text-3xl block mb-4">✉️</span>
              <p className="font-[Playfair_Display] text-white text-base font-semibold leading-tight mb-2">
                Send an Inquiry
              </p>
              <p className="font-[Lato] text-white/50 text-xs leading-relaxed mb-4">
                Have a question about the church, our faith, or how to get involved? We'd love to hear from you.
              </p>
              <div className="flex items-center gap-1.5">
                <span className="font-[Lato] text-white/50 text-[11px] uppercase tracking-widest">Ask away</span>
                <ChevronRight size={12} className="text-white/50 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </FadeUp>
        </div>
      </div>

      {/* ── CONTACT INFO ── */}
      <div
        className="px-5 md:px-14 py-12"
        style={{ background: "linear-gradient(180deg, #F8F5EE 0%, #F0EBE0 100%)" }}
      >
        <FadeUp>
          <p className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Reach Out</p>
          <h2
            className="font-[Playfair_Display] text-foreground font-semibold mb-7"
            style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)" }}
          >
            Get in Touch
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-3">
            {CONTACTS.map((c, i) => {
              const Icon = c.icon;
              const inner = (
                <div className={`flex items-center gap-4 p-4 bg-card border border-border rounded-2xl transition-all duration-300 ${c.hoverBg ?? ""} ${c.href ? "group" : ""}`}>
                  <div className={`w-11 h-11 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={c.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest">{c.label}</p>
                    <p className={`font-[Playfair_Display] text-sm font-semibold text-foreground mt-0.5 ${c.href ? "" : "text-muted-foreground italic font-normal"}`} style={{ fontFamily: c.href ? undefined : undefined }}>
                      {c.value}
                    </p>
                    {c.sub && <p className="font-[Lato] text-xs text-muted-foreground mt-0.5">{c.sub}</p>}
                  </div>
                  {c.href && (
                    <ChevronRight size={14} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
                  )}
                </div>
              );
              return (
                <FadeUp key={c.label} delay={i * 60}>
                  {c.href ? (
                    <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                      {inner}
                    </a>
                  ) : inner}
                </FadeUp>
              );
            })}
          </div>

          {/* ── MAP ── */}
          <FadeUp>
            <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
              <div className="flex items-center gap-3 px-5 py-4 bg-amber-50 border-b border-border">
                <MapPin size={16} className="text-primary shrink-0" />
                <div>
                  <p className="font-[Playfair_Display] text-base font-semibold text-foreground">Find Us</p>
                  <p className="font-[Lato] text-xs text-muted-foreground">Brgy. Malingin, Bago City, Negros Occidental</p>
                </div>
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3298.865727548701!2d122.9065936460828!3d10.497939062529491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33aec80520d25b9f%3A0x4572c9694808d21!2sMalingin%20Seventh-day%20Adventist%20Church!5e0!3m2!1sen!2sph!4v1781880131972!5m2!1sen!2sph"
                width="100%"
                height="240"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Malingin SDA Church Location"
              />
            </div>
          </FadeUp>
        </div>
      </div>

    </div>
  );
}

export default ConnectPage;
