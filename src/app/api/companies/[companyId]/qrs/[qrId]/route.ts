import { z } from "zod";

import { jsonError, validationError } from "@/lib/api/responses";
import { getAuthenticatedCompanyRole } from "@/lib/auth/authorization";
import { generateOpaqueToken, hashOpaqueToken } from "@/lib/domain/tokens";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const updateQrSchema = z.object({
  status: z
    .enum(["active_unassigned", "active_assigned", "claim_pending", "revoked"])
    .optional(),
  assignedEmployeeId: z.uuid().optional().nullable(),
  assignedName: z.string().trim().min(1).max(255).optional().nullable(),
  assignedEmail: z.string().trim().email().optional().nullable(),
  assignedPhone: z.string().trim().max(100).optional().nullable(),
  regenerateToken: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ companyId: string; qrId: string }> },
) {
  const { companyId, qrId } = await params;
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

  const parsed = updateQrSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const token = parsed.data.regenerateToken ? generateOpaqueToken() : undefined;
  const status = parsed.data.status;
  const clearsAssignment =
    status === "active_unassigned" || status === "revoked";
  const { data, error } = await getSupabaseAdminClient()
    .from("company_invoice_qrs")
    .update({
      status,
      assigned_employee_id: clearsAssignment
        ? null
        : parsed.data.assignedEmployeeId,
      assigned_name: clearsAssignment ? null : parsed.data.assignedName,
      assigned_email: clearsAssignment
        ? null
        : parsed.data.assignedEmail?.toLowerCase(),
      assigned_phone: clearsAssignment ? null : parsed.data.assignedPhone,
      token_hash: token ? hashOpaqueToken(token) : undefined,
      assigned_at:
        status === "active_assigned"
          ? new Date().toISOString()
          : clearsAssignment
            ? null
            : undefined,
      revoked_at: status === "revoked" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", qrId)
    .eq("company_id", companyId)
    .select("id, display_code, status, assigned_email, assigned_employee_id")
    .single();

  if (error) return jsonError("Unable to update QR.", 409);
  return Response.json({ qr: data, token });
}
