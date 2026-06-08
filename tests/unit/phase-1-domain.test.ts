import { describe, expect, it } from "vitest";

import { classifyEmails, formatQrDisplayCode } from "@/lib/domain/qr";
import {
  canTransitionRequestStatus,
  canUploadInvoice,
  REQUEST_STATUSES,
} from "@/lib/domain/request-status";
import {
  generateOpaqueToken,
  hashOpaqueToken,
  tokenContainsSensitiveValue,
} from "@/lib/domain/tokens";

describe("Phase 1 QR foundation", () => {
  it("generates opaque non-reversible QR tokens", () => {
    const token = generateOpaqueToken();
    const hash = hashOpaqueToken(token);

    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(hash).not.toContain(token);
    expect(
      tokenContainsSensitiveValue(token, [
        "company-id",
        "employee-id",
        "0123456789",
      ]),
    ).toBe(false);
  });

  it("formats stable company-scoped display codes", () => {
    expect(formatQrDisplayCode(1)).toBe("E-001");
    expect(formatQrDisplayCode(42)).toBe("E-042");
    expect(formatQrDisplayCode(1000)).toBe("E-1000");
  });

  it("normalizes, validates, and deduplicates onboarding emails", () => {
    expect(
      classifyEmails([
        " Jin@Example.com ",
        "jin@example.com",
        "accounting@example.com",
        "invalid",
      ]),
    ).toEqual({
      valid: ["jin@example.com", "accounting@example.com"],
      duplicates: ["jin@example.com"],
      invalid: ["invalid"],
    });
  });
});

describe("Phase 1 request status foundation", () => {
  it("contains exactly the nine MVP states without card_created", () => {
    expect(REQUEST_STATUSES).toHaveLength(9);
    expect(REQUEST_STATUSES).not.toContain("card_created");
  });

  it("keeps uploads open from every non-terminal state", () => {
    for (const status of REQUEST_STATUSES) {
      expect(canUploadInvoice(status)).toBe(
        !["resolved", "rejected", "cancelled"].includes(status),
      );
    }
  });

  it("supports the required late-upload and owner-assignment transitions", () => {
    expect(
      canTransitionRequestStatus("asked_assigned_employee", "invoice_uploaded"),
    ).toBe(true);
    expect(
      canTransitionRequestStatus(
        "need_qr_owner_identification",
        "invoice_uploaded",
      ),
    ).toBe(true);
    expect(
      canTransitionRequestStatus(
        "need_qr_owner_identification",
        "asked_assigned_employee",
      ),
    ).toBe(true);
  });
});
