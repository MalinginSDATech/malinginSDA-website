// Shared between the treasurer's Transaction "type" field and the member-facing
// "what was this for" declaration on the Give page, so the two stay in sync.
export const GIVING_PURPOSES = [
  "Tithe",
  "Offering",
  "Department Fund",
  "Benevolence (Someone in Need)",
  "Event",
  "Building & Development",
  "Other",
];

// Shared between the member's giving declaration and the treasurer's manual
// transaction entry, so both always offer the same payment method choices.
export const PAYMENT_METHODS = ["GCash", "Cash"];

// Maps a sermon's stored day_type (the weekday it's generated for) to the
// service name members actually recognize — shared between the admin
// schedule editor and the public Sermons page so both use the same wording.
export const DAY_TYPE_LABEL: Record<string, string> = { Wednesday: "Midweek", Friday: "Vesper", Saturday: "Sabbath" };

// Sub-options shown only when purpose is "Department Fund".
export const DEPARTMENTS = [
  "Youth",
  "Music",
  "Women's Ministry",
  "Children's Ministry",
  "Elders",
  "Technical Ministry",
  "Other Department",
];
