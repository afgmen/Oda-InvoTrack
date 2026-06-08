import type { z } from "zod";

import {
  canUploadInvoice,
  type RequestStatus,
} from "@/lib/domain/request-status";
import type { invoiceUploadSchema } from "@/lib/domain/uploads";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type InvoiceUpload = z.infer<typeof invoiceUploadSchema>;

export async function recordInvoiceUpload({
  requestId,
  currentStatus,
  upload,
  actor,
  userId,
}: {
  requestId: string;
  currentStatus: RequestStatus;
  upload: InvoiceUpload;
  actor: "restaurant" | "company_accounting";
  userId?: string;
}) {
  if (!canUploadInvoice(currentStatus)) {
    return { error: "Request is closed.", status: 409 } as const;
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("invoice_uploads")
    .insert({
      invoice_request_id: requestId,
      file_type: upload.fileType,
      storage_path:
        upload.fileType === "link" ? null : (upload.storagePath ?? null),
      invoice_link:
        upload.fileType === "link" ? (upload.invoiceLink ?? null) : null,
      original_filename: upload.originalFilename ?? null,
      content_type: upload.contentType ?? null,
      file_size_bytes: upload.fileSizeBytes ?? null,
      note: upload.note ?? null,
      uploaded_by_type: actor,
      uploaded_by_user_id: userId ?? null,
    })
    .select()
    .single();

  if (error) return { error: "Unable to record upload.", status: 500 } as const;

  const { error: updateError } = await admin
    .from("invoice_requests")
    .update({
      status: "invoice_uploaded",
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (updateError) {
    await admin.from("invoice_uploads").delete().eq("id", data.id);
    return { error: "Unable to update request.", status: 500 } as const;
  }

  await admin.from("invoice_request_events").insert({
    invoice_request_id: requestId,
    event_type: "invoice_uploaded",
    event_payload: { uploadId: data.id, fileType: upload.fileType },
    created_by_type: actor,
    created_by_user_id: userId ?? null,
  });

  return { upload: data } as const;
}
