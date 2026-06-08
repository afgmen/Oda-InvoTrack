import { z } from "zod";

import { jsonError, validationError } from "@/lib/api/responses";
import { getAuthenticatedCompanyRole } from "@/lib/auth/authorization";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const profileSchema = z.object({
  legalName: z.string().trim().min(1).max(255),
  taxCode: z.string().trim().min(1).max(100),
  registeredAddress: z.string().trim().min(1).max(2000),
  invoiceEmail: z.email().optional().nullable(),
});

export async function PUT(
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

  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("company_invoice_profiles")
    .upsert({
      company_id: companyId,
      legal_name: parsed.data.legalName,
      tax_code: parsed.data.taxCode,
      registered_address: parsed.data.registeredAddress,
      invoice_email: parsed.data.invoiceEmail
        ? parsed.data.invoiceEmail.toLowerCase()
        : null,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return jsonError("Unable to save invoice profile.", 500);
  return Response.json({ profile: data });
}
