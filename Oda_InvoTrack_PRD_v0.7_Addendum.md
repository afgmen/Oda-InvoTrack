# PRD v0.7 Addendum — Oda InvoTrack

This addendum continues PRD v0.7 (sections 1–12) and records the decisions made on
invoice tracking, system of record, the invoice request card, email onboarding
validation, and success metrics. Section numbering continues from 12.

Default language is **Vietnamese**, with **English** as an optional toggle, consistent
with Section 3.

---

## 13. Invoice Tracking, Detection, and Reconciliation

### 13.1 Decision — No Tax Portal Automation in MVP

* Oda InvoTrack will **not** store company e-Tax / `hoadondientu.gdt.gov.vn` credentials.
* Oda InvoTrack will **not** scrape or auto-read the GDT portal in the MVP.
* Detection of issued invoices is done through **manual upload by company accounting**
  of the portal invoice export and/or the signed XML files.

Credential-based auto-sync (or integration via an accredited service provider) is a
possible fast-follow, but is explicitly **out of scope** for the MVP.

### 13.2 Reconciliation Logic

When company accounting uploads a portal export or XML batch, Oda InvoTrack matches each
incoming invoice to an open request using:

| Match signal             | Notes                                                        |
| ------------------------ | ------------------------------------------------------------ |
| Seller tax code (MST)    | Restaurant MST, when known for the request                   |
| Amount                   | Within a configurable tolerance                              |
| Issue date               | Within a configurable window from the request date           |
| Request / QR display code | If the restaurant included it on the issued invoice         |

A matched invoice moves the request forward in the lifecycle (13.3). Unmatched invoices
are held for manual assignment by accounting.

### 13.3 Request Lifecycle (State Machine)

The lifecycle must explicitly separate **issued** (we know the invoice exists) from
**archived** (the signed XML is captured and stored). This distinction is required by the
system-of-record decision in Section 14.

| Trạng thái (VN)              | State (EN)             | Ý nghĩa                                                        |
| ---------------------------- | ---------------------- | -------------------------------------------------------------- |
| Đã tạo yêu cầu               | Request created        | QR scanned, Invoice Request Card generated                     |
| Chờ xuất hóa đơn             | Awaiting issuance      | Card sent to restaurant accounting; no invoice yet             |
| Đã xuất (chưa lưu hóa đơn)   | Issued (not archived)  | Invoice detected as issued, but signed XML not yet captured    |
| Đã lưu hóa đơn               | Archived               | Signed XML captured and stored as evidence                     |
| Còn thiếu / Quá hạn          | Missing / Overdue      | Window passed with no detected invoice                         |

### 13.4 Completeness Visibility

Because the archive is only as complete as what accounting uploads, the gap must be
**visible**, never silent. The accounting dashboard must surface a worklist:

Vietnamese:

```text
Cần xử lý

- Đã xuất nhưng chưa lưu hóa đơn (cần tải tệp XML)
- Còn thiếu hóa đơn (quá hạn)
```

English:

```text
Needs attention

- Issued but not archived (XML file needed)
- Missing invoice (overdue)
```

---

## 14. System of Record (SoR)

Oda InvoTrack is intended to be the **system of record** for the invoices it tracks. This
section defines what that commitment means and bounds it.

### 14.1 Scope of the SoR Claim

Vietnamese:

```text
Oda InvoTrack là nơi lưu trữ chính thức cho các hóa đơn GTGT của nhà hàng được tạo qua Oda InvoTrack.

Oda InvoTrack KHÔNG phải là hệ thống lưu trữ chính thức cho toàn bộ hóa đơn của công ty. Phần mềm kế toán hiện tại của công ty (ví dụ MISA) vẫn là sổ sách chính.
```

English:

```text
Oda InvoTrack is the system of record for restaurant VAT invoices captured through Oda InvoTrack.

Oda InvoTrack is NOT the system of record for the company's entire set of invoices. The company's existing accounting software (e.g. MISA) remains the primary books.
```

### 14.2 Retention Requirements

* Store the **original signed XML**, unaltered, for **10 years**.
* **Preserve the digital signature** so each invoice still validates at audit time.
* PDF or any rendered image is **display-only** and is **not** legal evidence; the signed
  XML is the evidence.
* Stored invoices must be **retrievable and exportable on demand**.

### 14.3 Continuity Policy

* Provide an **export-all** capability so a company can pull every stored signed XML at any
  time.
* Define behavior on **product sunset** or **company offboarding**: advance notice plus a
  bulk export, so evidence is never trapped or lost.

---

## 15. Machine-Readable Invoice Request Card

### 15.1 Goal

Eliminate manual re-typing of company tax information on the **restaurant** side, so the
front-end error solved by the QR does not reappear when restaurant accounting issues the
invoice.

### 15.2 Two Parallel Forms (ship both)

1. **Structured digital card (reliable)** — company fields shown as discrete, copy-able
   values with per-field copy buttons.
2. **Scannable payload (bonus)** — the same fields encoded in a scannable code for the
   subset of restaurant invoicing tools that can import it.

### 15.3 Card Copy

Vietnamese:

```text
Thông tin công ty để xuất hóa đơn

Tên công ty:  [____]   [ Sao chép ]
Mã số thuế:   [____]   [ Sao chép ]
Địa chỉ:      [____]   [ Sao chép ]
Số tiền:      [____]   [ Sao chép ]

[ Sao chép tất cả ]   [ Quét để nhập tự động ]
```

English:

```text
Company invoice information

Company name: [____]   [ Copy ]
Tax code:     [____]   [ Copy ]
Address:      [____]   [ Copy ]
Amount:       [____]   [ Copy ]

[ Copy all ]   [ Scan to auto-fill ]
```

---

## 16. Email Onboarding — Validation and Deduplication

Applies to the recommended onboarding mode (Mode B, Section 6).

### 16.1 Rules

* **Validate format** of each pasted email; reject malformed entries.
* **Normalize** (trim whitespace, lowercase) before comparison.
* **Deduplicate** exact duplicates within the pasted list.
* **Idempotency:** if an email already has a QR in this company, do not mint a second one.
* **"Valid email" definition** (referenced by AC #7): a correctly formatted, non-duplicate
  address that does not already hold a QR in this company.

### 16.2 Admin Summary After Paste

The number of QR codes created will often differ from the number of emails pasted, so the
admin must see a reconciliation summary.

Vietnamese:

```text
Kết quả tạo mã QR

47 email  →  44 mã QR được tạo
2 email trùng (đã bỏ qua)
1 email không hợp lệ: jon@gmial.com
```

English:

```text
QR generation result

47 emails  →  44 QR codes created
2 duplicates (skipped)
1 invalid email: jon@gmial.com
```

---

## 17. Success Metrics (Free Version)

The free product still needs targets. Revenue is not the metric; **adoption, loop
completion, and the acquisition funnel** are. These directly test win condition #5
(low-friction acquisition channel for broader Oda products).

| Metric                        | Definition                                                                 |
| ----------------------------- | -------------------------------------------------------------------------- |
| Activation                    | % of onboarded companies that generate a first invoice request             |
| Time to first request         | Median time from company setup to first request created                    |
| Loop completion rate          | % of requests that reach **Đã lưu hóa đơn (Archived)** — true completion   |
| Archive completeness          | % of **Issued** requests that have a captured signed XML (SoR health)      |
| Retention                     | % of companies generating requests in subsequent months                    |
| Funnel to paid Oda products   | % of free InvoTrack companies that engage with / convert to paid products  |

Note: loop completion is measured at **Archived**, not at **Issued** — an invoice that
exists but was never captured does not count as complete.

---

## 18. Acceptance Criteria — Additions

Continuing from AC #10 in Section 11.

11. No company e-Tax / portal credentials are stored, and the MVP performs no portal
    scraping.
12. Issued invoices are detected by reconciling accounting's uploaded portal export / XML
    files against open requests.
13. The request lifecycle distinguishes **Issued (not archived)** from **Archived**.
14. Company accounting has a visible worklist of **issued-but-unarchived** and **missing**
    invoices.
15. Oda InvoTrack stores the original signed XML for 10 years with the digital signature
    preserved, scoped to restaurant invoices captured through Oda InvoTrack.
16. A company can export all stored signed XMLs on demand (continuity).
17. The Invoice Request Card provides copy-able structured company fields **and** a
    scannable payload of the same fields.
18. Email onboarding validates format, deduplicates, is idempotent per company, and shows
    an admin summary of created / skipped / invalid emails.
