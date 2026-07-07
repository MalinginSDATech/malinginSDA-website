import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Mail, Facebook, Play, X } from "lucide-react";
import { Reveal3D } from "./Reveal3D";
import macPic from "../../imports/mac_pic.jpg";
import concertPhoto from "../../imports/concert.jpg";
import cantatePhoto from "../../imports/Cantate_Adoremus.jpg";
import ainPhoto from "../../imports/ain.jpg";
import lorlenPhoto from "../../imports/lorlen.jpg";
import skyPhoto from "../../imports/sky.jpg";
import video1 from "../../imports/Behold our God NOC.mp4";
import video2 from "../../imports/For Your Beauty NOC.mp4";
import musicVideoSrc from "../../imports/Music Video.mp4";

interface Props { onBack: () => void; }

interface VideoInfo {
  id: string;
  title: string;
  subtitle: string;
  src: string;
}

const FEATURED_VIDEO: VideoInfo = {
  id: "musicvideo",
  title: "Behold Our God",
  subtitle: "5th Anniversary Music Video · Mary McDonald · Malingin SDA Church",
  src: musicVideoSrc,
};

const PERFORMANCES: VideoInfo[] = [
  { id: "behold", title: "Behold Our God", subtitle: "Live · BEYOND IMAGINATION, NOC Evangelistic Center", src: video1 },
  { id: "beauty", title: "For Your Beauty", subtitle: "Live · BEYOND IMAGINATION, NOC Evangelistic Center", src: video2 },
];

const INFO_CARDS = [
  { label: "Choirmaster", value: "Shiloh Marfil", bg: "#EBF5FF", border: "#BFDBFE", text: "#1D6FAA" },
  { label: "Ministry", value: "Music & Worship", bg: "#EEF2FF", border: "#C7D2FE", text: "#3730A3" },
  { label: "Reach", value: "District & Conference", bg: "#F0F9FF", border: "#BAE6FD", text: "#0369A1" },
];

function StaffLines() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {[22, 34, 46, 58, 70].map((top) => (
        <div key={top} className="absolute w-full" style={{ top: `${top}%`, height: "1px", background: "rgba(255,255,255,0.07)" }} />
      ))}
    </div>
  );
}

function FloatingNotes({ light = false }: { light?: boolean }) {
  const color = light ? "rgba(12,60,120,0.055)" : "rgba(255,255,255,0.06)";
  const notes = ["𝄞", "♪", "♫", "♩", "♪", "♫", "♩", "𝄞"];
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden>
      {notes.map((n, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{ color, fontSize: `${22 + (i % 4) * 22}px`, top: `${(i * 13) % 95}%`, left: `${(i * 12 + 3) % 92}%` }}
          initial={{ rotate: -18 + i * 9, y: 0 }}
          animate={{ rotate: [-18 + i * 9, -18 + i * 9 + 7, -18 + i * 9], y: [0, -12, 0] }}
          transition={{ duration: 6 + (i % 3) * 1.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        >
          {n}
        </motion.span>
      ))}
    </div>
  );
}

function VideoCard({ video, onPlay, big = false }: { video: VideoInfo; onPlay: () => void; big?: boolean }) {
  return (
    <button
      onClick={onPlay}
      className="w-full relative overflow-hidden rounded-2xl group text-left focus:outline-none bg-black"
      style={{ aspectRatio: "16/9" }}
      aria-label={`Play ${video.title}`}
    >
      <video
        src={video.src}
        preload="metadata"
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(4,10,30,0.95) 0%, rgba(4,10,30,0.4) 55%, transparent 100%)" }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`${big ? "w-16 h-16" : "w-14 h-14"} rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300 shadow-lg`}
        >
          <Play size={big ? 26 : 22} className="text-white ml-1" fill="white" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
        <p className={`font-[Playfair_Display] text-white font-semibold italic ${big ? "text-lg" : "text-base"} leading-tight`}>{video.title}</p>
        <p className="font-[Lato] text-white/40 text-[10px] mt-1 uppercase tracking-widest">Tap to watch</p>
      </div>
    </button>
  );
}

export function ChoralePage({ onBack }: Props) {
  const [activeVideo, setActiveVideo] = useState<VideoInfo | null>(null);

  return (
    <div className="min-h-screen pb-16" style={{ background: "#F2F8FF" }}>

      {/* ── VIDEO MODAL ── */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "rgba(4,8,20,0.97)" }}
          onClick={() => setActiveVideo(null)}
        >
          <button
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center z-10 hover:bg-white/20 transition-colors"
            onClick={() => setActiveVideo(null)}
            aria-label="Close"
          >
            <X size={18} className="text-white" />
          </button>
          <div className="w-full max-w-2xl px-4" onClick={(e) => e.stopPropagation()}>
            <p className="font-[Lato] text-white/30 text-[10px] uppercase tracking-[0.22em] text-center mb-2">
              {activeVideo.subtitle}
            </p>
            <p className="font-[Playfair_Display] text-white text-lg font-semibold italic text-center mb-5">
              {activeVideo.title}
            </p>
            <video key={activeVideo.id} src={activeVideo.src} controls autoPlay className="w-full rounded-2xl shadow-2xl" style={{ maxHeight: "68vh", background: "#000" }} />
          </div>
        </div>
      )}

      {/* ── STICKY HEADER ── */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-sky-100 flex items-center gap-3 px-5 py-3">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-sky-50 transition-colors" aria-label="Back">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div>
          <p className="font-[Playfair_Display] font-semibold text-sm text-foreground leading-tight">Malingin Advent Chorale</p>
          <p className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest">Music Ministry · Malingin SDA Church</p>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ height: "55vh", minHeight: 320 }}>
        <img src={macPic} alt="Malingin Advent Chorale" className="absolute inset-0 w-full h-full object-cover object-[center_60%]" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
          {["𝄞", "♫", "♪", "♩"].map((n, i) => (
            <span key={i} className="absolute text-white" style={{ fontSize: `${28 + i * 22}px`, opacity: 0.07, top: `${12 + i * 18}%`, right: `${4 + i * 9}%`, transform: `rotate(${-8 + i * 14}deg)` }}>{n}</span>
          ))}
        </div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,18,48,0.95) 0%, rgba(8,18,48,0.35) 55%, transparent 100%)" }} />
        <div className="absolute bottom-0 px-5 pb-8 md:px-14">
          <p className="font-[Lato] text-[10px] text-white/40 uppercase tracking-[0.25em] mb-2">Music Ministry · Malingin SDA Church</p>
          <h1 className="font-[Playfair_Display] text-white font-semibold italic leading-tight" style={{ fontSize: "clamp(1.7rem, 5vw, 2.8rem)" }}>
            Malingin Advent Chorale
          </h1>
          <p className="font-[Lato] text-white/45 text-sm mt-2 max-w-xs leading-relaxed">Songs that touch the heart · God's Word through music</p>
        </div>
      </div>

      {/* ── FEATURED: 5TH ANNIVERSARY MUSIC VIDEO ── */}
      <div className="px-5 md:px-14 py-12 relative overflow-hidden" style={{ background: "linear-gradient(150deg, #FFF7E0 0%, #FDECC0 50%, #FBE0A0 100%)" }}>
        <FloatingNotes light />
        <div className="relative flex flex-col items-center text-center max-w-xl mx-auto">
          <Reveal3D className="flex flex-col items-center">
            <div className="inline-flex items-center gap-2 mb-3 bg-amber-500/15 border border-amber-400/40 rounded-full px-3 py-1">
              <span className="text-sm">🎉</span>
              <p className="font-[Lato] text-[10px] font-bold uppercase tracking-widest text-amber-700">5th Anniversary Special</p>
            </div>
            <h2 className="font-[Playfair_Display] text-foreground font-semibold italic mb-1" style={{ fontSize: "clamp(1.5rem, 4vw, 2.4rem)" }}>
              Behold Our God
            </h2>
            <p className="font-[Lato] text-muted-foreground text-sm mb-6">
              By Mary McDonald — performed live at Malingin SDA Church for the congregation's 5th anniversary.
            </p>
          </Reveal3D>
          <Reveal3D delay={100} direction="pop">
            <button
              onClick={() => setActiveVideo(FEATURED_VIDEO)}
              className="group relative inline-flex items-center gap-4 rounded-full pl-3 pr-7 py-3 bg-gradient-to-r from-amber-500 to-amber-600 shadow-xl shadow-amber-900/20 hover:shadow-2xl hover:shadow-amber-900/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              <span className="w-11 h-11 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0 group-hover:bg-white/35 group-hover:scale-110 transition-all duration-300">
                <Play size={18} className="text-white ml-0.5" fill="white" />
              </span>
              <span className="text-left">
                <span className="block font-[Lato] text-white/70 text-[10px] uppercase tracking-widest">Watch the Video</span>
                <span className="block font-[Playfair_Display] text-white font-semibold italic text-base leading-tight">Behold Our God</span>
              </span>
            </button>
          </Reveal3D>
        </div>
      </div>

      {/* ── OUR STORY + INFO CARDS (two-column) ── */}
      <div className="px-5 md:px-14 py-12 relative overflow-hidden" style={{ background: "linear-gradient(150deg, #e8f4ff 0%, #dbeafe 45%, #e0f2fe 100%)" }}>
        <FloatingNotes light />
        <div className="relative flex flex-col md:flex-row gap-8 md:gap-12 items-start">

          {/* Text — left */}
          <Reveal3D direction="left" className="flex-1 min-w-0">
            <div className="relative">
              <span
                className="absolute -top-8 -left-3 pointer-events-none select-none font-[Playfair_Display]"
                style={{ fontSize: "9rem", color: "rgba(37,99,235,0.07)", lineHeight: 1 }}
                aria-hidden
              >
                𝄞
              </span>
              <p className="relative font-[Lato] text-[10px] uppercase tracking-[0.25em] text-sky-600 mb-2 flex items-center gap-1.5">
                <span className="text-sky-400">♪</span> Our Story
              </p>
              <h2 className="relative font-[Playfair_Display] font-bold text-foreground mb-1.5 leading-[1.08]" style={{ fontSize: "clamp(1.9rem, 4.4vw, 2.9rem)" }}>
                From Choir to <span className="italic text-sky-700">Chorale</span>
              </h2>
              <p className="relative font-[Lato] text-[10px] text-sky-500 uppercase tracking-widest mb-6">
                Formerly Malingin SDA Choir · Renamed June 2026
              </p>

              <div className="relative space-y-4">
                <p className="font-[Lato] text-[15px] text-foreground/75 leading-relaxed">
                  <span
                    className="float-left font-[Playfair_Display] font-bold text-sky-700 pr-2"
                    style={{ fontSize: "3.6rem", lineHeight: "0.8", marginTop: "0.3rem" }}
                  >
                    T
                  </span>
                  he <strong className="text-foreground">Malingin Advent Chorale</strong> was once known as the <em>Malingin SDA Choir</em>. At first, they were composed of those who organized the church — faithful members who carried both the dream of a congregation and a song in their hearts.
                </p>
                <p className="font-[Lato] text-[15px] text-foreground/75 leading-relaxed">
                  As new members came to Malingin Church, they were invited to try and sing with the choir. One by one, they became full-fledged members — up to this day. Some were already seasoned singers, but <strong className="text-foreground">most of them were non-singers</strong>.
                </p>
                <blockquote className="pl-5 border-l-2 border-sky-400 py-1 relative">
                  <span className="absolute -left-1 -top-3 text-sky-300 font-[Playfair_Display]" style={{ fontSize: "2.5rem" }} aria-hidden>"</span>
                  <p className="font-[Playfair_Display] text-foreground/85 italic leading-relaxed" style={{ fontSize: "1.05rem" }}>
                    With the blessing and grace of God, they learned the voice and acquired the confidence to sing any song taught — and to grab every opportunity given to them.
                  </p>
                </blockquote>
                <p className="font-[Lato] text-[15px] text-foreground/75 leading-relaxed">
                  They are one of Malingin Church's thriving ministries across the district and conference. It is their prayer and hope to bless many more people with songs that touch their hearts and teach God's Word through music.
                </p>
              </div>
            </div>
          </Reveal3D>

          {/* Info cards — right */}
          <Reveal3D direction="right" delay={100} className="w-full md:w-56 shrink-0">
            <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
              {INFO_CARDS.map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl px-3 md:px-4 py-4 md:py-5 text-center border hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                  style={{ background: card.bg, borderColor: card.border }}
                >
                  <p className="font-[Lato] text-[9px] uppercase tracking-widest mb-1.5" style={{ color: card.text }}>{card.label}</p>
                  <p className="font-[Playfair_Display] text-xs md:text-sm font-semibold text-foreground leading-snug">{card.value}</p>
                </div>
              ))}
            </div>
          </Reveal3D>

        </div>
      </div>

      {/* ── PERFORMANCES ── deep navy */}
      <div className="px-5 md:px-14 py-12 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a1630 0%, #0d2458 60%, #0b1f4a 100%)" }}>
        <StaffLines />
        <FloatingNotes />

        <Reveal3D>
          <p className="font-[Lato] text-[10px] uppercase tracking-widest text-white/30 mb-1 relative">Live Performances</p>
          <h2 className="font-[Playfair_Display] text-white font-semibold mb-1 relative" style={{ fontSize: "clamp(1.3rem, 3.5vw, 2rem)" }}>
            BEYOND IMAGINATION
          </h2>
          <p className="font-[Lato] text-white/35 text-xs mb-8 relative">
            Your Pathway to Living · NOC Evangelistic Center, Bacolod City · June 2026
          </p>
        </Reveal3D>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
          {PERFORMANCES.map((perf, i) => (
            <Reveal3D key={perf.id} delay={i * 100} direction="flip">
              <VideoCard video={perf} onPlay={() => setActiveVideo(perf)} />
            </Reveal3D>
          ))}
        </div>
      </div>

      {/* ── PAST EVENTS ── */}
      <div className="px-5 md:px-14 py-12" style={{ background: "linear-gradient(180deg, #F2F8FF 0%, #E8F4FF 100%)" }}>
        <Reveal3D>
          <p className="font-[Lato] text-[10px] uppercase tracking-widest text-sky-600 mb-1">Milestones</p>
          <h2 className="font-[Playfair_Display] text-foreground font-semibold mb-8" style={{ fontSize: "clamp(1.3rem, 3.5vw, 2rem)" }}>
            Past Events
          </h2>
        </Reveal3D>

        <div className="space-y-6">

          {/* Not One Falls: The Musical */}
          <Reveal3D direction="left">
            <div className="rounded-2xl overflow-hidden border border-sky-100 shadow-sm bg-white">
              {/* 3-photo actor strip */}
              <div className="grid grid-cols-3 h-40 sm:h-52">
                {[
                  { photo: skyPhoto, name: "Shekinah Marfil", role: "The Youth" },
                  { photo: lorlenPhoto, name: "Lorlen Terante", role: "The Adult" },
                  { photo: ainPhoto, name: "Ain Arabelo", role: "The Mother" },
                ].map((actor, i) => (
                  <div key={i} className="relative overflow-hidden group">
                    <img src={actor.photo} alt={actor.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(6,15,45,0.92) 0%, rgba(6,15,45,0.15) 55%, transparent 100%)" }} />
                    <div className="absolute bottom-0 left-0 right-0 px-2 pb-2.5 text-center">
                      <p className="font-[Playfair_Display] text-white text-[11px] font-semibold leading-tight">{actor.name}</p>
                      <p className="font-[Lato] text-white/50 text-[9px] uppercase tracking-wide mt-0.5">{actor.role}</p>
                    </div>
                    {/* Divider */}
                    {i < 2 && <div className="absolute top-0 right-0 bottom-0 w-px bg-white/10" />}
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="px-5 py-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="bg-sky-100 text-sky-700 text-[10px] font-[Lato] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">Musical</span>
                      <span className="bg-indigo-100 text-indigo-700 text-[10px] font-[Lato] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">4th Anniversary</span>
                    </div>
                    <p className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest">December 2025</p>
                    <h3 className="font-[Playfair_Display] text-foreground text-base font-semibold italic mt-1 leading-snug">
                      Not One Falls: The Musical
                    </h3>
                  </div>
                </div>
                <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed mb-3">
                  A musical event produced for the <strong className="text-foreground">4th Anniversary of Malingin SDA Church</strong>. The story follows the journey of a life — from a left-behind youth, to a very busy adult, to a challenged mother and wife — a narrative of God's unfailing faithfulness through every season.
                </p>
                <div className="border-t border-sky-100 pt-3 mt-3 space-y-1">
                  <p className="font-[Lato] text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">Cast:</span> Malingin Advent Chorale
                  </p>
                  <p className="font-[Lato] text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">Narrator:</span> Anessa Lyca Galido
                  </p>
                </div>
              </div>
            </div>
          </Reveal3D>

          {/* Cantate Adoremus */}
          <Reveal3D direction="right">
            <div className="rounded-2xl overflow-hidden border border-sky-100 shadow-sm bg-white">
              <div className="relative grid grid-cols-2" style={{ height: "220px" }}>
                {/* Left photo */}
                <div className="relative overflow-hidden group">
                  <img src={concertPhoto} alt="Cantate Adoremus concert" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,18,50,0.85) 0%, rgba(8,18,50,0.1) 60%, transparent 100%)" }} />
                </div>
                {/* Right photo */}
                <div className="relative overflow-hidden border-l border-white/10 group">
                  <img src={cantatePhoto} alt="Cantate Adoremus performance" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,18,50,0.85) 0%, rgba(8,18,50,0.1) 60%, transparent 100%)" }} />
                </div>
                {/* Overlay badges + title across both photos */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                  <span className="bg-sky-500/85 text-white text-[10px] font-[Lato] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Concert</span>
                  <span className="bg-amber-500/85 text-white text-[10px] font-[Lato] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Fundraiser</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 z-10">
                  <p className="font-[Lato] text-white/45 text-[10px] uppercase tracking-widest mb-1">February 2025</p>
                  <p className="font-[Playfair_Display] text-white text-base font-semibold italic leading-snug">
                    Cantate Adoremus: Sing, Let Us Adore!
                  </p>
                </div>
              </div>
              <div className="px-5 py-5">
                <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed mb-3">
                  The church's very first concert — a sacred program featuring messages shared through songs, hymns that uplifted and called listeners to worship. It was also a fundraiser to support various church projects, produced by the <strong className="text-foreground">Malingin Advent Chorale</strong>.
                </p>
                <div className="rounded-xl bg-sky-50 border border-sky-100 px-4 py-3">
                  <p className="font-[Lato] text-[10px] uppercase tracking-widest text-sky-600 mb-1">Guest Singer</p>
                  <p className="font-[Playfair_Display] text-foreground text-sm font-semibold">Lyndou Magbanua Lila</p>
                  <p className="font-[Lato] text-xs text-muted-foreground mt-1 leading-relaxed">
                    Member of the World Choir Champions <strong className="text-foreground">AUP Ambassadors</strong> and a thriving vocal soloist serving God through music.
                  </p>
                </div>
              </div>
            </div>
          </Reveal3D>

        </div>
      </div>

      {/* ── JOIN THE CHORALE ── */}
      <div className="px-5 md:px-14 py-12 relative overflow-hidden" style={{ background: "linear-gradient(150deg, #1559A8 0%, #1A6FC0 50%, #2563EB 100%)" }}>
        <StaffLines />
        <FloatingNotes />

        <div className="relative flex flex-col md:flex-row gap-10 md:gap-12 items-start md:justify-between">

          {/* Left — heading + description, pops in */}
          <Reveal3D direction="pop" className="flex-1 min-w-0 md:max-w-lg">
            <p className="font-[Lato] text-[10px] uppercase tracking-widest text-white/35 mb-1">Be Part of the Harmony</p>
            <h2 className="font-[Playfair_Display] text-white font-semibold mb-4" style={{ fontSize: "clamp(1.3rem, 3.5vw, 2rem)" }}>
              Join the Chorale
            </h2>
            <p className="font-[Lato] text-white/65 text-sm leading-relaxed">
              No formal training required — just a willing voice and a faithful heart. Whether you're a seasoned singer or have never sung before, the Malingin Advent Chorale has a place for you. Reach out to us and let your voice become part of God's music.
            </p>
          </Reveal3D>

          {/* Right — contact links, pop up one after another */}
          <div className="w-full md:w-[340px] shrink-0 space-y-3">
            <Reveal3D direction="pop" delay={0}>
              <p className="font-[Lato] text-[10px] uppercase tracking-widest text-white/35 mb-3">Reach Out</p>
            </Reveal3D>
            <Reveal3D direction="pop" delay={55}>
              <a href="https://www.facebook.com/malingin.church" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl p-4 bg-white/[0.08] border border-white/20 hover:bg-white/[0.18] hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0"><Facebook size={18} className="text-white" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-[Lato] text-[10px] text-white/35 uppercase tracking-widest">Facebook</p>
                  <p className="font-[Playfair_Display] text-white text-sm font-semibold">Malingin SDA Church</p>
                </div>
              </a>
            </Reveal3D>
            <Reveal3D direction="pop" delay={110}>
              <a href="https://www.facebook.com/Terante1993" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl p-4 bg-white/[0.08] border border-white/20 hover:bg-white/[0.18] hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0"><Facebook size={18} className="text-white" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-[Lato] text-[10px] text-white/35 uppercase tracking-widest">Facebook</p>
                  <p className="font-[Playfair_Display] text-white text-sm font-semibold">Lorlen Terante</p>
                </div>
              </a>
            </Reveal3D>
            <Reveal3D direction="pop" delay={165}>
              <a href="mailto:sdamalingin@gmail.com" className="flex items-center gap-4 rounded-2xl p-4 bg-white/[0.08] border border-white/20 hover:bg-white/[0.18] hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0"><Mail size={18} className="text-white" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-[Lato] text-[10px] text-white/35 uppercase tracking-widest">Email</p>
                  <p className="font-[Playfair_Display] text-white text-sm font-semibold">sdamalingin@gmail.com</p>
                </div>
              </a>
            </Reveal3D>
          </div>

        </div>
      </div>

    </div>
  );
}
