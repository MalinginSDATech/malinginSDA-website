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
  active      boolean default true,
  created_at  timestamptz default now()
);

-- Sermons
create table if not exists sermons (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  speaker     text,
  date        text,
  series      text,
  video_url   text,
  excerpt     text,
  active      boolean default true,
  created_at  timestamptz default now()
);

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

-- Admin Emails (authorized users)
create table if not exists admin_emails (
  email  text primary key
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table announcements  enable row level security;
alter table events         enable row level security;
alter table sermons        enable row level security;
alter table give_settings  enable row level security;
alter table transactions   enable row level security;
alter table admin_emails   enable row level security;

-- helper: is the current user in admin_emails?
create or replace function is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from admin_emails where email = auth.jwt() ->> 'email'
  );
$$;

-- Announcements: public read, admin write
create policy "public read announcements"  on announcements for select using (true);
create policy "admin write announcements"  on announcements for insert with check (is_admin());
create policy "admin update announcements" on announcements for update using (is_admin());
create policy "admin delete announcements" on announcements for delete using (is_admin());

-- Events: public read, admin write
create policy "public read events"  on events for select using (true);
create policy "admin write events"  on events for insert with check (is_admin());
create policy "admin update events" on events for update using (is_admin());
create policy "admin delete events" on events for delete using (is_admin());

-- Sermons: public read, admin write
create policy "public read sermons"  on sermons for select using (true);
create policy "admin write sermons"  on sermons for insert with check (is_admin());
create policy "admin update sermons" on sermons for update using (is_admin());
create policy "admin delete sermons" on sermons for delete using (is_admin());

-- Give Settings: public read, admin write
create policy "public read give_settings"  on give_settings for select using (true);
create policy "admin write give_settings"  on give_settings for insert with check (is_admin());
create policy "admin update give_settings" on give_settings for update using (is_admin());
create policy "admin delete give_settings" on give_settings for delete using (is_admin());

-- Transactions: admin only (private financial data)
create policy "admin read transactions"   on transactions for select using (is_admin());
create policy "admin write transactions"  on transactions for insert with check (is_admin());
create policy "admin update transactions" on transactions for update using (is_admin());
create policy "admin delete transactions" on transactions for delete using (is_admin());

-- Admin Emails: authenticated read + admin manage + super admin can upsert own email
create policy "auth read admin_emails"    on admin_emails for select to authenticated using (true);
create policy "admin manage admin_emails" on admin_emails for insert with check (is_admin() or auth.jwt() ->> 'email' = email);
create policy "admin delete admin_emails" on admin_emails for delete using (is_admin());

-- ============================================================
-- IMPORTANT: Insert your email before registering on the site
-- Replace the email below with your actual email address
-- ============================================================
insert into admin_emails (email) values ('YOUR_EMAIL_HERE@example.com')
  on conflict (email) do nothing;
