import { randomBytes } from "node:crypto";
import { z } from "zod";

import { jsonError, validationError } from "@/lib/api/responses";
import { resolveActiveQrToken } from "@/lib/domain/guest-access";
import { generateOpaqueToken, hashOpaqueToken } from "@/lib/domain/tokens";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const createRequestSchema = z
  .object({
    receiptAmount: z.number().positive().max(999_999_999_999).optional(),
    receiptPhotoPath: z.string().min(1).max(1000).optional(),
    receiptPhotoSizeBytes: z.number().int().min(1).max(5_242_880).optional(),
    gpsLatitude: z.number().min(-90).max(90).optional(),
    gpsLongitude: z.number().min(-180).max(180).optional(),
    approximateLocation: z.string().trim().max(500).optional(),
  })
  .refine((value) => value.receiptAmount || value.receiptPhotoPath, {
    message: "Receipt amount or receipt photo is required.",
  });

function getRequestIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const idempotencyKey = request.headers.get("idempotency-key")?.trim();
  if (!idempotencyKey || idempotencyKey.length > 255) {
    return jsonError("Idempotency-Key header is required.", 400);
  }

  const parsed = createRequestSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const qr = await resolveActiveQrToken(token);
  if (!qr) return jsonError("Invalid or revoked QR token.", 404);

  const admin = getSupabaseAdminClient();
  const { data: existing } = await admin
    .from("invoice_requests")
    .select("id, request_code, status, visible_until")
    .eq("qr_id", qr.id)
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();

  if (existing) return Response.json({ request: existing, replayed: true });

  const requestedAt = new Date();
  const visibleUntil = new Date(
    requestedAt.getTime() + 60 * 24 * 60 * 60 * 1000,
  );
  const uploadToken = generateOpaqueToken();
  const requestCode = `INV-${requestedAt.toISOString().slice(0, 10).replaceAll("-", "")}-${randomBytes(4).toString("hex").toUpperCase()}`;
  const profile = qr.company_invoice_profiles;
  const { data, error } = await admin
    .from("invoice_requests")
    .insert({
      request_code: requestCode,
      company_id: qr.company_id,
      qr_id: qr.id,
      qr_display_code: qr.display_code,
      qr_assignment_status: qr.status,
      assigned_employee_id: qr.assigned_employee_id,
      assigned_employee_name: qr.assigned_name,
      assigned_email: qr.assigned_email,
      company_name: profile.legal_name,
      company_tax_code: profile.tax_code,
      company_address: profile.registered_address,
      company_invoice_email: profile.invoice_email,
      receipt_amount: parsed.data.receiptAmount,
      receipt_photo_path: parsed.data.receiptPhotoPath,
      upload_token_hash: hashOpaqueToken(uploadToken),
      idempotency_key: idempotencyKey,
      requested_at: requestedAt.toISOString(),
      visible_until: visibleUntil.toISOString(),
      gps_latitude: parsed.data.gpsLatitude,
      gps_longitude: parsed.data.gpsLongitude,
      ip_address: getRequestIp(request),
      user_agent: request.headers.get("user-agent") ?? "unknown",
      approximate_location: parsed.data.approximateLocation,
      status: "request_created",
    })
    .select("id, request_code, status, requested_at, visible_until")
    .single();

  if (error) return jsonError("Unable to create invoice request.", 409);

  await admin.from("invoice_request_events").insert({
    invoice_request_id: data.id,
    event_type: "request_created",
    event_payload: { qrDisplayCode: qr.display_code },
    created_by_type: "restaurant",
  });

  return Response.json(
    { request: data, uploadToken, replayed: false },
    { status: 201 },
  );
}
