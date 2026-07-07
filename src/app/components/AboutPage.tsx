import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import { ArrowLeft, MapPin, Clock } from "lucide-react";
import { Reveal3D } from "./Reveal3D";
import { ParallaxImage } from "./ParallaxImage";
import { DraggableRing3D } from "./DraggableRing3D";
import aerialPhoto from "../../imports/Bird's Eye View.png";
import communityPhoto from "../../imports/malingin_community.jpg";
import pulpitPic from "../../imports/pulpit_pic.jpg";
import beforeOrgPic from "../../imports/before organization.jpg";
import afterOrgPic from "../../imports/after organization.jpg";
import firstFamiliesPic from "../../imports/first families.jpg";
import constructionPic from "../../imports/construction.jpg";
import potluckPic from "../../imports/Potluck.jpg";
import choirPracticePic from "../../imports/Choir Practice.png";
import bibleStudyPic from "../../imports/Bible Study.jpg";
import districtFellowshipPic from "../../imports/District Fellowship.jpg";
import communityServicePic from "../../imports/Community Service.jpg";

interface Props {
  onBack: () => void;
}

const CULTURE_ITEMS = [
  { icon: "🍽️", title: "Fellowship Potlucks", desc: "Sharing a meal and meaningful conversations every Sabbath after service.", photo: potluckPic, bg: "bg-amber-50", border: "border-amber-200", iconBg: "bg-amber-100" },
  { icon: "🎵", title: "Choir Practices", desc: "Preparing music and praise to deliver God's message in harmony.", photo: choirPracticePic, bg: "bg-sky-50", border: "border-sky-200", iconBg: "bg-sky-100" },
  { icon: "📖", title: "Bible Studies", desc: "Small groups exploring scripture to strengthen faith and understanding.", photo: bibleStudyPic, bg: "bg-emerald-50", border: "border-emerald-200", iconBg: "bg-emerald-100" },
  { icon: "🤝", title: "District Fellowship", desc: "Connecting with sister churches across the Bago City district.", photo: districtFellowshipPic, bg: "bg-violet-50", border: "border-violet-200", iconBg: "bg-violet-100" },
  { icon: "❤️", title: "Community Service", desc: "Bringing supplies, prayer, programs, and Bible studies to different areas of Barangay Malingin — meeting daily needs while sharing the hope of the Gospel.", photo: communityServicePic, bg: "bg-rose-50", border: "border-rose-200", iconBg: "bg-rose-100" },
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

// ─── Safe scroll-scrubbed helpers ───────────────────────────────────────────────
// Framer Motion's single multi-keyframe useTransform can get stuck at its initial
// value when none of the keyframes touch progress 0 or 1 (observed empirically).
// These helpers sidestep that by combining independent monotonic ramps instead.

function useFadeInOut(p: MotionValue<number>, inStart: number, inEnd: number, outStart: number, outEnd: number) {
  const fadeIn = useTransform(p, [inStart, inEnd], [0, 1]);
  const fadeOut = useTransform(p, [outStart, outEnd], [1, 0]);
  return useTransform([fadeIn, fadeOut], (v: number[]) => Math.min(v[0], v[1]));
}

function useEnterHoldExit(
  p: MotionValue<number>,
  inStart: number, inEnd: number, outStart: number, outEnd: number,
  inVal: number, restVal: number, outVal: number,
) {
  return useTransform(p, (v) => {
    if (v <= inStart) return inVal;
    if (v < inEnd) return inVal + (restVal - inVal) * ((v - inStart) / (inEnd - inStart));
    if (v <= outStart) return restVal;
    if (v < outEnd) return restVal + (outVal - restVal) * ((v - outStart) / (outEnd - outStart));
    return outVal;
  });
}

// ─── Custom CSS/3D diorama scenes — illustrated environments, not photo crops ───

function SkyBackdrop({ colors }: { colors: string }) {
  return <div className="absolute inset-0" style={{ background: colors }} />;
}

function Treeline({ tint = "#4a5a35", opacity = 0.5, bottom = "37%" }: { tint?: string; opacity?: number; bottom?: string }) {
  return (
    <div
      className="absolute left-0 right-0 pointer-events-none"
      style={{
        bottom, height: "10%", background: tint, opacity,
        clipPath: "polygon(0% 100%,2% 55%,6% 92%,11% 38%,16% 88%,22% 48%,28% 96%,35% 42%,41% 90%,48% 52%,54% 94%,61% 40%,67% 88%,74% 50%,80% 95%,87% 46%,93% 92%,100% 52%,100% 100%)",
      }}
    />
  );
}

function DriftCloud({ p, top, left, w, h, speed, opacity = 0.5 }: { p: MotionValue<number>; top: string; left: string; w: number; h: number; speed: number; opacity?: number }) {
  const x = useTransform(p, [0, 1], [0, speed]);
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ top, left, width: w, height: h, x, background: "rgba(255,255,255,0.85)", filter: "blur(10px)", opacity }}
    />
  );
}

function GroundPlane({ bgPos, tint = "#c99a52", stripe = "rgba(110,76,28,0.32)" }: { bgPos: MotionValue<string>; tint?: string; stripe?: string }) {
  return (
    <div className="absolute inset-x-0 bottom-0 overflow-hidden" style={{ height: "58%", perspective: 500 }}>
      <motion.div
        className="absolute inset-0"
        style={{
          transform: "rotateX(60deg)",
          transformOrigin: "bottom",
          backgroundColor: tint,
          backgroundImage: `repeating-linear-gradient(98deg, ${stripe} 0px, ${stripe} 4px, transparent 4px, transparent 36px)`,
          backgroundPosition: bgPos,
        }}
      />
      <div className="absolute inset-x-0 top-0 h-1/3" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.18), transparent)" }} />
    </div>
  );
}

const FIELD_CLUSTERS = [
  { left: "3%", bottom: "6%", size: 130, speed: 95 },
  { left: "20%", bottom: "0%", size: 95, speed: 140 },
  { left: "76%", bottom: "4%", size: 115, speed: 105 },
  { left: "92%", bottom: "-2%", size: 85, speed: 160 },
];

function FieldCluster({ p, left, bottom, size, speed }: { p: MotionValue<number>; left: string; bottom: string; size: number; speed: number }) {
  const y = useTransform(p, [0, 1], [0, speed]);
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left, bottom, y, width: size, height: size * 0.55,
        background: "radial-gradient(ellipse at 50% 30%, rgba(230,190,90,0.9), rgba(180,130,40,0.5) 70%, transparent 100%)",
        filter: "blur(1px)",
      }}
    />
  );
}

function FieldScene({ p }: { p: MotionValue<number> }) {
  const driftPct = useTransform(p, [0, 1], [0, -24]);
  const bgPos = useTransform(driftPct, (v) => `${v}% 0%`);
  return (
    <div className="absolute inset-0 overflow-hidden">
      <SkyBackdrop colors="linear-gradient(180deg, #FDEFCF 0%, #FBDFA0 24%, #F0BE74 48%, #cf9a52 100%)" />
      <Treeline tint="#5a6a3d" opacity={0.55} bottom="40%" />
      <DriftCloud p={p} top="12%" left="8%" w={150} h={42} speed={-70} />
      <DriftCloud p={p} top="20%" left="62%" w={110} h={32} speed={-40} opacity={0.4} />
      <GroundPlane bgPos={bgPos} />
      {FIELD_CLUSTERS.map((c, i) => <FieldCluster key={i} p={p} {...c} />)}
    </div>
  );
}

const ROAD_POLES = [
  { left: "9%", bottom: "30%", height: 60, speed: 170 },
  { left: "87%", bottom: "26%", height: 50, speed: 190 },
  { left: "15%", bottom: "13%", height: 42, speed: 230 },
];

function RoadPole({ p, left, bottom, height, speed }: { p: MotionValue<number>; left: string; bottom: string; height: number; speed: number }) {
  const y = useTransform(p, [0, 1], [0, speed]);
  return (
    <motion.div className="absolute pointer-events-none" style={{ left, bottom, y }}>
      <div style={{ width: 4, height, background: "#3d3a34", borderRadius: 2 }} />
      <div style={{ width: 22, height: 4, background: "#3d3a34", marginTop: -height, marginLeft: -9, borderRadius: 2 }} />
    </motion.div>
  );
}

function RoadScene({ p }: { p: MotionValue<number> }) {
  const driftPct = useTransform(p, [0, 1], [0, -22]);
  const bgPos = useTransform(driftPct, (v) => `${v}% 0%`);
  const dashYRaw = useTransform(p, [0, 1], [0, -420]);
  const dashPos = useTransform(dashYRaw, (v) => `0px ${v}px`);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <SkyBackdrop colors="linear-gradient(180deg, #FBDFAE 0%, #F3C583 26%, #DE9F5C 52%, #a9723f 100%)" />
      <Treeline tint="#4d5a34" opacity={0.5} bottom="40%" />
      <GroundPlane bgPos={bgPos} tint="#c2954f" />
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{ height: "58%", clipPath: "polygon(44% 0%, 56% 0%, 82% 100%, 18% 100%)", background: "linear-gradient(180deg, #8a8a90 0%, #6f6f76 100%)" }}
      >
        <motion.div
          className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2"
          style={{
            width: 10,
            backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.85) 0px, rgba(255,255,255,0.85) 26px, transparent 26px, transparent 52px)",
            backgroundPosition: dashPos,
          }}
        />
      </div>
      {ROAD_POLES.map((pole, i) => <RoadPole key={i} p={p} {...pole} />)}
    </div>
  );
}

function ChurchScene({ p }: { p: MotionValue<number> }) {
  const driftPct = useTransform(p, [0, 1], [0, -10]);
  const bgPos = useTransform(driftPct, (v) => `${v}% 0%`);
  const churchScale = useTransform(p, [0.62, 1], [0.4, 1.08]);
  const glowOpacity = useTransform(p, [0.62, 1], [0.2, 0.65]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <SkyBackdrop colors="linear-gradient(180deg, #FFF3D6 0%, #FCE0A6 30%, #F0B979 58%, #cf9a52 100%)" />
      <Treeline tint="#5a6a3d" opacity={0.45} bottom="40%" />
      <GroundPlane bgPos={bgPos} />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: "50%", top: "38%", width: 520, height: 520, x: "-50%", y: "-50%",
          background: "radial-gradient(circle, rgba(255,236,180,0.9) 0%, rgba(255,220,140,0.35) 45%, transparent 72%)",
          opacity: glowOpacity,
        }}
      />
      <motion.div
        className="absolute left-1/2 pointer-events-none"
        style={{ bottom: "30%", x: "-50%", scale: churchScale, transformOrigin: "bottom" }}
      >
        <div className="mx-auto" style={{ width: 6, height: 26, background: "#f7ead0" }} />
        <div className="mx-auto" style={{ width: 22, height: 6, background: "#f7ead0", marginTop: -20, marginBottom: 14 }} />
        <div
          className="mx-auto"
          style={{ width: 0, height: 0, borderLeft: "90px solid transparent", borderRight: "90px solid transparent", borderBottom: "70px solid #b5451f" }}
        />
        <div className="mx-auto relative" style={{ width: 160, height: 130, background: "#f7f2e6", marginTop: -2 }}>
          <div className="absolute left-1/2 top-3 -translate-x-1/2" style={{ width: 0, height: 0, borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderBottom: "26px solid #3a2c22" }} />
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2" style={{ width: 34, height: 56, background: "#5b3a24", borderRadius: "4px 4px 0 0" }} />
        </div>
      </motion.div>
    </div>
  );
}

// ─── Prologue — the one real photograph, establishing the story ────────────────

interface PrologueProps {
  date: string;
  title: string;
  body: string;
  quote?: string;
  thumb: string;
  thumbAlt: string;
}

function Prologue({ date, title, body, quote, thumb, thumbAlt }: PrologueProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const photoScale = useTransform(p, [0, 1], [1.1, 1.28]);
  const photoDim = useTransform(p, [0, 1], [0.55, 0.72]);

  const enterA = 0;
  const enterB = 0.17;
  const exitA = 0.7;
  const exitB = 0.87;

  const titleOpacity = useFadeInOut(p, enterA, enterB, exitA, exitB);
  const titleY = useEnterHoldExit(p, enterA, enterB, exitA, exitB, 46, 0, -26);

  const imgOpacity = useFadeInOut(p, enterA + 0.04, enterB + 0.06, exitA - 0.04, exitB - 0.04);
  const imgScale = useEnterHoldExit(p, enterA + 0.04, enterB + 0.06, exitA - 0.04, exitB - 0.04, 0.8, 1, 0.9);

  const quoteOpacity = useFadeInOut(p, enterB + 0.05, enterB + 0.18, exitA - 0.08, exitA + 0.04);

  return (
    <div ref={ref} className="relative" style={{ height: "185vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-[#0d1423]">
        <motion.img src={aerialPhoto} alt="" aria-hidden style={{ scale: photoScale }} className="absolute inset-0 w-full h-full object-cover" />
        <motion.div className="absolute inset-0 bg-[#0d1423]" style={{ opacity: photoDim }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-black/25 pointer-events-none" />

        <div className="absolute inset-0 z-10 flex items-center px-6 sm:px-10 md:px-16 pointer-events-none">
          <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <motion.div style={{ opacity: titleOpacity, y: titleY }}>
              <p className="font-[Lato] text-amber-300 text-[11px] font-bold uppercase tracking-[0.2em] mb-3" style={{ textShadow: "0 2px 14px rgba(0,0,0,0.65)" }}>
                {date}
              </p>
              <h3 className="font-[Playfair_Display] text-white font-bold leading-[1.05] mb-5" style={{ fontSize: "clamp(1.9rem, 4.2vw, 3.2rem)", textShadow: "0 4px 26px rgba(0,0,0,0.6)" }}>
                {title}
              </h3>
              <p className="font-[Lato] text-white/90 leading-relaxed max-w-xl" style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)", textShadow: "0 2px 18px rgba(0,0,0,0.55)" }}>
                {body}
              </p>
              {quote && (
                <motion.blockquote style={{ opacity: quoteOpacity }} className="mt-6 pl-4 border-l-2 border-amber-400/80 max-w-lg">
                  <p className="font-[Playfair_Display] text-white italic text-base md:text-lg leading-relaxed" style={{ textShadow: "0 2px 18px rgba(0,0,0,0.55)" }}>
                    "{quote}"
                  </p>
                </motion.blockquote>
              )}
            </motion.div>
            <motion.div style={{ opacity: imgOpacity, scale: imgScale }} className="justify-self-center w-full max-w-md">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90" style={{ aspectRatio: "4/3" }}>
                <img src={thumb} alt={thumbAlt} className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Phase content — one chapter's text+photo inside the continuous journey ────

interface PhaseContentProps {
  p: MotionValue<number>;
  rangeStart: number;
  rangeEnd: number;
  align: "left" | "right";
  date: string;
  title: string;
  body: string;
  quote?: string;
  thumb: string;
  thumbAlt: string;
}

function PhaseContent({ p, rangeStart, rangeEnd, align, date, title, body, quote, thumb, thumbAlt }: PhaseContentProps) {
  const span = rangeEnd - rangeStart;
  const enterA = rangeStart + span * 0.06;
  const enterB = rangeStart + span * 0.24;
  const exitA = rangeStart + span * 0.76;
  const exitB = rangeStart + span * 0.95;
  const imgEnterA = enterA + span * 0.03;
  const imgEnterB = enterB + span * 0.04;
  const imgExitA = exitA - span * 0.03;
  const imgExitB = exitB - span * 0.02;

  const titleOpacity = useFadeInOut(p, enterA, enterB, exitA, exitB);
  const titleY = useEnterHoldExit(p, enterA, enterB, exitA, exitB, 46, 0, -26);

  const imgOpacity = useFadeInOut(p, imgEnterA, imgEnterB, imgExitA, imgExitB);
  const imgScale = useEnterHoldExit(p, imgEnterA, imgEnterB, imgExitA, imgExitB, 0.8, 1, 0.9);
  const imgX = useEnterHoldExit(p, imgEnterA, imgEnterB, imgExitA, imgExitB, align === "left" ? -110 : 110, 0, align === "left" ? -150 : 150);
  const imgRotate = useEnterHoldExit(p, imgEnterA, imgEnterB, imgExitA, imgExitB, align === "left" ? 9 : -9, -2, align === "left" ? 12 : -12);

  const quoteOpacity = useFadeInOut(p, enterB + span * 0.05, enterB + span * 0.16, exitA - span * 0.08, exitA + span * 0.03);

  const textBlock = (
    <motion.div key="text" style={{ opacity: titleOpacity, y: titleY }}>
      <p className="font-[Lato] text-amber-300 text-[11px] font-bold uppercase tracking-[0.2em] mb-3" style={{ textShadow: "0 2px 14px rgba(0,0,0,0.65)" }}>
        {date}
      </p>
      <h3 className="font-[Playfair_Display] text-white font-bold leading-[1.05] mb-5" style={{ fontSize: "clamp(1.9rem, 4.2vw, 3.2rem)", textShadow: "0 4px 26px rgba(0,0,0,0.6)" }}>
        {title}
      </h3>
      <p className="font-[Lato] text-white/90 leading-relaxed max-w-xl" style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)", textShadow: "0 2px 18px rgba(0,0,0,0.55)" }}>
        {body}
      </p>
      {quote && (
        <motion.blockquote style={{ opacity: quoteOpacity }} className="mt-6 pl-4 border-l-2 border-amber-400/80 max-w-lg">
          <p className="font-[Playfair_Display] text-white italic text-base md:text-lg leading-relaxed" style={{ textShadow: "0 2px 18px rgba(0,0,0,0.55)" }}>
            "{quote}"
          </p>
        </motion.blockquote>
      )}
    </motion.div>
  );

  const imageBlock = (
    <motion.div key="image" style={{ opacity: imgOpacity, scale: imgScale, x: imgX, rotate: imgRotate }} className="justify-self-center w-full max-w-md">
      <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/90" style={{ aspectRatio: "4/3" }}>
        <img src={thumb} alt={thumbAlt} className="w-full h-full object-cover" />
      </div>
    </motion.div>
  );

  return (
    <div className="absolute inset-0 flex items-center px-6 sm:px-10 md:px-16 pointer-events-none">
      <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {align === "right" ? <>{imageBlock}{textBlock}</> : <>{textBlock}{imageBlock}</>}
      </div>
    </div>
  );
}

// ─── The continuous journey — field, road, and church crossfade, never cutting ─

function JourneyContinuous() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const b1Start = 0.293, b1End = 0.373;
  const b2Start = 0.627, b2End = 0.707;

  const fieldOpacity = useTransform(p, [b1Start, b1End], [1, 0]);
  const roadOpacity = useFadeInOut(p, b1Start, b1End, b2Start, b2End);
  const churchOpacity = useTransform(p, [b2Start, b2End], [0, 1]);

  const barWidth = useTransform(p, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative" style={{ height: "555vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-[#0d1423]">
        <motion.div className="absolute inset-0" style={{ opacity: fieldOpacity }}>
          <FieldScene p={p} />
        </motion.div>
        <motion.div className="absolute inset-0" style={{ opacity: roadOpacity }}>
          <RoadScene p={p} />
        </motion.div>
        <motion.div className="absolute inset-0" style={{ opacity: churchOpacity }}>
          <ChurchScene p={p} />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-black/25 pointer-events-none" />

        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-40 h-1 rounded-full bg-white/25 overflow-hidden z-20">
          <motion.div className="h-full bg-white rounded-full" style={{ width: barWidth }} />
        </div>

        <PhaseContent
          p={p} rangeStart={0} rangeEnd={1 / 3} align="right"
          date="2020 — COVID-19 Pandemic" title="A Refuge in Uncertain Times"
          body="When city restrictions shut down churches across Bago City, churchgoers from different congregations found their way to this unfinished building. Every Saturday, they gathered within its bare walls to worship God. Their faith could not be quarantined — in the middle of a pandemic, this incomplete structure became the most alive place in Barangay Malingin, surrounded by nothing but open rice fields."
          quote="They didn't wait for perfect conditions. They worshipped anyway."
          thumb={beforeOrgPic} thumbAlt="Malingin SDA Church before organization"
        />
        <PhaseContent
          p={p} rangeStart={1 / 3} rangeEnd={2 / 3} align="left"
          date="2020" title="The Decision to Build"
          body="Those churchgoers and local members of Brgy. Malingin fell in love with the place. They decided to renovate and officially form a congregation — travelling the same quiet road, past the same fields, week after week. Budgeting was a constant challenge for an unorganized group, but big-hearted sponsors and members from near and far stepped up. What was once a stalled construction site was transformed, beam by beam, into a true house of worship."
          thumb={constructionPic} thumbAlt="Malingin SDA Church under construction"
        />
        <PhaseContent
          p={p} rangeStart={2 / 3} rangeEnd={1} align="right"
          date="December 4, 2020" title="The Church Was Born"
          body="Under the Negros Occidental Conference (NOC) and BPV District officers, led by founding Pastor Joel Alvarez and first Head Elder Elder Job Jabonete, Malingin SDA Church was officially organized. The Saturdays of Brgy. Malingin were now filled with the sound of worship, sermon, and song."
          quote="December 4, 2020 — the day a community became a church."
          thumb={afterOrgPic} thumbAlt="Malingin SDA Church after organization"
        />
      </div>
    </div>
  );
}

// ─── Fixed backdrop behind everything after the journey — same photo and settled
//     opacity/tint as the Home page hero, for visual continuity between pages ───

function PostJourneyBackdrop() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <img src={aerialPhoto} alt="" aria-hidden className="w-full h-full object-cover" style={{ opacity: 0.4 }} />
      <div className="absolute inset-0 bg-[#1A4B8C] mix-blend-multiply" style={{ opacity: 0.42 }} />
      <div className="absolute inset-0 bg-[#0d1423]" style={{ opacity: 0.25 }} />
    </div>
  );
}

export function AboutPage({ onBack }: Props) {
  return (
    <div className="min-h-full pb-40">
      <PostJourneyBackdrop />

      <div className="relative z-10">
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

        {/* ══════════════════════════════════════════
            THE JOURNEY — a scroll-driven origin story
        ══════════════════════════════════════════ */}

        <Prologue
          date="Early 2010s" title="The Beginning"
          body="The Malingin SDA Church was first built in the 2010s. A vision took shape on a plot of land in Barangay Malingin — walls rose, a roofline emerged — but construction was halted due to unforeseen circumstances. For years, the unfinished building stood quietly, waiting to fulfill the purpose it was built for."
          quote="Every stone laid was a prayer. Even in silence, the building kept that promise."
          thumb={pulpitPic} thumbAlt="Early Malingin SDA Church building"
        />

        <JourneyContinuous />

        {/* ── MISSION STATEMENT ── */}
        <div className="px-6 py-10 md:px-14 text-center backdrop-blur-md" style={{ background: "linear-gradient(135deg, rgba(26,75,140,0.85) 0%, rgba(13,38,80,0.85) 100%)" }}>
          <Reveal3D direction="pop">
            <p className="font-[Playfair_Display] text-white italic font-semibold leading-snug" style={{ fontSize: "clamp(1.2rem, 3.5vw, 2rem)" }}>
              "A home for the faithful,<br />a shelter for the searching."
            </p>
            <div className="w-12 h-0.5 bg-white/20 mx-auto my-4" />
            <p className="font-[Lato] text-white/50 text-xs uppercase tracking-widest">
              Founded December 4, 2020 · Bago-Pulupundan-Valladolid District, NOC
            </p>
          </Reveal3D>
        </div>

        {/* ── BY THE NUMBERS ── */}
        <div className="px-5 py-10 md:px-14 backdrop-blur-md" style={{ background: "linear-gradient(180deg, rgba(251,247,238,0.82) 0%, rgba(245,241,230,0.82) 100%)" }}>
          <Reveal3D>
            <p className="font-[Lato] text-xs uppercase tracking-widest text-muted-foreground text-center mb-6">By the Numbers</p>
          </Reveal3D>
          <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto">
            {([
              { value: "Dec 4", sub: "2020", label: "Date Organized", bg: "bg-amber-50", border: "border-amber-200", vc: "text-amber-900", sc: "text-amber-500" },
              { value: "12", sub: "families", label: "Founding Families", bg: "bg-blue-50", border: "border-blue-200", vc: "text-blue-900", sc: "text-blue-500" },
              { value: "BPV", sub: "district", label: "District Pillar", bg: "bg-emerald-50", border: "border-emerald-200", vc: "text-emerald-900", sc: "text-emerald-500" },
            ] as const).map((s, i) => (
              <Reveal3D key={s.label} delay={i * 100} direction="pop">
                <div className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}>
                  <p className={`font-[Playfair_Display] ${s.vc} font-bold leading-none`} style={{ fontSize: "clamp(1.1rem, 3.5vw, 1.8rem)" }}>{s.value}</p>
                  <p className={`font-[Lato] ${s.sc} text-[9px] font-bold uppercase tracking-widest mt-0.5`}>{s.sub}</p>
                  <p className="font-[Lato] text-muted-foreground text-[9px] mt-1 leading-tight">{s.label}</p>
                </div>
              </Reveal3D>
            ))}
          </div>
        </div>

        {/* ── TWELVE FAMILIES — dark cinematic finale to the story ── */}
        <div className="px-5 md:px-14 py-14 backdrop-blur-md" style={{ background: "linear-gradient(160deg, rgba(15,29,53,0.88) 0%, rgba(26,40,16,0.88) 100%)" }}>
          <div className="max-w-5xl mx-auto">
            <Reveal3D>
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
            </Reveal3D>

            <Reveal3D delay={100} direction="flip">
              <div className="relative overflow-hidden rounded-2xl shadow-xl mb-8" style={{ height: "clamp(200px, 40vw, 380px)" }}>
                <ParallaxImage src={firstFamiliesPic} alt="The 12 founding families of Malingin SDA Church" strength={30} />
              </div>
            </Reveal3D>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <Reveal3D direction="left" className="flex-1">
                <p className="font-[Lato] text-white/60 text-sm leading-relaxed">
                  With 12 founding families, the church grew steadily from the ground up. From plastic chairs
                  and open ceilings to a fully organized congregation — the growth was not just in numbers,
                  but in spirit, in faith, and in the deep bonds formed Sabbath after Sabbath. Today, Malingin
                  SDA Church stands as one of the great pillars of the Bago-Pulupundan-Valladolid District.
                </p>
              </Reveal3D>
              <Reveal3D direction="right" delay={100} className="flex-1">
                <div className="border-l-2 border-amber-500/60 pl-5">
                  <p className="font-[Playfair_Display] text-white italic text-base md:text-lg leading-relaxed">
                    "A church is not built with concrete and steel. It is built with the faith of the people who refuse to give up."
                  </p>
                  <p className="font-[Lato] text-amber-400/70 text-[10px] uppercase tracking-widest mt-3">
                    Malingin SDA Church · Est. December 4, 2020
                  </p>
                </div>
              </Reveal3D>
            </div>
          </div>
        </div>

        {/* ── LEADERSHIP ── */}
        <div className="px-5 py-12 md:px-14 backdrop-blur-md" style={{ background: "linear-gradient(180deg, rgba(248,245,238,0.82) 0%, rgba(240,235,224,0.82) 100%)" }}>
          <Reveal3D>
            <div className="text-center mb-10">
              <p className="font-[Lato] text-xs uppercase tracking-widest text-muted-foreground mb-2">Stewards of the Flock</p>
              <h2 className="font-[Playfair_Display] text-foreground font-semibold" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>Leadership</h2>
            </div>
          </Reveal3D>

          <div className="max-w-2xl mx-auto">
            <Reveal3D>
              <p className="font-[Lato] text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-5">Founding Leaders</p>
            </Reveal3D>
            <div className="relative pl-8 mb-10">
              <div className="absolute left-3 top-2 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, #d97706, #fcd34d, transparent)" }} />
              {PAST_LEADERS.map((l, i) => (
                <Reveal3D key={l.name} delay={i * 100} direction={i % 2 === 0 ? "left" : "right"}>
                  <div className="relative mb-8 last:mb-0">
                    <div className="absolute -left-8 top-1.5 w-3 h-3 rounded-full border-2 border-amber-400 bg-amber-50" />
                    <p className="font-[Lato] text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-1">{l.role}</p>
                    <p className="font-[Playfair_Display] text-foreground text-xl font-semibold">{l.name}</p>
                    <p className="font-[Lato] text-muted-foreground text-xs mt-1.5 leading-relaxed">{l.detail}</p>
                  </div>
                </Reveal3D>
              ))}
            </div>

            <Reveal3D>
              <p className="font-[Lato] text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-4">Current Leaders</p>
            </Reveal3D>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CURRENT_LEADERS.map((l, i) => (
                <Reveal3D key={l.name} delay={i * 100} direction="flip">
                  <div className={`rounded-2xl overflow-hidden border border-border hover:-translate-y-1 hover:shadow-md transition-all duration-300 ${l.bg}`}>
                    <div className={`h-1 bg-gradient-to-r ${l.stripe}`} />
                    <div className="p-5">
                      <p className="font-[Playfair_Display] text-foreground text-base font-semibold leading-tight">{l.name}</p>
                      <p className={`font-[Lato] ${l.accent} text-[10px] font-bold uppercase tracking-widest mt-1`}>{l.role}</p>
                      <p className="font-[Lato] text-muted-foreground text-xs mt-1.5 leading-relaxed">{l.detail}</p>
                    </div>
                  </div>
                </Reveal3D>
              ))}
            </div>
          </div>
        </div>

        {/* ── OUR PURPOSE — bento grid ── */}
        <div className="px-5 py-12 md:px-14 backdrop-blur-md" style={{ background: "linear-gradient(160deg, rgba(15,29,53,0.88) 0%, rgba(13,31,14,0.88) 100%)" }}>
          <Reveal3D>
            <div className="text-center mb-8">
              <p className="font-[Lato] text-xs uppercase tracking-widest text-white/30 mb-2">Why We Exist</p>
              <h2 className="font-[Playfair_Display] text-white font-semibold" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>Our Purpose</h2>
            </div>
          </Reveal3D>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <Reveal3D direction="left" className="md:row-span-2 h-full">
              <div className="h-full rounded-2xl p-8 flex flex-col justify-between" style={{ background: "linear-gradient(145deg, #1A4B8C 0%, #0d2650 100%)", minHeight: 260 }}>
                <span className="text-5xl block mb-5">🌾</span>
                <div>
                  <h3 className="font-[Playfair_Display] text-white text-2xl font-semibold mb-3">Nurture the Locals</h3>
                  <p className="font-[Lato] text-white/65 text-sm leading-relaxed">
                    Rooted in Brgy. Malingin, we serve our neighborhood first — families, youth, and elders alike. The people of this land are our first and deepest ministry.
                  </p>
                </div>
              </div>
            </Reveal3D>
            <Reveal3D direction="pop" delay={80}>
              <div className="rounded-2xl p-6 bg-amber-50 border border-amber-200 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <span className="text-3xl block mb-3">📖</span>
                <h3 className="font-[Playfair_Display] text-amber-900 text-lg font-semibold mb-2">Spread the Gospel</h3>
                <p className="font-[Lato] text-amber-800/70 text-sm leading-relaxed">The ministry of the Seventh-day Adventists drives everything we do. God's word is our mission.</p>
              </div>
            </Reveal3D>
            <Reveal3D direction="pop" delay={180}>
              <div className="rounded-2xl p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)" }}>
                <span className="text-3xl block mb-3">🏠</span>
                <h3 className="font-[Playfair_Display] text-white text-lg font-semibold mb-2">A Home for All</h3>
                <p className="font-[Lato] text-white/65 text-sm leading-relaxed">On the main road of Malingin, we welcome every Adventist passerby and non-Adventist hopeful seeking God's grace.</p>
              </div>
            </Reveal3D>
          </div>
        </div>

        {/* ── CHURCH LIFE — drag the ring to spin through it ── */}
        <div className="px-5 py-16 md:px-14 overflow-hidden backdrop-blur-md" style={{ background: "linear-gradient(180deg, rgba(251,247,238,0.82) 0%, rgba(245,241,230,0.82) 100%)" }}>
          <Reveal3D>
            <div className="text-center mb-4">
              <p className="font-[Lato] text-xs uppercase tracking-widest text-muted-foreground mb-2">Community</p>
              <h2 className="font-[Playfair_Display] text-foreground font-semibold" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>Church Life</h2>
            </div>
          </Reveal3D>
          <Reveal3D delay={100} direction="pop">
            <DraggableRing3D items={CULTURE_ITEMS} />
          </Reveal3D>
        </div>

        {/* ── SERVICE SCHEDULE ── */}
        <div className="px-5 py-12 md:px-14 bg-background/82 backdrop-blur-md">
          <Reveal3D>
            <div className="text-center mb-8">
              <p className="font-[Lato] text-xs uppercase tracking-widest text-muted-foreground mb-2">Join Us</p>
              <h2 className="font-[Playfair_Display] text-foreground font-semibold" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>Service Schedule</h2>
            </div>
          </Reveal3D>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {WEEKDAY_SERVICES.map((s, i) => (
                <Reveal3D key={s.day} delay={i * 100} direction={i === 0 ? "left" : "right"}>
                  <div className="bg-card border border-border rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300">
                    <span className="text-xl mb-2 block">{s.icon}</span>
                    <p className="font-[Lato] text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.day}</p>
                    <p className="font-[Playfair_Display] text-foreground text-base font-semibold mt-0.5">{s.label}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Clock size={11} className="text-muted-foreground shrink-0" />
                      <span className="font-[Lato] text-muted-foreground text-xs">{s.time}</span>
                    </div>
                  </div>
                </Reveal3D>
              ))}
            </div>
            <Reveal3D delay={160} direction="flip">
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
            </Reveal3D>
          </div>
        </div>

        {/* ── COMMUNITY PHOTO ── */}
        <div className="px-5 py-10 md:px-14 overflow-hidden">
          <Reveal3D direction="left">
            <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
              <div className="h-56 relative">
                <ParallaxImage src={communityPhoto} alt="Malingin SDA Church community" className="object-[center_65%]" strength={30} />
              </div>
              <div className="bg-amber-50/80 px-5 py-4 flex items-start gap-2">
                <span className="text-lg shrink-0">🌾</span>
                <p className="font-[Lato] text-xs text-foreground/70 italic leading-relaxed">
                  Surrounded by the peaceful rice fields of Barangay Malingin — every Sabbath feels fresh and close to God's creation.
                </p>
              </div>
            </div>
          </Reveal3D>
        </div>

        {/* ── MAP ── */}
        <div className="px-5 pb-10 md:px-14 overflow-hidden">
          <Reveal3D direction="right">
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
          </Reveal3D>
        </div>

        {/* ── CTA ── */}
        <div className="px-5 pb-10 md:px-14">
          <Reveal3D direction="pop">
            <div className="rounded-2xl p-8 text-center overflow-hidden relative" style={{ background: "linear-gradient(135deg, #1A4B8C 0%, #0d2650 100%)" }}>
              <div className="absolute inset-0 opacity-[0.04] text-[18vw] flex items-center justify-center text-white leading-none pointer-events-none select-none">✝</div>
              <p className="font-[Playfair_Display] text-white italic font-semibold relative" style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)" }}>Come as you are.</p>
              <div className="w-10 h-0.5 bg-white/20 mx-auto my-4" />
              <p className="font-[Lato] text-white/65 text-sm leading-relaxed max-w-md mx-auto relative">
                Whether you are a lifelong Adventist, someone exploring their faith, or simply passing by
                the main road of Malingin — our doors are always open. Come and be blessed.
              </p>
            </div>
          </Reveal3D>
        </div>
      </div>
    </div>
  );
}
