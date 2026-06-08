import { jsonError, validationError } from "@/lib/api/responses";
import { getAuthenticatedCompanyRole } from "@/lib/auth/authorization";
import { recordInvoiceUpload } from "@/lib/domain/invoice-uploads";
import type { RequestStatus } from "@/lib/domain/request-status";
import { invoiceUploadSchema } from "@/lib/domain/uploads";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ companyId: string; requestId: string }> },
) {
  const { companyId, requestId } = await params;
  const authorization = await getAuthenticatedCompanyRole(
    companyId,
    "company_accounting",
  );

  if (!authorization.allowed) {
    return jsonError(
      authorization.reason === "unauthenticated"
        ? "Unauthenticated."
        : "Forbidden.",
      authorization.reason === "unauthenticated" ? 401 : 403,
    );
  }

  const parsed = invoiceUploadSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const { data: invoiceRequest } = await getSupabaseAdminClient()
    .from("invoice_requests")
    .select("id, status, visible_until")
    .eq("id", requestId)
    .eq("company_id", companyId)
    .maybeSingle();

  if (
    !invoiceRequest ||
    new Date(invoiceRequest.visible_until).getTime() <= Date.now()
  ) {
    return jsonError("Request not found or expired.", 404);
  }

  const result = await recordInvoiceUpload({
    requestId,
    currentStatus: invoiceRequest.status as RequestStatus,
    upload: parsed.data,
    actor: "company_accounting",
    userId: authorization.user.id,
  });

  if ("error" in result && result.error) {
    return jsonError(result.error, result.status ?? 500);
  }
  return Response.json(result, { status: 201 });
}
