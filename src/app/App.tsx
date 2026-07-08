import { useState, useRef, useEffect } from "react";
import {
  BookOpen, Bell, Menu, X, MapPin, ChevronRight,
  Phone, Mail, Heart, Clock, Calendar, ChevronDown, MessageSquare,
} from "lucide-react";
import { Facebook } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import Lenis from "lenis";

import { MaAYOPage } from "./components/MaAYOPage";
import { ChoralePage } from "./components/ChoralePage";
import { AboutPage } from "./components/AboutPage";
import { GivePage } from "./components/GivePage";
import { PrayerPage } from "./components/PrayerPage";
import { InquiryPage } from "./components/InquiryPage";
import { MessagesPage } from "./components/MessagesPage";
import { FadeUp } from "./components/FadeUp";
import { Reveal3D } from "./components/Reveal3D";
import { ParallaxImage } from "./components/ParallaxImage";
import { ConnectPage } from "./components/ConnectPage";
import { IntroScreen } from "./components/IntroScreen";
import { ChoraleTransitionOverlay } from "./components/ChoraleTransition";
import { MaAYOTransitionOverlay } from "./components/MaAYOTransition";
import { AdminPage } from "./components/AdminPage";
import { DecorativeCross } from "./components/DecorativeCross";
import { supabaseMember } from "../supabase";
import { DAY_TYPE_LABEL } from "../constants";

import birdsEyeViewPic from "../imports/Bird's Eye View.png";
const churchPhoto: string = birdsEyeViewPic;
import churchVideo from "../imports/AQPIGIoZZpw4Z-Hz57VWI7g2b_kvpNnnJ1uLTIA2bjhQ3xTtbVt_77ZEqyB-2N1N3ohLusPiERPHqJW0JTORHcTGEvW4sGPXvak.mp4";
import communityPhoto from "../imports/malingin_community.jpg";
import maayoPic from "../imports/MaAYO_pic.jpg";
import choralePic from "../imports/Chorale_pic.jpg";

type PageId = "main" | "maayo" | "chorale" | "about" | "give" | "prayer" | "inquiry" | "messages" | "connect" | "admin";

const NAV_LINKS: { label: string; tab?: string; page?: PageId }[] = [
  { label: "Home", tab: "home" },
  { label: "About", page: "about" },
  { label: "Connect", page: "connect" },
  { label: "Give", page: "give" },
  { label: "Prayer", page: "prayer" },
  { label: "Messages", page: "messages" },
  { label: "Events", tab: "events" },
  { label: "Sermons", tab: "sermons" },
];

const SERVICES = [
  { day: "Wednesday", label: "Midweek Service", times: ["7:00 PM – 8:00 PM"], icon: "🌙" },
  { day: "Friday", label: "Vesper Service", times: ["7:00 PM – 8:00 PM"], icon: "🕯" },
  {
    day: "Saturday", label: "Sabbath Day", icon: "✨",
    times: ["8:30–10:00 AM — Sabbath School", "10:30–11:50 AM — Divine Service", "2:30–4:30 PM — AYF"],
  },
];

interface Announcement { id: string; title: string; body: string; active: boolean; created_at: string }
interface CrusadeSession { label: string; topic: string; speaker: string }
interface CrusadeDay { date: string; sessions: CrusadeSession[] }
interface ChurchEvent   { id: string; title: string; tag: string; day: string; month: string; year: string; location: string; description: string; image_url: string; active: boolean; crusade_start: string; crusade_end: string; crusade_schedule: CrusadeDay[] }
interface Sermon        { id: string; title: string; speaker: string; date: string; series: string; video_url: string; excerpt: string; status: string; active: boolean; service_date: string; day_type: string; year: string; has_event: boolean }

const pad2 = (n: number) => String(n).padStart(2, "0");
const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };
const formatIsoDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const MINISTRIES = [
  {
    id: "maayo" as PageId,
    name: "MaAYO",
    fullName: "Malingin Adventist Youth Organization",
    desc: "Empowering the youth to grow in faith, leadership, and service.",
    schedule: "Every Saturday · AYF 2:30 PM",
    photo: maayoPic,
    accent: "#1A4B8C",
  },
  {
    id: "chorale" as PageId,
    name: "Advent Chorale",
    fullName: "Malingin Advent Chorale",
    desc: "Glorifying God through the gift of music and harmonious worship.",
    schedule: "Music & Worship Ministry",
    photo: choralePic,
    accent: "#2D6BB5",
  },
];

// ─── Pill Nav Bar ───────────────────────────────────────────────────────────

interface NavBarProps {
  activeTab: string;
  currentPage: PageId;
  onNavClick: (tab: string) => void;
  onNavigate: (page: PageId) => void;
}

function NavBar({ activeTab, currentPage, onNavClick, onNavigate }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLink = (link: (typeof NAV_LINKS)[0]) => {
    if (link.page) onNavigate(link.page);
    else if (link.tab) onNavClick(link.tab);
    setMobileOpen(false);
  };

  const isActive = (link: (typeof NAV_LINKS)[0]) =>
    (link.tab && link.tab === activeTab && currentPage === "main") ||
    (link.page && link.page === currentPage);

  return (
    <div className="fixed top-3 left-0 right-0 z-50 flex flex-col items-center px-3 sm:px-6">
      {/* Pill */}
      <div
        className="w-full max-w-4xl flex items-center gap-3 px-4 py-2.5 rounded-full shadow-2xl"
        style={{
          background: "rgba(18,28,46,0.96)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => onNavClick("home")}
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <div
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow"
          >
            <span
              className="text-[#162033] font-bold text-sm"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
            >
              M
            </span>
          </div>
          <div className="hidden sm:block leading-none">
            <p className="font-[Lato] font-bold text-white text-[11px] tracking-wider uppercase">Malingin</p>
            <p className="font-[Lato] font-light text-white/55 text-[9px] tracking-[0.18em] uppercase mt-0.5">SDA Church</p>
          </div>
        </button>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleLink(link)}
              className={`px-3 py-1.5 rounded-full text-[13px] font-[Lato] transition-all duration-200 ${
                isActive(link)
                  ? "bg-white/15 text-white font-bold"
                  : "text-white/65 hover:text-white hover:bg-white/08"
              }`}
              style={isActive(link) ? {} : { ["--tw-bg-opacity" as string]: "0.08" }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden ml-auto w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={17} /> : <Menu size={17} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-4xl mt-2 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "rgba(14,22,38,0.98)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {NAV_LINKS.map((link, i) => (
              <button
                key={link.label}
                onClick={() => handleLink(link)}
                className={`w-full text-left px-5 py-3.5 font-[Lato] text-sm transition-colors flex items-center justify-between ${
                  isActive(link)
                    ? "text-white bg-white/10 font-semibold"
                    : "text-white/65 hover:text-white hover:bg-white/06"
                } ${i > 0 ? "border-t border-white/05" : ""}`}
              >
                {link.label}
                <ChevronRight size={14} className="opacity-40" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Floating Contact Widget ────────────────────────────────────────────────────

function ContactWidget({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-primary text-primary-foreground pl-4 pr-5 py-3 rounded-full shadow-xl hover:opacity-90 active:scale-95 transition-all"
      aria-label="Ask a question or send a message"
    >
      <MessageSquare size={16} />
      <span className="font-[Lato] text-xs font-bold hidden sm:inline">Ask a Question</span>
    </button>
  );
}

// ─── Tag Badge ────────────────────────────────────────────────────────────────

function TagBadge({ label }: { label: string }) {
  const colors: Record<string, string> = {
    Youth: "bg-[#1A4B8C]/12 text-[#1A4B8C]",
    Church: "bg-[#2D6BB5]/12 text-[#2D6BB5]",
    Outreach: "bg-[#1E7C4A]/12 text-[#1E7C4A]",
    Worship: "bg-[#2D6BB5]/12 text-[#2D6BB5]",
  };
  return (
    <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${colors[label] ?? "bg-muted text-muted-foreground"}`}>
      {label}
    </span>
  );
}

// ─── Hero (zooms out on scroll, then settles as a fixed page backdrop) ─────────

function HeroZoom({ onNavigate, onOpenSermons }: { onNavigate: (p: PageId) => void; onOpenSermons: () => void }) {
  const { scrollY } = useScroll();

  const ZOOM_END = 650;
  const FADE_END = 1300;

  const scale = useTransform(scrollY, [0, ZOOM_END], [1.45, 1]);
  const imageOpacity = useTransform(scrollY, [ZOOM_END, FADE_END], [1, 0.4]);
  const tintOpacity = useTransform(scrollY, [ZOOM_END, FADE_END], [0, 0.42]);
  const darkOpacity = useTransform(scrollY, [0, ZOOM_END * 0.7], [0.9, 0.25]);
  const contentOpacity = useTransform(scrollY, [0, ZOOM_END * 0.6], [1, 0]);
  const contentY = useTransform(scrollY, [0, ZOOM_END * 0.65], [0, -120]);
  const indicatorOpacity = useTransform(scrollY, [0, 90], [1, 0]);

  return (
    <>
      {/* Fixed backdrop — zooms out, then stays as a tinted background behind the rest of the page */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.img
          src={churchPhoto}
          alt=""
          aria-hidden
          style={{ scale, opacity: imageOpacity }}
          className="w-full h-full object-cover"
        />
        <motion.div className="absolute inset-0 bg-[#1A4B8C] mix-blend-multiply" style={{ opacity: tintOpacity }} />
        <motion.div className="absolute inset-0 bg-[#0d1423]" style={{ opacity: darkOpacity }} />
      </div>

      {/* Hero text — normal flow, first thing seen, sits above the fixed backdrop */}
      <section className="relative z-10" style={{ height: "100vh", minHeight: 560 }}>
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute inset-0 flex flex-col justify-end px-5 sm:px-10 md:px-16 pb-14 md:pb-20"
        >
          <FadeUp>
            <p className="font-[Lato] text-[#D6E5F5]/70 text-[10px] uppercase tracking-[0.22em] mb-3">
              Brgy. Malingin · Bago City, Neg. Occ.
            </p>
          </FadeUp>
          <FadeUp delay={80}>
            <h1 className="font-[Playfair_Display] text-white leading-tight font-semibold mb-5" style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}>
              Malingin<br />
              <span className="italic">Seventh-day Adventist</span><br />
              Church
            </h1>
          </FadeUp>
          <FadeUp delay={150}>
            <p className="font-[Lato] text-white/65 text-sm md:text-base mb-7 max-w-md leading-relaxed">
              A warm, faith-driven community near the rice fields of Bago City. Everyone is welcome here.
            </p>
          </FadeUp>
          <FadeUp delay={210}>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate("about")}
                className="font-[Lato] font-bold text-sm px-6 py-2.5 rounded-full bg-white text-[#162033] hover:bg-[#D6E5F5] active:scale-95 transition-all shadow-lg"
              >
                About Us
              </button>
              <button
                onClick={onOpenSermons}
                className="font-[Lato] text-sm px-6 py-2.5 rounded-full border border-white/40 text-white hover:bg-white/12 active:scale-95 transition-all"
              >
                Watch Sermons
              </button>
            </div>
          </FadeUp>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          style={{ opacity: indicatorOpacity }}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={18} className="text-white/30" />
        </motion.div>
      </section>
    </>
  );
}

// ─── Our Story (scroll-scrubbed 3D door-wipe) ──────────────────────────────────

function OurStoryReveal({ onNavigate }: { onNavigate: (p: PageId) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start 0.9", "start 0.1"] });

  const leftWipeRotate = useTransform(p, [0, 0.45], [0, -115]);
  const leftWipeOpacity = useTransform(p, [0.3, 0.45], [1, 0]);
  const rightWipeRotate = useTransform(p, [0.05, 0.5], [0, 115]);
  const rightWipeOpacity = useTransform(p, [0.35, 0.5], [1, 0]);

  const textOpacity = useTransform(p, [0.18, 0.5], [0, 1]);
  const textY = useTransform(p, [0.15, 0.5], [70, 0]);
  const textRotateX = useTransform(p, [0.15, 0.5], [-28, 0]);

  const imgOpacity = useTransform(p, [0.3, 0.6], [0, 1]);
  const imgScale = useTransform(p, [0.3, 0.62], [0.78, 1]);
  const imgRotateY = useTransform(p, [0.3, 0.62], [38, 0]);

  const btnOpacity = useTransform(p, [0.65, 0.78], [0, 1]);
  const btnScale = useTransform(p, [0.65, 0.82, 0.95], [0, 1.2, 1]);

  return (
    <section ref={ref} className="px-5 sm:px-10 md:px-16 py-14 md:py-20 bg-secondary/50 backdrop-blur-md overflow-hidden">
      <div
        className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center"
        style={{ perspective: 1400 }}
      >
        <div className="relative">
          <motion.div style={{ opacity: textOpacity, y: textY, rotateX: textRotateX }}>
            <p className="font-[Lato] text-accent text-[10px] uppercase tracking-[0.22em] mb-2">Our Story</p>
            <h2 className="font-[Playfair_Display] text-2xl md:text-3xl font-semibold text-foreground mb-5 leading-snug">
              A church built on faith and community
            </h2>
            <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed mb-4">
              Organized on <strong className="text-foreground">December 4, 2020</strong>, the Malingin Seventh-day Adventist Church is a warm, faith-driven community dedicated to worship, fellowship, and spiritual growth under the pastoral care of <strong className="text-foreground">Pastor Ur Caro</strong>.
            </p>
            <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed mb-7">
              Situated near the peaceful rice fields of Barangay Malingin, we gather each Sabbath to study, worship, and serve one another in Christ's love.
            </p>
            <motion.button
              onClick={() => onNavigate("about")}
              style={{ opacity: btnOpacity, scale: btnScale }}
              className="inline-flex items-center gap-2 font-[Lato] font-bold text-sm text-primary hover:gap-3 transition-all"
            >
              Learn More About Us <ChevronRight size={15} />
            </motion.button>
          </motion.div>
          {/* wipe panel */}
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent"
            style={{
              transformOrigin: "left center",
              transformPerspective: 1400,
              backfaceVisibility: "hidden",
              rotateY: leftWipeRotate,
              opacity: leftWipeOpacity,
            }}
          />
        </div>
        <div className="relative">
          <motion.div
            className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl group"
            style={{ transformPerspective: 1400, opacity: imgOpacity, scale: imgScale, rotateY: imgRotateY }}
          >
            <ParallaxImage
              src={communityPhoto}
              alt="Malingin SDA Church community"
              className="object-[center_65%]"
              strength={35}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#162033]/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="font-[Playfair_Display] text-white text-sm font-semibold italic">
                "One family in Christ's name."
              </p>
            </div>
          </motion.div>
          {/* wipe panel */}
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-2xl bg-gradient-to-bl from-primary to-accent"
            style={{
              transformOrigin: "right center",
              transformPerspective: 1400,
              backfaceVisibility: "hidden",
              rotateY: rightWipeRotate,
              opacity: rightWipeOpacity,
            }}
          />
        </div>
      </div>
    </section>
  );
}

// ─── Home Tab ─────────────────────────────────────────────────────────────────

function HomeTab({ onNavigate, onOpenSermons }: { onNavigate: (p: PageId) => void; onOpenSermons: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<ChurchEvent[]>([]);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
    supabaseMember.from("announcements").select("*").eq("active", true).order("created_at", { ascending: false }).limit(3)
      .then(({ data }) => setAnnouncements(data ?? []));
    supabaseMember.from("events").select("*").eq("active", true).order("created_at", { ascending: false }).limit(2)
      .then(({ data }) => setEvents(data ?? []));
  }, []);

  return (
    <div>
      <HeroZoom onNavigate={onNavigate} onOpenSermons={onOpenSermons} />

      <div className="relative z-10">
      {/* ── Theme Banner ── */}
      <div className="bg-primary/95 px-5 sm:px-10 md:px-16 py-5">
        <div className="max-w-5xl mx-auto flex items-center gap-4 flex-wrap">
          <div>
            <p className="font-[Lato] text-primary-foreground/50 text-[9px] uppercase tracking-[0.22em] mb-0.5">Theme 2026</p>
            <p className="font-[Playfair_Display] text-white text-xl font-bold italic">"Pag-uswag"</p>
          </div>
          <div className="h-8 w-px bg-primary-foreground/15 hidden sm:block" />
          <p className="font-[Lato] text-primary-foreground/55 text-xs sm:text-sm italic">
            Progress · Growth · Advancement
          </p>
        </div>
      </div>

      {/* ── Service Schedule ── */}
      <section className="px-5 sm:px-10 md:px-16 py-14 md:py-20 bg-background/85 backdrop-blur-md">
        <div className="max-w-5xl mx-auto">
          <Reveal3D>
            <p className="font-[Lato] text-accent text-[10px] uppercase tracking-[0.22em] mb-2">Join Us</p>
            <h2 className="font-[Playfair_Display] text-2xl md:text-3xl font-semibold text-foreground mb-8">
              Weekly Services
            </h2>
          </Reveal3D>
          <div className="grid gap-4 sm:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal3D key={s.day} delay={i * 100}>
                <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="text-xl">{s.icon}</span>
                    <div>
                      <p className="font-[Lato] font-bold text-foreground text-sm">{s.day}</p>
                      <p className="font-[Playfair_Display] text-muted-foreground text-xs italic">{s.label}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {s.times.map((t) => (
                      <div key={t} className="flex items-start gap-1.5">
                        <Clock size={11} className="text-accent shrink-0 mt-0.5" />
                        <span className="font-[Lato] text-xs text-muted-foreground leading-relaxed">{t}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5">
                    <MapPin size={10} className="text-muted-foreground/50 shrink-0" />
                    <span className="font-[Lato] text-[10px] text-muted-foreground/50">Malingin SDA Church</span>
                  </div>
                </div>
              </Reveal3D>
            ))}
          </div>
        </div>
      </section>

      <OurStoryReveal onNavigate={onNavigate} />

      {/* ── Upcoming Events ── */}
      <section className="px-5 sm:px-10 md:px-16 py-14 md:py-20 bg-background/85 backdrop-blur-md overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <Reveal3D>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="font-[Lato] text-accent text-[10px] uppercase tracking-[0.22em] mb-2">What's Coming</p>
                <h2 className="font-[Playfair_Display] text-2xl md:text-3xl font-semibold text-foreground">
                  Upcoming Events
                </h2>
              </div>
              <button className="font-[Lato] text-xs text-accent font-bold uppercase tracking-wide flex items-center gap-1 hover:gap-2 transition-all">
                All <ChevronRight size={12} />
              </button>
            </div>
          </Reveal3D>
          {events.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {events.map((e, i) => (
                <Reveal3D key={e.id} delay={i * 100} direction={i % 2 === 0 ? "left" : "right"}>
                  <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex gap-4">
                    {e.image_url && (
                      <img src={e.image_url} alt={e.title} className="shrink-0 w-14 h-14 rounded-lg object-cover" />
                    )}
                    <div className="shrink-0 text-center w-14">
                      <p className="font-[Playfair_Display] text-2xl font-bold text-primary leading-none">{e.day}</p>
                      <p className="font-[Lato] text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">{e.month}</p>
                      <p className="font-[Lato] text-[9px] text-muted-foreground">{e.year}</p>
                    </div>
                    <div className="border-l border-border pl-4 flex-1 min-w-0">
                      <TagBadge label={e.tag} />
                      <h3 className="font-[Playfair_Display] text-base font-semibold text-foreground mt-2 mb-2 leading-snug">{e.title}</h3>
                      {e.location && (
                        <p className="font-[Lato] text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground/60">Location:</span> {e.location}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal3D>
              ))}
            </div>
          ) : (
            <Reveal3D delay={60}>
              <div className="bg-card rounded-2xl border border-dashed border-border py-10 flex flex-col items-center gap-2 text-center">
                <Calendar size={20} className="text-muted-foreground/30" />
                <p className="font-[Lato] text-sm text-muted-foreground">No upcoming events yet.</p>
              </div>
            </Reveal3D>
          )}
        </div>
      </section>

      {/* ── Ministries ── */}
      <section className="px-5 sm:px-10 md:px-16 py-14 md:py-20 bg-secondary/50 backdrop-blur-md overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <Reveal3D>
            <p className="font-[Lato] text-accent text-[10px] uppercase tracking-[0.22em] mb-2">Get Involved</p>
            <h2 className="font-[Playfair_Display] text-2xl md:text-3xl font-semibold text-foreground mb-8">
              Ministries & Groups
            </h2>
          </Reveal3D>
          <div className="grid sm:grid-cols-2 gap-5">
            {MINISTRIES.map((m, i) => (
              <Reveal3D key={m.id} delay={i * 100} direction={i % 2 === 0 ? "left" : "right"}>
                <button
                  onClick={() => onNavigate(m.id)}
                  className="group w-full text-left bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-44 overflow-hidden">
                    <ParallaxImage src={m.photo} alt={m.name} strength={18} scale={1.15} />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${m.accent}cc 0%, transparent 60%)` }} />
                    <div className="absolute bottom-3 left-4 right-4">
                      <p className="font-[Playfair_Display] text-white text-lg font-semibold">{m.name}</p>
                      <p className="font-[Lato] text-white/70 text-xs">{m.fullName}</p>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-[Lato] text-sm text-foreground leading-relaxed">{m.desc}</p>
                      <p className="font-[Lato] text-xs text-muted-foreground mt-1">{m.schedule}</p>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground shrink-0 ml-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </Reveal3D>
            ))}
          </div>
        </div>
      </section>

      {/* ── Give / Tithe CTA ── */}
      <section className="relative overflow-hidden px-5 sm:px-10 md:px-16 py-16 md:py-20 bg-primary/92 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <Reveal3D className="flex-1" direction="left">
            <div>
              <p className="font-[Lato] text-primary-foreground/50 text-[10px] uppercase tracking-[0.22em] mb-2">Support the Mission</p>
              <h2 className="font-[Playfair_Display] text-2xl md:text-3xl font-semibold text-primary-foreground mb-4">
                Give & Tithe
              </h2>
              <p className="font-[Lato] text-primary-foreground/70 text-sm leading-relaxed max-w-md">
                Your generosity fuels our community, our outreach, and our growth. Every gift is an act of faith.
              </p>
            </div>
          </Reveal3D>
          <Reveal3D delay={150} className="shrink-0" direction="right">
            <button
              onClick={() => onNavigate("give")}
              className="font-[Lato] font-bold text-sm px-8 py-3.5 rounded-full bg-white text-primary hover:bg-[#D6E5F5] active:scale-95 transition-all shadow-lg"
            >
              Give Online
            </button>
          </Reveal3D>
        </div>

        {/* Decorative cross */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-primary-foreground pointer-events-none">
          <DecorativeCross size={160} opacity={0.05} />
        </div>
      </section>

      {/* ── Announcements ── */}
      <section className="px-5 sm:px-10 md:px-16 py-14 md:py-20 bg-background/85 backdrop-blur-md">
        <div className="max-w-5xl mx-auto">
          <Reveal3D>
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="font-[Lato] text-accent text-[10px] uppercase tracking-[0.22em] mb-2">Stay Updated</p>
                <h2 className="font-[Playfair_Display] text-2xl md:text-3xl font-semibold text-foreground">Announcements</h2>
              </div>
              <button className="font-[Lato] text-xs text-accent font-bold uppercase tracking-wide flex items-center gap-1">
                All <ChevronRight size={12} />
              </button>
            </div>
          </Reveal3D>
          {announcements.length > 0 ? (
            <div className="space-y-3">
              {announcements.map((a, i) => (
                <Reveal3D key={a.id} delay={i * 80}>
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <p className="font-[Playfair_Display] text-base font-semibold text-foreground mb-1">{a.title}</p>
                    {a.body && <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed">{a.body}</p>}
                  </div>
                </Reveal3D>
              ))}
            </div>
          ) : (
            <Reveal3D delay={60}>
              <div className="bg-card rounded-2xl border border-dashed border-border py-12 flex flex-col items-center gap-2 text-center">
                <Bell size={22} className="text-muted-foreground/25" />
                <p className="font-[Lato] text-sm text-muted-foreground">No announcements at this time.</p>
                <p className="font-[Lato] text-xs text-muted-foreground/50">Check back soon.</p>
              </div>
            </Reveal3D>
          )}
        </div>
      </section>

      {/* ── Church Video ── */}
      <section className="px-5 sm:px-10 md:px-16 pb-14 md:pb-20 bg-background/85 backdrop-blur-md">
        <div className="max-w-5xl mx-auto">
          <Reveal3D>
            <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
              <video ref={videoRef} src={churchVideo} autoPlay muted loop playsInline preload="auto" className="w-full h-56 md:h-80 object-cover" />
              <div className="bg-secondary px-5 py-4 flex items-start gap-3">
                <span className="text-base mt-0.5">🌾</span>
                <p className="font-[Lato] text-xs text-foreground/65 leading-relaxed italic">
                  Every Sabbath, our services are surrounded by the tranquil green rice fields of Barangay Malingin — a blessing that makes worship always feel fresh and close to God's creation.
                </p>
              </div>
            </div>
          </Reveal3D>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-foreground text-background px-5 sm:px-10 md:px-16 py-12">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-10">
          <div>
            <p className="font-[Playfair_Display] font-semibold text-lg mb-3">Malingin SDA Church</p>
            <p className="font-[Lato] text-background/60 text-xs leading-relaxed">
              Brgy. Malingin, Bago City<br />Negros Occidental, Philippines
            </p>
            <p className="font-[Lato] text-background/40 text-xs mt-3 italic">Organized December 4, 2020</p>
          </div>
          <div>
            <p className="font-[Lato] font-bold text-xs uppercase tracking-widest text-background/40 mb-3">Contact</p>
            <div className="space-y-2">
              <a href="mailto:sdamalingin@gmail.com" className="flex items-center gap-2 font-[Lato] text-xs text-background/60 hover:text-background transition-colors">
                <Mail size={12} /> sdamalingin@gmail.com
              </a>
              <a href="https://www.facebook.com/malingin.church" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-[Lato] text-xs text-background/60 hover:text-background transition-colors">
                <Facebook size={12} /> Facebook Page
              </a>
            </div>
          </div>
          <div>
            <p className="font-[Lato] font-bold text-xs uppercase tracking-widest text-background/40 mb-3">Navigate</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {NAV_LINKS.map((l) => (
                <p key={l.label} className="font-[Lato] text-xs text-background/50">{l.label}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-background/10 flex items-center justify-center gap-2">
          <Heart size={11} className="text-background/30" />
          <p className="font-[Lato] text-[10px] text-background/30">
            © 2026 Malingin Seventh-day Adventist Church · Bago City, Philippines
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
}

// ─── Sermons Tab ──────────────────────────────────────────────────────────────

function SermonsTab() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [seriesName, setSeriesName] = useState("");

  useEffect(() => {
    const year = String(new Date().getFullYear());
    supabaseMember.from("sermons").select("*").eq("active", true).order("service_date", { ascending: true })
      .then(({ data }) => setSermons((data ?? []).filter((s) => s.speaker?.trim())));
    supabaseMember.from("sermon_series").select("*").eq("year", year).maybeSingle()
      .then(({ data }) => setSeriesName(data?.series_name ?? ""));
  }, []);

  const today = todayIso();
  const upcoming = sermons.filter((s) => s.service_date >= today);
  const past = sermons.filter((s) => s.service_date < today).reverse();
  const series = Array.from(new Set(sermons.map((s) => s.series).filter(Boolean)));

  return (
    <div className="px-5 sm:px-10 md:px-16 py-12 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto">
        <FadeUp>
          {seriesName && <p className="font-[Lato] text-accent text-[10px] uppercase tracking-[0.22em] mb-2">"{seriesName}" Series</p>}
          <h2 className="font-[Playfair_Display] text-2xl md:text-3xl font-semibold text-foreground mb-2">Sermons</h2>
        </FadeUp>
        <div className="mb-10" />

        {/* ── Upcoming Speakers ── */}
        <FadeUp>
          <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground mb-1">Upcoming Speakers</h3>
          <p className="font-[Lato] text-xs text-muted-foreground mb-4">Who's preaching this Sabbath, and what's coming up.</p>
        </FadeUp>
        {upcoming.length > 0 ? (
          <div className="space-y-3 mb-12 max-h-[420px] overflow-y-auto pr-1" data-lenis-prevent>
            {upcoming.map((s) => (
              <FadeUp key={s.id} delay={0}>
                <div className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4">
                  <div className="shrink-0 w-24 text-center border-r border-border pr-4">
                    <p className="font-[Lato] text-xs font-bold text-primary uppercase tracking-widest">{formatIsoDate(s.service_date)}</p>
                    <p className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{DAY_TYPE_LABEL[s.day_type] ?? s.day_type}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-[Playfair_Display] text-base font-semibold text-foreground">{s.speaker}</p>
                      {s.has_event && (
                        <span className="font-[Lato] text-[9px] font-bold uppercase tracking-widest text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">Event</span>
                      )}
                    </div>
                    {s.title && <p className="font-[Lato] text-xs text-muted-foreground mt-0.5">{s.title}</p>}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        ) : (
          <FadeUp delay={60}>
            <div className="bg-card rounded-2xl border border-dashed border-border py-8 flex flex-col items-center gap-2 text-center mb-12">
              <Calendar size={20} className="text-muted-foreground/30" />
              <p className="font-[Lato] text-sm text-muted-foreground">No speakers scheduled yet.</p>
            </div>
          </FadeUp>
        )}

        {/* ── Past Sermons ── */}
        <FadeUp>
          <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground mb-1">Past Sermons</h3>
          <p className="font-[Lato] text-xs text-muted-foreground mb-4">Missed a Sabbath? Catch the recording here.</p>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {past.length > 0
              ? past.map((s) => (
                  <article key={s.id} className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-5">
                      <p className="text-xs text-muted-foreground">{formatIsoDate(s.service_date)} · {s.speaker}</p>
                      <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground mt-1">{s.title || s.speaker}</h3>
                      <p className="font-[Lato] text-sm text-muted-foreground mt-2">{s.excerpt}</p>
                    </div>
                    <div className="bg-secondary px-5 py-3 flex items-center justify-between">
                      {s.video_url ? (
                        <a href={s.video_url} target="_blank" rel="noopener noreferrer"
                          className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-[Lato] font-bold text-xs">Watch Video</a>
                      ) : (
                        <span className="bg-muted/50 text-muted px-4 py-2 rounded-full font-[Lato] font-bold text-xs opacity-40 select-none">No footage yet</span>
                      )}
                    </div>
                  </article>
                ))
              : [1, 2].map((i) => (
                  <FadeUp key={i} delay={i * 80}>
                    <div className="rounded-2xl border border-dashed border-border overflow-hidden">
                      <div className="h-40 bg-secondary/60 flex flex-col items-center justify-center gap-2">
                        <BookOpen size={26} className="text-muted-foreground/25" />
                        <p className="font-[Lato] text-xs text-muted-foreground italic">No past sermons yet</p>
                      </div>
                      <div className="bg-card px-5 py-4 flex items-center justify-between gap-3">
                        <div>
                          <div className="h-3 w-28 bg-muted rounded mb-1.5" />
                          <div className="h-2.5 w-20 bg-muted/60 rounded" />
                        </div>
                        <div className="px-4 py-2 rounded-full bg-muted/50 text-muted font-[Lato] font-bold text-xs opacity-30 select-none">Watch Video</div>
                      </div>
                    </div>
                  </FadeUp>
                ))}
          </div>

          <aside className="space-y-4">
            <FadeUp delay={60}>
              <div className="rounded-2xl border border-border p-4 bg-card">
                <h4 className="font-[Playfair_Display] text-sm font-semibold mb-2">Series</h4>
                {series.length > 0 ? (
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {series.map((s) => (
                      <li key={s} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {s}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">No series yet.</p>
                )}
              </div>
            </FadeUp>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ─── Events Tab ───────────────────────────────────────────────────────────────

function EventsTab() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    supabaseMember.from("events").select("*").eq("active", true).order("created_at", { ascending: false })
      .then(({ data }) => setEvents(data ?? []));
  }, []);

  return (
    <div className="px-5 sm:px-10 md:px-16 py-12 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto">
        <FadeUp>
          <p className="font-[Lato] text-accent text-[10px] uppercase tracking-[0.22em] mb-2">Calendar</p>
          <h2 className="font-[Playfair_Display] text-2xl md:text-3xl font-semibold text-foreground mb-10">Upcoming Events</h2>
        </FadeUp>

        {events.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {events.map((e, i) => (
              <FadeUp key={e.id} delay={i * 70}>
                <div className="flex gap-4 bg-card border border-border rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  {e.image_url && (
                    <img src={e.image_url} alt={e.title} className="shrink-0 w-14 h-14 rounded-lg object-cover" />
                  )}
                  <div className="shrink-0 w-14 text-center">
                    <p className="font-[Playfair_Display] text-2xl font-bold text-primary leading-none">{e.day}</p>
                    <p className="font-[Lato] text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">{e.month}</p>
                    <p className="font-[Lato] text-[9px] text-muted-foreground">{e.year}</p>
                  </div>
                  <div className="border-l border-border pl-4 flex-1 min-w-0">
                    <TagBadge label={e.tag} />
                    <h3 className="font-[Playfair_Display] text-base font-semibold text-foreground mt-2 mb-2 leading-snug">{e.title}</h3>
                    {e.location && (
                      <p className="font-[Lato] text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground/60">Location:</span> {e.location}
                      </p>
                    )}
                    {e.description && <p className="font-[Lato] text-xs text-muted-foreground mt-1">{e.description}</p>}

                    {e.tag === "Crusade" && e.crusade_schedule?.length > 0 && (
                      <>
                        <button
                          onClick={() => setExpandedId(expandedId === e.id ? null : e.id)}
                          className="font-[Lato] text-xs text-accent font-bold mt-2 flex items-center gap-1"
                        >
                          {expandedId === e.id ? "Hide" : "View"} Full Schedule <ChevronRight size={11} className={`transition-transform ${expandedId === e.id ? "rotate-90" : ""}`} />
                        </button>
                        {expandedId === e.id && (
                          <div className="mt-3 space-y-2 border-t border-border pt-3">
                            {e.crusade_schedule.map((day) => (
                              <div key={day.date}>
                                <p className="font-[Lato] text-[10px] font-bold text-foreground uppercase tracking-widest">{formatIsoDate(day.date)}</p>
                                {day.sessions.map((sess, i) => (
                                  <p key={i} className="font-[Lato] text-xs text-muted-foreground">
                                    {sess.label && <span className="font-semibold text-foreground/70">{sess.label}: </span>}
                                    {sess.topic}{sess.topic && sess.speaker ? " — " : ""}{sess.speaker}
                                  </p>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        ) : (
          <FadeUp delay={140}>
            <div className="bg-card rounded-2xl border border-dashed border-border py-10 flex flex-col items-center gap-2 text-center mb-8">
              <Bell size={20} className="text-muted-foreground/25" />
              <p className="font-[Lato] text-sm text-muted-foreground">No upcoming events yet — check back soon.</p>
            </div>
          </FadeUp>
        )}

        {/* Sabbath schedule */}
        <FadeUp delay={180}>
          <div className="bg-primary rounded-2xl p-6 text-primary-foreground relative overflow-hidden">
            <p className="font-[Lato] text-[9px] uppercase tracking-[0.22em] text-primary-foreground/50 mb-1">Every Saturday</p>
            <h3 className="font-[Playfair_Display] text-xl font-semibold mb-5">Sabbath Day Schedule</h3>
            <div className="space-y-3">
              {[
                { time: "8:30 – 10:00 AM", name: "Sabbath School" },
                { time: "10:30 – 11:50 AM", name: "Divine Service" },
                { time: "2:30 – 4:30 PM", name: "AYF Program" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between border-b border-primary-foreground/10 pb-3 last:border-b-0 last:pb-0">
                  <span className="font-[Lato] text-sm text-primary-foreground/90">{item.name}</span>
                  <span className="font-[Lato] text-xs text-primary-foreground/55">{item.time}</span>
                </div>
              ))}
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-primary-foreground pointer-events-none">
              <DecorativeCross size={100} opacity={0.04} />
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

// ─── Connect Tab ──────────────────────────────────────────────────────────────

function ConnectTab({ onNavigate }: { onNavigate: (p: PageId) => void }) {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <div className="relative h-52 md:h-72 overflow-hidden">
        <img src={communityPhoto} alt="Malingin SDA Church community" className="w-full h-full object-cover object-[center_65%]" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,20,35,0.80) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 px-5 sm:px-10 md:px-16 pb-8">
          <p className="font-[Lato] text-[10px] text-white/50 uppercase tracking-[0.22em] mb-1">Community</p>
          <h2 className="font-[Playfair_Display] text-2xl md:text-3xl font-semibold text-white">Our Community</h2>
          <p className="font-[Lato] text-sm text-white/60 mt-1">One family in Christ's name.</p>
        </div>
      </div>

      <div className="px-5 sm:px-10 md:px-16 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Ministries */}
          <FadeUp>
            <p className="font-[Lato] text-accent text-[10px] uppercase tracking-[0.22em] mb-2">Get Involved</p>
            <h3 className="font-[Playfair_Display] text-xl font-semibold text-foreground mb-5">Ministries & Groups</h3>
          </FadeUp>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {MINISTRIES.map((m, i) => (
              <FadeUp key={m.id} delay={i * 80}>
                <button
                  onClick={() => onNavigate(m.id)}
                  className="group w-full text-left bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center gap-0">
                    <div className="w-24 h-20 shrink-0 overflow-hidden">
                      <img src={m.photo} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0 px-4 py-3">
                      <p className="font-[Playfair_Display] text-base font-semibold text-foreground leading-tight">{m.name}</p>
                      <p className="font-[Lato] text-xs text-accent mb-0.5">{m.fullName}</p>
                      <p className="font-[Lato] text-xs text-muted-foreground">{m.schedule}</p>
                    </div>
                    <ChevronRight size={15} className="text-muted-foreground shrink-0 mr-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </FadeUp>
            ))}
          </div>

          {/* Theme CTA */}
          <FadeUp>
            <div className="bg-primary rounded-2xl p-6 mb-10 relative overflow-hidden">
              <p className="font-[Lato] text-[9px] uppercase tracking-[0.22em] text-primary-foreground/50 mb-1">Theme 2026</p>
              <h3 className="font-[Playfair_Display] text-xl font-semibold text-primary-foreground italic mb-3">"Pag-uswag"</h3>
              <p className="font-[Lato] text-sm text-primary-foreground/70 mb-5 leading-relaxed max-w-md">
                This year, we move forward together — in faith, in service, and in community. You are part of this growth.
              </p>
              <button
                onClick={() => onNavigate("about")}
                className="font-[Lato] font-bold text-sm px-6 py-2.5 rounded-full bg-white text-primary hover:bg-[#D6E5F5] active:scale-95 transition-all shadow-md"
              >
                I'm New Here
              </button>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-primary-foreground pointer-events-none">
                <DecorativeCross size={120} opacity={0.05} />
              </div>
            </div>
          </FadeUp>

          {/* Contact */}
          <FadeUp>
            <h3 className="font-[Playfair_Display] text-xl font-semibold text-foreground mb-4">Get in Touch</h3>
          </FadeUp>
          <div className="space-y-3 mb-8">
            {[
              { icon: <Phone size={15} />, label: "Phone", value: "To be announced", isLink: false },
              { icon: <Mail size={15} />, label: "Email", value: "sdamalingin@gmail.com", href: "mailto:sdamalingin@gmail.com", isLink: true },
              { icon: <Facebook size={15} />, label: "Facebook", value: "Malingin Seventh-Day Adventist Church", href: "https://www.facebook.com/malingin.church", isLink: true },
              { icon: <MapPin size={15} />, label: "Address", value: "Brgy. Malingin, Bago City, Negros Occidental", isLink: false },
            ].map((c, i) => (
              <FadeUp key={c.label} delay={i * 50}>
                {c.isLink ? (
                  <a
                    href={c.href}
                    target={c.href?.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:bg-secondary transition-colors"
                  >
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0 text-primary">{c.icon}</div>
                    <div>
                      <p className="font-[Lato] text-xs text-muted-foreground">{c.label}</p>
                      <p className="font-[Lato] text-sm font-bold text-foreground">{c.value}</p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0 text-primary">{c.icon}</div>
                    <div>
                      <p className="font-[Lato] text-xs text-muted-foreground">{c.label}</p>
                      <p className="font-[Lato] text-sm text-foreground">{c.value}</p>
                    </div>
                  </div>
                )}
              </FadeUp>
            ))}
          </div>

          {/* Map */}
          <FadeUp>
            <div className="rounded-2xl overflow-hidden border border-border shadow-md mb-8">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3298.865727548701!2d122.9065936460828!3d10.497939062529491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33aec80520d25b9f%3A0x4572c9694808d21!2sMalingin%20Seventh-day%20Adventist%20Church!5e0!3m2!1sen!2sph!4v1781880131972!5m2!1sen!2sph"
                width="100%" height="220" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="Malingin SDA Church Location"
              />
            </div>
          </FadeUp>

          <FadeUp>
            <div className="flex items-center justify-center gap-2 py-4">
              <Heart size={11} className="text-primary" />
              <p className="font-[Lato] text-xs text-muted-foreground">Malingin SDA Church · Bago City, Philippines</p>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [currentPage, setCurrentPage] = useState<PageId>(() =>
    window.location.hash === "#admin" ? "admin" : "main"
  );
  const [choraleTransition, setChoraleTransition] = useState(false);
  const [maayoTransition, setMaayoTransition] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Smooth inertia scrolling for the whole app (skipped if the user prefers reduced motion)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenisRef.current = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToTop = () => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 0.9 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (page: PageId) => {
    if (page === "chorale") {
      // page swap is deferred to the transition's explosion moment (see below)
      setChoraleTransition(true);
      return;
    }
    if (page === "maayo") {
      // page swap is deferred to the transition's wipe moment (see below)
      setMaayoTransition(true);
      return;
    }
    setCurrentPage(page);
    scrollToTop();
  };

  const handleChoraleExplode = () => {
    setCurrentPage("chorale");
    scrollToTop();
  };

  const handleMaAYOWipe = () => {
    setCurrentPage("maayo");
    scrollToTop();
  };

  const handleBack = () => {
    setCurrentPage("main");
    scrollToTop();
  };

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage("main");
    scrollToTop();
  };

  const fullPageComponents: Partial<Record<PageId, React.ReactNode>> = {
    maayo: <MaAYOPage onBack={handleBack} />,
    chorale: <ChoralePage onBack={handleBack} />,
    about: <AboutPage onBack={handleBack} />,
    connect: <ConnectPage onBack={handleBack} onNavigate={handleNavigate} />,
    give: <GivePage onBack={handleBack} onGoToAdmin={() => handleNavigate("admin")} />,
    prayer: <PrayerPage onBack={handleBack} />,
    inquiry: <InquiryPage onBack={handleBack} />,
    messages: <MessagesPage onBack={handleBack} />,
    admin: <AdminPage onBack={handleBack} />,
  };

  const tabs: Record<string, React.ReactNode> = {
    home: <HomeTab onNavigate={handleNavigate} onOpenSermons={() => handleNavClick("sermons")} />,
    sermons: <SermonsTab />,
    events: <EventsTab />,
    connect: <ConnectTab onNavigate={handleNavigate} />,
  };

  const content = currentPage !== "main" ? fullPageComponents[currentPage] : tabs[activeTab];

  // Admin panel renders completely standalone — no nav, no intro
  if (currentPage === "admin") {
    return <AdminPage onBack={handleBack} />;
  }

  return (
    <>
      {/* Intro screen — renders on top, removed after animation */}
      {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}

      {/* Chorale entrance — musical notes spiral in and burst, revealing the page */}
      <AnimatePresence>
        {choraleTransition && (
          <ChoraleTransitionOverlay onExplode={handleChoraleExplode} onDone={() => setChoraleTransition(false)} />
        )}
      </AnimatePresence>

      {/* MaAYO entrance — a crowd walks in, the leader leaps and wipes the page in */}
      <AnimatePresence>
        {maayoTransition && (
          <MaAYOTransitionOverlay onWipe={handleMaAYOWipe} onDone={() => setMaayoTransition(false)} />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-background">
        {/* Floating pill nav */}
        <NavBar
          activeTab={activeTab}
          currentPage={currentPage}
          onNavClick={handleNavClick}
          onNavigate={handleNavigate}
        />

        {/* Page content — pt clears the floating nav */}
        <main className="pt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage !== "main" ? currentPage : activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Floating "ask a question" widget — visible on every non-admin page */}
        {currentPage !== "messages" && <ContactWidget onClick={() => handleNavigate("messages")} />}
      </div>

      <style>{`
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        html.lenis, html.lenis body { height: auto; }
        html.lenis.lenis-smooth { scroll-behavior: auto !important; }
        html.lenis.lenis-stopped { overflow: hidden; }
      `}</style>
    </>
  );
}
