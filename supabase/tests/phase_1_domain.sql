begin;

select plan(26);

select enum_has_labels(
  'public',
  'company_invoice_qr_status',
  array['active_unassigned', 'active_assigned', 'claim_pending', 'revoked'],
  'QR ownership states are exact'
);

select enum_has_labels(
  'public',
  'invoice_request_status',
  array[
    'request_created',
    'waiting_invoice',
    'invoice_uploaded',
    'need_follow_up_overdue',
    'asked_assigned_employee',
    'need_qr_owner_identification',
    'resolved',
    'rejected',
    'cancelled'
  ],
  'request statuses are exactly the nine MVP states'
);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '22000000-0000-0000-0000-000000000001',
    'authenticated', 'authenticated', 'phase1-admin@example.com', '', now(),
    '{}', '{}', now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22000000-0000-0000-0000-000000000002',
    'authenticated', 'authenticated', 'phase1-accounting@example.com', '', now(),
    '{}', '{}', now(), now()
  );

insert into public.companies (id, name)
values ('12000000-0000-0000-0000-000000000001', 'Phase 1 Company');

insert into public.company_memberships (company_id, user_id, role)
values
  (
    '12000000-0000-0000-0000-000000000001',
    '22000000-0000-0000-0000-000000000001',
    'company_admin'
  ),
  (
    '12000000-0000-0000-0000-000000000001',
    '22000000-0000-0000-0000-000000000002',
    'company_accounting'
  );

insert into public.company_invoice_profiles (
  company_id, legal_name, tax_code, registered_address, invoice_email
)
values (
  '12000000-0000-0000-0000-000000000001',
  'Phase 1 Company Limited',
  '0123456789',
  'District 1, HCMC',
  'accounting@example.com'
);

insert into public.company_employees (id, company_id, name, email)
values (
  '32000000-0000-0000-0000-000000000001',
  '12000000-0000-0000-0000-000000000001',
  'Employee One',
  'employee@example.com'
);

insert into public.company_invoice_qrs (
  id, company_id, display_code, token_hash, status, distribution_method
)
values (
  '42000000-0000-0000-0000-000000000001',
  '12000000-0000-0000-0000-000000000001',
  'E-001',
  repeat('a', 64),
  'active_unassigned',
  'manual'
);

select is(
  (
    select status::text
    from public.company_invoice_qrs
    where id = '42000000-0000-0000-0000-000000000001'
  ),
  'active_unassigned',
  'QR can be active_unassigned'
);

insert into public.company_invoice_qrs (
  id, company_id, display_code, token_hash, assigned_email, status,
  distribution_method
)
values (
  '42000000-0000-0000-0000-000000000002',
  '12000000-0000-0000-0000-000000000001',
  'E-002',
  repeat('b', 64),
  'assigned@example.com',
  'active_assigned',
  'email'
);

select is(
  (
    select status::text
    from public.company_invoice_qrs
    where assigned_email = 'assigned@example.com'
  ),
  'active_assigned',
  'email assignment uses active_assigned'
);

insert into public.company_invoice_qrs (
  id, company_id, display_code, token_hash, assigned_employee_id, status,
  distribution_method
)
values (
  '42000000-0000-0000-0000-000000000003',
  '12000000-0000-0000-0000-000000000001',
  'E-003',
  repeat('c', 64),
  '32000000-0000-0000-0000-000000000001',
  'active_assigned',
  'import'
);

select is(
  (
    select status::text
    from public.company_invoice_qrs
    where assigned_employee_id = '32000000-0000-0000-0000-000000000001'
  ),
  'active_assigned',
  'employee assignment uses active_assigned'
);

select throws_ok(
  $$
    insert into public.company_invoice_qrs (
      company_id, display_code, token_hash, status
    )
    values (
      '12000000-0000-0000-0000-000000000001',
      'E-001',
      repeat('d', 64),
      'active_unassigned'
    )
  $$,
  '23505',
  null,
  'QR display code is unique within a company'
);

update public.company_invoice_qrs
set status = 'revoked', revoked_at = now()
where id = '42000000-0000-0000-0000-000000000003';

select is(
  (
    select count(*)
    from public.company_invoice_qrs
    where company_id = '12000000-0000-0000-0000-000000000001'
      and status <> 'revoked'
  ),
  2::bigint,
  'revoked QRs do not count as active'
);

insert into public.company_invoice_qrs (
  company_id, display_code, token_hash, status
)
select
  '12000000-0000-0000-0000-000000000001',
  'E-' || lpad(series_number::text, 3, '0'),
  encode(digest('limit-token-' || series_number, 'sha256'), 'hex'),
  'active_unassigned'
from generate_series(4, 31) as series_number;

select is(
  (
    select count(*)
    from public.company_invoice_qrs
    where company_id = '12000000-0000-0000-0000-000000000001'
      and status <> 'revoked'
  ),
  30::bigint,
  'a company can have 30 active QRs'
);

select throws_ok(
  $$
    insert into public.company_invoice_qrs (
      company_id, display_code, token_hash, status
    )
    values (
      '12000000-0000-0000-0000-000000000001',
      'E-032',
      repeat('f', 64),
      'active_unassigned'
    )
  $$,
  '23514',
  'A company may have at most 30 active QR records.',
  'the database rejects a 31st active QR'
);

insert into public.companies (id, name)
values ('12000000-0000-0000-0000-000000000002', 'Other Company');

insert into public.company_employees (id, company_id, name, email)
values (
  '32000000-0000-0000-0000-000000000002',
  '12000000-0000-0000-0000-000000000002',
  'Other Employee',
  'other@example.com'
);

select throws_ok(
  $$
    insert into public.company_invoice_qrs (
      company_id, display_code, token_hash, assigned_employee_id, status
    )
    values (
      '12000000-0000-0000-0000-000000000001',
      'E-033',
      repeat('1', 64),
      '32000000-0000-0000-0000-000000000002',
      'active_assigned'
    )
  $$,
  '23514',
  'Assigned employee must belong to the QR company.',
  'QR assignment rejects an employee from another company'
);

select is(
  (
    select count(*)
    from public.company_invoice_qrs
    where assigned_employee_id = '32000000-0000-0000-0000-000000000002'
  ),
  0::bigint,
  'cross-company QR assignment is not persisted'
);

insert into public.invoice_requests (
  id, request_code, company_id, qr_id, qr_display_code,
  qr_assignment_status, company_name, company_tax_code, company_address,
  receipt_amount, upload_token_hash, idempotency_key, requested_at,
  visible_until, ip_address, user_agent
)
values (
  '52000000-0000-0000-0000-000000000001',
  'INV-TEST-001',
  '12000000-0000-0000-0000-000000000001',
  '42000000-0000-0000-0000-000000000001',
  'E-001',
  'active_unassigned',
  'Phase 1 Company Limited',
  '0123456789',
  'District 1, HCMC',
  1250000,
  repeat('e', 64),
  'idempotency-1',
  '2026-06-01 00:00:00+00',
  '2026-07-31 00:00:00+00',
  '127.0.0.1',
  'pgTAP'
);

select is(
  (
    select visible_until - requested_at
    from public.invoice_requests
    where id = '52000000-0000-0000-0000-000000000001'
  ),
  interval '60 days',
  'visible_until is exactly requested_at plus 60 days'
);

select throws_ok(
  $$
    insert into public.invoice_requests (
      request_code, company_id, qr_id, qr_display_code,
      qr_assignment_status, company_name, company_tax_code, company_address,
      upload_token_hash, idempotency_key, requested_at, visible_until,
      ip_address, user_agent
    )
    values (
      'INV-TEST-NO-EVIDENCE',
      '12000000-0000-0000-0000-000000000001',
      '42000000-0000-0000-0000-000000000001',
      'E-001', 'active_unassigned', 'Company', '123', 'Address',
      repeat('f', 64), 'idempotency-no-evidence', now(), now() + interval '60 days',
      '127.0.0.1', 'pgTAP'
    )
  $$,
  '23514',
  null,
  'request requires amount or receipt photo'
);

select ok(
  public.can_transition_request_status(
    'asked_assigned_employee',
    'invoice_uploaded'
  ),
  'asked_assigned_employee can transition to invoice_uploaded'
);

select ok(
  public.can_transition_request_status(
    'need_qr_owner_identification',
    'invoice_uploaded'
  ),
  'need_qr_owner_identification can transition to invoice_uploaded'
);

select ok(
  public.can_transition_request_status(
    'need_qr_owner_identification',
    'asked_assigned_employee'
  ),
  'owner identification can transition to asked_assigned_employee'
);

select ok(
  not public.is_terminal_request_status('invoice_uploaded'),
  'invoice_uploaded is not terminal'
);

select ok(
  public.is_terminal_request_status('resolved')
  and public.is_terminal_request_status('rejected')
  and public.is_terminal_request_status('cancelled'),
  'terminal states are resolved rejected and cancelled'
);

insert into public.invoice_request_events (
  invoice_request_id, event_type, created_by_type
)
values (
  '52000000-0000-0000-0000-000000000001',
  'employee_reported_cancelled',
  'qr_holder'
);

select is(
  (
    select status::text
    from public.invoice_requests
    where id = '52000000-0000-0000-0000-000000000001'
  ),
  'request_created',
  'employee cancellation event does not change request status'
);

insert into public.invoice_requests (
  id, request_code, company_id, qr_id, qr_display_code,
  qr_assignment_status, company_name, company_tax_code, company_address,
  receipt_amount, upload_token_hash, idempotency_key, requested_at,
  visible_until, ip_address, user_agent
)
values (
  '52000000-0000-0000-0000-000000000002',
  'INV-TEST-EXPIRED',
  '12000000-0000-0000-0000-000000000001',
  '42000000-0000-0000-0000-000000000001',
  'E-001', 'active_unassigned', 'Company', '123', 'Address', 100,
  repeat('1', 64), 'idempotency-expired',
  '2025-01-01 00:00:00+00', '2025-03-02 00:00:00+00',
  '127.0.0.1', 'pgTAP'
);

select results_eq(
  $$
    select id
    from public.requests_eligible_for_purge('2026-01-01 00:00:00+00')
    where id = '52000000-0000-0000-0000-000000000002'
  $$,
  $$
    values ('52000000-0000-0000-0000-000000000002'::uuid)
  $$,
  'expired requests are queryable for purge'
);

set local role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '22000000-0000-0000-0000-000000000001',
  true
);
select set_config('request.jwt.claim.role', 'authenticated', true);

select throws_ok(
  $$
    update public.invoice_requests
    set status = 'resolved'
    where id = '52000000-0000-0000-0000-000000000001'
  $$,
  '42501',
  null,
  'client-side authenticated access cannot write protected request status'
);

select is(
  (
    select count(*)
    from public.invoice_requests
    where company_id = '12000000-0000-0000-0000-000000000001'
  ),
  2::bigint,
  'company member can read company requests through RLS'
);

reset role;

select lives_ok(
  $$
    insert into public.invoice_uploads (
      invoice_request_id, file_type, invoice_link, uploaded_by_type
    )
    values (
      '52000000-0000-0000-0000-000000000001',
      'link',
      'https://example.com/invoice.pdf',
      'restaurant'
    )
  $$,
  'invoice link upload metadata can be recorded'
);

select is(
  (
    select status::text
    from public.invoice_requests
    where id = '52000000-0000-0000-0000-000000000001'
  ),
  'request_created',
  'upload metadata alone does not resolve a request'
);

select ok(
  not public.can_transition_request_status('resolved', 'invoice_uploaded'),
  'terminal requests cannot return to invoice_uploaded'
);

select is(
  (
    select count(*)
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'invoice_requests'
      and column_name = 'visible_until'
  ),
  1::bigint,
  'visible_until is available for dashboard display'
);

select * from finish();
rollback;
