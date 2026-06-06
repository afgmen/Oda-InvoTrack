# PRD v0.9.1 — Oda InvoTrack

> Consolidated PRD. v0.9.1 applies four targeted fixes over v0.9:
> (1) minimal status-flow transitions so no non-terminal state is a dead end and the
> always-live upload path can reach Resolved; (2) the assigned-employee follow-up screen
> reports a cancellation as an event for accounting rather than changing status directly —
> only company accounting closes a request; (3) the "Card Created Page" UI screen renamed to
> "Card Ready Page" to avoid confusion with the removed `Card Created` status; (4) a short
> privacy/notice line on the restaurant guest page for request time, browser/device
> information, IP-based approximate location, and GPS location if allowed. No scope was added;
> no structured employee follow-up response workflow exists in the MVP.

## 1. Product Name

Oda InvoTrack

Meaning: Invoice + Tracking — a lightweight system that tracks corporate VAT e-invoice
requests made at restaurants.

## 2. One-line Description

Oda InvoTrack allows companies to create fixed invoice QR codes for employees or teams, so
restaurant staff can scan the QR, generate a ready-to-send Invoice Request Card, and help
company accounting teams track whether VAT e-invoices were requested, uploaded, followed up,
and resolved.

## 3. Default Language

Default product language: Vietnamese
Optional language toggle: English

Reason:

* Restaurant staff and restaurant accounting teams in Vietnam will usually operate in
  Vietnamese.
* Company admins, foreign managers, and foreign-invested companies may prefer English.
* The product should support Vietnamese first, with English as an optional interface
  language.

## 4. MVP Positioning

Vietnamese

```text
Oda InvoTrack là công cụ nhẹ để theo dõi yêu cầu xuất hóa đơn điện tử GTGT từ nhà hàng.

Nó giúp công ty tạo yêu cầu xuất hóa đơn bằng mã QR, giúp nhân viên nhà hàng tạo một Thẻ Yêu Cầu Hóa Đơn rõ ràng, và giúp kế toán công ty theo dõi các hóa đơn còn chờ và đã tải lên.
```

English

```text
Oda InvoTrack is a lightweight restaurant VAT e-invoice request tracking tool.

It helps companies generate QR-based invoice requests, helps restaurant staff create a clean Invoice Request Card, and helps company accounting teams track pending and uploaded invoices.
```

## 5. Background

In Vietnam, companies often need VAT e-invoices from restaurants to properly record business
meal, staff meal, client meeting, and entertainment expenses.

The current process is manual and inconvenient:

1. Company employees show company tax code, company name, registered address, and invoice
   email to restaurant staff.
2. Restaurant staff take a photo of the company information or manually copy it.
3. Restaurant staff also need to keep the receipt or bill information.
4. Restaurant staff usually send the company invoice information and receipt evidence to the
   restaurant accounting team via Zalo, Messenger, email, or internal chat.
5. Restaurant accounting later issues the VAT e-invoice using its existing e-invoice
   provider.
6. Company accounting has limited visibility into whether the invoice was requested,
   uploaded, followed up, or resolved.
7. If the invoice is missing, company accounting often does not know who to ask.

Oda InvoTrack solves this by creating:

1. A lightweight invoice request trail for the company.
2. A structured Invoice Request Card for restaurant staff.
3. A simple tracking dashboard for company accounting.

## 6. Product Goals

The MVP goal is not to become an e-invoice issuance provider, accounting system, tax portal
automation system, or long-term invoice archive.

The goal is to build a lightweight workflow layer that:

1. Lets companies create fixed QR codes for invoice requests.
2. Supports multiple onboarding modes:
   * quick unassigned QR generation,
   * recommended email distribution and auto-assignment,
   * full employee setup.
3. Gives each QR a human-friendly display code such as `E-001`, `E-002`, `E-003`.
4. Allows QR codes to be assigned to employees immediately or later.
5. Allows employees or QR holders to show a QR at restaurants.
6. Allows restaurant staff to scan the QR and access verified company invoice information.
7. Allows restaurant staff to confirm the invoice request by providing either:
   * receipt amount, or
   * receipt photo.
8. Automatically creates a shareable Invoice Request Card containing:
   * company invoice information,
   * receipt evidence,
   * QR display code,
   * request ID,
   * request time,
   * upload/follow-up link.
9. Guides restaurant staff to save the card image and send/share it with their accounting
   team.
10. Allows restaurant or company accounting to upload an invoice file/link.
11. Allows company accounting to manually review and close the request.
12. Allows automatic follow-up if the QR is assigned to an email/contact.
13. Allows manual follow-up by QR display code if the QR is unassigned.

## 7. Core Product Principles

### 7.1 Employee / QR Holder UX

The employee or QR holder experience should be: Show QR. Done.

No employee should need to enter:

* restaurant name,
* amount,
* receipt photo,
* purpose,
* attendees,
* department,
* project.

### 7.2 Restaurant Staff UX

The restaurant staff experience should be: Scan QR. Add amount or receipt photo. Create
card. Save/share. Done.

Restaurant staff should not need to:

* create an account,
* enter restaurant tax code,
* enter restaurant name,
* enter personal information,
* learn a new accounting system.

### 7.3 Company Accounting UX

The company accounting experience should be: Track invoice requests. Follow up only when
needed.

Important rule: Invoice request does not mean accounting approval.

A QR-generated request only means that a company invoice request was created. Final expense
acceptance belongs to the company accounting team.

## 8. MVP Scope

### 8.1 Included in MVP

1. Company invoice profile
2. QR generation
3. Email-assisted QR onboarding
4. Assigned / unassigned QR modes
5. Invoice Request Card
6. Save / share card flow
7. Request tracking dashboard
8. Invoice upload by file or link
9. Manual accounting review
10. 60-day free tracking window
11. QR display code
12. QR claim / assignment flow
13. Structured copyable fields on the Invoice Request Card
14. Basic notifications / follow-up where contact is available
15. CSV/Excel export within the visible tracking window
16. Free-plan active QR limit
17. Basic fair-use controls

### 8.2 Not Included in MVP

1. GDT portal login
2. Portal scraping
3. Automatic reconciliation
4. System-of-record positioning
5. 10-year XML storage
6. Long-term legal archive
7. Direct VAT e-invoice issuance by Oda
8. Integration with MISA, Viettel, VNPT, BKAV, SInvoice, EasyInvoice, or other providers
9. POS integration
10. Full expense management
11. Approval workflow
12. Department/project allocation
13. Attendee tracking
14. Meal purpose classification
15. Company card/payment integration
16. Automatic accounting system posting
17. Mandatory restaurant account registration
18. Legal/tax validation of whether the expense is deductible
19. Automatic saving of image into phone gallery without user action
20. Advanced employee directory management
21. Structured employee follow-up response workflow (see Section 26 / 27)

## 9. Record Positioning: Not a System of Record, Not a Store

Oda InvoTrack does not store invoices as a record and does not claim to be the official
invoice archive.

The invoice itself already exists in three places:

1. Government tax portal: `hoadondientu.gdt.gov.vn`
2. Supplier / restaurant: the issuer
3. Buyer / company: received by email in most cases, then usually downloaded locally

Oda InvoTrack only tracks the request and its status. The company's accounting software or
existing storage remains the official accounting record. Any file or link held in Oda
InvoTrack is a temporary tracking convenience, not a record copy.

### 9.1 Upload Screen Reminder

To prevent misplaced trust, the upload screen must carry a short reminder.

Vietnamese:

```text
Lưu ý: Oda InvoTrack chỉ giúp theo dõi yêu cầu hóa đơn. Đây không phải là nơi lưu trữ chính thức. Vui lòng giữ hóa đơn gốc trong hệ thống kế toán của công ty.
```

English:

```text
Note: Oda InvoTrack only helps track invoice requests. It is not your official archive. Please keep the original invoice in your company's accounting records.
```

## 10. Tracking Window — Free Plan

Oda InvoTrack is a tracking tool, not a storage location.

Free-plan tracking behavior:

1. A request and any attached file/link stay visible for a 60-day tracking window.
2. After 60 days, the request record and attached file/link are purged.
3. This is expected, not a loss: the invoice continues to exist in the three real locations:
   * government tax portal,
   * restaurant/supplier records,
   * buyer/company email or local/accounting storage.
4. Requests still open at day 60 are purged on the same schedule.
5. The window is not extended.
6. There is no pre-purge prompt.
7. Silent expiry is correct because Oda InvoTrack is not the record.
8. If a buyer or supplier needs to follow up beyond the window, they reconcile using their
   own storage, not Oda InvoTrack.

Dashboard UX:

```text
Visible until: <date>
```

This label is transparency only. It is not a pre-purge prompt and does not extend the window.

## 11. User Personas

### 11.1 Company Admin

Needs:

* Create company invoice profile.
* Generate QR codes quickly.
* Choose onboarding mode.
* Paste employee emails for auto-distribution.
* Download QR cards as PDF or image.
* Assign QR codes later.
* Revoke or regenerate QR codes.
* See active QR usage and free-plan limit.

### 11.2 Company Employee / QR Holder

Needs:

* Receive QR by email, print, or internal distribution.
* Show QR at restaurant.
* Avoid typing or uploading anything.
* Respond only if accounting asks later.

Expected behavior:

* Shows fixed company invoice QR.
* Does nothing else at request stage.

### 11.3 Restaurant Staff

Examples: cashier, waiter/waitress, store manager.

Needs:

* Quickly access company invoice information.
* Avoid taking separate photos of company info and receipt.
* Create one clean image to send to restaurant accounting team.

Expected behavior:

* Scans QR.
* Views company invoice information.
* Adds receipt amount or uploads/takes receipt photo.
* Creates Invoice Request Card.
* Saves the card image.
* Sends/shares the card image to restaurant accounting.

No login required in MVP.

### 11.4 Restaurant Accounting Team

Needs:

* Receive clear invoice request information.
* Issue VAT e-invoice using existing e-invoice provider.
* Use Invoice Request Card as reference.
* Upload issued invoice PDF/XML/image/link later if useful.

### 11.5 Company Accounting Team

Needs:

* Track invoice requests.
* Know which QR generated the request.
* Know whether QR is assigned or unassigned.
* Know when and roughly where the request happened.
* Follow up with the QR owner if known.
* Manually identify QR owner if unassigned.
* Review uploaded invoice file/link.
* Mark requests as resolved, rejected, or cancelled.

## 12. Flexible QR Onboarding

### 12.1 Why This Matters

Requiring employee names, phone numbers, Zalo IDs, or departments upfront creates onboarding
friction. However, fully anonymous QR codes weaken automatic follow-up.

Therefore, Oda InvoTrack should support three onboarding levels:

1. Quick Start — generate unassigned QR codes by quantity.
2. Recommended — paste employee emails and auto-assign one QR per email.
3. Full Setup — upload names, emails, phone/Zalo, and optional employee details.

Recommended product principle: Generate QR codes easily first. Add employee details only
when useful.

## 13. Onboarding Modes

### 13.1 Mode A — Quick Start: Generate Unassigned QR Codes

Best for fast setup, trials, and companies that do not want to input employee data yet.

Flow:

```text
Company admin creates company invoice profile
→ Inputs number of QR codes to generate
→ System generates QR codes
→ Admin downloads QR cards
→ Admin distributes QR cards internally
→ QRs can be assigned or claimed later
```

Example:

```text
Generate 30 QR codes
```

System behavior:

* Generate the requested number of QR codes.
* Assign each QR a display code such as `E-001`, `E-002`, `E-003`.
* QR codes are created as `active_unassigned`.
* Admin can download QR cards as PDF/image.
* Admin distributes QR cards manually.
* QR codes can be assigned or claimed later.

Limitation:

* Automatic employee follow-up is not available until QR is assigned to an employee, email,
  or contact.

### 13.2 Mode B — Recommended: Email Distribution and Auto-Assignment

This should be the recommended/default onboarding mode. Company admin pastes or uploads a
list of employee email addresses.

Example:

```text
jin@company.com
vinh@company.com
sales1@company.com
sales2@company.com
```

System behavior:

* Number of generated QR codes equals the number of valid email addresses within the active
  QR limit.
* Each QR code is assigned to one email address.
* Each QR receives a display code such as `E-001`, `E-002`, `E-003`.
* System sends each employee their QR card/link by email.
* Admin can also download all QR cards.
* QR status becomes `active_assigned`.

Example result:

```text
E-001 → jin@company.com
E-002 → vinh@company.com
E-003 → sales1@company.com
E-004 → sales2@company.com
```

Benefits:

* Onboarding remains simple.
* Employee name, phone, department, and Zalo are not required at the beginning.
* Automatic follow-up by email becomes possible.
* Accounting can identify QR ownership more easily.
* The company can start with only emails and enrich employee profiles later.

Optional behavior:

* After receiving the QR email, the employee can claim or complete their profile by adding
  name and phone/Zalo.
* Admin can edit or reassign QR ownership later.

### 13.3 Mode C — Full Employee Setup

Best for companies that want cleaner employee-level tracking from day one.

Admin enters or uploads:

* employee name,
* email,
* phone/Zalo, optional,
* department, optional.

System behavior:

* Generate one QR per employee.
* Assign QR to employee profile.
* Enable stronger employee follow-up and notifications.
* Admin can download or email QR cards.

Use case:

* More structured finance/admin teams.
* Companies that want automated follow-up from day one.
* Better for paid plans or larger customers.

### 13.4 Mixed Distribution

Company admin may combine assigned and unassigned QR generation.

Example:

```text
24 employee emails
+ 6 extra unassigned QR codes
= 30 active QR codes
```

Result:

```text
E-001 to E-024: assigned by email
E-025 to E-030: active_unassigned
```

Use cases: temporary staff, new employees, shared team QR cards, spare QR cards,
management/admin use.

### 13.5 Free Plan Rule

The free plan supports up to 30 active QR codes. The limit applies to all active QR codes,
including:

* assigned QR codes,
* email-assigned QR codes,
* unassigned QR codes,
* claim-pending QR codes.

Revoked QR codes do not count toward the active QR limit.

## 14. Email Onboarding — Validation, Deduplication, and Free-Plan Limit

Applies to the recommended onboarding mode, Mode B.

### 14.1 Rules

1. Validate format of each pasted email.
2. Reject malformed entries.
3. Normalize emails before comparison:
   * trim whitespace,
   * lowercase.
4. Deduplicate exact duplicates within the pasted list.
5. Enforce idempotency per company:
   * if an email already has a QR in this company, do not mint a second one.
6. Enforce free-plan limit:
   * maximum 30 active QR codes per company.
   * if a paste exceeds the limit, create QRs up to the remaining headroom and report the
     overflow.

Definition of valid email: a correctly formatted, non-duplicate email address that does not
already hold a QR in this company and fits within the active QR limit.

### 14.2 Admin Summary After Paste

Vietnamese:

```text
Kết quả tạo mã QR

Gói miễn phí: tối đa 30 mã QR đang hoạt động
Đang hoạt động: 12  •  Còn lại: 18

Đã dán: 25 email
→ 18 mã QR được tạo
3 email trùng (đã bỏ qua)
1 email không hợp lệ: jon@gmial.com
3 email vượt giới hạn gói miễn phí (chưa tạo)
```

English:

```text
QR generation result

Free plan: up to 30 active QR codes
Active: 12  •  Remaining: 18

Pasted: 25 emails
→ 18 QR codes created
3 duplicates (skipped)
1 invalid email: jon@gmial.com
3 over the free-plan limit (not created)
```

## 15. QR Display Code

Each QR code should have a human-friendly display code that is unique within the company.

Examples:

```text
E-001
E-002
E-003
```

or for larger companies:

```text
E-0001
E-0002
E-0003
```

The display code is used for human reference only. It should not expose:

* employee database ID,
* company database ID,
* secure token,
* sensitive personal data.

## 16. QR Ownership States

Each QR can exist in one of the following states:

| Status             | Meaning                                                       |
| ------------------ | ------------------------------------------------------------- |
| active_unassigned  | QR is active but not assigned to a specific employee/contact  |
| active_assigned    | QR is linked to an employee, email, or named person           |
| claim_pending      | QR has been invited for employee self-claim                   |
| revoked            | QR is inactive and cannot be used                             |

## 17. Unassigned QR Behavior

An unassigned QR can still be used to create invoice requests.

Example:

```text
QR No: E-014
Company: Elliot Company Limited
Assigned employee: Not assigned
Status: active_unassigned
```

If an invoice is missing, company accounting can see:

```text
QR No: E-014
Time: Jun 4, 13:24
Amount: 1,250,000 VND
Location: Near District 1
Status: Waiting Invoice
```

Accounting can then ask internally: Who has QR E-014? This allows fast onboarding without
requiring personal data upfront.

## 18. Assigned QR Behavior

If the QR is assigned to an employee, email, or contact, accounting can see:

```text
QR No: E-014
Assigned to: jin@company.com
Time: Jun 4, 13:24
Amount: 1,250,000 VND
Status: Waiting Invoice
```

If contact details are available, the system can send automatic follow-up.

## 19. Claim QR Flow

Employees can optionally claim their QR later.

Flow:

```text
Employee scans own QR
→ Claim this QR page opens
→ Employee enters name and optional phone/Zalo
→ QR becomes assigned or enriched
```

Example claim page:

```text
This is company invoice QR E-014.

Would you like to register this QR as yours?

Name:
Email or phone:

[ Claim QR ]
```

This allows the company to start with quick QR distribution and gradually improve
automation.

## 20. Main User Flows

### 20.1 Company Onboarding Flow

```text
Company admin creates company invoice profile
→ Select onboarding mode
→ Generate QR codes
   Option A: input number of QR codes
   Option B: paste employee email list
   Option C: upload full employee list
→ Download QR cards and/or send QR cards by email
→ QR codes are distributed internally
→ QR codes are assigned immediately or claimed later
```

### 20.2 Employee / QR Holder Flow

```text
QR holder receives QR by email, print, or internal distribution
→ QR holder shows fixed QR at restaurant
→ Restaurant scans QR
→ QR holder is done
```

### 20.3 Restaurant Guest Flow

```text
Restaurant staff scans QR
→ Guest page opens without login
→ Company invoice information is displayed
→ Restaurant staff adds receipt amount or receipt photo
→ Restaurant staff creates Invoice Request Card
→ Restaurant staff saves card image
→ Restaurant staff sends/shares card to restaurant accounting
```

### 20.4 Restaurant Accounting Flow

```text
Restaurant accounting receives Invoice Request Card
→ Issues VAT e-invoice using existing provider
→ Uploads invoice PDF/XML/image/link through Oda InvoTrack link if useful
```

### 20.5 Company Accounting Flow

```text
Accounting dashboard receives request
→ Shows QR display code and assignment status
→ Tracks invoice status
→ If invoice missing:
   - ask assigned employee automatically, or
   - manually identify unassigned QR owner by display code
→ Review uploaded invoice file/link
→ Mark resolved/rejected/cancelled
```

## 21. QR Code Logic

### 21.1 QR Token

Each QR has a secure token URL.

Example:

```text
https://invoice.oda.vn/q/{qr_token}
```

The QR token must not expose:

* company tax code,
* employee ID,
* company ID,
* database IDs,
* personal information.

The server resolves:

1. QR ID
2. Company ID
3. QR display code
4. QR status
5. Assigned employee/email/contact, if any
6. Company invoice profile
7. Notification/follow-up settings

### 21.2 Display Code Stability

The QR display code should remain stable across QR token regeneration.

Before regeneration:

```text
Display code: E-014
QR token: abc123
```

After regeneration:

```text
Display code: E-014
QR token: xyz789
```

Reason:

* display code is for human reference,
* token is for security,
* changing the visible display code creates accounting/support confusion.

The display code should only change if the company intentionally reassigns or recreates the
QR identity.

### 21.3 QR Card Display

Each QR card should show:

```text
Oda InvoTrack
Company Invoice QR

Company: Elliot Company Limited
QR No: E-014

Show this QR to restaurant staff when requesting company VAT e-invoice.
```

The QR card should not show the company tax code directly unless the company chooses to
include it.

## 22. Restaurant Guest Page

### 22.1 English Version

```text
Company invoice request

Please issue VAT e-invoice to:

Company: Elliot Company Limited
Tax code: xxxxxxxx
Address: xxxxxxxxx
Invoice email: accounting@elliot.vn

QR No: E-014

Add receipt evidence:

[ Take / Upload Receipt Photo ]

or

[ Enter Receipt Amount ]

[ Create Invoice Request Card ]

By continuing, you allow Oda InvoTrack to record the request time, basic browser/device information, IP-based approximate location, and GPS location if you choose to allow location access, for invoice request tracking.
```

### 22.2 Vietnamese Version

```text
Yêu cầu xuất hóa đơn công ty

Vui lòng xuất hóa đơn điện tử GTGT cho:

Công ty: Elliot Company Limited
MST: xxxxxxxx
Địa chỉ: xxxxxxxxx
Email nhận hóa đơn: accounting@elliot.vn

Mã QR: E-014

Thêm thông tin bill:

[ Chụp / Tải ảnh bill ]

hoặc

[ Nhập số tiền trên bill ]

[ Tạo ảnh yêu cầu xuất hóa đơn ]

Bằng cách tiếp tục, bạn đồng ý để Oda InvoTrack ghi nhận thời gian yêu cầu, thông tin trình duyệt/thiết bị cơ bản, vị trí gần đúng dựa trên IP và vị trí GPS nếu bạn cho phép truy cập vị trí, nhằm theo dõi yêu cầu hóa đơn này.
```

### 22.3 Input Rule

Restaurant staff must provide at least one of:

1. receipt amount,
2. receipt photo.

Restaurant staff does not need to provide:

1. restaurant name,
2. restaurant tax code,
3. staff name,
4. phone number,
5. email,
6. login account.

### 22.4 Privacy Notice

The guest page shows a short, non-blocking notice (see copy in 22.1 / 22.2) because the
system may capture request time, basic browser/device information, IP-based approximate
location, and GPS location when the user allows location access, for invoice request
tracking. The notice is informational and does not block the request flow.

## 23. Structured Invoice Request Card

### 23.1 Purpose

The Invoice Request Card is a generated image and structured digital card that restaurant
staff can save and send to the restaurant accounting team. It replaces the current manual
flow where restaurant staff separately sends:

1. company tax information photo,
2. receipt photo,
3. customer request message,
4. invoice instruction.

### 23.2 Card Content

The card should contain:

1. Company name
2. Company tax code / MST
3. Company registered address
4. Invoice receiving email, if configured
5. QR display code
6. Receipt photo or receipt amount
7. Request ID
8. Request time
9. Upload/follow-up link or QR code
10. Short instruction: "Please issue VAT e-invoice to this company."
11. Small footer: "Generated by Oda InvoTrack"

### 23.3 Card Layout — Receipt Photo Case

If receipt photo is provided:

| Left Side             | Right Side     |
| --------------------- | -------------- |
| Company name          | Receipt photo  |
| Tax code / MST        | Receipt image  |
| Registered address    |                |
| Invoice email         |                |
| QR No                 |                |
| Request ID            |                |
| Request time          |                |
| Upload link / QR      |                |

### 23.4 Card Layout — Amount-only Case

If only receipt amount is provided:

```text
Company Invoice Request

Please issue VAT e-invoice to:

Company: Elliot Company Limited
MST: xxxxxxxx
Address: xxxxxxxxx
Invoice email: accounting@elliot.vn

QR No: E-014
Receipt amount: 1,250,000 VND
Request time: Jun 4, 2026 13:24
Request ID: INV-20260604-00082

Upload issued invoice:
invoice.oda.vn/u/INV-20260604-00082

Generated by Oda InvoTrack
```

### 23.5 Copyable Fields — Required for MVP

Company fields should be shown as discrete, copyable values with per-field copy buttons, so
restaurant accounting does not re-type tax information.

Vietnamese:

```text
Thông tin công ty để xuất hóa đơn

Tên công ty:  [____]   [ Sao chép ]
Mã số thuế:   [____]   [ Sao chép ]
Địa chỉ:      [____]   [ Sao chép ]
Số tiền:      [____]   [ Sao chép ]

[ Sao chép tất cả ]
```

English:

```text
Company invoice information

Company name: [____]   [ Copy ]
Tax code:     [____]   [ Copy ]
Address:      [____]   [ Copy ]
Amount:       [____]   [ Copy ]

[ Copy all ]
```

### 23.6 Scannable Payload — Optional

A scannable code encoding the same fields may be added for restaurant tools that can import
it. This is not a dependency for MVP. Copyable fields are the required path.

## 24. Card Save and Share UX

### 24.1 Card Ready Page — English

```text
Invoice Request Card ready.

Please save this image and send it to your accounting team so they can issue the VAT e-invoice.

[ Save Card Image ]

After saving, you can:

[ Share Image ]
[ Copy Upload Link ]
[ Upload Issued Invoice Later ]

Request ID: INV-20260604-00082
```

### 24.2 Card Ready Page — Vietnamese

```text
Đã sẵn sàng ảnh yêu cầu xuất hóa đơn.

Vui lòng lưu ảnh này và gửi cho kế toán nhà hàng để xuất hóa đơn điện tử GTGT.

[ Lưu ảnh ]

Sau khi lưu ảnh, bạn có thể:

[ Chia sẻ ảnh ]
[ Copy link upload hóa đơn ]
[ Upload hóa đơn sau ]

Mã yêu cầu: INV-20260604-00082
```

> Naming note: this screen is the **Card Ready Page** (a UI screen). It is intentionally not
> called "Card Created," to avoid confusion with the removed `Card Created` status. Card
> generation is folded into the **Request Created** status (Section 26).

### 24.3 If Save Success Can Be Detected

English:

```text
Image saved successfully.

Now send this image to your accounting team so they can issue the VAT e-invoice.

[ Share Image ]
[ Copy Upload Link ]
[ Upload Issued Invoice Later ]
```

Vietnamese:

```text
Đã lưu ảnh thành công.

Bây giờ hãy gửi ảnh này cho kế toán nhà hàng để xuất hóa đơn điện tử GTGT.

[ Chia sẻ ảnh ]
[ Copy link upload hóa đơn ]
[ Upload hóa đơn sau ]
```

Technical rule: the system should not claim that the image was saved unless save success can
be detected.

## 25. Invoice Upload Flow

Restaurant or company accounting can upload an invoice file/link. The upload link is a
secure, request-specific link and stays available for any non-terminal request throughout
the tracking window.

Upload can include:

1. PDF invoice
2. XML invoice
3. Invoice image
4. Invoice link
5. Optional note

MVP should allow upload without restaurant login through a secure request-specific upload
link.

Important: uploading an invoice file/link does not automatically resolve the request.
Company accounting must review and close the request.

## 26. Request Status Flow

Manual flow. The restaurant or company accounting can upload an invoice file/link, but only
company accounting reviews and closes the request status.

There is:

* no Issued vs Archived distinction,
* no automatic reconciliation,
* no standalone Card Created state,
* no structured employee follow-up response workflow.

Card generation is folded into Request Created.

The MVP uses exactly these nine states:

| Trạng thái (VN)            | State (EN)                    | Meaning                                                       |
| -------------------------- | ----------------------------- | ------------------------------------------------------------- |
| Đã tạo yêu cầu             | Request Created               | QR scanned, Invoice Request Card generated                    |
| Chờ hóa đơn                | Waiting Invoice               | Request open; no invoice uploaded yet                         |
| Đã tải hóa đơn lên         | Invoice Uploaded              | Restaurant or company accounting uploaded an invoice file/link |
| Cần theo dõi / Quá hạn     | Need Follow-up / Overdue      | Follow-up threshold passed with no invoice uploaded           |
| Đã hỏi nhân viên được gán  | Asked Assigned Employee       | Follow-up sent to the employee tied to an assigned QR         |
| Cần xác định chủ mã QR     | Need QR Owner Identification  | Unassigned QR; owner unknown and must be identified           |
| Đã xử lý xong              | Resolved                      | Invoice confirmed handled; request closed successfully        |
| Đã từ chối                 | Rejected                      | Invoice invalid/not accepted; request closed                  |
| Đã hủy                     | Cancelled                     | Request cancelled                                             |

### 26.1 Intent of the Follow-up States

"Asked Assigned Employee" and "Need QR Owner Identification" are **status flags**, not a
workflow branch. They mean the system (or accounting) has done its active job — nudged the
right person — and the MVP does **not** capture a structured employee response. The only
repeat action is to ask again.

However, the **upload path stays open from every non-terminal state**, because the restaurant
or company accounting may still upload the invoice later. An upload moves the request to
Invoice Uploaded, and company accounting then closes it.

### 26.2 Transitions

Guidance, not strict enforcement:

1. Request Created → Waiting Invoice
2. Waiting Invoice → Invoice Uploaded
3. Waiting Invoice → Need Follow-up / Overdue
4. Need Follow-up / Overdue → Asked Assigned Employee, if QR is assigned
5. Need Follow-up / Overdue → Need QR Owner Identification, if QR is unassigned
6. Asked Assigned Employee → Invoice Uploaded, if an invoice file/link is uploaded later
7. Asked Assigned Employee → Asked Assigned Employee, if accounting chooses to ask again
8. Need QR Owner Identification → Asked Assigned Employee, once accounting identifies and
   assigns the QR owner
9. Need QR Owner Identification → Invoice Uploaded, if an invoice file/link is uploaded
   before the owner is identified
10. Invoice Uploaded → Resolved, after company accounting review
11. Invoice Uploaded → Rejected, after company accounting review
12. Any non-terminal state → Cancelled, **by company accounting only**

Terminal states:

* Resolved
* Rejected
* Cancelled

Closing rule: Resolved, Rejected, and Cancelled can only be set by company accounting. No
other actor (restaurant staff, assigned employee, QR holder) can close a request.

## 27. Follow-up Logic

If invoice is not uploaded within a configurable follow-up threshold, the system should mark
the request as needing follow-up.

Default reminder timing:

1. 24 hours after request
2. 48 hours after request
3. 7 days after request

These are follow-up thresholds, not tracking-window limits.

### 27.1 Assigned QR Follow-up

If QR is assigned and contact info exists:

```text
Your company invoice request is still pending.

QR No: E-014
Time: Jun 4, 13:24
Location: Near District 1, HCMC
Amount: 1,250,000 VND

Do you remember the restaurant name or have the receipt?

[ Enter Restaurant Name ]
[ Upload Receipt ]
[ Report this was cancelled ]
```

The `[ Report this was cancelled ]` button does **not** change the request status. It creates
an event/note for company accounting (e.g. "assigned employee reported this was cancelled").
Only company accounting can mark the request `Cancelled` after review. This keeps closing
authority with accounting (Section 26).

These employee actions are lightweight response events only. They do not create a separate
employee workflow and do not change request status automatically. Company accounting remains
responsible for reviewing the information and closing the request.

### 27.2 Unassigned QR Follow-up

If QR is unassigned, show this to accounting:

```text
Invoice request is still pending.

QR No: E-014
Time: Jun 4, 13:24
Location: Near District 1, HCMC
Amount: 1,250,000 VND

This QR is not assigned to an employee.

Please identify who owns QR E-014.

[ Assign QR Owner ]
[ Mark as Resolved ]
[ Reject ]
[ Cancel ]
```

## 28. Company Accounting Dashboard

Dashboard columns:

| Column           | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| Request Time     | When request was created                                     |
| Visible Until    | 60-day tracking window expiry date                           |
| QR No            | Human-friendly QR display code                               |
| QR Assignment    | Unassigned / Assigned / Email-assigned                       |
| Employee / Owner | Name or email if assigned                                    |
| Approx. Location | GPS/IP-based location                                        |
| Amount / Receipt | Amount or photo indicator                                    |
| Request Card     | View/download generated card                                 |
| Invoice File     | Uploaded / Not uploaded                                      |
| Status           | Current status                                               |
| Actions          | Assign owner, ask employee, upload invoice, resolve, reject, cancel |

Example row:

```text
Jun 4, 13:24
Visible until: Aug 3, 2026
QR No: E-014
Owner: jin@company.com
Near District 1, HCMC
1,250,000 VND
Invoice not uploaded
Waiting Invoice
```

## 29. Company Admin Settings

Company admin can manage:

1. Company invoice profile
2. Tax code / MST
3. Registered address
4. Invoice receiving email
5. Accounting team users
6. Onboarding mode
7. QR batch generation
8. QR display code format
9. QR assignment status
10. Employee/email mapping
11. QR claim settings
12. QR email distribution
13. QR regeneration
14. QR revocation
15. Reminder timing
16. Notification channels
17. Storage usage
18. Tracking window visibility
19. Upgrade options

## 30. Data Captured at Request Creation

When restaurant staff creates the card, the system should capture:

| Field                     | Source                  | Required    |
| ------------------------- | ----------------------- | ----------- |
| request_id                | System generated        | Yes         |
| request_code              | System generated        | Yes         |
| company_id                | QR token                | Yes         |
| qr_id                     | QR token                | Yes         |
| qr_display_code           | QR profile              | Yes         |
| qr_assignment_status      | QR profile              | Yes         |
| assigned_employee_id      | QR profile              | Optional    |
| assigned_employee_name    | QR profile              | Optional    |
| assigned_email            | QR profile              | Optional    |
| company_name              | Company profile         | Yes         |
| company_tax_code          | Company profile         | Yes         |
| company_address           | Company profile         | Yes         |
| company_invoice_email     | Company profile         | Optional    |
| requested_at              | Server timestamp        | Yes         |
| visible_until             | requested_at + 60 days  | Yes         |
| receipt_amount            | Restaurant input        | Conditional |
| receipt_photo             | Restaurant upload       | Conditional |
| invoice_request_card_url  | System generated/dynamic | Yes        |
| gps_latitude              | Browser GPS, if allowed | Optional    |
| gps_longitude             | Browser GPS, if allowed | Optional    |
| ip_address                | System                  | Yes         |
| user_agent                | System                  | Yes         |
| approximate_location      | GPS/IP derived          | Optional    |
| status                    | System                  | Yes         |

Condition: at least one of `receipt_amount` or `receipt_photo` must be provided.

## 31. Data Model Draft

### 31.1 companies

| Field              | Type             |
| ------------------ | ---------------- |
| id                 | bigint           |
| name               | varchar          |
| tax_code           | varchar          |
| registered_address | text             |
| invoice_email      | varchar          |
| status             | active/inactive  |
| created_at         | timestamp        |
| updated_at         | timestamp        |

### 31.2 employees

Employees are optional at initial onboarding.

| Field      | Type             |
| ---------- | ---------------- |
| id         | bigint           |
| company_id | bigint           |
| name       | varchar          |
| email      | varchar nullable |
| phone      | varchar nullable |
| status     | active/inactive  |
| created_at | timestamp        |
| updated_at | timestamp        |

### 31.3 company_invoice_qrs

QRs belong to the company first and can optionally be assigned to employees or emails later.

| Field                | Type                                                          |
| -------------------- | ------------------------------------------------------------- |
| id                   | bigint                                                        |
| company_id           | bigint                                                        |
| display_code         | varchar                                                       |
| token_hash           | varchar                                                       |
| assigned_employee_id | bigint nullable                                               |
| assigned_name        | varchar nullable                                              |
| assigned_email       | varchar nullable                                              |
| assigned_phone       | varchar nullable                                              |
| status               | active_unassigned / active_assigned / claim_pending / revoked |
| distribution_method  | manual / email / import                                       |
| email_sent_at        | timestamp nullable                                            |
| created_at           | timestamp                                                     |
| assigned_at          | timestamp nullable                                            |
| revoked_at           | timestamp nullable                                            |

Constraint:

```text
unique(company_id, display_code)
```

### 31.4 invoice_requests

| Field                    | Type             |
| ------------------------ | ---------------- |
| id                       | bigint           |
| request_code             | varchar          |
| company_id               | bigint           |
| qr_id                    | bigint           |
| qr_display_code          | varchar          |
| qr_assignment_status     | varchar          |
| assigned_employee_id     | bigint nullable  |
| assigned_email           | varchar nullable |
| receipt_amount           | decimal nullable |
| receipt_photo_url        | text nullable    |
| invoice_request_card_url | text nullable    |
| requested_at             | timestamp        |
| visible_until            | timestamp        |
| gps_latitude             | decimal nullable |
| gps_longitude            | decimal nullable |
| ip_address               | varchar          |
| user_agent               | text             |
| approximate_location     | varchar nullable |
| status                   | varchar          |
| created_at               | timestamp        |
| updated_at               | timestamp        |

### 31.5 invoice_uploads

| Field              | Type                                          |
| ------------------ | --------------------------------------------- |
| id                 | bigint                                        |
| invoice_request_id | bigint                                        |
| file_type          | pdf/xml/image/link                            |
| file_url           | text nullable                                 |
| invoice_link       | text nullable                                 |
| uploaded_by_type   | restaurant/company_accounting/system          |
| uploaded_at        | timestamp                                     |
| created_at         | timestamp                                     |

### 31.6 invoice_request_events

| Field              | Type                                                       |
| ------------------ | ---------------------------------------------------------- |
| id                 | bigint                                                     |
| invoice_request_id | bigint                                                     |
| event_type         | varchar                                                    |
| event_payload      | json                                                       |
| created_by_type    | system/qr_holder/company_accounting/restaurant             |
| created_at         | timestamp                                                  |

> Note: the assigned-employee "Report this was cancelled" action (Section 27.1) is recorded
> here as an event (e.g. `event_type = employee_reported_cancelled`), not as a status change.

## 32. Free Plan Strategy

Free plan limits:

| Item                          | Free Plan Limit                          |
| ----------------------------- | ---------------------------------------- |
| Active QR codes               | 30                                       |
| Company admin/accounting users | 3                                       |
| Invoice requests              | Unlimited within fair-use policy         |
| Request visibility            | 60 days                                  |
| Receipt photos                | visible for 60 days                      |
| Uploaded invoice files/links  | visible for 60 days                      |
| Temporary card image files    | 7–30 days                                |
| Export history                | 30 days                                  |
| Total storage                 | 500MB per company                        |

Important:

* The limit is 30 active QR codes, not 30 employees.
* Active QR codes can be assigned or unassigned.
* Revoked/inactive QR records may be kept for 60 days for troubleshooting.
* Paid plans may provide more active QR codes and longer tracking visibility.
* Free-plan files are temporary tracking conveniences, not official storage.

## 33. Tracking Window Policy — Free Plan

### 33.1 Company Profile Data

* Keep while account is active.
* Delete 90 days after account deletion request.

### 33.2 QR Data

* Keep while QR is active.
* Keep revoked QR records for 60 days.
* Delete after 60 days unless operationally required longer.

### 33.3 Invoice Request Records

* Stay visible for 60 days.
* Purge after 60 days in the free plan.
* Open requests are purged on the same schedule.

### 33.4 Receipt Photos

* Stay visible for 60 days.
* Compress immediately after upload.
* Delete raw original after processing.
* Purge processed image after 60 days.

### 33.5 Invoice Request Card Images

* Do not permanently store by default.
* Store underlying request data.
* Regenerate card image when needed within the tracking window.
* Temporary generated card files may be deleted after 7–30 days.

### 33.6 Uploaded Invoice Files / Links

* Stay visible for 60 days.
* Purge after 60 days.
* No extension for open requests.
* No pre-purge prompt.

### 33.7 Export History

* Keep generated exports for 30 days.
* Delete after 30 days.

## 34. Storage / Tracking Limit Behavior

When free-plan storage limit is reached:

1. Continue accepting invoice request metadata where possible.
2. Continue allowing amount-only requests.
3. Delete temporary/generated files that are past their lifecycle first.
4. If storage is still exceeded, restrict new file uploads until:
   * company deletes old files,
   * cleanup occurs,
   * or company upgrades.
5. Encourage upgrade for:
   * more QR codes,
   * longer tracking visibility,
   * OCR,
   * invoice matching,
   * accounting integrations,
   * larger storage.

Important: request metadata should be prioritized over file storage.

## 35. Paid Plan Direction

Paid plans may add value through convenience, automation, and higher capacity.

| Plan     | Active QR Codes | Request Visibility | Receipt Photos | Invoice Files / Links |
| -------- | --------------- | ------------------ | -------------- | --------------------- |
| Free     | 30              | 60 days            | 60 days        | 60 days               |
| Pro      | 100             | 12 months          | 12 months      | 12 months             |
| Business | Custom          | Custom             | Custom         | Custom                |

Potential paid features:

1. OCR extraction
2. Invoice matching assistance
3. Accounting integrations
4. API access
5. Advanced analytics
6. Multi-company management
7. Longer tracking visibility
8. Extended file visibility
9. Automated, scheduled reminders (beyond the basic free follow-up nudge)
10. Custom branding removal
11. Higher QR limits
12. Higher storage limits
13. Bulk employee import
14. Zalo notification

> Reminder scope: the free MVP includes a **basic** follow-up nudge where contact info exists
> (Section 8.1 #14, Section 27). Paid plans extend this into **automated, scheduled**
> reminder sequences and additional channels. Basic follow-up is not paid-only.

Important: long-term legal archive and system-of-record positioning are not part of MVP and
should not be promised in the free product.

## 36. Fair-use Protection

Free plan invoice requests are unlimited within reasonable fair-use limits. Oda may apply
rate limits to prevent spam, abuse, or automated misuse.

Suggested internal controls:

| Limit                              | Suggested Internal Rule       |
| ---------------------------------- | ----------------------------- |
| Requests per QR per day            | 20–30                         |
| File upload size before compression | 5MB                          |
| Processed receipt photo target size | 300–800KB                    |
| Requests per company per month     | Soft internal monitoring      |
| Suspicious location/device activity | Flag for review              |

## 37. Oda Promotion Strategy

Oda InvoTrack should function as a low-friction acquisition channel for Oda products and
services.

### 37.1 Branding on QR Pages

Footer:

```text
Powered by Oda

Helping companies manage invoice requests and business operations.

Learn more: oda.vn
```

Keep branding subtle. Do not interfere with invoice request completion.

### 37.2 Branding on Invoice Request Cards

Small footer:

```text
Generated by Oda InvoTrack
oda.vn
```

Every card shared internally becomes a marketing asset. Potential exposure: restaurant
accounting teams, store managers, business owners, finance teams.

### 37.3 Dashboard Promotion

Only show after successful product usage:

```text
Need better expense management?

Explore Oda Expense.
```

or:

```text
Need approval workflows and accounting automation?

Explore Oda Operations.
```

Avoid aggressive popups.

### 37.4 Monthly Usage Reports

Send monthly report:

```text
This month:

- 42 invoice requests
- 38 invoices uploaded
- 4 pending follow-ups

Powered by Oda.
```

Optional promotion:

```text
See how Oda can automate the next step:
Expense management
Approval workflows
Accounting integrations
```

### 37.5 Lead Qualification

Track: number of active QR codes, number of invoice requests, monthly activity, accounting
team engagement, uploaded invoice count, follow-up count.

High-usage companies can be flagged as potential customers for: expense management,
procurement workflows, accounting automation, operations software.

## 38. Notifications

### 38.1 Employee / QR Holder Notification

Trigger: request created from assigned QR.

```text
Company invoice request submitted.

QR No: E-014
Time: Jun 4, 13:24
Amount: 1,250,000 VND
Status: Waiting Invoice
```

This notification can be optional in MVP.

### 38.2 Company Accounting Notification

Trigger: new request created.

```text
New company invoice request

QR No: E-014
Owner: jin@company.com
Time: Jun 4, 13:24
Amount: 1,250,000 VND
Location: Near District 1, HCMC
Status: Waiting Invoice
```

### 38.3 Restaurant Upload Reminder

Trigger: invoice not uploaded after configured time, if restaurant contact is available.

```text
Invoice request is still waiting for issued invoice.

Please upload PDF/XML/image or invoice link.

Request ID: INV-20260604-00082
```

Restaurant upload reminder is optional in MVP because restaurant contact information may not
be captured.

## 39. Success Metrics — MVP

Targets for the free MVP. No metric is measured at "Archived" because archiving is not part
of the MVP.

| Metric                       | Definition                                                                 |
| ---------------------------- | -------------------------------------------------------------------------- |
| Activation                   | % of onboarded companies that generate a first invoice request             |
| Time to first request        | Median time from company setup to first request created                    |
| Invoice upload rate          | % of requests that receive an uploaded invoice file/link                   |
| Request completion rate      | % of requests that reach Resolved                                          |
| Overdue rate                 | % of requests that enter Need Follow-up / Overdue                          |
| Follow-up resolution rate    | % of overdue requests that reach Resolved after follow-up                  |
| Card save/share rate         | % of requests where the restaurant saved or shared the Invoice Request Card |
| Retention                    | % of companies generating requests in subsequent months                    |
| Funnel to paid Oda products  | % of free InvoTrack companies that engage with / convert to paid products  |

Additional operational metrics:

1. Number of companies onboarded
2. Number of QR codes generated
3. Number of active QR codes
4. Percentage of QR codes assigned
5. Percentage of QR codes assigned by email
6. Percentage of QR codes unassigned but active
7. Number of QR emails sent
8. QR email open/click rate, if trackable
9. Number of unassigned QR owner identification cases
10. Restaurant-side repeat scan rate

## 40. Key Product Risks

**Risk 1: Restaurant staff refuses to scan QR.** Mitigation: no login required; page must
load fast; the card must help restaurant staff do their existing job faster; Vietnamese copy
must be simple and clear.

**Risk 2: Restaurant does not upload invoice later.** Mitigation: Invoice Request Card allows
restaurant staff to send request internally; accounting dashboard tracks missing invoices; QR
display code allows manual follow-up; upload link remains available.

**Risk 3: QR is shared with other people.** Mitigation: QR request is not accounting
approval; admin can revoke QR; request logs show QR display code; accounting team can reject
suspicious requests.

**Risk 4: Unassigned QR limits automatic follow-up.** Mitigation: dashboard clearly shows QR
display code; accounting can manually identify QR owner; system encourages assignment after
repeated use; employee self-claim is supported; email distribution mode is recommended by
default.

**Risk 5: Email distribution fails or emails are ignored.** Mitigation: admin can download
all QR cards as fallback; admin can resend QR email; admin can copy individual QR link; QR
remains active even if employee does not open email; admin can manually distribute QR card by
chat or print.

**Risk 6: Location permission denied.** Mitigation: use IP-based approximate location; use
receipt photo OCR later; ask QR owner only if invoice is missing.

**Risk 7: Save image behavior differs by phone/browser.** Mitigation: provide clear Save Card
Image button; provide native share option where supported; provide fallback download link;
provide copy upload link; do not assume save success unless browser/device confirms it.

**Risk 8: Free plan creates unnecessary storage cost.** Mitigation: limit free plan to 30
active QR codes; use 60-day tracking window; compress receipt photos; regenerate card images
dynamically; use 500MB storage limit per company; reserve longer tracking visibility for paid
plans.

**Risk 9: Users misunderstand InvoTrack as official storage.** Mitigation: upload screen
reminder; dashboard copy says tracking window, not storage; product copy says tracker, not
archive; 60-day visible-until label; no system-of-record wording.

**Risk 10: Guest-side data capture without clear notice.** Mitigation: short non-blocking
privacy notice on the guest page (Section 22.4) covering request time, basic browser/device
information, IP-based approximate location, and GPS location if allowed; review against
current Vietnam personal-data rules before launch.

## 41. Future Versions

### 41.1 V1

1. OCR for receipt photo
2. OCR/XML parsing for uploaded invoice
3. Amount matching assistance
4. Restaurant name extraction
5. Zalo notification
6. Restaurant accounting contact capture
7. Monthly accounting report
8. QR assignment recommendation based on repeated use

### 41.2 V2

1. POS integration
2. QR on receipt
3. Direct invoice upload from restaurant portal
4. Restaurant account dashboard
5. Frequent restaurant recognition
6. Company policy rules
7. Auto-generated Zalo message template for restaurant accounting team
8. Bulk employee import
9. Employee directory management

### 41.3 V3

1. E-invoice provider API integration
2. Direct e-invoice issuance request
3. Automated invoice status retrieval, only if legally and technically appropriate
4. Accounting system export
5. Advanced reconciliation assistance
6. Expense workflow integration

## 42. MVP Acceptance Criteria

The MVP is ready when:

1. Company admin can create company invoice profile.
2. Company admin can select onboarding mode.
3. Company admin can bulk-generate QR codes by entering the number of QR codes.
4. Company admin can paste employee emails and generate one QR per valid email within the
   active QR limit.
5. Email onboarding validates format, normalizes, deduplicates, is idempotent per company,
   enforces the 30 active-QR free-plan limit, and shows an admin summary of created / skipped
   / invalid / over-limit emails.
6. System can send QR cards/links by email.
7. Admin can download all QR cards as PDF/image.
8. Free plan supports up to 30 active QR codes.
9. Each QR has a unique display code within the company.
10. QR can be active_unassigned.
11. QR can be assigned by email.
12. QR can be assigned to an employee later.
13. QR can be claimed by an employee later.
14. QR can be revoked by admin.
15. Restaurant staff can scan QR without login.
16. Guest page displays company invoice information and QR display code.
17. Restaurant staff can submit request with either amount or receipt photo.
18. System generates Invoice Request Card image.
19. Card includes company info, QR display code, receipt evidence, request ID, time, and
    upload link.
20. The Invoice Request Card provides copyable structured company fields.
21. Scannable payload is optional.
22. Restaurant staff can save/download the card image.
23. Restaurant staff can share the card image or copy upload link.
24. System records QR, company, time, IP, visible-until date, and optional GPS.
25. The guest page shows a short, non-blocking privacy notice covering request time, basic
    browser/device information, IP-based approximate location, and GPS location if the user
    allows location access.
26. Accounting dashboard shows QR display code, assignment status, amount/photo, request
    card, invoice file status, visible-until date, and request status.
27. The request status flow uses exactly the nine defined states.
28. There is no separate Card Created state; the card-ready screen is a UI page, not a status.
29. There is no Issued vs Archived distinction.
30. The MVP has no GDT portal login, no portal scraping, and no automatic reconciliation.
31. Oda InvoTrack does not position itself as a system of record or legal archive.
32. The upload screen reminds accounting that Oda InvoTrack is not the official archive.
33. Restaurant or company accounting can upload invoice PDF/XML/image/link later from any
    non-terminal request during the tracking window.
34. Company accounting reviews uploaded invoice file/link and marks the request Resolved,
    Rejected, or Cancelled.
35. Only company accounting can move a request to Resolved, Rejected, or Cancelled; no other
    actor can close a request.
36. The assigned-employee follow-up screen can report a cancellation as an event/note for
    accounting, without changing the request status.
37. Accounting can assign QR owner from dashboard.
38. Accounting can ask assigned employee/email for follow-up, and can ask again.
39. Accounting can manually identify owner for unassigned QR.
40. An uploaded invoice can move a request from any non-terminal state (including Asked
    Assigned Employee and Need QR Owner Identification) to Invoice Uploaded, then to a
    terminal state after accounting review.
41. Company can export invoice request list within the visible tracking window.
42. Request data and uploaded invoice files/links remain visible for 60 days, then are purged
    under the normal tracking-window policy.
43. Invoice Request Card images are dynamically generated where possible and not stored
    long-term by default.
44. The card-ready page clearly guides restaurant staff to save the card image and send it to
    their accounting team.
45. The UX does not claim the image was saved unless save success can be detected.

## 43. Final MVP Summary

Oda InvoTrack MVP should be built as a lightweight invoice request tracking system. The
product should not try to solve full expense management, direct VAT e-invoice issuance,
automatic reconciliation, tax portal access, or long-term legal invoice storage in the first
version.

The most important flow is:

```text
Company creates invoice profile
→ Company chooses onboarding mode
→ Company generates QR codes by quantity, email list, or full employee setup
→ QR holder shows fixed QR
→ Restaurant scans QR
→ Restaurant sees company invoice information
→ Restaurant enters amount or uploads receipt photo
→ Oda generates Invoice Request Card
→ Restaurant saves/shares card to internal accounting team
→ Restaurant or company accounting uploads invoice file/link
→ Company accounting tracks and manually closes status
→ Missing invoice can be followed up by assigned employee/email or QR display code
→ Request disappears after 60-day tracking window
```

The product wins if it makes the current manual process easier for both sides:

1. Companies can onboard quickly without heavy employee data entry.
2. Email-based onboarding enables automatic follow-up without full employee setup.
3. Employees no longer need to manually provide company tax information.
4. Restaurant staff get one clean image to send to accounting.
5. Company accounting gets a trackable request trail.
6. Oda gets a low-friction acquisition channel for broader business operations products.
