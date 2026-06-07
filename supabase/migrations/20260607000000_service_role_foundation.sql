grant select, insert, update, delete
on table public.companies
to service_role;

grant select, insert, update, delete
on table public.user_profiles
to service_role;

grant select, insert, update, delete
on table public.company_memberships
to service_role;

grant execute on function public.is_company_member(uuid)
to service_role;

grant execute on function public.has_company_role(uuid, public.company_role)
to service_role;

comment on role service_role is
  'Server-only Supabase role used by trusted Oda InvoTrack route handlers.';
