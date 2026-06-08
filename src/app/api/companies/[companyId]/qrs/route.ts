import { jsonError, validationError } from "@/lib/api/responses";
import { getAuthenticatedCompanyRole } from "@/lib/auth/authorization";
import {
  ACTIVE_QR_LIMIT,
  classifyEmails,
  formatQrDisplayCode,
  qrBatchSchema,
} from "@/lib/domain/qr";
import { generateOpaqueToken, hashOpaqueToken } from "@/lib/domain/tokens";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ companyId: string }> },
) {
  const { companyId } = await params;
  const authorization = await getAuthenticatedCompanyRole(
    companyId,
    "company_admin",
  );

  if (!authorization.allowed) {
    return jsonError(
      authorization.reason === "unauthenticated"
        ? "Unauthenticated."
        : "Forbidden.",
      authorization.reason === "unauthenticated" ? 401 : 403,
    );
  }

  const parsed = qrBatchSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const admin = getSupabaseAdminClient();
  const { data: currentQrs, error } = await admin
    .from("company_invoice_qrs")
    .select("display_code, assigned_email, status")
    .eq("company_id", companyId);

  if (error) return jsonError("Unable to read QR inventory.", 500);

  const activeQrs = currentQrs.filter((qr) => qr.status !== "revoked");
  const remaining = Math.max(0, ACTIVE_QR_LIMIT - activeQrs.length);
  const existingEmails = new Set(
    activeQrs.flatMap((qr) => (qr.assigned_email ? [qr.assigned_email] : [])),
  );
  const classified = classifyEmails(parsed.data.emails ?? []);
  const newEmails = classified.valid.filter(
    (email) => !existingEmails.has(email),
  );
  const existingDuplicates = classified.valid.filter((email) =>
    existingEmails.has(email),
  );
  const requestedUnassigned = parsed.data.quantity ?? 0;
  const candidates = [
    ...newEmails.map((email) => ({ email })),
    ...Array.from({ length: requestedUnassigned }, () => ({
      email: undefined,
    })),
  ];
  const accepted = candidates.slice(0, remaining);
  const overLimit = candidates.length - accepted.length;
  const highestSequence = currentQrs.reduce((highest, qr) => {
    const sequence = Number(qr.display_code.match(/^E-(\d+)$/)?.[1] ?? 0);
    return Math.max(highest, sequence);
  }, 0);

  const records = accepted.map((candidate, index) => {
    const token = generateOpaqueToken();
    return {
      token,
      row: {
        company_id: companyId,
        display_code: formatQrDisplayCode(highestSequence + index + 1),
        token_hash: hashOpaqueToken(token),
        assigned_email: candidate.email ?? null,
        status: candidate.email
          ? ("active_assigned" as const)
          : ("active_unassigned" as const),
        distribution_method: candidate.email
          ? ("email" as const)
          : ("manual" as const),
        assigned_at: candidate.email ? new Date().toISOString() : null,
      },
    };
  });

  if (records.length > 0) {
    const { data: inserted, error: insertError } = await admin
      .from("company_invoice_qrs")
      .insert(records.map((record) => record.row))
      .select("id, display_code, assigned_email, status");

    if (insertError || !inserted) {
      return jsonError("Unable to generate QR records.", 409);
    }

    return Response.json({
      qrs: inserted.map((qr, index) => ({
        ...qr,
        token: records[index]?.token,
      })),
      summary: {
        created: inserted.length,
        skippedDuplicate:
          classified.duplicates.length + existingDuplicates.length,
        invalid: classified.invalid,
        overLimit,
        active: activeQrs.length + inserted.length,
        remaining: remaining - inserted.length,
      },
    });
  }

  return Response.json({
    qrs: [],
    summary: {
      created: 0,
      skippedDuplicate:
        classified.duplicates.length + existingDuplicates.length,
      invalid: classified.invalid,
      overLimit,
      active: activeQrs.length,
      remaining,
    },
  });
}
