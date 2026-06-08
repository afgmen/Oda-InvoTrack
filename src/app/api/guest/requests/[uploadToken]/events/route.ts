import { z } from "zod";

import { jsonError, validationError } from "@/lib/api/responses";
import { resolveActiveUploadToken } from "@/lib/domain/guest-access";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";

const eventSchema = z.object({
  eventType: z.enum([
    "employee_reported_cancelled",
    "employee_entered_restaurant_name",
    "employee_uploaded_receipt",
  ]),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ uploadToken: string }> },
) {
  const { uploadToken } = await params;
  const invoiceRequest = await resolveActiveUploadToken(uploadToken);
  if (!invoiceRequest)
    return jsonError("Invalid or expired request token.", 404);

  const parsed = eventSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const { data, error } = await getSupabaseAdminClient()
    .from("invoice_request_events")
    .insert({
      invoice_request_id: invoiceRequest.id,
      event_type: parsed.data.eventType,
      event_payload: (parsed.data.payload ?? {}) as Json,
      created_by_type: "qr_holder",
    })
    .select()
    .single();

  if (error) return jsonError("Unable to record request event.", 500);
  return Response.json({ event: data }, { status: 201 });
}
