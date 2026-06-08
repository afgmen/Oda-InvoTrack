import { expect, test } from "@playwright/test";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { parseEnv } from "node:util";

const MAILPIT_URL = "http://127.0.0.1:54324";

type LocalEnvironment = {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

async function getLocalEnvironment(): Promise<LocalEnvironment> {
  const environment = parseEnv(await readFile(".env.local", "utf8"));
  const supabaseUrl = environment.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = environment.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Local Supabase environment is not configured.");
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey,
  };
}

function adminHeaders(serviceRoleKey: string) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function getMagicLink(email: string): Promise<string | undefined> {
  const mailboxResponse = await fetch(`${MAILPIT_URL}/api/v1/messages`);
  const mailbox = (await mailboxResponse.json()) as {
    messages: Array<{
      ID: string;
      To: Array<{ Address: string }>;
    }>;
  };
  const message = mailbox.messages.find((candidate) =>
    candidate.To.some((recipient) => recipient.Address === email),
  );

  if (!message) return undefined;

  const messageResponse = await fetch(
    `${MAILPIT_URL}/api/v1/message/${message.ID}`,
  );
  const detail = (await messageResponse.json()) as { Text: string };
  return detail.Text.match(/Log In \( (https?:\/\/\S+) \)/)?.[1];
}

test("guest request, event, and upload lifecycle uses opaque tokens", async ({
  request,
}) => {
  test.setTimeout(90_000);

  const environment = await getLocalEnvironment();
  const headers = adminHeaders(environment.SUPABASE_SERVICE_ROLE_KEY);
  const companyId = randomUUID();
  const qrId = randomUUID();
  const qrToken = randomBytes(32).toString("base64url");

  try {
    const companyResponse = await fetch(
      `${environment.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/companies`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ id: companyId, name: "Oda Phase 1 API" }),
      },
    );
    expect(companyResponse.ok).toBeTruthy();

    const profileResponse = await fetch(
      `${environment.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/company_invoice_profiles`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          company_id: companyId,
          legal_name: "Oda Phase 1 API Limited",
          tax_code: "0123456789",
          registered_address: "Ho Chi Minh City",
          invoice_email: "accounting@example.com",
        }),
      },
    );
    expect(profileResponse.ok).toBeTruthy();

    const qrResponse = await fetch(
      `${environment.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/company_invoice_qrs`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          id: qrId,
          company_id: companyId,
          display_code: "E-001",
          token_hash: hashToken(qrToken),
          status: "active_unassigned",
        }),
      },
    );
    expect(qrResponse.ok).toBeTruthy();

    const publicQr = await request.get(`/api/guest/q/${qrToken}`);
    expect(publicQr.status()).toBe(200);
    expect(await publicQr.json()).toMatchObject({
      qr: {
        displayCode: "E-001",
      },
      company: {
        legalName: "Oda Phase 1 API Limited",
      },
    });

    const missingEvidence = await request.post(
      `/api/guest/q/${qrToken}/requests`,
      {
        headers: { "Idempotency-Key": randomUUID() },
        data: {},
      },
    );
    expect(missingEvidence.status()).toBe(400);

    const idempotencyKey = randomUUID();
    const created = await request.post(`/api/guest/q/${qrToken}/requests`, {
      headers: {
        "Idempotency-Key": idempotencyKey,
        "User-Agent": "Oda Phase 1 Playwright",
        "X-Forwarded-For": "203.0.113.10",
      },
      data: { receiptAmount: 1250000 },
    });
    expect(created.status()).toBe(201);
    const createdBody = (await created.json()) as {
      request: {
        id: string;
        status: string;
        requested_at: string;
        visible_until: string;
      };
      uploadToken: string;
      replayed: boolean;
    };
    expect(createdBody.replayed).toBe(false);
    expect(createdBody.request.status).toBe("request_created");
    expect(
      new Date(createdBody.request.visible_until).getTime() -
        new Date(createdBody.request.requested_at).getTime(),
    ).toBe(60 * 24 * 60 * 60 * 1000);

    const replay = await request.post(`/api/guest/q/${qrToken}/requests`, {
      headers: { "Idempotency-Key": idempotencyKey },
      data: { receiptAmount: 1250000 },
    });
    expect(replay.status()).toBe(200);
    expect(await replay.json()).toMatchObject({
      request: { id: createdBody.request.id },
      replayed: true,
    });

    const cancellationEvent = await request.post(
      `/api/guest/requests/${createdBody.uploadToken}/events`,
      {
        data: {
          eventType: "employee_reported_cancelled",
          payload: { note: "Restaurant reported cancellation" },
        },
      },
    );
    expect(cancellationEvent.status()).toBe(201);

    const upload = await request.post(
      `/api/guest/requests/${createdBody.uploadToken}/uploads`,
      {
        data: {
          fileType: "link",
          invoiceLink: "https://example.com/invoice.pdf",
        },
      },
    );
    expect(upload.status()).toBe(201);

    const storedRequest = await fetch(
      `${environment.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/invoice_requests?id=eq.${createdBody.request.id}&select=status,ip_address,user_agent`,
      { headers: { ...headers, Accept: "application/vnd.pgrst.object+json" } },
    );
    expect(storedRequest.ok).toBeTruthy();
    expect(await storedRequest.json()).toMatchObject({
      status: "invoice_uploaded",
      ip_address: "203.0.113.10",
      user_agent: "Oda Phase 1 Playwright",
    });

    const invalidUpload = await request.post(
      `/api/guest/requests/not-a-valid-token/uploads`,
      {
        data: {
          fileType: "link",
          invoiceLink: "https://example.com/invoice.pdf",
        },
      },
    );
    expect(invalidUpload.status()).toBe(404);
  } finally {
    await fetch(
      `${environment.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/companies?id=eq.${companyId}`,
      { method: "DELETE", headers },
    );
  }
});

test("company_admin without company_accounting cannot close a request", async ({
  page,
}) => {
  test.setTimeout(90_000);

  const environment = await getLocalEnvironment();
  const headers = adminHeaders(environment.SUPABASE_SERVICE_ROLE_KEY);
  const companyId = randomUUID();
  const qrId = randomUUID();
  const requestId = randomUUID();
  const email = `phase1-admin-only-${Date.now()}@example.com`;
  const requestedAt = new Date();
  let userId: string | undefined;

  try {
    const userResponse = await fetch(
      `${environment.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ email, email_confirm: true }),
      },
    );
    const user = (await userResponse.json()) as { id: string };
    expect(userResponse.ok).toBeTruthy();
    userId = user.id;

    for (const [path, body] of [
      ["companies", { id: companyId, name: "Oda Admin Only Company" }],
      [
        "company_memberships",
        {
          company_id: companyId,
          user_id: userId,
          role: "company_admin",
        },
      ],
      [
        "company_invoice_profiles",
        {
          company_id: companyId,
          legal_name: "Oda Admin Only Company Limited",
          tax_code: "9876543210",
          registered_address: "Ho Chi Minh City",
        },
      ],
      [
        "company_invoice_qrs",
        {
          id: qrId,
          company_id: companyId,
          display_code: "E-001",
          token_hash: hashToken(randomBytes(32).toString("base64url")),
          status: "active_unassigned",
        },
      ],
      [
        "invoice_requests",
        {
          id: requestId,
          request_code: `INV-E2E-${Date.now()}`,
          company_id: companyId,
          qr_id: qrId,
          qr_display_code: "E-001",
          qr_assignment_status: "active_unassigned",
          company_name: "Oda Admin Only Company Limited",
          company_tax_code: "9876543210",
          company_address: "Ho Chi Minh City",
          receipt_amount: 100000,
          upload_token_hash: hashToken(randomBytes(32).toString("base64url")),
          idempotency_key: randomUUID(),
          requested_at: requestedAt.toISOString(),
          visible_until: new Date(
            requestedAt.getTime() + 60 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          ip_address: "127.0.0.1",
          user_agent: "Playwright",
          status: "invoice_uploaded",
        },
      ],
    ] as const) {
      const response = await fetch(
        `${environment.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${path}`,
        { method: "POST", headers, body: JSON.stringify(body) },
      );
      expect(response.ok, `${path}: ${await response.text()}`).toBeTruthy();
    }

    await page.goto("/sign-in");
    await page.getByLabel("Email công ty").fill(email);
    await page.getByRole("button", { name: "Gửi liên kết đăng nhập" }).click();

    let magicLink: string | undefined;
    await expect
      .poll(
        async () => {
          magicLink = await getMagicLink(email);
          return magicLink;
        },
        { timeout: 30_000 },
      )
      .toBeTruthy();

    await page.goto(magicLink!);
    await expect(page).toHaveURL(/\/dashboard$/);

    const closeResponse = await page.request.patch(
      `/api/companies/${companyId}/requests/${requestId}/status`,
      { data: { status: "resolved" } },
    );
    expect(closeResponse.status()).toBe(403);
  } finally {
    if (userId) {
      await fetch(
        `${environment.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${userId}`,
        { method: "DELETE", headers },
      );
    }
    await fetch(
      `${environment.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/companies?id=eq.${companyId}`,
      { method: "DELETE", headers },
    );
  }
});
