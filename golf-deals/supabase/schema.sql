-- Golf deals site: run this once in Supabase -> SQL Editor -> New query.
-- It creates the deals table, the admin list, security rules and the image bucket.

-- ---------- Tables ----------
create table if not exists public.deals (
  id             uuid primary key default gen_random_uuid(),
  title          text not null check (char_length(title) between 1 and 200),
  description    text,
  brand          text,
  category       text not null default 'accessories',
  retailer       text,
  deal_url       text not null check (deal_url ~* '^https?://'),
  image_url      text,
  price          numeric(10,2) check (price >= 0),
  original_price numeric(10,2) check (original_price >= 0),
  coupon_code    text,
  is_featured    boolean not null default false,
  is_active      boolean not null default true,
  starts_at      timestamptz,
  expires_at     timestamptz,
  clicks         integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists deals_live_idx on public.deals (is_active, expires_at);
create index if not exists deals_created_idx on public.deals (created_at desc);

-- People allowed to manage deals. Add yourself after creating your login (see README).
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ---------- Helpers ----------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists deals_touch_updated_at on public.deals;
create trigger deals_touch_updated_at
  before update on public.deals
  for each row execute function public.touch_updated_at();

-- Visitors can bump the click counter of a live deal, and nothing else.
create or replace function public.increment_deal_clicks(deal_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.deals
     set clicks = clicks + 1
   where id = deal_id
     and is_active
     and (starts_at is null or starts_at <= now())
     and (expires_at is null or expires_at > now());
$$;

grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.increment_deal_clicks(uuid) to anon, authenticated;

-- ---------- Row level security ----------
alter table public.deals enable row level security;
alter table public.admins enable row level security;

drop policy if exists "Public can read live deals" on public.deals;
create policy "Public can read live deals" on public.deals
  for select using (
    is_active
    and (starts_at is null or starts_at <= now())
    and (expires_at is null or expires_at > now())
  );

drop policy if exists "Admins can read all deals" on public.deals;
create policy "Admins can read all deals" on public.deals
  for select to authenticated using (public.is_admin());

drop policy if exists "Admins can insert deals" on public.deals;
create policy "Admins can insert deals" on public.deals
  for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update deals" on public.deals;
create policy "Admins can update deals" on public.deals
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete deals" on public.deals;
create policy "Admins can delete deals" on public.deals
  for delete to authenticated using (public.is_admin());

drop policy if exists "Admins can see admin list" on public.admins;
create policy "Admins can see admin list" on public.admins
  for select to authenticated using (public.is_admin());

-- ---------- Image storage ----------
insert into storage.buckets (id, name, public)
values ('deal-images', 'deal-images', true)
on conflict (id) do nothing;

drop policy if exists "Admins upload deal images" on storage.objects;
create policy "Admins upload deal images" on storage.objects
  for insert to authenticated with check (bucket_id = 'deal-images' and public.is_admin());

drop policy if exists "Admins update deal images" on storage.objects;
create policy "Admins update deal images" on storage.objects
  for update to authenticated using (bucket_id = 'deal-images' and public.is_admin());

drop policy if exists "Admins delete deal images" on storage.objects;
create policy "Admins delete deal images" on storage.objects
  for delete to authenticated using (bucket_id = 'deal-images' and public.is_admin());
