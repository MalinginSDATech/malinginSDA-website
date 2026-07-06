import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { ArrowLeft, Send, ChevronDown, ChevronUp, AlertCircle, MessageCircle } from "lucide-react";
import { supabaseMember as supabase } from "../../supabase";
import { MemberLogin } from "./MemberLogin";

interface Props {
  onBack: () => void;
}

type InquiryType = "visitation" | "host-service" | "event" | "group-request" | "others";

interface MyInquiry { id: string; inquiry_type: string; inquiry_type_other: string | null; status: string; admin_reply: string | null; created_at: string }

const INQUIRY_TYPE_LABELS: Record<string, string> = {
  visitation: "Church Visit", "host-service": "Host a Service", event: "Hold an Event", "group-request": "Request a Group", others: "Other",
};

const SERVICE_PARTS = [
  "Midweek Service (Wednesday)",
  "Vesper Service (Friday)",
  "Sabbath School (Saturday, 8:30 AM)",
  "Divine Service (Saturday, 10:30 AM)",
  "AYF Program (Saturday, 2:30 PM)",
  "Full Sabbath Day",
];

const EVENT_TYPES = [
  "Concert",
  "Meeting / Conference",
  "Special Program",
  "Fundraiser",
  "Youth Event",
  "Other",
];

const GROUP_OPTIONS = [
  { id: "maayo", name: "MaAYO", sub: "Malingin Adventist Youth Organization" },
  { id: "chorale", name: "Malingin Advent Chorale", sub: "Music & Worship Ministry" },
];

function AccordionSection({ title, open, onToggle, children }: {
  title: string; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-3">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary transition-colors">
        <p className="font-[Lato] text-sm font-bold text-foreground">{title}</p>
        {open ? <ChevronUp size={15} className="text-muted-foreground" /> : <ChevronDown size={15} className="text-muted-foreground" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-border pt-4">{children}</div>}
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-left transition-colors ${checked ? "bg-primary/5" : "hover:bg-secondary"}`}
    >
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? "border-primary bg-primary" : "border-border"}`}>
        {checked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <span className={`font-[Lato] text-sm ${checked ? "text-primary font-semibold" : "text-foreground"}`}>{label}</span>
    </button>
  );
}

export function InquiryPage({ onBack }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [inquiryType, setInquiryType] = useState<InquiryType | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const [contact, setContact] = useState({ name: "", phone: "", email: "", org: "" });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [outsideChurch, setOutsideChurch] = useState(false);
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [notes, setNotes] = useState("");
  const [otherDescription, setOtherDescription] = useState("");

  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [myInquiries, setMyInquiries] = useState<MyInquiry[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const fetchMyInquiries = async () => {
    if (!user?.email) { setMyInquiries([]); return; }
    const { data } = await supabase
      .from("inquiries")
      .select("id, inquiry_type, inquiry_type_other, status, admin_reply, created_at")
      .eq("requester_email", user.email)
      .order("created_at", { ascending: false });
    setMyInquiries(data ?? []);
  };
  useEffect(() => { fetchMyInquiries(); }, [user?.email]);

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  const handleSubmit = async () => {
    if (!contact.name.trim() || !inquiryType || (inquiryType === "others" && !otherDescription.trim())) return;
    setError("");
    setSubmitting(true);
    const { error } = await supabase.from("inquiries").insert({
      name: contact.name.trim(), phone: contact.phone.trim(), email: contact.email.trim(), org: contact.org.trim(),
      inquiry_type: inquiryType,
      inquiry_type_other: inquiryType === "others" ? otherDescription.trim() : null,
      services: selectedServices, events: selectedEvents, groups_wanted: selectedGroups,
      outside_church: outsideChurch, event_date: eventDate, event_location: eventLocation,
      notes: notes.trim(),
      requester_email: user?.email ?? null,
    });
    setSubmitting(false);
    if (error) return setError("Failed to submit. Please try again.");
    setSubmitted(true);
    if (user) fetchMyInquiries();
  };

  if (submitted) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-border flex items-center gap-3 px-5 py-3">
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <p className="font-[Playfair_Display] font-semibold text-sm text-foreground">Church Inquiry</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl">🕊</div>
          <h2 className="font-[Playfair_Display] text-xl font-semibold text-foreground">Inquiry Submitted</h2>
          <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed">
            Thank you! Our church leadership will review your inquiry and get back to you as soon as possible.
          </p>
          <button
            onClick={() => {
              setSubmitted(false); setInquiryType(null); setContact({ name: "", phone: "", email: "", org: "" });
              setSelectedServices([]); setSelectedEvents([]); setSelectedGroups([]);
              setOutsideChurch(false); setEventLocation(""); setEventDate(""); setNotes(""); setOtherDescription("");
            }}
            className="mt-2 bg-primary text-primary-foreground font-[Lato] font-bold text-sm px-8 py-3 rounded-full hover:opacity-90 active:scale-95 transition-all"
          >
            Submit Another
          </button>
          <button onClick={onBack} className="font-[Lato] text-sm text-muted-foreground">Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-border flex items-center gap-3 px-5 py-3">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div>
          <p className="font-[Playfair_Display] font-semibold text-sm text-foreground">Church Inquiry</p>
          <p className="font-[Lato] text-[10px] text-muted-foreground uppercase tracking-widest">Malingin SDA Church</p>
        </div>
      </div>

      <div className="px-5 pt-6 pb-10">
        <p className="font-[Lato] text-sm text-muted-foreground leading-relaxed mb-6">
          Planning a visit, hosting a service, or requesting our groups for an event? Fill out the form below and we will get back to you.
        </p>

        {/* Contact info */}
        <div className="mb-5">
          <p className="font-[Lato] text-xs text-muted-foreground uppercase tracking-widest mb-3">Contact Information</p>
          <div className="space-y-3">
            <input
              type="text"
              value={contact.name}
              onChange={(e) => setContact({ ...contact, name: e.target.value })}
              placeholder="Full Name *"
              className="w-full bg-card border border-border rounded-xl px-4 py-3 font-[Lato] text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
            <input
              type="tel"
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              placeholder="Phone Number"
              className="w-full bg-card border border-border rounded-xl px-4 py-3 font-[Lato] text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
            <input
              type="email"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              placeholder="Email Address"
              className="w-full bg-card border border-border rounded-xl px-4 py-3 font-[Lato] text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
            <input
              type="text"
              value={contact.org}
              onChange={(e) => setContact({ ...contact, org: e.target.value })}
              placeholder="Organization / Church (if applicable)"
              className="w-full bg-card border border-border rounded-xl px-4 py-3 font-[Lato] text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Inquiry type */}
        <div className="mb-5">
          <p className="font-[Lato] text-xs text-muted-foreground uppercase tracking-widest mb-3">
            What is your inquiry? <span className="text-primary">*</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            {([
              { value: "visitation", label: "Church Visit", icon: "🏛" },
              { value: "host-service", label: "Host a Service", icon: "📖" },
              { value: "event", label: "Hold an Event", icon: "🎉" },
              { value: "group-request", label: "Request a Group", icon: "🎵" },
              { value: "others", label: "Others", icon: "❓" },
            ] as { value: InquiryType; label: string; icon: string }[]).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setInquiryType(opt.value)}
                className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all text-center ${
                  inquiryType === opt.value ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-secondary"
                }`}
              >
                <span className="text-2xl">{opt.icon}</span>
                <p className={`font-[Lato] text-xs font-bold ${inquiryType === opt.value ? "text-primary" : "text-foreground"}`}>
                  {opt.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Conditional sections */}
        {inquiryType === "host-service" && (
          <AccordionSection
            title="Which service would you like to host?"
            open={openSection === "service"}
            onToggle={() => setOpenSection(openSection === "service" ? null : "service")}
          >
            <div className="space-y-1">
              {SERVICE_PARTS.map((s) => (
                <Checkbox
                  key={s}
                  label={s}
                  checked={selectedServices.includes(s)}
                  onChange={() => toggleItem(selectedServices, setSelectedServices, s)}
                />
              ))}
            </div>
          </AccordionSection>
        )}

        {inquiryType === "event" && (
          <AccordionSection
            title="What type of event?"
            open={openSection === "event"}
            onToggle={() => setOpenSection(openSection === "event" ? null : "event")}
          >
            <div className="space-y-1 mb-4">
              {EVENT_TYPES.map((e) => (
                <Checkbox
                  key={e}
                  label={e}
                  checked={selectedEvents.includes(e)}
                  onChange={() => toggleItem(selectedEvents, setSelectedEvents, e)}
                />
              ))}
            </div>
            <input
              type="text"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              placeholder="Preferred Date (e.g. July 20, 2026)"
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 font-[Lato] text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors mb-2"
            />
            <input
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              placeholder="Preferred Location"
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 font-[Lato] text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
          </AccordionSection>
        )}

        {inquiryType === "group-request" && (
          <AccordionSection
            title="Which group would you like to request?"
            open={openSection === "group"}
            onToggle={() => setOpenSection(openSection === "group" ? null : "group")}
          >
            <div className="space-y-2 mb-4">
              {GROUP_OPTIONS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => toggleItem(selectedGroups, setSelectedGroups, g.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                    selectedGroups.includes(g.id) ? "border-primary bg-primary/5" : "border-border bg-secondary"
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${selectedGroups.includes(g.id) ? "border-primary bg-primary" : "border-border"}`}>
                    {selectedGroups.includes(g.id) && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <div>
                    <p className={`font-[Lato] text-sm font-bold ${selectedGroups.includes(g.id) ? "text-primary" : "text-foreground"}`}>{g.name}</p>
                    <p className="font-[Lato] text-xs text-muted-foreground">{g.sub}</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setOutsideChurch(!outsideChurch)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${outsideChurch ? "border-primary bg-primary/5" : "border-border bg-secondary"}`}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${outsideChurch ? "border-primary bg-primary" : "border-border"}`}>
                {outsideChurch && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div className="text-left">
                <p className={`font-[Lato] text-sm font-bold ${outsideChurch ? "text-primary" : "text-foreground"}`}>Outside Malingin Church</p>
                <p className="font-[Lato] text-xs text-muted-foreground">Request the group for an event at another venue</p>
              </div>
            </button>
            {outsideChurch && (
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  placeholder="Event Date"
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 font-[Lato] text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                />
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Event Location / Venue"
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 font-[Lato] text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            )}
          </AccordionSection>
        )}

        {inquiryType === "others" && (
          <div className="mb-5">
            <label className="font-[Lato] text-xs text-muted-foreground uppercase tracking-widest block mb-2">
              Please describe your inquiry <span className="text-primary">*</span>
            </label>
            <textarea
              value={otherDescription}
              onChange={(e) => setOtherDescription(e.target.value)}
              placeholder="Tell us what you'd like to ask or request..."
              rows={3}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 font-[Lato] text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none leading-relaxed"
            />
          </div>
        )}

        {/* Notes */}
        <div className="mb-8">
          <label className="font-[Lato] text-xs text-muted-foreground uppercase tracking-widest block mb-2">
            Additional Notes / Details
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any other details, requests, or questions..."
            rows={4}
            className="w-full bg-card border border-border rounded-xl px-4 py-3 font-[Lato] text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Login to be notified of acknowledgement */}
        <div className="mb-6 bg-secondary/50 border border-border rounded-xl p-4">
          {user ? (
            <p className="font-[Lato] text-xs text-foreground leading-relaxed">
              Signed in as <span className="font-bold">{user.email}</span> — any reply from the church will appear below.{" "}
              <button onClick={() => supabase.auth.signOut()} className="underline text-muted-foreground">Sign out</button>
            </p>
          ) : showLogin ? (
            <MemberLogin
              onAuthed={(u) => { setUser(u); setShowLogin(false); }}
              helperText="Log in or register so you can see if your inquiry has been acknowledged."
            />
          ) : (
            <button onClick={() => setShowLogin(true)} className="font-[Lato] text-xs text-primary underline text-left leading-relaxed">
              Want to Know if your Inquiry has been Acknowledged? Login/Register here.
            </button>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 mb-3">
            <AlertCircle size={14} className="text-red-600 shrink-0 mt-0.5" />
            <p className="font-[Lato] text-xs text-red-700">{error}</p>
          </div>
        )}
        <button
          onClick={handleSubmit}
          disabled={!contact.name.trim() || !inquiryType || (inquiryType === "others" && !otherDescription.trim()) || submitting}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-[Lato] font-bold text-sm py-3.5 rounded-full tracking-wide hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={15} />
          {submitting ? "Submitting…" : "Submit Inquiry"}
        </button>
        <p className="font-[Lato] text-xs text-muted-foreground text-center mt-3">
          We will respond as soon as possible through your provided contact details.
        </p>

        {user && myInquiries.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border">
            <p className="font-[Lato] text-xs text-muted-foreground uppercase tracking-widest mb-3">Your Inquiries</p>
            <div className="space-y-3">
              {myInquiries.map((i) => (
                <div key={i.id} className="bg-card border border-border rounded-xl p-4">
                  <p className="font-[Lato] text-sm font-semibold text-foreground">
                    {i.inquiry_type === "others" ? (i.inquiry_type_other || "Other") : INQUIRY_TYPE_LABELS[i.inquiry_type] ?? i.inquiry_type}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-[Lato] text-[10px] uppercase tracking-widest text-muted-foreground">{i.status}</span>
                    <span className="font-[Lato] text-[10px] text-muted-foreground">{new Date(i.created_at).toLocaleDateString()}</span>
                  </div>
                  {i.admin_reply && (
                    <div className="mt-2 bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-start gap-2">
                      <MessageCircle size={12} className="text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-[Lato] text-[10px] uppercase tracking-widest text-primary font-bold mb-1">Church Reply</p>
                        <p className="font-[Lato] text-sm text-foreground leading-relaxed">{i.admin_reply}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
