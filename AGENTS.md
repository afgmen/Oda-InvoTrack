# AGENTS.md — Oda InvoTrack MVP

## Project Context

This repository contains work for **Oda InvoTrack**, a lightweight restaurant VAT e-invoice
request tracking tool.

Use **PRD v0.9.1 — Oda InvoTrack** as the product source of truth.

The MVP is a tracker. It is not an invoice issuer, accounting system, tax portal automation
system, system of record, or long-term invoice archive.

## Environment & Stack (decide before planning run)

This is a required decision, not an assumption. Confirm it before Codex's first planning run,
because every migration, model convention, and auth integration depends on it.

* **Deployment shape:** InvoTrack is expected to be built as a **module inside the existing
  Oda system** so it can reuse Oda's auth, admin, file storage, and email stack. If instead
  it is a standalone service, say so explicitly — do not infer.
* **Default stack (confirm with PM):** Laravel + MySQL, matching the existing Oda system.
  Do not proceed on this default silently; the planning run must state the detected stack and
  flag any mismatch.

### Codex environment notes

* The Codex agent's own internet access is **off by default** inside the task sandbox. Only
  the **environment setup script** runs with network access.
* Therefore all dependency installs (e.g. `composer install`, `npm install`) and test-database
  setup/migrations must happen in the **setup script**, not mid-task.
* Pin language/runtime versions in the environment settings to match the existing Oda system.

## Core Product Rules

Always preserve these rules:

1. Oda InvoTrack is a **tracker**, not a storage/archive/legal-record system.
2. Do not implement GDT portal login.
3. Do not implement portal scraping.
4. Do not implement automatic reconciliation.
5. Do not implement direct VAT e-invoice issuance.
6. Do not implement 10-year XML storage.
7. Do not position InvoTrack as a system of record.
8. Free-plan request visibility is a **60-day tracking window**, not a storage promise.
9. Request data and uploaded files/links are purged after the tracking window according to
   policy (see Tracking Window Rules — note the purge **job** is out of Phase 1 scope).
10. The invoice itself lives outside InvoTrack: government tax portal, supplier/restaurant
    records, and buyer/company email/accounting storage.

## Roles & Permissions

The permission rules below ("only company accounting can close a request") are unenforceable
until the role exists, so model it explicitly.

* **`company_accounting`** — the only role permitted to set terminal request states
  (`resolved`, `rejected`, `cancelled`) and to review uploaded invoices.
* **`company_admin`** — manages company invoice profile, QR generation, assignment, and
  revocation. May or may not also hold `company_accounting`; do not assume they are the same.
* A user may hold both `company_admin` and `company_accounting`; request closing is gated by
  the `company_accounting` permission, not by the person's title, identity, or admin status.
* **Restaurant staff, assigned employees, QR holders** — have **no** ability to set terminal
  states. Restaurant staff act unauthenticated via request-specific links (no login in MVP).

If the existing Oda system already has a role/permission abstraction, reuse it; do not invent
a parallel one. The planning run must state which role/permission mechanism it will use.

## MVP Request States

The request status flow must use exactly these nine states:

1. `request_created`
2. `waiting_invoice`
3. `invoice_uploaded`
4. `need_follow_up_overdue`
5. `asked_assigned_employee`
6. `need_qr_owner_identification`
7. `resolved`
8. `rejected`
9. `cancelled`

Do not add a separate `card_created` status. Card generation is part of `request_created`.

Do not add any state by analogy (for example, there is **no** separate "email-assigned"
request state — see QR Model Rules).

## Status Transition Rules

The upload path must remain open from every non-terminal state during the tracking window.

Allowed transition rules:

1. `request_created` → `waiting_invoice`
2. `waiting_invoice` → `invoice_uploaded`
3. `waiting_invoice` → `need_follow_up_overdue`
4. `need_follow_up_overdue` → `asked_assigned_employee` if QR is assigned
5. `need_follow_up_overdue` → `need_qr_owner_identification` if QR is unassigned
6. `asked_assigned_employee` → `invoice_uploaded` if invoice file/link is uploaded later
7. `asked_assigned_employee` → `asked_assigned_employee` if accounting asks again
8. `need_qr_owner_identification` → `asked_assigned_employee` once accounting identifies and
   assigns the QR owner
9. `need_qr_owner_identification` → `invoice_uploaded` if invoice file/link is uploaded before
   owner is identified
10. `invoice_uploaded` → `resolved` after company accounting review
11. `invoice_uploaded` → `rejected` after company accounting review
12. Any non-terminal state → `cancelled` by company accounting only

Terminal states:

* `resolved`
* `rejected`
* `cancelled`

Only the `company_accounting` role can set terminal states. Restaurant staff, assigned
employees, and QR holders must not directly close a request.

## Employee Follow-up Rule

The MVP does not include a structured employee follow-up response workflow.

Employee actions are lightweight response events only. Examples:

* entering restaurant name
* uploading receipt
* reporting cancellation

These actions must be recorded as events/notes for company accounting. They must not
automatically change request status.

Example event type:

* `employee_reported_cancelled`

## QR Token Rules

QR tokens must be random, opaque, and non-reversible.

Do not encode or expose:

* company ID
* employee ID
* database IDs
* company tax code
* personal data

Store only a hash of the QR token where appropriate; resolve the token via a lookup, not by
decoding it. Do not use a reversible/encoded scheme (e.g. a JWT or base64-packed ID) that
technically hides but can be reversed.

The QR display code, such as `E-001`, is human-readable and unique within a company, but it
is not a security credential. The display code should remain stable across QR token
regeneration.

## QR Model Rules

QR codes belong to the company first.

Ownership is represented by **exactly four** states (PRD §16):

* `active_unassigned`
* `active_assigned`
* `claim_pending`
* `revoked`

Important: "assigned to an email" and "assigned to an employee" are **both** the single
`active_assigned` state, distinguished only by which columns are populated
(`assigned_email` vs `assigned_employee_id`, both nullable). Do **not** create a fifth
"email-assigned" ownership state.

The free plan supports up to 30 **active** QR codes. Revoked QR codes do not count toward the
active QR limit.

## Tracking Window Rules

Every invoice request must have:

* `requested_at`
* `visible_until`

Default:

```text
visible_until = requested_at + 60 days
```

Open requests are purged on the normal schedule. Do not pause, extend, or warn before purge
for free-plan tracking-window expiry.

Dashboard may show:

```text
Visible until: <date>
```

This is transparency only and does not extend the tracking window.

**Phase 1 purge scope:** Phase 1 stores `visible_until` and must expose purge-eligibility as a
queryable condition (e.g. a scope/query that returns requests past their window). The actual
scheduled deletion job is **out of Phase 1 scope** — do not build a cron/queued purge worker
in Phase 1.

## Privacy / Request Data Rules

The request creation flow may capture:

* request time
* IP address
* user agent / browser-device information
* IP-based approximate location
* GPS latitude/longitude only if the user allows browser location access

The guest page must show a short non-blocking notice before request submission. Do not require
restaurant staff login for MVP.

> Compliance reminder (PRD Risk 10): the guest-page capture of IP, device/browser info, and
> GPS must be reviewed against current Vietnam personal-data rules before launch. This is a
> pre-launch legal/compliance check, not a code task — do not treat the notice as
> self-certifying sufficiency.

## Invoice Upload Rules

Restaurant or company accounting can upload an invoice file/link from any non-terminal request
during the tracking window.

Supported upload types:

* PDF
* XML
* image
* link

Uploading an invoice does not automatically resolve the request. The `company_accounting` role
must review and close it as:

* `resolved`
* `rejected`
* `cancelled`

## Phase 1 Implementation Scope

For the first implementation task, build backend foundation only:

1. Company invoice profile
2. Company invoice QR model
3. QR display code generation
4. Secure QR token generation/storage
5. Assigned/unassigned QR status model
6. Invoice request model
7. Exactly nine request statuses
8. 60-day `visible_until`
9. Invoice request events table
10. Restaurant guest request creation endpoint
11. Receipt amount or receipt photo input
12. Invoice upload placeholder/model
13. Basic accounting dashboard query/data structure

Do not implement OCR, Zalo notification, paid plans, POS integration, reconciliation, provider
integration, the scheduled purge job, or polished UI in Phase 1.

## Required Test Cases

Add or update tests for the following behaviors.

### QR Tests

1. QR display code is unique within a company.
2. QR token does not expose company ID, employee ID, tax code, or database IDs.
3. QR token is opaque and non-reversible.
4. QR can be `active_unassigned`.
5. QR can be `active_assigned` via email (`assigned_email` populated, same state).
6. QR can be `active_assigned` via employee (`assigned_employee_id` populated, same state).
7. Revoked QR does not count toward the active QR limit.

### QR Onboarding / Limit Tests

1. Pasting an email that already holds a QR in the company does **not** mint a second QR
   (idempotency per company).
2. A paste exceeding the 30 active-QR free-plan limit creates QRs up to the remaining headroom
   and reports the overflow (created / skipped-duplicate / invalid / over-limit counts).
3. Malformed emails are rejected and reported; emails are normalized (trimmed, lowercased)
   before duplicate comparison.

### Request Creation Tests

1. Restaurant guest request can be created without login.
2. Request requires either receipt amount or receipt photo.
3. Request stores `requested_at`.
4. Request stores `visible_until = requested_at + 60 days`.
5. Request stores QR ID, QR display code, company ID, IP, user agent, and optional GPS fields.

### Status Tests

1. Status enum includes exactly the nine MVP states.
2. There is no `card_created` status.
3. Invoice upload is allowed from every non-terminal state.
4. `asked_assigned_employee` can transition to `invoice_uploaded`.
5. `need_qr_owner_identification` can transition to `invoice_uploaded`.
6. `need_qr_owner_identification` can transition to `asked_assigned_employee` after owner
   assignment.
7. A non-`company_accounting` actor cannot set `resolved`, `rejected`, or `cancelled`.
8. The `company_accounting` role can set `resolved`, `rejected`, or `cancelled`.
9. Employee cancellation report creates an event/note, not a status change.

### Upload Tests

1. Restaurant can upload invoice file/link through request-specific upload link.
2. Company accounting can upload invoice file/link.
3. Uploading invoice moves request to `invoice_uploaded`.
4. Uploading invoice does not automatically resolve the request.

### Tracking Window Tests

1. Requests older than the tracking window are query-eligible for purge.
2. Open requests are not extended automatically.
3. `Visible until` date is available for dashboard display.

## Engineering Expectations

Before editing files, Codex must:

1. Inspect repository structure.
2. Identify framework, database, routing, auth/roles, file storage, and test setup.
3. State the detected stack and flag any mismatch with the Environment & Stack section.
4. State which role/permission mechanism it will use for `company_accounting`.
5. Propose an implementation plan.
6. List files/migrations/models/controllers/tests to add or modify.
7. State assumptions.
8. Wait for approval before implementation.

When implementing:

1. Prefer existing project conventions.
2. Reuse existing auth, roles, file storage, and notification patterns where possible.
3. Avoid adding new production dependencies unless approved.
4. Add tests for all status and permission rules.
5. Run relevant tests and linters before finishing.
6. Report changed files, test results, and any unresolved assumptions.

## Do Not Build

Do not build any of the following in MVP:

1. GDT portal login
2. Portal scraping
3. Automatic reconciliation
4. Direct VAT e-invoice issuance
5. E-invoice provider integration
6. POS integration
7. Long-term legal archive
8. System-of-record behavior
9. 10-year XML storage
10. Full expense management
11. Approval workflow
12. Department/project allocation
13. Attendee tracking
14. Company card/payment integration
15. Automatic accounting posting
16. Scheduled tracking-window purge job (Phase 1)
17. Polished paid-plan feature set
