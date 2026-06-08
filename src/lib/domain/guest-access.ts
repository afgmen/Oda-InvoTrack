import { hashOpaqueToken } from "@/lib/domain/tokens";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function resolveActiveQrToken(token: string) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("company_invoice_qrs")
    .select(
      "id, company_id, display_code, status, assigned_employee_id, assigned_name, assigned_email",
    )
    .eq("token_hash", hashOpaqueToken(token))
    .neq("status", "revoked")
    .maybeSingle();

  if (error || !data) return null;

  const { data: profile, error: profileError } = await admin
    .from("company_invoice_profiles")
    .select("legal_name, tax_code, registered_address, invoice_email")
    .eq("company_id", data.company_id)
    .maybeSingle();

  if (profileError || !profile) return null;
  return { ...data, company_invoice_profiles: profile };
}

export async function resolveActiveUploadToken(token: string) {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("invoice_requests")
    .select("id, company_id, status, visible_until")
    .eq("upload_token_hash", hashOpaqueToken(token))
    .maybeSingle();

  if (error || !data || new Date(data.visible_until).getTime() <= Date.now()) {
    return null;
  }

  return data;
}
