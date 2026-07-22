-- Run once in Supabase → SQL Editor → New query → Run

create table public.counters (
  id text primary key,
  name text not null,
  color text not null,
  created_at timestamptz not null default now()
);

create table public.entries (
  id bigint generated always as identity primary key,
  counter_id text not null references public.counters (id) on delete cascade,
  count integer not null,
  timestamp timestamptz not null default now()
);

create index entries_counter_id_idx on public.entries (counter_id);

alter table public.counters enable row level security;
alter table public.entries enable row level security;

create policy "anon all counters" on public.counters
  for all to anon using (true) with check (true);
create policy "anon all entries" on public.entries
  for all to anon using (true) with check (true);

grant select, insert, update, delete on table public.counters to anon;
grant select, insert, update, delete on table public.entries to anon;
grant usage, select on all sequences in schema public to anon;
