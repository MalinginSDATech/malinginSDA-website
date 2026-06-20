import { ArrowLeft, Mail, Phone, Facebook, Music, ChevronRight, Calendar } from "lucide-react";
import macPic from "../../imports/mac_pic.jpg";
import cantatePhoto from "../../imports/Cantate_Adoremus.jpg";
import nocSingPhoto from "../../imports/NOC_sing.png";

interface Props {
  onBack: () => void;
}

const PAST_EVENTS = [
  {
    title: "Cantate Adoremus: Sing, Let Us Adore!",
    date: "February 2025",
    tag: "Concert · Fundraiser",
    desc: "The church's very first concert. A special program featuring messages shared through songs — hymns that uplifted, inspired, and called listeners to worship. It also served as a fundraiser to support various church projects.",
    photo: cantatePhoto,
    alt: "Cantate Adoremus concert performance",
  },
  {
    title: "BEYOND IMAGINATION: Your Pathway to Living",
    date: "June 2026 (Series)",
    tag: "Evangelism Series",
    desc: "A nightly broadcast series held physically at the Negros Occidental Conference Evangelistic Center in Bacolod City and live-streamed by Hope Channel Bacolod and Adventist Media Bacolod. Focused on spiritual growth, health, and discovering a deeper purpose in life. Primary speaker: Pastor Samuel Ruben Braga. The 7th night was held on June 5, 2026.",
    photo: nocSingPhoto,
    alt: "Beyond Imagination NOC evangelism series",
  },
];

export function ChoralePage({ onBack }: Props) {
  return (
    <div className="min-h-full pb-10">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-border flex items-center gap-3 px-5 py-3">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div>
          <p className="font-[Playfair_Display] font-semibold text-sm text-foreground leading-tight">Malingin Advent Chorale</p>
          <p className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest">Ministry Page</p>
        </div>
      </div>

      {/* Hero photo */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={macPic}
          alt="Malingin Advent Chorale"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#162033]/80 via-[#162033]/20 to-transparent" />
        <div className="absolute bottom-0 p-5">
          <p className="font-[Lato] text-[10px] uppercase tracking-widest text-[#D6E5F5]/70 mb-1">Music Ministry · Malingin SDA Church</p>
          <h1 className="font-[Playfair_Display] text-2xl font-bold text-white leading-snug italic">
            Malingin Advent Chorale
          </h1>
        </div>
      </div>

      <div className="px-5 pt-6 space-y-6">

        {/* About */}
        <section className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-[Playfair_Display] text-lg font-semibold text-foreground mb-3">About the Chorale</h2>
          <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed mb-3">
            The Malingin Advent Chorale is the music ministry of the Malingin Seventh-day Adventist Church. Led by choirmaster <span className="font-bold text-foreground">Shiloh Marfil</span>, the chorale is composed of dedicated singers from the congregation who share a heart for worship.
          </p>
          <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed mb-3">
            Their songs are treated as <span className="font-bold text-foreground">hymns of the Church</span> — each performance is not merely a musical number but a sacred offering, delivering God's message through harmony and melody.
          </p>
          <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed">
            In the spirit of <span className="italic text-primary font-semibold">Pag-uswag</span>, the chorale continues to grow in musical excellence and spiritual depth, using their voices as instruments of praise and evangelism.
          </p>
        </section>

        {/* Key info strip */}
        <div className="flex gap-3">
          <div className="flex-1 bg-secondary border border-border rounded-xl px-4 py-3 text-center">
            <p className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Choirmaster</p>
            <p className="font-[Playfair_Display] text-sm font-semibold text-foreground">Shiloh Marfil</p>
          </div>
          <div className="flex-1 bg-secondary border border-border rounded-xl px-4 py-3 text-center">
            <p className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Ministry</p>
            <p className="font-[Playfair_Display] text-sm font-semibold text-foreground">Music & Worship</p>
          </div>
        </div>

        {/* Past Events */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[Playfair_Display] text-lg font-semibold text-foreground">Past Events</h2>
            <Calendar size={16} className="text-muted-foreground" />
          </div>
          <div className="space-y-5">
            {PAST_EVENTS.map((event) => (
              <div key={event.title} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={event.photo}
                    alt={event.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#162033]/70 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-accent text-accent-foreground text-[10px] font-[Lato] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                      {event.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-0 px-4 py-3">
                    <p className="font-[Lato] text-[#D6E5F5]/70 text-[10px] uppercase tracking-widest mb-0.5">{event.date}</p>
                    <h3 className="font-[Playfair_Display] text-white text-base font-semibold italic leading-snug">{event.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Join */}
        <section className="bg-secondary border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
              <Music size={18} className="text-accent" />
            </div>
            <div>
              <h3 className="font-[Lato] text-sm font-bold text-foreground">Join the Chorale</h3>
              <p className="font-[Lato] text-xs text-muted-foreground">Open to all willing singers</p>
            </div>
          </div>
          <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed">
            If you have a heart for worship and a love for music, the Malingin Advent Chorale welcomes you. No formal training required — just a willing voice and a faithful heart.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="font-[Playfair_Display] text-lg font-semibold text-foreground mb-3">Contact</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
              <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <Phone size={15} className="text-primary" />
              </div>
              <div>
                <p className="font-[Lato] text-xs text-muted-foreground">Phone</p>
                <p className="font-[Lato] text-sm text-muted-foreground italic">To be announced</p>
              </div>
            </div>
            <a
              href="mailto:sdamalingin@gmail.com"
              className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:bg-secondary transition-colors"
            >
              <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <Mail size={15} className="text-primary" />
              </div>
              <div>
                <p className="font-[Lato] text-xs text-muted-foreground">Email</p>
                <p className="font-[Lato] text-sm font-bold text-foreground">sdamalingin@gmail.com</p>
              </div>
            </a>
            <a
              href="https://www.facebook.com/malingin.church"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:bg-secondary transition-colors"
            >
              <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <Facebook size={15} className="text-primary" />
              </div>
              <div>
                <p className="font-[Lato] text-xs text-muted-foreground">Facebook</p>
                <p className="font-[Lato] text-sm font-bold text-foreground">Malingin SDA Church</p>
              </div>
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
