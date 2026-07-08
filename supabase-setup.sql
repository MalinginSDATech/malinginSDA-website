-- ============================================================
-- Malingin SDA Church — Supabase Database Setup
-- Run this entire file in: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- Announcements
create table if not exists announcements (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text,
  active      boolean default true,
  created_at  timestamptz default now()
);

-- Events
create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  tag         text default 'Church',
  day         text,
  month       text,
  year        text,
  location    text,
  description text,
  image_url   text,
  active      boolean default true,
  created_at  timestamptz default now()
);
alter table events add column if not exists image_url text;
-- Crusade-specific fields: a date range plus a per-day schedule of sessions.
-- crusade_schedule shape: [{ date: "YYYY-MM-DD", sessions: [{ label, topic, speaker }] }]
alter table events add column if not exists crusade_start date;
alter table events add column if not exists crusade_end date;
alter table events add column if not exists crusade_schedule jsonb not null default '[]'::jsonb;

-- Sermon Series: one series name per year (e.g. 2026 -> "Pag-uswag")
create table if not exists sermon_series (
  year        text primary key,
  series_name text not null default ''
);

-- Sermons: rows are generated for every Wednesday/Friday/Saturday of a year
-- (the church's regular Midweek/Vesper/Sabbath service days). The admin then
-- just fills in speaker + title per date. "Upcoming" vs "past" is derived from
-- service_date compared to today — no manual status field needed.
create table if not exists sermons (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  speaker     text,
  date        text,
  series      text,
  video_url   text,
  excerpt     text,
  status      text not null default 'Upcoming',
  active      boolean default true,
  created_at  timestamptz default now(),
  service_date date,
  day_type    text,
  year        text
);
alter table sermons add column if not exists status text not null default 'Upcoming';
alter table sermons add column if not exists service_date date;
alter table sermons add column if not exists day_type text;
alter table sermons add column if not exists year text;
alter table sermons add column if not exists has_event boolean not null default false;
-- Must be a plain (non-partial) unique index: Postgres can't match a bare
-- ON CONFLICT (service_date) — as issued by supabase-js's upsert() — against
-- a partial index. A plain unique index still allows any number of NULLs.
drop index if exists sermons_service_date_key;
create unique index if not exists sermons_service_date_key on sermons (service_date);

-- Give Settings (single row, id = 'main')
create table if not exists give_settings (
  id            text primary key default 'main',
  gcash_name    text,
  gcash_number  text,
  phone         text,
  qr_code_url   text
);

-- Transactions
create table if not exists transactions (
  id           uuid primary key default gen_random_uuid(),
  donor_name   text not null,
  donor_email  text,
  amount       numeric default 0,
  type         text default 'Tithe',
  description  text,
  date         text,
  note         text,
  created_at   timestamptz default now()
);
alter table transactions add column if not exists reference_number text;
alter table transactions add column if not exists receipt_url text;
alter table transactions add column if not exists payment_method text default 'GCash';

-- Admin Emails (authorized users)
create table if not exists admin_emails (
  email  text primary key
);

-- Giving Submissions (member self-reported: what they gave, and what it was for)
create table if not exists giving_submissions (
  id          uuid primary key default gen_random_uuid(),
  user_email  text not null,
  user_name   text,
  purpose     text not null default 'Tithe',
  amount      numeric not null default 0,
  note        text,
  status      text not null default 'Pending',
  created_at  timestamptz default now()
);
alter table giving_submissions add column if not exists user_name text;
alter table giving_submissions add column if not exists payment_method text not null default 'GCash';
alter table giving_submissions add column if not exists reference_number text;
alter table giving_submissions add column if not exists receipt_url text;
alter table giving_submissions add column if not exists admin_reply text;
alter table giving_submissions add column if not exists replied_at timestamptz;

-- One-time migration of the old 2-state (Pending/Reviewed) lifecycle's terminal
-- value into the new 4-state one. Must run before the guard trigger below
-- exists: this UPDATE has no auth.jwt() context when run from the SQL Editor,
-- so it would otherwise hit the trigger's non-admin branch and abort the
-- whole pasted script.
update giving_submissions set status = 'Confirmed' where status = 'Reviewed';

-- Guards the giving_submissions status lifecycle (Pending -> Acknowledged ->
-- Payment Sent -> Confirmed) against a member forging a transition directly
-- (e.g. a raw PATCH claiming Payment Sent with a fabricated reference number,
-- or reopening an already-Confirmed row). Admins bypass entirely; members may
-- only no-op, advance Acknowledged -> Payment Sent, or drop back to Pending
-- (which clears the fields tied to the acknowledgement that no longer applies).
create or replace function giving_submissions_guard_transition()
returns trigger language plpgsql as $$
begin
  if is_admin() then return new; end if;
  if new.status = old.status then return new;
  elsif old.status = 'Acknowledged' and new.status = 'Payment Sent' then return new;
  elsif old.status in ('Acknowledged', 'Payment Sent') and new.status = 'Pending' then
    new.admin_reply := null; new.replied_at := null;
    new.reference_number := null; new.receipt_url := null;
    return new;
  else
    raise exception 'Members cannot change a submission from % to %.', old.status, new.status;
  end if;
end;
$$;
drop trigger if exists giving_submissions_guard_transition on giving_submissions;
create trigger giving_submissions_guard_transition
  before update on giving_submissions
  for each row execute function giving_submissions_guard_transition();

-- Church Inquiries (visits, hosting a service, events, group requests)
create table if not exists inquiries (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  phone          text,
  email          text,
  org            text,
  inquiry_type   text not null,
  services       text[],
  events         text[],
  groups_wanted  text[],
  outside_church boolean default false,
  event_date     text,
  event_location text,
  notes          text,
  status         text not null default 'New',
  created_at     timestamptz default now()
);
alter table inquiries add column if not exists inquiry_type_other text;
alter table inquiries add column if not exists requester_email text;
alter table inquiries add column if not exists admin_reply text;
alter table inquiries add column if not exists replied_at timestamptz;

-- Prayer Requests
create table if not exists prayer_requests (
  id          uuid primary key default gen_random_uuid(),
  request     text not null,
  from_name   text,
  visibility  text not null default 'public',
  status      text not null default 'New',
  created_at  timestamptz default now()
);
alter table prayer_requests add column if not exists contact_info text;
alter table prayer_requests add column if not exists wants_visit boolean not null default false;
alter table prayer_requests add column if not exists private_target text;
alter table prayer_requests add column if not exists requester_email text;
alter table prayer_requests add column if not exists admin_reply text;
alter table prayer_requests add column if not exists replied_at timestamptz;

-- Messages: general "ask us anything" channel for logged-in members, separate
-- from Prayer/Inquiry/Giving — the Messages page aggregates all four kinds of
-- admin replies in one place, but this table only holds the general ones.
create table if not exists messages (
  id              uuid primary key default gen_random_uuid(),
  requester_email text not null,
  requester_name  text,
  subject         text,
  body            text not null,
  status          text not null default 'New',
  admin_reply     text,
  replied_at      timestamptz,
  created_at      timestamptz default now()
);

-- Member Profiles: lightweight public mirror of auth.users, kept in sync by a
-- trigger, so the admin panel can check "does this email belong to a
-- registered account?" without needing service-role access to auth.users.
create table if not exists member_profiles (
  id    uuid primary key references auth.users(id) on delete cascade,
  email text not null
);

create or replace function sync_member_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.member_profiles (id, email) values (new.id, new.email)
    on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_upserted on auth.users;
create trigger on_auth_user_upserted
  after insert or update of email on auth.users
  for each row execute function sync_member_profile();

-- Backfill existing accounts (safe to re-run)
insert into public.member_profiles (id, email)
  select id, email from auth.users
  on conflict (id) do update set email = excluded.email;

-- ============================================================
-- Row Level Security
-- ============================================================

alter table announcements  enable row level security;
alter table events         enable row level security;
alter table sermons        enable row level security;
alter table give_settings  enable row level security;
alter table transactions   enable row level security;
alter table admin_emails   enable row level security;
alter table giving_submissions enable row level security;
alter table member_profiles enable row level security;
alter table inquiries enable row level security;
alter table prayer_requests enable row level security;
alter table sermon_series enable row level security;
alter table messages enable row level security;

-- helper: is the current user in admin_emails?
create or replace function is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from admin_emails where email = auth.jwt() ->> 'email'
  );
$$;

-- Callable by anyone (including not-yet-registered visitors) to check whether
-- a given email is on the admin allowlist — needed because the registration
-- screen has to run this check *before* the person has a session, and the
-- admin_emails table itself is only readable by authenticated users.
create or replace function is_authorized_admin_email(check_email text)
returns boolean language sql security definer as $$
  select exists (select 1 from admin_emails where email = lower(check_email));
$$;
grant execute on function is_authorized_admin_email(text) to anon, authenticated;

-- Announcements: public read, admin write
drop policy if exists "public read announcements" on announcements;
drop policy if exists "admin write announcements" on announcements;
drop policy if exists "admin update announcements" on announcements;
drop policy if exists "admin delete announcements" on announcements;
create policy "public read announcements"  on announcements for select using (true);
create policy "admin write announcements"  on announcements for insert with check (is_admin());
create policy "admin update announcements" on announcements for update using (is_admin());
create policy "admin delete announcements" on announcements for delete using (is_admin());

-- Events: public read, admin write
drop policy if exists "public read events" on events;
drop policy if exists "admin write events" on events;
drop policy if exists "admin update events" on events;
drop policy if exists "admin delete events" on events;
create policy "public read events"  on events for select using (true);
create policy "admin write events"  on events for insert with check (is_admin());
create policy "admin update events" on events for update using (is_admin());
create policy "admin delete events" on events for delete using (is_admin());

-- Sermons: public read, admin write
drop policy if exists "public read sermons" on sermons;
drop policy if exists "admin write sermons" on sermons;
drop policy if exists "admin update sermons" on sermons;
drop policy if exists "admin delete sermons" on sermons;
create policy "public read sermons"  on sermons for select using (true);
create policy "admin write sermons"  on sermons for insert with check (is_admin());
create policy "admin update sermons" on sermons for update using (is_admin());
create policy "admin delete sermons" on sermons for delete using (is_admin());

-- Give Settings: public read, admin write
drop policy if exists "public read give_settings" on give_settings;
drop policy if exists "admin write give_settings" on give_settings;
drop policy if exists "admin update give_settings" on give_settings;
drop policy if exists "admin delete give_settings" on give_settings;
create policy "public read give_settings"  on give_settings for select using (true);
create policy "admin write give_settings"  on give_settings for insert with check (is_admin());
create policy "admin update give_settings" on give_settings for update using (is_admin());
create policy "admin delete give_settings" on give_settings for delete using (is_admin());

-- Transactions: admins see everything, members see only rows tagged with their own email
drop policy if exists "admin read transactions" on transactions;
drop policy if exists "member read own transactions" on transactions;
drop policy if exists "admin write transactions" on transactions;
drop policy if exists "admin update transactions" on transactions;
drop policy if exists "admin delete transactions" on transactions;
create policy "admin read transactions"   on transactions for select using (is_admin());
create policy "member read own transactions" on transactions for select
  using (lower(donor_email) = lower(auth.jwt() ->> 'email'));
create policy "admin write transactions"  on transactions for insert with check (is_admin());
create policy "admin update transactions" on transactions for update using (is_admin());
create policy "admin delete transactions" on transactions for delete using (is_admin());

-- Admin Emails: authenticated read + admin manage + super admin can upsert own email
drop policy if exists "auth read admin_emails" on admin_emails;
drop policy if exists "admin manage admin_emails" on admin_emails;
drop policy if exists "admin delete admin_emails" on admin_emails;
create policy "auth read admin_emails"    on admin_emails for select to authenticated using (true);
create policy "admin manage admin_emails" on admin_emails for insert with check (is_admin() or auth.jwt() ->> 'email' = email);
create policy "admin delete admin_emails" on admin_emails for delete using (is_admin());

-- Member Profiles: admin-only lookup (used to validate a donor email exists)
drop policy if exists "admin read member_profiles" on member_profiles;
create policy "admin read member_profiles" on member_profiles for select using (is_admin());

-- Giving Submissions: members declare their own gifts, admins review all.
-- Members may update their own row (to edit before confirmation, or to send
-- the reference number/receipt at the "Done Sending" step) but never once
-- Confirmed, and never insert a row that's born anything but a fresh,
-- unacknowledged Pending — the guard trigger above is the primary defense
-- against a forged status transition, this is a second, cheap layer under it.
drop policy if exists "member insert own submission" on giving_submissions;
drop policy if exists "member read own submissions" on giving_submissions;
drop policy if exists "member update own submission" on giving_submissions;
drop policy if exists "admin read submissions" on giving_submissions;
drop policy if exists "admin update submissions" on giving_submissions;
drop policy if exists "admin delete submissions" on giving_submissions;
create policy "member insert own submission" on giving_submissions
  for insert with check (
    lower(user_email) = lower(auth.jwt() ->> 'email')
    and status = 'Pending' and admin_reply is null
    and reference_number is null and receipt_url is null
  );
create policy "member read own submissions" on giving_submissions
  for select using (lower(user_email) = lower(auth.jwt() ->> 'email'));
create policy "member update own submission" on giving_submissions
  for update
  using (lower(user_email) = lower(auth.jwt() ->> 'email') and status <> 'Confirmed')
  with check (lower(user_email) = lower(auth.jwt() ->> 'email') and status <> 'Confirmed');
create policy "admin read submissions" on giving_submissions
  for select using (is_admin());
create policy "admin update submissions" on giving_submissions
  for update using (is_admin());
create policy "admin delete submissions" on giving_submissions
  for delete using (is_admin());

-- Inquiries: anyone can submit (no login required); a logged-in requester can
-- also read their own row back (matched by email) to see an admin reply,
-- but can't stamp someone else's email onto a submission to spoof that.
drop policy if exists "anyone submit inquiries" on inquiries;
drop policy if exists "requester read own inquiries" on inquiries;
drop policy if exists "admin read inquiries" on inquiries;
drop policy if exists "admin update inquiries" on inquiries;
drop policy if exists "admin delete inquiries" on inquiries;
create policy "anyone submit inquiries" on inquiries
  for insert with check (requester_email is null or lower(requester_email) = lower(auth.jwt() ->> 'email'));
create policy "requester read own inquiries" on inquiries
  for select using (requester_email is not null and lower(requester_email) = lower(auth.jwt() ->> 'email'));
create policy "admin read inquiries"   on inquiries for select using (is_admin());
create policy "admin update inquiries" on inquiries for update using (is_admin());
create policy "admin delete inquiries" on inquiries for delete using (is_admin());

-- Prayer Requests: same anyone-submits / requester-reads-own-by-email pattern.
drop policy if exists "anyone submit prayer_requests" on prayer_requests;
drop policy if exists "requester read own prayer_requests" on prayer_requests;
drop policy if exists "admin read prayer_requests" on prayer_requests;
drop policy if exists "admin update prayer_requests" on prayer_requests;
drop policy if exists "admin delete prayer_requests" on prayer_requests;
create policy "anyone submit prayer_requests" on prayer_requests
  for insert with check (requester_email is null or lower(requester_email) = lower(auth.jwt() ->> 'email'));
create policy "requester read own prayer_requests" on prayer_requests
  for select using (requester_email is not null and lower(requester_email) = lower(auth.jwt() ->> 'email'));
create policy "admin read prayer_requests"   on prayer_requests for select using (is_admin());
create policy "admin update prayer_requests" on prayer_requests for update using (is_admin());
create policy "admin delete prayer_requests" on prayer_requests for delete using (is_admin());

-- Messages: unlike Prayer/Inquiry, sending a general message always requires
-- being logged in — there's no anonymous case to support here.
drop policy if exists "member insert own message" on messages;
drop policy if exists "member read own messages" on messages;
drop policy if exists "admin read messages" on messages;
drop policy if exists "admin update messages" on messages;
drop policy if exists "admin delete messages" on messages;
create policy "member insert own message" on messages
  for insert with check (lower(requester_email) = lower(auth.jwt() ->> 'email'));
create policy "member read own messages" on messages
  for select using (lower(requester_email) = lower(auth.jwt() ->> 'email'));
create policy "admin read messages"   on messages for select using (is_admin());
create policy "admin update messages" on messages for update using (is_admin());
create policy "admin delete messages" on messages for delete using (is_admin());

-- Sermon Series: public read, admin write
drop policy if exists "public read sermon_series" on sermon_series;
drop policy if exists "admin write sermon_series" on sermon_series;
drop policy if exists "admin update sermon_series" on sermon_series;
drop policy if exists "admin delete sermon_series" on sermon_series;
create policy "public read sermon_series"  on sermon_series for select using (true);
create policy "admin write sermon_series"  on sermon_series for insert with check (is_admin());
create policy "admin update sermon_series" on sermon_series for update using (is_admin());
create policy "admin delete sermon_series" on sermon_series for delete using (is_admin());

-- Storage: the "uploads" bucket's "Public" toggle only allows public reads —
-- uploading still goes through RLS on storage.objects, so admins need an
-- explicit policy to insert/update files there (e.g. the QR code image).
drop policy if exists "public read uploads bucket" on storage.objects;
drop policy if exists "admin upload to uploads bucket" on storage.objects;
drop policy if exists "admin update uploads bucket" on storage.objects;
drop policy if exists "admin delete uploads bucket" on storage.objects;
create policy "public read uploads bucket" on storage.objects
  for select using (bucket_id = 'uploads');
create policy "admin upload to uploads bucket" on storage.objects
  for insert to authenticated with check (bucket_id = 'uploads' and is_admin());
create policy "admin update uploads bucket" on storage.objects
  for update to authenticated using (bucket_id = 'uploads' and is_admin());
create policy "admin delete uploads bucket" on storage.objects
  for delete to authenticated using (bucket_id = 'uploads' and is_admin());

-- Members need to upload their own GCash receipt image at the "Done Sending"
-- step. Scoped narrowly to a receipts/ folder so they can't touch admin-owned
-- content elsewhere in the bucket (events/, sermons/, qr/, etc). Both insert
-- and update are needed since the upload uses a fixed receipts/<submission id>
-- path with upsert:true, matching the qr/gcash-qr fixed-path convention above.
drop policy if exists "member upload receipts" on storage.objects;
drop policy if exists "member update own receipts" on storage.objects;
create policy "member upload receipts" on storage.objects
  for insert to authenticated with check (bucket_id = 'uploads' and (storage.foldername(name))[1] = 'receipts');
create policy "member update own receipts" on storage.objects
  for update to authenticated using (bucket_id = 'uploads' and (storage.foldername(name))[1] = 'receipts');

-- ============================================================
-- IMPORTANT: Insert your email before registering on the site
-- Replace the email below with your actual email address
-- ============================================================
insert into admin_emails (email) values ('sdamalingin@gmail.com')
  on conflict (email) do nothing;
