import { jsonError } from "@/lib/api/responses";
import { getAuthenticatedCompanyMember } from "@/lib/auth/authorization";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ companyId: string }> },
) {
  const { companyId } = await params;
  const authorization = await getAuthenticatedCompanyMember(companyId);

  if (!authorization.allowed) {
    return jsonError(
      authorization.reason === "unauthenticated"
        ? "Unauthenticated."
        : "Forbidden.",
      authorization.reason === "unauthenticated" ? 401 : 403,
    );
  }

  const url = new URL(request.url);
  const includeExpired = url.searchParams.get("includeExpired") === "true";
  let query = (await createServerSupabaseClient())
    .from("invoice_requests")
    .select(
      "id, request_code, requested_at, visible_until, qr_display_code, qr_assignment_status, assigned_employee_name, assigned_email, approximate_location, receipt_amount, receipt_photo_path, status, invoice_uploads(id, file_type, uploaded_at)",
    )
    .eq("company_id", companyId)
    .order("requested_at", { ascending: false });

  if (!includeExpired) {
    query = query.gt("visible_until", new Date().toISOString());
  }

  const { data, error } = await query;
  if (error) return jsonError("Unable to load invoice requests.", 500);
  return Response.json({ requests: data });
}
