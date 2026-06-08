import { z } from "zod";

export const ACTIVE_QR_LIMIT = 30;

export const qrStatusSchema = z.enum([
  "active_unassigned",
  "active_assigned",
  "claim_pending",
  "revoked",
]);

export const qrBatchSchema = z
  .object({
    quantity: z.number().int().min(1).max(ACTIVE_QR_LIMIT).optional(),
    emails: z.array(z.string()).max(200).optional(),
  })
  .refine((value) => value.quantity || value.emails?.length, {
    message: "Provide quantity or emails.",
  });

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return z.email().safeParse(email).success;
}

export function formatQrDisplayCode(sequence: number): string {
  return `E-${String(sequence).padStart(3, "0")}`;
}

export function classifyEmails(emails: readonly string[]) {
  const seen = new Set<string>();
  const valid: string[] = [];
  const invalid: string[] = [];
  const duplicates: string[] = [];

  for (const value of emails) {
    const email = normalizeEmail(value);

    if (!isValidEmail(email)) {
      invalid.push(value);
    } else if (seen.has(email)) {
      duplicates.push(email);
    } else {
      seen.add(email);
      valid.push(email);
    }
  }

  return { valid, invalid, duplicates };
}
