create type public.company_invoice_qr_status as enum (
  'active_unassigned',
  'active_assigned',
  'claim_pending',
  'revoked'
);

create type public.qr_distribution_method as enum (
  'manual',
  'email',
  'import'
);

create type public.invoice_request_status as enum (
  'request_created',
  'waiting_invoice',
  'invoice_uploaded',
  'need_follow_up_overdue',
  'asked_assigned_employee',
  'need_qr_owner_identification',
  'resolved',
  'rejected',
  'cancelled'
);

create type public.invoice_upload_type as enum (
  'pdf',
  'xml',
  'image',
  'link'
);

create type public.invoice_upload_actor as enum (
  'restaurant',
  'company_accounting',
  'system'
);

create type public.request_event_actor as enum (
  'system',
  'qr_holder',
  'company_accounting',
  'restaurant'
);

create table public.company_invoice_profiles (
  company_id uuid primary key references public.companies(id) on delete cascade,
  legal_name text not null check (char_length(trim(legal_name)) > 0),
  tax_code text not null check (char_length(trim(tax_code)) > 0),
  registered_address text not null check (char_length(trim(registered_address)) > 0),
  invoice_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.company_employees (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  email text,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique nulls not distinct (company_id, email)
);

create table public.company_invoice_qrs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  display_code text not null,
  token_hash text not null unique check (token_hash ~ '^[0-9a-f]{64}$'),
  assigned_employee_id uuid references public.company_employees(id) on delete set null,
  assigned_name text,
  assigned_email text,
  assigned_phone text,
  status public.company_invoice_qr_status not null,
  distribution_method public.qr_distribution_method not null default 'manual',
  email_sent_at timestamptz,
  created_at timestamptz not null default now(),
  assigned_at timestamptz,
  revoked_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (company_id, display_code),
  check (
    status <> 'active_unassigned'
    or (
      assigned_employee_id is null
      and assigned_email is null
      and assigned_name is null
      and assigned_phone is null
    )
  ),
  check (
    status <> 'active_assigned'
    or assigned_employee_id is not null
    or assigned_email is not null
    or assigned_name is not null
  ),
  check (
    assigned_email is null
    or assigned_email = lower(trim(assigned_email))
  )
);

create unique index company_invoice_qrs_active_email_idx
  on public.company_invoice_qrs(company_id, assigned_email)
  where assigned_email is not null and status <> 'revoked';

create index company_invoice_qrs_company_status_idx
  on public.company_invoice_qrs(company_id, status);

create or replace function public.enforce_company_invoice_qr_rules()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  employee_company_id uuid;
  active_qr_count integer;
begin
  if new.assigned_employee_id is not null then
    select employee.company_id
    into employee_company_id
    from public.company_employees employee
    where employee.id = new.assigned_employee_id;

    if employee_company_id is distinct from new.company_id then
      raise exception 'Assigned employee must belong to the QR company.'
        using errcode = '23514';
    end if;
  end if;

  if new.status <> 'revoked' and (
    tg_op = 'INSERT'
    or old.status = 'revoked'
    or old.company_id is distinct from new.company_id
  ) then
    perform pg_advisory_xact_lock(hashtextextended(new.company_id::text, 0));

    select count(*)
    into active_qr_count
    from public.company_invoice_qrs qr
    where qr.company_id = new.company_id
      and qr.status <> 'revoked'
      and qr.id <> new.id;

    if active_qr_count >= 30 then
      raise exception 'A company may have at most 30 active QR records.'
        using errcode = '23514';
    end if;
  end if;

  return new;
end;
$$;

create trigger enforce_company_invoice_qr_rules
before insert or update of company_id, assigned_employee_id, status
on public.company_invoice_qrs
for each row execute function public.enforce_company_invoice_qr_rules();

create table public.invoice_requests (
  id uuid primary key default gen_random_uuid(),
  request_code text not null unique,
  company_id uuid not null references public.companies(id) on delete cascade,
  qr_id uuid not null references public.company_invoice_qrs(id) on delete restrict,
  qr_display_code text not null,
  qr_assignment_status public.company_invoice_qr_status not null,
  assigned_employee_id uuid,
  assigned_employee_name text,
  assigned_email text,
  company_name text not null,
  company_tax_code text not null,
  company_address text not null,
  company_invoice_email text,
  receipt_amount numeric(18, 2) check (receipt_amount is null or receipt_amount > 0),
  receipt_photo_path text,
  invoice_request_card_url text,
  upload_token_hash text not null unique check (upload_token_hash ~ '^[0-9a-f]{64}$'),
  idempotency_key text not null,
  requested_at timestamptz not null default now(),
  visible_until timestamptz not null,
  gps_latitude numeric(9, 6) check (
    gps_latitude is null or gps_latitude between -90 and 90
  ),
  gps_longitude numeric(9, 6) check (
    gps_longitude is null or gps_longitude between -180 and 180
  ),
  ip_address inet not null,
  user_agent text not null,
  approximate_location text,
  status public.invoice_request_status not null default 'request_created',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (qr_id, idempotency_key),
  check (receipt_amount is not null or receipt_photo_path is not null),
  check (visible_until = requested_at + interval '60 days')
);

create index invoice_requests_company_requested_idx
  on public.invoice_requests(company_id, requested_at desc);

create index invoice_requests_visible_until_idx
  on public.invoice_requests(visible_until);

create table public.invoice_request_events (
  id uuid primary key default gen_random_uuid(),
  invoice_request_id uuid not null references public.invoice_requests(id) on delete cascade,
  event_type text not null check (char_length(trim(event_type)) > 0),
  event_payload jsonb not null default '{}'::jsonb,
  created_by_type public.request_event_actor not null,
  created_by_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index invoice_request_events_request_created_idx
  on public.invoice_request_events(invoice_request_id, created_at);

create table public.invoice_uploads (
  id uuid primary key default gen_random_uuid(),
  invoice_request_id uuid not null references public.invoice_requests(id) on delete cascade,
  file_type public.invoice_upload_type not null,
  storage_path text,
  invoice_link text,
  original_filename text,
  content_type text,
  file_size_bytes bigint check (
    file_size_bytes is null or file_size_bytes between 1 and 26214400
  ),
  note text,
  uploaded_by_type public.invoice_upload_actor not null,
  uploaded_by_user_id uuid references auth.users(id) on delete set null,
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  check (
    (file_type = 'link' and invoice_link is not null and storage_path is null)
    or
    (file_type <> 'link' and storage_path is not null and invoice_link is null)
  )
);

create index invoice_uploads_request_uploaded_idx
  on public.invoice_uploads(invoice_request_id, uploaded_at desc);

alter table public.company_invoice_profiles enable row level security;
alter table public.company_employees enable row level security;
alter table public.company_invoice_qrs enable row level security;
alter table public.invoice_requests enable row level security;
alter table public.invoice_request_events enable row level security;
alter table public.invoice_uploads enable row level security;

revoke all on table public.company_invoice_profiles from anon, authenticated;
revoke all on table public.company_employees from anon, authenticated;
revoke all on table public.company_invoice_qrs from anon, authenticated;
revoke all on table public.invoice_requests from anon, authenticated;
revoke all on table public.invoice_request_events from anon, authenticated;
revoke all on table public.invoice_uploads from anon, authenticated;

grant select on table public.company_invoice_profiles to authenticated;
grant select on table public.company_employees to authenticated;
grant select on table public.company_invoice_qrs to authenticated;
grant select on table public.invoice_requests to authenticated;
grant select on table public.invoice_request_events to authenticated;
grant select on table public.invoice_uploads to authenticated;

grant select, insert, update, delete
on table public.company_invoice_profiles,
  public.company_employees,
  public.company_invoice_qrs,
  public.invoice_requests,
  public.invoice_request_events,
  public.invoice_uploads
to service_role;

create policy "members read invoice profiles"
on public.company_invoice_profiles for select to authenticated
using (public.is_company_member(company_id));

create policy "members read employees"
on public.company_employees for select to authenticated
using (public.is_company_member(company_id));

create policy "members read invoice qrs"
on public.company_invoice_qrs for select to authenticated
using (public.is_company_member(company_id));

create policy "members read invoice requests"
on public.invoice_requests for select to authenticated
using (public.is_company_member(company_id));

create policy "members read request events"
on public.invoice_request_events for select to authenticated
using (
  exists (
    select 1
    from public.invoice_requests request
    where request.id = invoice_request_id
      and public.is_company_member(request.company_id)
  )
);

create policy "members read invoice uploads"
on public.invoice_uploads for select to authenticated
using (
  exists (
    select 1
    from public.invoice_requests request
    where request.id = invoice_request_id
      and public.is_company_member(request.company_id)
  )
);

create or replace function public.is_terminal_request_status(
  target_status public.invoice_request_status
)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select target_status in ('resolved', 'rejected', 'cancelled');
$$;

create or replace function public.can_transition_request_status(
  from_status public.invoice_request_status,
  to_status public.invoice_request_status
)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select case
    when public.is_terminal_request_status(from_status) then false
    when to_status = 'cancelled' then true
    when from_status = 'request_created' and to_status = 'waiting_invoice' then true
    when from_status = 'waiting_invoice'
      and to_status in ('invoice_uploaded', 'need_follow_up_overdue') then true
    when from_status = 'need_follow_up_overdue'
      and to_status in ('asked_assigned_employee', 'need_qr_owner_identification') then true
    when from_status = 'asked_assigned_employee'
      and to_status in ('asked_assigned_employee', 'invoice_uploaded') then true
    when from_status = 'need_qr_owner_identification'
      and to_status in ('asked_assigned_employee', 'invoice_uploaded') then true
    when from_status = 'invoice_uploaded'
      and to_status in ('resolved', 'rejected') then true
    else false
  end;
$$;

create or replace function public.requests_eligible_for_purge(
  as_of timestamptz default now()
)
returns setof public.invoice_requests
language sql
stable
security definer
set search_path = ''
as $$
  select request.*
  from public.invoice_requests request
  where request.visible_until <= as_of;
$$;

revoke all on function public.is_terminal_request_status(public.invoice_request_status)
from public;
revoke all on function public.can_transition_request_status(
  public.invoice_request_status,
  public.invoice_request_status
) from public;
revoke all on function public.requests_eligible_for_purge(timestamptz)
from public;

grant execute on function public.is_terminal_request_status(public.invoice_request_status)
to authenticated, service_role;
grant execute on function public.can_transition_request_status(
  public.invoice_request_status,
  public.invoice_request_status
) to authenticated, service_role;
grant execute on function public.requests_eligible_for_purge(timestamptz)
to service_role;

comment on table public.company_invoice_profiles is
  'Company VAT invoice details used to create request snapshots.';
comment on table public.company_invoice_qrs is
  'Company-owned QR identities. Only opaque token hashes are stored.';
comment on table public.invoice_requests is
  '60-day tracking records, not official invoice archive records.';
comment on table public.invoice_uploads is
  'Temporary invoice file/link metadata within the tracking window.';
