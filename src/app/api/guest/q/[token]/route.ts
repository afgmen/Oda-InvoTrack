import { jsonError } from "@/lib/api/responses";
import { resolveActiveQrToken } from "@/lib/domain/guest-access";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const qr = await resolveActiveQrToken(token);

  if (!qr) return jsonError("Invalid or revoked QR token.", 404);

  const profile = qr.company_invoice_profiles;
  return Response.json({
    qr: {
      displayCode: qr.display_code,
      status: qr.status,
    },
    company: {
      legalName: profile.legal_name,
      taxCode: profile.tax_code,
      registeredAddress: profile.registered_address,
      invoiceEmail: profile.invoice_email,
    },
  });
}
