import { ArrowLeft, MapPin, Clock } from "lucide-react";
import { FadeUp } from "./FadeUp";
import churchPhoto from "../../imports/Bird's Eye View.png";
import communityPhoto from "../../imports/malingin_community.jpg";
import pulpitPic from "../../imports/pulpit_pic.jpg";
import beforeOrgPic from "../../imports/before organization.jpg";
import afterOrgPic from "../../imports/after organization.jpg";
import firstFamiliesPic from "../../imports/first families.jpg";
import constructionPic from "../../imports/construction.jpg";

interface Props {
  onBack: () => void;
}

const CULTURE_ITEMS = [
  { icon: "🍽️", title: "Fellowship Potlucks", desc: "Sharing a meal and meaningful conversations every Sabbath after service.", bg: "bg-amber-50", border: "border-amber-200", iconBg: "bg-amber-100" },
  { icon: "🎵", title: "Choir Practices", desc: "Preparing music and praise to deliver God's message in harmony.", bg: "bg-sky-50", border: "border-sky-200", iconBg: "bg-sky-100" },
  { icon: "📖", title: "Bible Studies", desc: "Small groups exploring scripture to strengthen faith and understanding.", bg: "bg-emerald-50", border: "border-emerald-200", iconBg: "bg-emerald-100" },
  { icon: "🤝", title: "District Fellowship", desc: "Connecting with sister churches across the Bago City district.", bg: "bg-violet-50", border: "border-violet-200", iconBg: "bg-violet-100" },
];

const WEEKDAY_SERVICES = [
  { day: "Wednesday", label: "Midweek Service", time: "7:00 PM – 8:00 PM", icon: "🙏" },
  { day: "Friday", label: "Vesper Service", time: "7:00 PM – 8:00 PM", icon: "🌅" },
];

const SABBATH_SLOTS = [
  { label: "Sabbath School", time: "8:30–10:00 AM" },
  { label: "Divine Service", time: "10:30–11:50 AM" },
  { label: "AYF Program", time: "2:30–4:30 PM" },
];

const PAST_LEADERS = [
  { name: "Pastor Joel Alvarez", role: "Founding Pastor", detail: "Organized the church under the Negros Occidental Conference and the BPV District." },
  { name: "Elder Job Jabonete", role: "First Head Elder", detail: "Led the congregation with dedication from the very first organized Sabbath." },
];

const CURRENT_LEADERS = [
  { name: "Pastor Ur Caro", role: "District Pastor", detail: "Bago City District, Negros Occidental Conference", stripe: "from-[#1A4B8C] to-[#0d2650]", accent: "text-blue-800", bg: "bg-blue-50" },
  { name: "Bro. Calixto Galido Jr", role: "Head Elder", detail: "Leading the congregation with wisdom and faith", stripe: "from-amber-600 to-amber-800", accent: "text-amber-800", bg: "bg-amber-50" },
  { name: "Sis. Alpha Jabonete", role: "Youth President", detail: "Guiding the next generation of Malingin Adventists", stripe: "from-emerald-600 to-emerald-800", accent: "text-emerald-800", bg: "bg-emerald-50" },
];

function StoryChapter({
  number, date, title, body, quote, photo, alt, flip = false,
}: {
  number: string; date: string; title: string; body: string; quote?: string;
  photo: string; alt: string; flip?: boolean;
}) {
  return (
    <FadeUp>
      <div className={`flex flex-col ${flip ? "md:flex-row-reverse" : "md:flex-row"} gap-8 md:gap-12 items-center max-w-5xl mx-auto`}>
        {/* Photo */}
        <div className="w-full md:w-[52%] shrink-0 overflow-hidden rounded-2xl shadow-lg" style={{ aspectRatio: "4/3" }}>
          <img src={photo} alt={alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          {/* Chapter number — decorative */}
          <p
            className="font-[Playfair_Display] font-bold leading-none select-none mb-3"
            style={{ fontSize: "clamp(4rem, 10vw, 7rem)", color: "rgba(22,32,51,0.05)" }}
          >
            {number}
          </p>
          <p className="font-[Lato] text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2 -mt-4 md:-mt-8">{date}</p>
          <h3 className="font-[Playfair_Display] text-foreground font-semibold leading-tight mb-4" style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)" }}>
            {title}
          </h3>
          <p className="font-[Lato] text-muted-foreground text-sm leading-relaxed">{body}</p>
          {quote && (
            <blockquote className="mt-5 pl-4 border-l-2 border-amber-400">
              <p className="font-[Playfair_Display] text-foreground/70 italic text-sm leading-relaxed">"{quote}"</p>
            </blockquote>
          )}
        </div>
      </div>
    </FadeUp>
  );
}

export function AboutPage({ onBack }: Props) {
  return (
    <div className="min-h-full pb-16">

      {/* Sticky back header */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-sm border-b border-border flex items-center gap-3 px-5 py-3">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div>
          <p className="font-[Playfair_Display] font-semibold text-sm text-foreground">About the Church</p>
          <p className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest">Malingin SDA Church</p>
        </div>
      </div>

      {/* ── 1. HERO ── */}
      <div className="relative" style={{ height: "70vh", minHeight: 420 }}>
        <img src={churchPhoto} alt="Malingin SDA Church" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,20,35,0.93) 0%, rgba(13,20,35,0.4) 55%, transparent 100%)" }} />
        <div className="absolute bottom-0 px-6 pb-10 md:px-14">
          <p className="font-[Lato] text-[#D6E5F5]/70 text-[10px] uppercase tracking-[0.22em] mb-3">Brgy. Malingin · Bago City, Negros Occidental</p>
          <h1 className="font-[Playfair_Display] text-white font-semibold leading-tight" style={{ fontSize: "clamp(2rem, 5.5vw, 3.5rem)" }}>
            Malingin<br /><span className="italic">Seventh-day Adventist</span><br />Church
          </h1>
          <p className="font-[Lato] text-white/60 text-sm mt-3 max-w-lg leading-relaxed">
            A faith community rooted in Brgy. Malingin since 2020 — built by ordinary people, sustained by extraordinary grace.
          </p>
        </div>
      </div>

      {/* ── 2. MISSION STATEMENT ── */}
      <div className="px-6 py-10 md:px-14 text-center" style={{ background: "linear-gradient(135deg, #1A4B8C 0%, #0d2650 100%)" }}>
        <p className="font-[Playfair_Display] text-white italic font-semibold leading-snug" style={{ fontSize: "clamp(1.2rem, 3.5vw, 2rem)" }}>
          "A home for the faithful,<br />a shelter for the searching."
        </p>
        <div className="w-12 h-0.5 bg-white/20 mx-auto my-4" />
        <p className="font-[Lato] text-white/50 text-xs uppercase tracking-widest">
          Founded December 4, 2020 · Bago-Pulupundan-Valladolid District, NOC
        </p>
      </div>

      {/* ── 3. BY THE NUMBERS ── */}
      <div className="px-5 py-10 md:px-14" style={{ background: "linear-gradient(180deg, #FBF7EE 0%, #F5F1E6 100%)" }}>
        <FadeUp>
          <p className="font-[Lato] text-xs uppercase tracking-widest text-muted-foreground text-center mb-6">By the Numbers</p>
        </FadeUp>
        <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto">
          {([
            { value: "Dec 4", sub: "2020", label: "Date Organized", bg: "bg-amber-50", border: "border-amber-200", vc: "text-amber-900", sc: "text-amber-500" },
            { value: "12", sub: "families", label: "Founding Families", bg: "bg-blue-50", border: "border-blue-200", vc: "text-blue-900", sc: "text-blue-500" },
            { value: "BPV", sub: "district", label: "District Pillar", bg: "bg-emerald-50", border: "border-emerald-200", vc: "text-emerald-900", sc: "text-emerald-500" },
          ] as const).map((s, i) => (
            <FadeUp key={s.label} delay={i * 80}>
              <div className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}>
                <p className={`font-[Playfair_Display] ${s.vc} font-bold leading-none`} style={{ fontSize: "clamp(1.1rem, 3.5vw, 1.8rem)" }}>{s.value}</p>
                <p className={`font-[Lato] ${s.sc} text-[9px] font-bold uppercase tracking-widest mt-0.5`}>{s.sub}</p>
                <p className="font-[Lato] text-muted-foreground text-[9px] mt-1 leading-tight">{s.label}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          OUR STORY — Five numbered chapters
      ══════════════════════════════════════════ */}

      {/* Story Header */}
      <div className="bg-background px-5 md:px-14 pt-14 pb-4">
        <FadeUp>
          <div className="max-w-5xl mx-auto flex items-center gap-5">
            <div className="flex-1 h-px bg-border" />
            <div className="text-center">
              <p className="font-[Lato] text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">A Living Faith</p>
              <h2 className="font-[Playfair_Display] text-foreground font-semibold" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
                Our Story
              </h2>
            </div>
            <div className="flex-1 h-px bg-border" />
          </div>
        </FadeUp>
      </div>

      {/* ── Chapter 01: The Beginning ── */}
      <div className="bg-background px-5 md:px-14 pt-10 pb-14">
        <StoryChapter
          number="01"
          date="Early 2010s"
          title="The Beginning"
          body="The Malingin SDA Church was first built in the 2010s. A vision took shape on a plot of land in Barangay Malingin — walls rose, a roofline emerged — but construction was halted due to unforeseen circumstances. For years, the unfinished building stood quietly, waiting to fulfill the purpose it was built for."
          quote="Every stone laid was a prayer. Even in silence, the building kept that promise."
          photo={pulpitPic}
          alt="Early Malingin SDA Church building"
        />
      </div>

      {/* Chapter divider */}
      <div className="flex items-center gap-4 px-5 md:px-14 py-0 bg-stone-50">
        <div className="flex-1 h-px bg-border" />
        <span className="text-border text-xs">✦</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* ── Chapter 02: A Refuge in Uncertain Times ── */}
      <div className="bg-stone-50 px-5 md:px-14 pt-14 pb-14">
        <StoryChapter
          number="02"
          date="2020 — COVID-19 Pandemic"
          title="A Refuge in Uncertain Times"
          body="When city restrictions shut down churches across Bago City, churchgoers from different congregations found their way to this unfinished building. Every Saturday, they gathered within its bare walls to worship God — folding chairs on raw concrete, voices rising toward an open ceiling. Their faith could not be quarantined. In the middle of a pandemic, this incomplete structure became the most alive place in Barangay Malingin."
          quote="They didn't wait for perfect conditions. They worshipped anyway."
          photo={beforeOrgPic}
          alt="Malingin SDA Church before organization"
          flip
        />
      </div>

      {/* Chapter divider */}
      <div className="flex items-center gap-4 px-5 md:px-14 py-0 bg-background">
        <div className="flex-1 h-px bg-border" />
        <span className="text-border text-xs">✦</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* ── Chapter 03: The Decision to Build ── */}
      <div className="bg-background px-5 md:px-14 pt-14 pb-14">
        <StoryChapter
          number="03"
          date="2020"
          title="The Decision to Build"
          body="Those churchgoers and local members of Brgy. Malingin fell in love with the place. They decided to renovate and officially form a congregation. The road was not easy — budgeting was a constant challenge for an unorganized group, and there were real highs and lows along the way. But big-hearted sponsors and members from near and far stepped up. What was once a stalled construction site was transformed, beam by beam, into a true house of worship."
          photo={constructionPic}
          alt="Malingin SDA Church under construction"
        />
      </div>

      {/* Chapter divider */}
      <div className="flex items-center gap-4 px-5 md:px-14 py-0 bg-stone-50">
        <div className="flex-1 h-px bg-border" />
        <span className="text-border text-xs">✦</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* ── Chapter 04: The Church Was Born ── */}
      <div className="bg-stone-50 px-5 md:px-14 pt-14 pb-14">
        <StoryChapter
          number="04"
          date="December 4, 2020"
          title="The Church Was Born"
          body="Under the Negros Occidental Conference (NOC) and BPV District officers, led by founding Pastor Joel Alvarez and first Head Elder Elder Job Jabonete, Malingin SDA Church was officially organized. The Saturdays of Brgy. Malingin were now filled with the sound of worship, sermon, and song — members and visitors from near and far packing every seat, week after week."
          quote="December 4, 2020 — the day a community became a church."
          photo={afterOrgPic}
          alt="Malingin SDA Church after organization"
          flip
        />
      </div>

      {/* ── Chapter 05: 12 Families — Dark cinematic finale ── */}
      <div className="px-5 md:px-14 py-14" style={{ background: "linear-gradient(160deg, #0f1d35 0%, #1a2810 100%)" }}>
        <FadeUp>
          <div className="max-w-5xl mx-auto">
            {/* Chapter header */}
            <div className="flex items-start gap-4 mb-8">
              <p
                className="font-[Playfair_Display] font-bold leading-none select-none shrink-0"
                style={{ fontSize: "clamp(4rem, 10vw, 7rem)", color: "rgba(255,255,255,0.04)" }}
              >
                05
              </p>
              <div className="flex-1 -mt-1 md:-mt-3">
                <p className="font-[Lato] text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">2020 — Present</p>
                <h3 className="font-[Playfair_Display] text-white font-semibold leading-tight" style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)" }}>
                  Twelve Families,<br />One Mission
                </h3>
              </div>
            </div>

            {/* Full-width group photo */}
            <div className="overflow-hidden rounded-2xl shadow-xl mb-8">
              <img
                src={firstFamiliesPic}
                alt="The 12 founding families of Malingin SDA Church"
                className="w-full object-cover hover:scale-105 transition-transform duration-700"
                style={{ height: "clamp(200px, 40vw, 380px)" }}
              />
            </div>

            {/* Text + pull quote side by side on desktop */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <p className="font-[Lato] text-white/60 text-sm leading-relaxed flex-1">
                With 12 founding families, the church grew steadily from the ground up. From plastic chairs
                and open ceilings to a fully organized congregation — the growth was not just in numbers,
                but in spirit, in faith, and in the deep bonds formed Sabbath after Sabbath. Today, Malingin
                SDA Church stands as one of the great pillars of the Bago-Pulupundan-Valladolid District,
                a testament to what God can build through willing hearts.
              </p>
              <div className="flex-1 border-l-2 border-amber-500/60 pl-5">
                <p className="font-[Playfair_Display] text-white italic text-base md:text-lg leading-relaxed">
                  "A church is not built with concrete and steel. It is built with the faith of the people who refuse to give up."
                </p>
                <p className="font-[Lato] text-amber-400/70 text-[10px] uppercase tracking-widest mt-3">
                  Malingin SDA Church · Est. December 4, 2020
                </p>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>

      {/* ── 5. LEADERSHIP ── */}
      <div className="px-5 py-12 md:px-14" style={{ background: "linear-gradient(180deg, #F8F5EE 0%, #F0EBE0 100%)" }}>
        <FadeUp>
          <div className="text-center mb-10">
            <p className="font-[Lato] text-xs uppercase tracking-widest text-muted-foreground mb-2">Stewards of the Flock</p>
            <h2 className="font-[Playfair_Display] text-foreground font-semibold" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>Leadership</h2>
          </div>
        </FadeUp>

        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <p className="font-[Lato] text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-5">Founding Leaders</p>
          </FadeUp>
          <div className="relative pl-8 mb-10">
            <div className="absolute left-3 top-2 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, #d97706, #fcd34d, transparent)" }} />
            {PAST_LEADERS.map((l, i) => (
              <FadeUp key={l.name} delay={i * 100}>
                <div className="relative mb-8 last:mb-0">
                  <div className="absolute -left-8 top-1.5 w-3 h-3 rounded-full border-2 border-amber-400 bg-amber-50" />
                  <p className="font-[Lato] text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-1">{l.role}</p>
                  <p className="font-[Playfair_Display] text-foreground text-xl font-semibold">{l.name}</p>
                  <p className="font-[Lato] text-muted-foreground text-xs mt-1.5 leading-relaxed">{l.detail}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp>
            <p className="font-[Lato] text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-4">Current Leaders</p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CURRENT_LEADERS.map((l, i) => (
              <FadeUp key={l.name} delay={i * 80}>
                <div className={`rounded-2xl overflow-hidden border border-border hover:-translate-y-1 hover:shadow-md transition-all duration-300 ${l.bg}`}>
                  <div className={`h-1 bg-gradient-to-r ${l.stripe}`} />
                  <div className="p-5">
                    <p className="font-[Playfair_Display] text-foreground text-base font-semibold leading-tight">{l.name}</p>
                    <p className={`font-[Lato] ${l.accent} text-[10px] font-bold uppercase tracking-widest mt-1`}>{l.role}</p>
                    <p className="font-[Lato] text-muted-foreground text-xs mt-1.5 leading-relaxed">{l.detail}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6. OUR PURPOSE — bento grid ── */}
      <div className="px-5 py-12 md:px-14" style={{ background: "linear-gradient(160deg, #0f1d35 0%, #0d1f0e 100%)" }}>
        <FadeUp>
          <div className="text-center mb-8">
            <p className="font-[Lato] text-xs uppercase tracking-widest text-white/30 mb-2">Why We Exist</p>
            <h2 className="font-[Playfair_Display] text-white font-semibold" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>Our Purpose</h2>
          </div>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <FadeUp className="md:row-span-2 h-full">
            <div className="h-full rounded-2xl p-8 flex flex-col justify-between" style={{ background: "linear-gradient(145deg, #1A4B8C 0%, #0d2650 100%)", minHeight: 260 }}>
              <span className="text-5xl block mb-5">🌾</span>
              <div>
                <h3 className="font-[Playfair_Display] text-white text-2xl font-semibold mb-3">Nurture the Locals</h3>
                <p className="font-[Lato] text-white/65 text-sm leading-relaxed">
                  Rooted in Brgy. Malingin, we serve our neighborhood first — families, youth, and elders alike. The people of this land are our first and deepest ministry.
                </p>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={80}>
            <div className="rounded-2xl p-6 bg-amber-50 border border-amber-200 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <span className="text-3xl block mb-3">📖</span>
              <h3 className="font-[Playfair_Display] text-amber-900 text-lg font-semibold mb-2">Spread the Gospel</h3>
              <p className="font-[Lato] text-amber-800/70 text-sm leading-relaxed">The ministry of the Seventh-day Adventists drives everything we do. God's word is our mission.</p>
            </div>
          </FadeUp>
          <FadeUp delay={160}>
            <div className="rounded-2xl p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)" }}>
              <span className="text-3xl block mb-3">🏠</span>
              <h3 className="font-[Playfair_Display] text-white text-lg font-semibold mb-2">A Home for All</h3>
              <p className="font-[Lato] text-white/65 text-sm leading-relaxed">On the main road of Malingin, we welcome every Adventist passerby and non-Adventist hopeful seeking God's grace.</p>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* ── 7. CHURCH LIFE ── */}
      <div className="px-5 py-12 md:px-14" style={{ background: "linear-gradient(180deg, #FBF7EE 0%, #F5F1E6 100%)" }}>
        <FadeUp>
          <div className="text-center mb-8">
            <p className="font-[Lato] text-xs uppercase tracking-widest text-muted-foreground mb-2">Community</p>
            <h2 className="font-[Playfair_Display] text-foreground font-semibold" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>Church Life</h2>
          </div>
        </FadeUp>
        <div className="flex gap-4 overflow-x-auto pb-3 -mx-5 px-5 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
          {CULTURE_ITEMS.map((item, i) => (
            <FadeUp key={item.title} delay={i * 60} className="min-w-[200px] md:min-w-0 snap-start shrink-0 md:shrink">
              <div className={`${item.bg} border ${item.border} rounded-2xl p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col gap-3 h-full`}>
                <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center`}>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <p className="font-[Playfair_Display] text-foreground text-sm font-semibold leading-tight">{item.title}</p>
                <p className="font-[Lato] text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* ── 8. SERVICE SCHEDULE ── */}
      <div className="px-5 py-12 md:px-14 bg-background">
        <FadeUp>
          <div className="text-center mb-8">
            <p className="font-[Lato] text-xs uppercase tracking-widest text-muted-foreground mb-2">Join Us</p>
            <h2 className="font-[Playfair_Display] text-foreground font-semibold" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>Service Schedule</h2>
          </div>
        </FadeUp>
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {WEEKDAY_SERVICES.map((s, i) => (
              <FadeUp key={s.day} delay={i * 80}>
                <div className="bg-card border border-border rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300">
                  <span className="text-xl mb-2 block">{s.icon}</span>
                  <p className="font-[Lato] text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.day}</p>
                  <p className="font-[Playfair_Display] text-foreground text-base font-semibold mt-0.5">{s.label}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Clock size={11} className="text-muted-foreground shrink-0" />
                    <span className="font-[Lato] text-muted-foreground text-xs">{s.time}</span>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={160}>
            <div className="rounded-2xl overflow-hidden shadow-md" style={{ background: "linear-gradient(135deg, #1A4B8C 0%, #0d2650 100%)" }}>
              <div className="px-6 pt-6 pb-5 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-[Lato] text-white/40 text-[10px] uppercase tracking-widest mb-0.5">The Holy Sabbath</p>
                    <p className="font-[Playfair_Display] text-white text-2xl font-semibold italic">Saturday</p>
                  </div>
                  <span className="text-3xl opacity-60">✝️</span>
                </div>
                <p className="font-[Lato] text-white/45 text-xs mt-2">A day of worship, fellowship, and rest in the Lord</p>
              </div>
              <div className="grid grid-cols-3 divide-x divide-white/10">
                {SABBATH_SLOTS.map((slot) => (
                  <div key={slot.label} className="px-4 py-4">
                    <p className="font-[Lato] text-white/40 text-[9px] uppercase tracking-wide leading-tight mb-1.5">{slot.label}</p>
                    <div className="flex items-center gap-1">
                      <Clock size={10} className="text-white/40 shrink-0" />
                      <span className="font-[Lato] text-white text-[11px] leading-tight">{slot.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* ── 9. COMMUNITY PHOTO ── */}
      <div className="px-5 py-10 md:px-14">
        <FadeUp>
          <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
            <img src={communityPhoto} alt="Malingin SDA Church community" className="w-full h-56 object-cover object-[center_65%] hover:scale-105 transition-transform duration-500" />
            <div className="bg-amber-50/80 px-5 py-4 flex items-start gap-2">
              <span className="text-lg shrink-0">🌾</span>
              <p className="font-[Lato] text-xs text-foreground/70 italic leading-relaxed">
                Surrounded by the peaceful rice fields of Barangay Malingin — every Sabbath feels fresh and close to God's creation.
              </p>
            </div>
          </div>
        </FadeUp>
      </div>

      {/* ── 10. MAP ── */}
      <div className="px-5 pb-10 md:px-14">
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
              width="100%" height="220" style={{ border: 0 }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Malingin SDA Church Location"
            />
          </div>
        </FadeUp>
      </div>

      {/* ── 11. CTA ── */}
      <div className="px-5 pb-10 md:px-14">
        <FadeUp>
          <div className="rounded-2xl p-8 text-center overflow-hidden relative" style={{ background: "linear-gradient(135deg, #1A4B8C 0%, #0d2650 100%)" }}>
            <div className="absolute inset-0 opacity-[0.04] text-[18vw] flex items-center justify-center text-white leading-none pointer-events-none select-none">✝</div>
            <p className="font-[Playfair_Display] text-white italic font-semibold relative" style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)" }}>Come as you are.</p>
            <div className="w-10 h-0.5 bg-white/20 mx-auto my-4" />
            <p className="font-[Lato] text-white/65 text-sm leading-relaxed max-w-md mx-auto relative">
              Whether you are a lifelong Adventist, someone exploring their faith, or simply passing by
              the main road of Malingin — our doors are always open. Come and be blessed.
            </p>
          </div>
        </FadeUp>
      </div>

    </div>
  );
}
