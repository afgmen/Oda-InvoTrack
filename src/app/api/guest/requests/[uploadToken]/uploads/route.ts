import { jsonError, validationError } from "@/lib/api/responses";
import { resolveActiveUploadToken } from "@/lib/domain/guest-access";
import { recordInvoiceUpload } from "@/lib/domain/invoice-uploads";
import type { RequestStatus } from "@/lib/domain/request-status";
import { invoiceUploadSchema } from "@/lib/domain/uploads";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ uploadToken: string }> },
) {
  const { uploadToken } = await params;
  const invoiceRequest = await resolveActiveUploadToken(uploadToken);
  if (!invoiceRequest)
    return jsonError("Invalid or expired upload token.", 404);

  const parsed = invoiceUploadSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const result = await recordInvoiceUpload({
    requestId: invoiceRequest.id,
    currentStatus: invoiceRequest.status as RequestStatus,
    upload: parsed.data,
    actor: "restaurant",
  });

  if ("error" in result && result.error) {
    return jsonError(result.error, result.status ?? 500);
  }
  return Response.json(result, { status: 201 });
}
