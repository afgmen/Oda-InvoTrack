begin;

select plan(17);

select has_type('public', 'company_role', 'company_role enum exists');
select enum_has_labels(
  'public',
  'company_role',
  array['company_admin', 'company_accounting'],
  'company roles are exact and distinct'
);

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '20000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'admin@example.com',
    '',
    now(),
    '{}',
    '{}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '20000000-0000-0000-0000-000000000002',
    'authenticated',
    'authenticated',
    'accounting@example.com',
    '',
    now(),
    '{}',
    '{}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '20000000-0000-0000-0000-000000000003',
    'authenticated',
    'authenticated',
    'outsider@example.com',
    '',
    now(),
    '{}',
    '{}',
    now(),
    now()
  );

insert into public.companies (id, name)
values
  ('10000000-0000-0000-0000-000000000001', 'Company One'),
  ('10000000-0000-0000-0000-000000000002', 'Company Two');

insert into public.company_memberships (company_id, user_id, role)
values
  (
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'company_admin'
  ),
  (
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    'company_accounting'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000002',
    'company_admin'
  );

select is(
  (
    select count(*)
    from public.user_profiles
    where user_id in (
      '20000000-0000-0000-0000-000000000001',
      '20000000-0000-0000-0000-000000000002',
      '20000000-0000-0000-0000-000000000003'
    )
  ),
  3::bigint,
  'auth trigger creates one profile per user'
);

set local role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '20000000-0000-0000-0000-000000000001',
  true
);
select set_config('request.jwt.claim.role', 'authenticated', true);

select ok(
  public.is_company_member('10000000-0000-0000-0000-000000000001'),
  'admin is a member of company one'
);
select ok(
  public.has_company_role(
    '10000000-0000-0000-0000-000000000001',
    'company_admin'
  ),
  'admin has company_admin'
);
select ok(
  not public.has_company_role(
    '10000000-0000-0000-0000-000000000001',
    'company_accounting'
  ),
  'company_admin does not imply company_accounting'
);
select is(
  (select count(*) from public.companies),
  1::bigint,
  'member can read only their company'
);
select is(
  (select count(*) from public.company_memberships),
  2::bigint,
  'member can read memberships only in their company'
);
select is(
  (select count(*) from public.user_profiles),
  1::bigint,
  'member can read only their own profile'
);
select throws_ok(
  $$
    insert into public.company_memberships (company_id, user_id, role)
    values (
      '10000000-0000-0000-0000-000000000001',
      '20000000-0000-0000-0000-000000000001',
      'company_accounting'
    )
  $$,
  '42501',
  null,
  'authenticated user cannot grant themselves a role'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '20000000-0000-0000-0000-000000000003',
  true
);
select set_config('request.jwt.claim.role', 'authenticated', true);

select is(
  (select count(*) from public.companies),
  0::bigint,
  'outsider cannot read companies'
);
select is(
  (select count(*) from public.company_memberships),
  0::bigint,
  'outsider cannot read memberships'
);
select is(
  (select count(*) from storage.objects),
  0::bigint,
  'private storage exposes no objects to an authenticated outsider'
);
select throws_ok(
  $$
    insert into storage.objects (bucket_id, name, owner)
    values (
      'receipt-photos',
      'unauthorized.jpg',
      '20000000-0000-0000-0000-000000000003'
    )
  $$,
  '42501',
  null,
  'storage buckets deny direct authenticated uploads'
);

reset role;
set local role service_role;

select lives_ok(
  $$
    insert into public.companies (id, name)
    values ('10000000-0000-0000-0000-000000000003', 'Service Company')
  $$,
  'service role can write trusted server-side company data'
);

reset role;
select is(
  (select count(*) from storage.buckets where public),
  0::bigint,
  'Phase 0 storage buckets are private'
);
select is(
  (
    select count(*)
    from storage.buckets
    where id in ('receipt-photos', 'invoice-uploads')
  ),
  2::bigint,
  'temporary tracking buckets are provisioned'
);

select * from finish();
rollback;
