import { ArrowLeft, MapPin, Clock, Calendar, Users, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { FadeUp } from "./FadeUp";
import churchPhoto from "../../imports/Screenshot_2026-06-19_232524.png";
import communityPhoto from "../../imports/malingin_community.jpg";

interface Props {
  onBack: () => void;
}

const CULTURE_ITEMS = [
  { icon: "🍽", title: "Fellowship Potlucks", desc: "Gathering to share lunch and meaningful conversations after the weekly Sabbath services." },
  { icon: "🎵", title: "Choir Practices", desc: "Preparing music and singing in harmony to deliver God's message through song." },
  { icon: "📖", title: "Bible Studies", desc: "Exploring scripture in small groups to strengthen faith and biblical understanding." },
  { icon: "🤝", title: "District Fellowship", desc: "Connecting with sister churches across the Bago City district for larger gatherings and mutual support." },
];

const SERVICES = [
  { day: "Wednesday", label: "Midweek Service", times: ["7:00 PM – 8:00 PM"] },
  { day: "Friday", label: "Vesper Service", times: ["7:00 PM – 8:00 PM"] },
  { day: "Saturday", label: "Sabbath Day", times: ["8:30–10:00 AM — Sabbath School", "10:30–11:50 AM — Divine Service", "2:30–4:30 PM — AYF Program"] },
];

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <FadeUp>
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">{icon}</span>
            <h3 className="font-[Playfair_Display] text-base font-semibold text-foreground">{title}</h3>
          </div>
          {open ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
        </button>
        {open && (
          <div className="px-5 pb-5 border-t border-border">
            <div className="pt-4">{children}</div>
          </div>
        )}
      </div>
    </FadeUp>
  );
}

export function AboutPage({ onBack }: Props) {
  return (
    <div className="min-h-full pb-10">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-border flex items-center gap-3 px-5 py-3">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
        >
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div>
          <p className="font-[Playfair_Display] font-semibold text-sm text-foreground">About the Church</p>
          <p className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest">Malingin SDA Church</p>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-56 overflow-hidden">
        <img src={churchPhoto} alt="Malingin SDA Church" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#162033]/80 via-[#162033]/20 to-transparent" />
        <div className="absolute bottom-0 p-6">
          <h1 className="font-[Playfair_Display] text-white text-xl font-semibold leading-snug">
            Malingin<br /><span className="italic">Seventh-day Adventist Church</span>
          </h1>
          <p className="font-[Lato] text-[#D6E5F5] text-xs mt-1">Brgy. Malingin, Bago City, Negros Occidental</p>
        </div>
      </div>

      {/* Theme strip */}
      <div className="bg-primary px-5 py-3">
        <p className="font-[Lato] text-[10px] uppercase tracking-widest text-primary-foreground/60">Theme 2026</p>
        <p className="font-[Playfair_Display] text-white font-bold italic">"Pag-uswag" — Progress · Growth · Advancement</p>
      </div>

      <div className="px-5 pt-6">

        {/* Intro */}
        <FadeUp>
          <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed mb-6">
            The Malingin Seventh-day Adventist Church is a warm, faith-driven community dedicated to worship, fellowship, and spiritual growth. Situated near the agricultural farming areas of Bago City, the church provides a serene and welcoming environment for its congregation.
          </p>
        </FadeUp>

        {/* History */}
        <Section title="History & Foundation" icon="🏛">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-primary mt-0.5 shrink-0" />
              <div className="w-0.5 h-12 bg-border mt-1" />
            </div>
            <div>
              <p className="font-[Lato] text-xs font-bold text-accent uppercase tracking-widest mb-1">December 4, 2021</p>
              <p className="font-[Lato] text-sm text-foreground font-semibold">Church Organized</p>
              <p className="font-[Lato] text-xs text-muted-foreground mt-0.5 leading-relaxed">Under the Negros Occidental Conference (NOC) of the worldwide Seventh-day Adventist Church.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-accent mt-0.5 shrink-0" />
            <div>
              <p className="font-[Lato] text-xs font-bold text-accent uppercase tracking-widest mb-1">Present</p>
              <p className="font-[Lato] text-sm text-foreground font-semibold">Growing Community</p>
              <p className="font-[Lato] text-xs text-muted-foreground mt-0.5 leading-relaxed">A close-knit group of believers, primarily composed of families from Barangay Malingin and surrounding neighborhoods.</p>
            </div>
          </div>
        </Section>

        {/* Leadership */}
        <Section title="Leadership & Ministry" icon="✝️">
          <div className="flex items-center gap-4 mb-4 bg-secondary rounded-xl p-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Users size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-[Lato] text-xs text-muted-foreground uppercase tracking-widest">District Pastor</p>
              <p className="font-[Playfair_Display] text-base font-semibold text-foreground">Pastor Ur Caro</p>
              <p className="font-[Lato] text-xs text-muted-foreground">Bago City District, NOC</p>
            </div>
          </div>
          <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed">
            The day-to-day church operations and spiritual care of the congregation are actively managed by dedicated lay members, including local elders, deacons, and Sabbath School teachers.
          </p>
        </Section>

        {/* Culture */}
        <Section title="Church Culture & Fellowship" icon="🌾">
          <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed mb-4">
            Vibrant community life revolves around shared faith and genuine connection. Some of the most cherished activities:
          </p>
          <div className="space-y-3">
            {CULTURE_ITEMS.map((item, i) => (
              <div key={i} className="flex gap-3 bg-secondary rounded-lg p-3">
                <span className="text-lg shrink-0">{item.icon}</span>
                <div>
                  <p className="font-[Lato] text-sm font-bold text-foreground">{item.title}</p>
                  <p className="font-[Lato] text-xs text-muted-foreground leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Service Times */}
        <Section title="Service Schedule" icon="📅">
          <div className="space-y-3">
            {SERVICES.map((s) => (
              <div key={s.day} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-[Lato] text-xs font-bold text-accent uppercase tracking-widest">{s.day}</p>
                  <span className="text-border text-xs">·</span>
                  <p className="font-[Lato] text-xs text-muted-foreground">{s.label}</p>
                </div>
                {s.times.map((t) => (
                  <div key={t} className="flex items-start gap-2 mt-1">
                    <Clock size={12} className="text-muted-foreground shrink-0 mt-0.5" />
                    <span className="font-[Lato] text-sm text-foreground">{t}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Section>

        {/* Community photo */}
        <FadeUp className="mb-4">
          <div className="rounded-xl overflow-hidden border border-border">
            <img src={communityPhoto} alt="Malingin SDA Church community" className="w-full h-44 object-cover" />
            <div className="bg-secondary px-4 py-3 flex items-start gap-2">
              <span className="text-sm">🌾</span>
              <p className="font-[Lato] text-xs text-foreground/70 italic leading-relaxed">
                Surrounded by the peaceful rice fields of Barangay Malingin — every Sabbath feels fresh and close to God's creation.
              </p>
            </div>
          </div>
        </FadeUp>

        {/* Location */}
        <FadeUp>
          <div className="rounded-xl overflow-hidden border border-border mb-6">
            <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
              <MapPin size={15} className="text-primary shrink-0" />
              <div>
                <p className="font-[Lato] text-sm font-bold text-foreground">Brgy. Malingin, Bago City</p>
                <p className="font-[Lato] text-xs text-muted-foreground">Negros Occidental, Philippines</p>
              </div>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3298.865727548701!2d122.9065936460828!3d10.497939062529491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33aec80520d25b9f%3A0x4572c9694808d21!2sMalingin%20Seventh-day%20Adventist%20Church!5e0!3m2!1sen!2sph!4v1781880131972!5m2!1sen!2sph"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Malingin SDA Church Location"
            />
          </div>
        </FadeUp>

        {/* Closing */}
        <FadeUp>
          <div className="bg-primary rounded-xl p-5 mb-6 text-center">
            <p className="font-[Playfair_Display] text-lg font-semibold text-primary-foreground italic mb-2">
              A welcoming space for all.
            </p>
            <p className="font-[Lato] text-sm text-primary-foreground/80 leading-relaxed">
              Whether for lifelong Adventists, those exploring their faith, or individuals seeking a supportive community near the farms of Bago City — you are always welcome here.
            </p>
          </div>
        </FadeUp>

      </div>
    </div>
  );
}
