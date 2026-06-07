# PRD v0.8 — Oda InvoTrack (Lightweight MVP)

This revision supersedes sections 13–18 of the v0.7 addendum. It keeps v0.7's good
operational ideas but removes system-of-record positioning, long-term archiving, and
automatic reconciliation from the MVP.

Default language is **Vietnamese**, with **English** as an optional toggle (Section 3).

---

## 13. MVP Positioning

Vietnamese:

```text
Oda InvoTrack là công cụ nhẹ để theo dõi yêu cầu xuất hóa đơn điện tử GTGT từ nhà hàng.

Nó giúp công ty tạo yêu cầu xuất hóa đơn bằng mã QR, giúp nhân viên nhà hàng tạo một Thẻ Yêu Cầu Hóa Đơn rõ ràng, và giúp kế toán công ty theo dõi các hóa đơn còn chờ và đã tải lên.
```

English:

```text
Oda InvoTrack is a lightweight restaurant VAT e-invoice request tracking tool.

It helps companies generate QR-based invoice requests, helps restaurant staff create a clean Invoice Request Card, and helps company accounting teams track pending and uploaded invoices.
```

### 13.1 Included in MVP

* Company invoice profile
* QR generation
* Email-assisted QR onboarding
* Assigned / unassigned QR modes
* Invoice Request Card
* Save / share card flow
* Request tracking dashboard
* Invoice upload (file or link)
* Manual accounting review
* 60-day free tracking window

### 13.2 Not Included in MVP

* GDT portal login
* Portal scraping
* Automatic reconciliation
* System-of-record positioning
* 10-year XML storage
* Long-term legal archive

---

## 14. Record Positioning (Not a System of Record, Not a Store)

Oda InvoTrack does **not** store invoices as a record, and does **not** claim to be the
official invoice archive. The invoice itself already exists in three places:

1. **Government tax portal** (`hoadondientu.gdt.gov.vn`)
2. **Supplier / restaurant** (the issuer)
3. **Buyer / company** (received by email in most cases, then usually downloaded locally)

Oda InvoTrack only tracks the request and its status. The company's accounting software /
existing storage remains the official accounting record. Any file or link held in Oda
InvoTrack is a **temporary tracking convenience**, not a record copy.

To prevent misplaced trust, the upload screen must carry a short reminder.

Vietnamese:

```text
Lưu ý: Oda InvoTrack chỉ giúp theo dõi yêu cầu hóa đơn. Đây không phải là nơi lưu trữ chính thức. Vui lòng giữ hóa đơn gốc trong hệ thống kế toán của công ty.
```

English:

```text
Note: Oda InvoTrack only helps track invoice requests. It is not your official archive. Please keep the original invoice in your company's accounting records.
```

---

## 15. Tracking Window (Free Plan)

* Oda InvoTrack is a tracking tool, **not** a storage location (Section 14).
* A request and any attached file/link stay visible for a **60-day tracking window**.
* After 60 days, the request record and attached file/link are **purged**. This is
  expected, not a loss: the invoice continues to exist in the three locations in Section 14.
* **Requests still open at day 60 are purged on the same schedule.** The window is not
  extended and there is no pre-purge prompt — silent expiry is correct because Oda InvoTrack
  is not the record.
* If a buyer or supplier needs to follow up beyond the window, they reconcile using their
  **own storage** (email / local download, supplier records, or the tax portal), not Oda
  InvoTrack.
* **Dashboard UX:** each request may show a small `Visible until: <date>` label so users
  know when it will drop off. This is transparency only — it is **not** a pre-purge prompt
  and does **not** extend the window.

---

## 16. Request Status Flow

Manual flow. The restaurant or company accounting uploads an invoice file/link, and company
accounting updates status. There is **no** Issued vs Archived distinction and **no**
automatic reconciliation.

**Merge note (Option A):** this 9-state model is authoritative. The MVP does **not** use a
separate "Card Created" state — card generation is folded into **Request Created**. When
merging into the main PRD, remove any standalone "Card Created" state so the flow uses
exactly these nine states (see AC #14).

| Trạng thái (VN)            | State (EN)                    | Ý nghĩa                                                       |
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

### 16.1 Transitions (guidance, not strict)

* Request Created → Waiting Invoice.
* Waiting Invoice → Invoice Uploaded (restaurant or accounting uploads) **or** Need
  Follow-up / Overdue (follow-up threshold passes).
* Need Follow-up / Overdue → Asked Assigned Employee (assigned QR) **or** Need QR Owner
  Identification (unassigned QR).
* Invoice Uploaded → Resolved (confirmed) **or** Rejected (invalid).
* Any non-terminal state → Cancelled.
* Terminal states: Resolved, Rejected, Cancelled.

The two follow-up states map directly to the assigned / unassigned QR modes: an assigned QR
can be chased via its employee, while an unassigned QR first needs its owner identified.

---

## 17. Structured Invoice Request Card

### 17.1 Copyable Fields (MVP, required)

Company fields are shown as discrete, copyable values with per-field copy buttons, so
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

### 17.2 Scannable Payload (optional, nice-to-have)

A scannable code encoding the same fields **may** be added for restaurant tools that can
import it. It is **not** a dependency for MVP; copyable fields are the required path.

---

## 18. Email Onboarding — Validation, Deduplication, and Free-Plan Limit

Applies to the recommended onboarding mode (Mode B, Section 6).

### 18.1 Rules

* **Validate format** of each pasted email; reject malformed entries.
* **Normalize** (trim whitespace, lowercase) before comparison.
* **Deduplicate** exact duplicates within the pasted list.
* **Idempotency per company:** if an email already has a QR in this company, do not mint a
  second one.
* **Free-plan limit:** a maximum of **30 active QR codes** per company. If a paste would
  exceed the limit, create QRs up to the remaining headroom and report the overflow.
* **"Valid email" definition** (referenced by base PRD AC #7): a correctly formatted,
  non-duplicate address that does not already hold a QR in this company and fits within the
  active-QR limit.

### 18.2 Admin Summary After Paste

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

---

## 19. Success Metrics (MVP)

Targets for the free MVP. No metric is measured at "Archived" — archiving is not part of the
MVP.

| Metric                       | Definition                                                                 |
| ---------------------------- | -------------------------------------------------------------------------- |
| Activation                   | % of onboarded companies that generate a first invoice request             |
| Time to first request        | Median time from company setup to first request created                    |
| Invoice upload rate          | % of requests that receive an uploaded invoice file/link                   |
| Request completion rate      | % of requests that reach **Resolved**                                      |
| Overdue rate                 | % of requests that enter **Need Follow-up / Overdue**                      |
| Follow-up resolution rate    | % of overdue requests that reach **Resolved** after follow-up             |
| Card save/share rate         | % of requests where the restaurant saved or shared the Invoice Request Card |
| Retention                    | % of companies generating requests in subsequent months                    |
| Funnel to paid Oda products  | % of free InvoTrack companies that engage with / convert to paid products  |

---

## 20. Acceptance Criteria — MVP

Continuing from AC #10 in Section 11. (Replaces the v0.7 addendum ACs 11–18.)

11. Oda InvoTrack does not position itself as a system of record or legal archive; the
    company's accounting software remains the official record.
12. The MVP has no GDT portal login, no portal scraping, and no automatic reconciliation.
13. Invoice handling is manual: restaurant or company accounting uploads an invoice
    file/link; company accounting then reviews and marks the request **Resolved**,
    **Rejected**, or **Cancelled**.
14. The request status flow uses exactly the nine defined states; there is no Issued vs
    Archived distinction.
15. The Invoice Request Card provides copyable structured company fields; a scannable
    payload is optional.
16. Email onboarding validates format, normalizes, deduplicates, is idempotent per company,
    enforces the 30 active-QR free-plan limit, and shows an admin summary of created /
    skipped / invalid / over-limit emails.
17. Request data and uploaded invoice files/links remain visible for 60 days, then are
    purged under the normal tracking-window policy.
18. The upload screen reminds accounting that Oda InvoTrack is not the official archive.
