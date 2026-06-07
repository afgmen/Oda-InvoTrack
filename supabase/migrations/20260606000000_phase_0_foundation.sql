create type public.company_role as enum (
  'company_admin',
  'company_accounting'
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.company_memberships (
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.company_role not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  primary key (company_id, user_id, role)
);

create index company_memberships_user_id_idx
  on public.company_memberships(user_id);

alter table public.companies enable row level security;
alter table public.user_profiles enable row level security;
alter table public.company_memberships enable row level security;

revoke all on public.companies from anon, authenticated;
revoke all on public.user_profiles from anon, authenticated;
revoke all on public.company_memberships from anon, authenticated;

grant select on public.companies to authenticated;
grant select, update (display_name, updated_at) on public.user_profiles to authenticated;
grant select on public.company_memberships to authenticated;

create or replace function public.is_company_member(target_company_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.company_memberships membership
    where membership.company_id = target_company_id
      and membership.user_id = auth.uid()
  );
$$;

create or replace function public.has_company_role(
  target_company_id uuid,
  required_role public.company_role
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.company_memberships membership
    where membership.company_id = target_company_id
      and membership.user_id = auth.uid()
      and membership.role = required_role
  );
$$;

revoke all on function public.is_company_member(uuid) from public;
revoke all on function public.has_company_role(uuid, public.company_role) from public;
grant execute on function public.is_company_member(uuid) to authenticated;
grant execute on function public.has_company_role(uuid, public.company_role)
  to authenticated;

create policy "members can read their companies"
on public.companies
for select
to authenticated
using (public.is_company_member(id));

create policy "users can read their own profile"
on public.user_profiles
for select
to authenticated
using (user_id = auth.uid());

create policy "users can update their own display name"
on public.user_profiles
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "members can read memberships in their companies"
on public.company_memberships
for select
to authenticated
using (public.is_company_member(company_id));

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_profiles (user_id, display_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'display_name', ''));
  return new;
end;
$$;

revoke all on function public.handle_new_auth_user() from public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();

insert into storage.buckets (id, name, public, file_size_limit)
values
  ('receipt-photos', 'receipt-photos', false, 10485760),
  ('invoice-uploads', 'invoice-uploads', false, 26214400)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit;

comment on table public.companies is
  'Standalone InvoTrack company tenants; Phase 0 identity foundation only.';
comment on table public.company_memberships is
  'Distinct company permissions. company_admin does not imply company_accounting.';
comment on table public.user_profiles is
  'Application profile corresponding to an authenticated company-side user.';
comment on function public.has_company_role(uuid, public.company_role) is
  'RLS-safe company-scoped role check for authenticated users.';
