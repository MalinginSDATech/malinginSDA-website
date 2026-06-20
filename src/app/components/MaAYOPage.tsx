import { ArrowLeft, Mail, Phone, Facebook, Image, Video, Users, ChevronRight } from "lucide-react";
import maayoPic from "../../imports/MaAYO_pic.jpg";

interface Props {
  onBack: () => void;
}

export function MaAYOPage({ onBack }: Props) {
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
          <p className="font-[Playfair_Display] font-semibold text-sm text-foreground leading-tight">MaAYO</p>
          <p className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest">Ministry Page</p>
        </div>
      </div>

      {/* Hero photo */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={maayoPic}
          alt="Malingin Adventist Youth Organization"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#162033]/80 via-[#162033]/20 to-transparent" />
        <div className="absolute bottom-0 p-5">
          <p className="font-[Lato] text-[10px] uppercase tracking-widest text-[#D6E5F5]/70 mb-1">Youth Ministry · Malingin SDA Church</p>
          <h1 className="font-[Playfair_Display] text-2xl font-bold text-white leading-snug">
            Malingin Adventist<br />
            <span className="italic">Youth Organization</span>
          </h1>
        </div>
      </div>

      <div className="px-5 pt-6 space-y-6">

        {/* About */}
        <section className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-[Playfair_Display] text-lg font-semibold text-foreground mb-3">About MaAYO</h2>
          <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed mb-3">
            The Malingin Adventist Youth Organization (MaAYO) is the official youth ministry of the Malingin Seventh-day Adventist Church. It serves as a vibrant community for young believers dedicated to spiritual growth, leadership development, and community outreach.
          </p>
          <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed mb-3">
            MaAYO gathers every Saturday during the Adventist Youth Fellowship (AYF) program from 2:30 PM to 4:30 PM. Through worship, Bible study, and creative activities, the youth are equipped to live out their faith in practical and meaningful ways.
          </p>
          <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed">
            The organization is committed to the year's theme of <span className="text-primary font-semibold italic">Pag-uswag</span> — encouraging every young member to grow in character, faith, and service to the community.
          </p>
        </section>

        {/* What We Do */}
        <section>
          <h2 className="font-[Playfair_Display] text-lg font-semibold text-foreground mb-3">What We Do</h2>
          <div className="space-y-3">
            {[
              { icon: "📖", title: "AYF Programs", desc: "Weekly youth programs every Saturday, 2:30–4:30 PM, featuring devotions, games, and spiritual discussions." },
              { icon: "🤝", title: "Community Outreach", desc: "Reaching out to neighboring communities through service projects, health programs, and evangelism activities." },
              { icon: "🎵", title: "Youth Worship", desc: "Leading praise and worship during Sabbath services and special programs throughout the year." },
              { icon: "🌾", title: "District Events", desc: "Participating in youth rallies and events across the Bago City district with other SDA youth groups." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 bg-card border border-border rounded-xl p-4">
                <span className="text-xl shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-[Lato] text-sm font-bold text-foreground mb-0.5">{item.title}</h3>
                  <p className="font-[Lato] text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Photos placeholder */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-[Playfair_Display] text-lg font-semibold text-foreground">Photos</h2>
            <button className="flex items-center gap-1 text-accent text-xs font-[Lato] font-bold uppercase tracking-wide">
              See All <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-secondary rounded-lg border border-border flex items-center justify-center">
                <Image size={20} className="text-muted-foreground/40" />
              </div>
            ))}
          </div>
          <p className="font-[Lato] text-xs text-muted-foreground text-center mt-2 italic">Photos coming soon</p>
        </section>

        {/* Videos placeholder */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-[Playfair_Display] text-lg font-semibold text-foreground">Videos</h2>
            <button className="flex items-center gap-1 text-accent text-xs font-[Lato] font-bold uppercase tracking-wide">
              See All <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="aspect-video bg-secondary rounded-lg border border-border flex items-center justify-center">
                <Video size={24} className="text-muted-foreground/40" />
              </div>
            ))}
          </div>
          <p className="font-[Lato] text-xs text-muted-foreground text-center mt-2 italic">Videos coming soon</p>
        </section>

        {/* Join */}
        <section className="bg-secondary border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Users size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="font-[Lato] text-sm font-bold text-foreground">Join MaAYO</h3>
              <p className="font-[Lato] text-xs text-muted-foreground">Open to all youth members</p>
            </div>
          </div>
          <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed">
            Every young person is welcome. Come as you are — join us every Saturday at 2:30 PM for AYF Program.
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
