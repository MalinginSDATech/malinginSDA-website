import { useState } from "react";
import { Home, BookOpen, Bell, Users, Menu, X, MapPin, Clock, ChevronRight, Phone, Mail, Heart, Facebook } from "lucide-react";

import { MaAYOPage } from "./components/MaAYOPage";
import { ChoralePage } from "./components/ChoralePage";
import { AboutPage } from "./components/AboutPage";
import { GivePage } from "./components/GivePage";
import { PrayerPage } from "./components/PrayerPage";
import { InquiryPage } from "./components/InquiryPage";
import { FadeUp } from "./components/FadeUp";
import { ConnectPage } from "./components/ConnectPage";

import screenshotPic from "../imports/Screenshot_2026-06-19_232524.png";
// pulpit_pic.jpg not present — fallback to screenshot until you add the pulpit image
const churchPhoto: string = screenshotPic;
import churchVideo from "../imports/AQPIGIoZZpw4Z-Hz57VWI7g2b_kvpNnnJ1uLTIA2bjhQ3xTtbVt_77ZEqyB-2N1N3ohLusPiERPHqJW0JTORHcTGEvW4sGPXvak.mp4";
import communityPhoto from "../imports/malingin_community.jpg";
import maayoPic from "../imports/MaAYO_pic.jpg";
import choralePic from "../imports/Chorale_pic.jpg";

type PageId = "main" | "maayo" | "chorale" | "about" | "give" | "prayer" | "inquiry" | "connect";

const NAV_ITEMS = [
  { id: "home", icon: Home, label: "Home" },
  { id: "events", icon: Bell, label: "Events" },
  { id: "sermons", icon: BookOpen, label: "Sermons" },
  { id: "connect", icon: Users, label: "Connect" },
];

const SERVICES = [
  {
    day: "Wednesday", label: "Midweek Service",
    times: ["7:00 PM – 8:00 PM"], location: "Malingin SDA Church",
  },
  {
    day: "Friday", label: "Vesper Service",
    times: ["7:00 PM – 8:00 PM"], location: "Malingin SDA Church",
  },
  {
    day: "Saturday", label: "Sabbath Day",
    times: ["8:30 AM – 10:00 AM — Sabbath School", "10:30 AM – 11:50 AM — Divine Service", "2:30 PM – 4:30 PM — AYF Program"],
    location: "Malingin SDA Church",
  },
];

const EVENTS = [
  {
    day: "27", month: "June", year: "2026",
    title: "Bago District Youth Association",
    tag: "Youth",
    details: [
      { label: "Location", value: "To Be Announced" },
      { label: "Details", value: "Details to follow." },
    ],
  },
  {
    day: "5", month: "Dec", year: "2026",
    title: "Malingin SDA Church Anniversary",
    tag: "Church",
    details: [
      { label: "Theme", value: "To Be Announced" },
      { label: "Location", value: "Malingin SDA Church" },
      { label: "Details", value: "Details to follow." },
    ],
  },
];

const ANNOUNCEMENTS: { date?: string; title?: string; summary?: string }[] = [];

function TagBadge({ label }: { label: string }) {
  const colors: Record<string, string> = {
    Youth: "bg-[#1A4B8C]/10 text-[#1A4B8C]",
    Church: "bg-[#2D6BB5]/10 text-[#2D6BB5]",
    Outreach: "bg-[#1E7C4A]/10 text-[#1E7C4A]",
    Worship: "bg-[#2D6BB5]/10 text-[#2D6BB5]",
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${colors[label] ?? "bg-muted text-muted-foreground"}`}>
      {label}
    </span>
  );
}

function HomeTab({ onNavigate, onOpenSermons }: { onNavigate: (p: PageId) => void; onOpenSermons?: () => void }) {
  return (
    <div className="pb-24">
      {/* Hero */}
      <div className="relative h-72 overflow-hidden">
        <img src={churchPhoto} alt="Malingin Seventh-day Adventist Church" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#162033]/85 via-[#162033]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <p className="text-[#D6E5F5] text-[10px] tracking-[0.2em] uppercase font-[Lato] mb-1">Brgy. Malingin · Bago City, Neg. Occ.</p>
          <h1 className="font-[Playfair_Display] text-white text-2xl leading-snug font-semibold">
            Malingin<br /><span className="italic">Seventh-day Adventist</span><br />Church
          </h1>
        </div>
      </div>

      

      {/* Pag-uswag banner */}
      <div className="bg-primary px-6 py-4">
        <p className="font-[Lato] text-[#D6E5F5] text-[10px] uppercase tracking-widest mb-1">Theme 2026</p>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="font-[Playfair_Display] text-white text-xl font-bold italic">"Pag-uswag"</span>
          <span className="font-[Lato] text-[#D6E5F5]/70 text-xs">— Progress · Growth · Advancement</span>
        </div>
      </div>

      {/* Brief About (mobile only) */}
      <section className="px-5 pt-6 pb-2 md:hidden">
        <FadeUp>
          <h2 className="font-[Playfair_Display] text-xl font-semibold text-foreground mb-3">About the Church</h2>
        </FadeUp>
        <FadeUp delay={80}>
          <div className="bg-card border border-border rounded-xl p-5 mb-3">
            <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed">
              The Malingin Seventh-day Adventist Church is a warm, faith-driven community dedicated to worship, fellowship, and spiritual growth. Organized on <span className="font-semibold text-foreground">December 4, 2021</span>, and led by <span className="font-semibold text-foreground">Pastor Ur Caro</span> of the Bago City district, the church is situated near the peaceful rice fields of Barangay Malingin, Bago City.
            </p>
          </div>
        </FadeUp>
        <FadeUp delay={140}>
          <button
            onClick={() => onNavigate("about")}
            className="w-full flex items-center justify-center gap-2 bg-secondary border border-border rounded-xl py-3.5 font-[Lato] text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all active:scale-[0.98]"
          >
            Want to know more? Click here
            <ChevronRight size={15} />
          </button>
        </FadeUp>
      </section>

      {/* Desktop grid (md+) — uses full width and organizes content into cards */}
      <section className="hidden md:block px-10 pt-8 pb-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Large intro card */}
          <div className="col-span-6">
            <div className="bg-card border border-border rounded-xl p-8 flex flex-col">
              <div>
                <h2 className="font-[Playfair_Display] text-2xl font-semibold text-foreground mb-3">Welcome to Malingin SDA Church</h2>
                <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed mb-4">
                  A warm, faith-driven community dedicated to worship, fellowship, and spiritual growth. Located in Barangay Malingin, Bago City — we gather each Sabbath to study, worship, and serve.
                </p>
                <div className="space-y-3">
                  <button onClick={() => onNavigate("about")} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-bold">Learn more</button>
                  <button onClick={() => onNavigate("give")} className="inline-flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-md">Give / Tithe</button>
                </div>
              </div>
              <div className="mt-6 text-xs text-muted-foreground">Organized December 4, 2021 · Pastor Ur Caro</div>
            </div>
          </div>

          {/* Right column: Sermons card (matches left card size) */}
          <div className="col-span-6">
            <div className="bg-card border border-border rounded-xl p-8 flex flex-col justify-between h-full">
              <div>
                <h3 className="font-[Playfair_Display] text-2xl font-semibold text-foreground mb-3">Sermons</h3>
                <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed">Listen to recent sermons and explore the "Pag-uswag" series. Sermon recordings and notes are available for catch-up.</p>
              </div>
              <div className="mt-6">
                <button onClick={() => onOpenSermons ? onOpenSermons() : null} className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-md font-bold">Go to Sermons</button>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary grid below: video + ministries */}
        <div className="grid grid-cols-12 gap-6 mt-4">
          <div className="col-span-8">
            <div className="space-y-4">
              {ANNOUNCEMENTS.map((a) => (
                <div key={a.title} className="rounded-xl border border-border p-6 bg-card">
                  <div className="flex items-center justify-between">
                    <p className="font-[Lato] text-xs text-muted-foreground">{a.date}</p>
                  </div>
                  <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground mt-2">{a.title}</h3>
                  <p className="font-[Lato] text-sm text-muted-foreground mt-2">{a.summary}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-4 space-y-4">
            {/* intentionally left empty; Sermons CTA moved to the right of the intro card */}
          </div>
        </div>
      </section>

      {/* Service Times removed here; moved into Events view to avoid duplicates */}

      {/* Announcements — blank placeholder */}
      <section className="px-5 pt-4">
        <FadeUp>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[Playfair_Display] text-xl font-semibold text-foreground">Announcements</h2>
            <button className="flex items-center gap-1 text-accent text-xs font-[Lato] font-bold uppercase tracking-wide">
              All <ChevronRight size={13} />
            </button>
          </div>
        </FadeUp>
        <FadeUp delay={60}>
          <div className="bg-card rounded-xl border border-dashed border-border p-8 flex flex-col items-center text-center gap-2 mb-3">
            <Bell size={22} className="text-muted-foreground/30" />
            <p className="font-[Lato] text-sm text-muted-foreground">No announcements at this time.</p>
            <p className="font-[Lato] text-xs text-muted-foreground/60">Check back soon.</p>
          </div>
        </FadeUp>

        {/* Video strip (desktop/mobile) */}
        <FadeUp delay={100}>
          <div className="mt-2 rounded-xl overflow-hidden border border-border">
            <video src={churchVideo} autoPlay muted loop playsInline className="w-full h-48 object-cover" />
            <div className="bg-secondary px-4 py-3 flex items-start gap-2">
              <span className="text-sm mt-0.5">🌾</span>
              <p className="font-[Lato] text-xs text-foreground/70 leading-relaxed italic">
                Every Sabbath, our services are surrounded by the tranquil green rice fields of Barangay Malingin — a blessing that makes worship always feel fresh and close to God's creation.
              </p>
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}

function SermonsTab({ onBack }: { onBack?: () => void }) {
  const SERMONS: { id?: number; title?: string; date?: string; speaker?: string; excerpt?: string }[] = [];

  return (
    <div className="pb-24 px-5 pt-6">
      <div className="mb-3">
        <button onClick={() => onBack && onBack()} className="inline-flex items-center gap-2 text-xs text-accent font-[Lato]">
          <ChevronRight size={14} className="transform rotate-180" />
          Back
        </button>
      </div>
      <h2 className="font-[Playfair_Display] text-2xl font-semibold text-foreground mb-1">Sermons</h2>
      <p className="font-[Lato] text-sm text-muted-foreground mb-6">"Pag-uswag" Series · 2026</p>

      <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {SERMONS.length > 0 ? (
              SERMONS.map((s) => (
                <article key={s.id} className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground">{s.date} · {s.speaker}</p>
                    <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground mt-1">{s.title}</h3>
                    <p className="font-[Lato] text-sm text-muted-foreground mt-2">{s.excerpt}</p>
                  </div>
                  <div className="bg-secondary p-3 flex items-center justify-between">
                    <button className="bg-primary text-primary-foreground px-3 py-2 rounded-md font-bold">Listen</button>
                    <button className="text-xs text-muted-foreground">Notes</button>
                  </div>
                </article>
              ))
            ) : (
              <>
                {[1, 2].map((i) => (
                  <div key={i} className="rounded-xl border border-dashed border-border overflow-hidden">
                    <div className="h-40 bg-secondary flex items-center justify-center">
                      <div className="text-center">
                        <BookOpen size={28} className="text-muted-foreground/30 mx-auto mb-2" />
                        <p className="font-[Lato] text-xs text-muted-foreground italic">Sermon {i === 1 ? "(Latest)" : "(Previous)"} — Coming soon</p>
                      </div>
                    </div>
                    <div className="bg-card p-4 flex items-center justify-between gap-3">
                      <div>
                        <div className="h-3.5 w-28 bg-muted rounded mb-1.5" />
                        <div className="h-3 w-20 bg-muted/60 rounded" />
                      </div>
                      <div className="bg-muted text-muted text-xs font-[Lato] font-bold uppercase tracking-wide px-4 py-2 rounded-full opacity-30 select-none">Listen</div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

        <aside className="md:col-span-1 space-y-4">
          <div className="rounded-xl border border-border p-4 bg-card">
            <h4 className="font-[Playfair_Display] text-sm font-semibold">Featured</h4>
            <p className="text-xs text-muted-foreground mt-2">No featured sermon yet.</p>
          </div>

          <div className="rounded-xl border border-border p-4 bg-card">
            <h4 className="font-[Playfair_Display] text-sm font-semibold">Series</h4>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
              <li>Pag-uswag (2026)</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function EventsTab() {
  return (
    <div className="pb-24 px-5 pt-6">
      <h2 className="font-[Playfair_Display] text-2xl font-semibold text-foreground mb-6">Upcoming Events</h2>

      <div className="space-y-4 mb-6">
        {EVENTS.map((e) => (
          <div key={e.title} className="flex gap-4 bg-card border border-border rounded-xl p-4">
            <div className="shrink-0 w-14 text-center">
              <p className="font-[Playfair_Display] text-2xl font-bold text-primary leading-none">{e.day}</p>
              <p className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{e.month}</p>
              <p className="font-[Lato] text-[10px] text-muted-foreground">{e.year}</p>
            </div>
            <div className="border-l border-border pl-4 flex-1 min-w-0">
              <TagBadge label={e.tag} />
              <h3 className="font-[Playfair_Display] text-base font-semibold text-foreground mt-2 mb-2 leading-snug">{e.title}</h3>
              {e.details.map((d) => (
                <p key={d.label} className="font-[Lato] text-xs text-muted-foreground leading-relaxed">
                  <span className="font-bold text-foreground/70">{d.label}:</span> {d.value}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Blank placeholder for more events */}
      <div className="bg-card rounded-xl border border-dashed border-border py-10 flex flex-col items-center gap-2 text-center">
        <Bell size={22} className="text-muted-foreground/30" />
        <p className="font-[Lato] text-sm text-muted-foreground">More events coming soon.</p>
      </div>

      {/* Sabbath schedule */}
      <div className="mt-6 bg-primary rounded-xl p-5 text-primary-foreground">
        <p className="font-[Lato] text-[10px] uppercase tracking-widest text-primary-foreground/60 mb-2">Every Saturday</p>
        <h3 className="font-[Playfair_Display] text-lg font-semibold mb-4">Sabbath Day Schedule</h3>
        <div className="space-y-3">
          {[
            { time: "8:30 – 10:00 AM", name: "Sabbath School" },
            { time: "10:30 – 11:50 AM", name: "Divine Service" },
            { time: "2:30 – 4:30 PM", name: "AYF Program" },
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between border-b border-primary-foreground/10 pb-3 last:border-b-0">
              <span className="font-[Lato] text-sm text-primary-foreground/90">{item.name}</span>
              <span className="font-[Lato] text-xs text-primary-foreground/60">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ConnectTabProps {
  onNavigate: (page: PageId) => void;
}

function ConnectTab({ onNavigate }: ConnectTabProps) {
  const MINISTRIES = [
    {
      id: "maayo" as PageId,
      name: "MaAYO",
      fullName: "Malingin Adventist Youth Organization",
      desc: "Every Saturday · AYF Program 2:30 PM",
      photo: maayoPic,
    },
    {
      id: "chorale" as PageId,
      name: "Advent Chorale",
      fullName: "Malingin Advent Chorale",
      desc: "Music & worship ministry",
      photo: choralePic,
    },
  ];

  return (
    <div className="pb-24">
      {/* Community hero — malingin_community.jpg */}
      <div className="relative h-44 overflow-hidden">
        <img src={communityPhoto} alt="Malingin SDA Church community" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#162033]/75 to-transparent" />
        <div className="absolute bottom-0 p-6">
          <h2 className="font-[Playfair_Display] text-2xl font-semibold text-white">Our Community</h2>
          <p className="font-[Lato] text-sm text-[#D6E5F5]/80 mt-1">One family in Christ's name.</p>
        </div>
      </div>

      <div className="px-5 pt-6">
        {/* Ministries with photos */}
        <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground mb-3">Ministries & Groups</h3>
        <div className="space-y-3 mb-8">
          {MINISTRIES.map((m) => (
            <button
              key={m.id}
              onClick={() => onNavigate(m.id)}
              className="w-full flex items-center gap-0 bg-card border border-border rounded-xl overflow-hidden hover:bg-secondary active:scale-[0.98] transition-all text-left"
            >
              <div className="w-24 h-20 shrink-0">
                <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 px-4 py-3">
                <p className="font-[Playfair_Display] text-base font-semibold text-foreground leading-tight">{m.name}</p>
                <p className="font-[Lato] text-xs text-accent mb-0.5">{m.fullName}</p>
                <p className="font-[Lato] text-xs text-muted-foreground">{m.desc}</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground shrink-0 mr-4" />
            </button>
          ))}
        </div>

        {/* Pag-uswag CTA */}
        <div className="bg-primary rounded-xl p-5 mb-6">
          <p className="font-[Lato] text-[10px] uppercase tracking-widest text-primary-foreground/60 mb-1">Theme 2026</p>
          <h3 className="font-[Playfair_Display] text-lg font-semibold text-primary-foreground italic mb-2">"Pag-uswag"</h3>
          <p className="font-[Lato] text-sm text-primary-foreground/80 mb-4 leading-relaxed">
            This year, we move forward together — in faith, in service, and in community. You are part of this growth.
          </p>
          <button
            onClick={() => onNavigate("about")}
            className="w-full bg-primary-foreground text-primary font-[Lato] font-bold text-sm py-3 rounded-full tracking-wide hover:opacity-90 active:scale-95 transition-all"
          >
            I'm New Here
          </button>
        </div>

        {/* Contact */}
        <h3 className="font-[Playfair_Display] text-lg font-semibold text-foreground mb-3">Get in Touch</h3>
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Phone size={16} className="text-primary" />
            </div>
            <div>
              <p className="font-[Lato] text-xs text-muted-foreground">Phone</p>
              <p className="font-[Lato] text-sm text-muted-foreground italic">To be announced</p>
            </div>
          </div>
          <a href="mailto:sdamalingin@gmail.com" className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:bg-secondary transition-colors">
            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Mail size={16} className="text-primary" />
            </div>
            <div>
              <p className="font-[Lato] text-xs text-muted-foreground">Email</p>
              <p className="font-[Lato] text-sm font-bold text-foreground">sdamalingin@gmail.com</p>
            </div>
          </a>
          <a href="https://www.facebook.com/malingin.church" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:bg-secondary transition-colors">
            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Facebook size={16} className="text-primary" />
            </div>
            <div>
              <p className="font-[Lato] text-xs text-muted-foreground">Facebook</p>
              <p className="font-[Lato] text-sm font-bold text-foreground">Malingin Seventh-Day Adventist Church</p>
            </div>
          </a>
          <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <MapPin size={16} className="text-primary" />
            </div>
            <div>
              <p className="font-[Lato] text-xs text-muted-foreground">Address</p>
              <p className="font-[Lato] text-sm font-bold text-foreground">Brgy. Malingin, Bago City</p>
              <p className="font-[Lato] text-xs text-muted-foreground">Negros Occidental, Philippines</p>
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="rounded-xl overflow-hidden border border-border mb-6">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3298.865727548701!2d122.9065936460828!3d10.497939062529491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33aec80520d25b9f%3A0x4572c9694808d21!2sMalingin%20Seventh-day%20Adventist%20Church!5e0!3m2!1sen!2sph!4v1781880131972!5m2!1sen!2sph"
            width="100%" height="220" style={{ border: 0 }} allowFullScreen loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" title="Malingin SDA Church Location"
          />
        </div>

        <div className="flex items-center justify-center gap-2 py-4 border-t border-border">
          <Heart size={12} className="text-primary" />
          <p className="font-[Lato] text-xs text-muted-foreground">Malingin SDA Church · Bago City, Philippines</p>
        </div>
      </div>
    </div>
  );
}

const MENU_ITEMS: { label: string; page?: PageId; href?: string }[] = [
  { label: "Connect", page: "connect" },
  { label: "About the Church", page: "about" },
  { label: "Give / Tithe", page: "give" },
  { label: "Prayer Request", page: "prayer" },
  { label: "Church Inquiry", page: "inquiry" },
  { label: "Live Stream", href: "" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageId>("main");

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  const handleBack = () => setCurrentPage("main");

  const tabs: Record<string, React.ReactNode> = {
    home: <HomeTab onNavigate={handleNavigate} onOpenSermons={() => setActiveTab("sermons")} />,
    sermons: <SermonsTab onBack={() => setActiveTab("home")} />,
    events: <EventsTab />,
    connect: <ConnectTab onNavigate={handleNavigate} />,
  };

  const fullPageComponents: Partial<Record<PageId, React.ReactNode>> = {
    maayo: <MaAYOPage onBack={handleBack} />,
    chorale: <ChoralePage onBack={handleBack} />,
    about: <AboutPage onBack={handleBack} />,
    connect: <ConnectPage onBack={handleBack} onNavigate={handleNavigate} />,
    give: <GivePage onBack={handleBack} />,
    prayer: <PrayerPage onBack={handleBack} />,
    inquiry: <InquiryPage onBack={handleBack} />,
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-sm min-h-screen bg-background relative overflow-hidden flex flex-col shadow-2xl md:hidden">

        {currentPage !== "main" ? (
          <main className="flex-1 overflow-y-auto scrollbar-hide">
            {fullPageComponents[currentPage]}
          </main>
        ) : (
          <>
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border flex items-center justify-between px-5 py-3">
              <div>
                <p className="font-[Playfair_Display] font-semibold text-sm text-foreground leading-tight">Malingin SDA Church</p>
                <p className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest">Bago City, Negros Occidental</p>
              </div>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
              >
                {menuOpen ? <X size={20} className="text-foreground" /> : <Menu size={20} className="text-foreground" />}
              </button>
            </header>

            {/* Slide-down menu */}
            {menuOpen && (
              <div className="absolute top-[57px] left-0 right-0 z-30 bg-card border-b border-border shadow-lg">
                {MENU_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.page) handleNavigate(item.page);
                      else setMenuOpen(false);
                    }}
                    className="w-full text-left px-6 py-4 font-[Lato] text-sm text-foreground border-b border-border last:border-b-0 hover:bg-secondary transition-colors flex items-center justify-between"
                  >
                    {item.label}
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}

            {/* Content */}
            <main className="flex-1 overflow-y-auto scrollbar-hide">
              {tabs[activeTab]}
            </main>

            {/* Bottom nav */}
            <nav className="sticky bottom-0 z-40 bg-card border-t border-border px-2 py-2 flex items-center justify-around">
              {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors ${activeTab === id ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Icon size={20} strokeWidth={activeTab === id ? 2.5 : 1.75} />
                  <span className={`font-[Lato] text-[10px] uppercase tracking-widest ${activeTab === id ? "font-bold" : ""}`}>{label}</span>
                  {activeTab === id && <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
                </button>
              ))}
            </nav>
          </>
        )}
      </div>

      {/* Desktop layout (md and up) — landscape / laptop-friendly */}
      <div className="hidden md:flex w-full max-w-screen-2xl min-h-screen bg-background">
        <div className="flex-1 flex flex-col">
          {/* Top header across the layout */}
          <header className="flex items-center justify-between px-10 py-6 border-b border-border">
            <div>
              <p className="font-[Playfair_Display] font-semibold text-2xl text-foreground">Malingin SDA Church</p>
              <p className="font-[Lato] text-sm text-muted-foreground uppercase tracking-widest">Brgy. Malingin · Bago City, Negros Occidental</p>
            </div>
            <div className="text-right">
              <p className="font-[Lato] text-sm text-muted-foreground">Theme 2026</p>
              <p className="font-[Playfair_Display] text-lg italic">"Pag-uswag"</p>
            </div>
          </header>

          <div className="flex flex-1">
            {/* Slim left navigation rail */}
            <nav className="w-56 p-6 border-r border-border flex flex-col gap-3">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => item.page && handleNavigate(item.page as PageId)}
                  className={`text-left w-full px-3 py-2 rounded-lg text-sm font-[Lato] transition-colors ${currentPage === item.page ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"}`}
                >
                  {item.label}
                </button>
              ))}
              <div className="mt-auto text-xs text-muted-foreground">© Malingin SDA · 2026</div>
            </nav>

            {/* Main content — larger hero + content in two columns where appropriate */}
            <main className="flex-1 overflow-auto p-10">
              {/* Larger hero for desktop */}
              <div className="relative h-72 rounded-xl overflow-hidden mb-8">
                <img src={churchPhoto} alt="Malingin SDA Church" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#162033]/85 via-[#162033]/30 to-transparent" />
                <div className="absolute bottom-8 left-10 text-white">
                  <h1 className="font-[Playfair_Display] text-4xl font-semibold leading-tight">Malingin<br /><span className="italic">Seventh-day Adventist Church</span></h1>
                  <p className="font-[Lato] text-sm text-[#D6E5F5]/80 mt-2">A welcoming community near the rice fields of Bago City.</p>
                </div>
              </div>

              {/* Content grid: main article + related cards */}
              <div className="grid grid-cols-3 gap-8">
                <article className="col-span-2 space-y-6">
                  {currentPage !== "main" ? (
                    <div>{fullPageComponents[currentPage]}</div>
                  ) : (
                    <div>{tabs[activeTab]}</div>
                  )}
                </article>

                <aside className="col-span-1">
                  <div className="bg-card border border-border rounded-xl p-4">
                    <EventsTab />
                  </div>
                </aside>
              </div>
            </main>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
