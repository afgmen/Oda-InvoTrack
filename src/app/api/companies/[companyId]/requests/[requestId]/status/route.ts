import { z } from "zod";

import { jsonError, validationError } from "@/lib/api/responses";
import { getAuthenticatedCompanyRole } from "@/lib/auth/authorization";
import {
  canTransitionRequestStatus,
  type RequestStatus,
} from "@/lib/domain/request-status";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const statusSchema = z.object({
  status: z.enum([
    "request_created",
    "waiting_invoice",
    "invoice_uploaded",
    "need_follow_up_overdue",
    "asked_assigned_employee",
    "need_qr_owner_identification",
    "resolved",
    "rejected",
    "cancelled",
  ]),
  note: z.string().trim().max(2000).optional(),
});

export async function PATCH(
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

  const parsed = statusSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const admin = getSupabaseAdminClient();
  const { data: current } = await admin
    .from("invoice_requests")
    .select("status, visible_until")
    .eq("id", requestId)
    .eq("company_id", companyId)
    .maybeSingle();

  if (!current || new Date(current.visible_until).getTime() <= Date.now()) {
    return jsonError("Request not found or expired.", 404);
  }

  if (
    !canTransitionRequestStatus(
      current.status as RequestStatus,
      parsed.data.status,
    )
  ) {
    return jsonError("Status transition is not allowed.", 409);
  }

  const { data, error } = await admin
    .from("invoice_requests")
    .update({
      status: parsed.data.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .eq("company_id", companyId)
    .select("id, status, updated_at")
    .single();

  if (error) return jsonError("Unable to update request status.", 500);

  await admin.from("invoice_request_events").insert({
    invoice_request_id: requestId,
    event_type: "status_changed",
    event_payload: {
      from: current.status,
      to: parsed.data.status,
      note: parsed.data.note,
    },
    created_by_type: "company_accounting",
    created_by_user_id: authorization.user.id,
  });

  return Response.json({ request: data });
}
