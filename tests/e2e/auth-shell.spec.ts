import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { parseEnv } from "node:util";

const MAILPIT_URL = "http://127.0.0.1:54324";

type LocalEnvironment = {
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

type MailpitMessage = {
  ID: string;
  To: Array<{ Address: string }>;
};

type SupabaseUser = {
  id: string;
  email?: string;
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

function supabaseAdminHeaders(serviceRoleKey: string) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };
}

async function findSupabaseUser(
  environment: LocalEnvironment,
  email: string,
): Promise<SupabaseUser | undefined> {
  const response = await fetch(
    `${environment.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=1000`,
    {
      headers: supabaseAdminHeaders(environment.SUPABASE_SERVICE_ROLE_KEY),
    },
  );

  if (!response.ok) {
    throw new Error(`Unable to list local Auth users: ${response.status}`);
  }

  const body = (await response.json()) as { users: SupabaseUser[] };
  return body.users.find((user) => user.email === email);
}

async function createSupabaseUser(
  environment: LocalEnvironment,
  email: string,
): Promise<SupabaseUser> {
  const response = await fetch(
    `${environment.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users`,
    {
      method: "POST",
      headers: supabaseAdminHeaders(environment.SUPABASE_SERVICE_ROLE_KEY),
      body: JSON.stringify({
        email,
        email_confirm: true,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Unable to create local Auth user: ${response.status}`);
  }

  return (await response.json()) as SupabaseUser;
}

async function provisionCompanyRoles(
  environment: LocalEnvironment,
  userId: string,
  companyId: string,
) {
  const headers = {
    ...supabaseAdminHeaders(environment.SUPABASE_SERVICE_ROLE_KEY),
    Prefer: "return=minimal",
  };
  const companyResponse = await fetch(
    `${environment.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/companies`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        id: companyId,
        name: "Oda Playwright Company",
      }),
    },
  );

  if (!companyResponse.ok) {
    throw new Error(
      `Unable to create E2E company: ${companyResponse.status} ${await companyResponse.text()}`,
    );
  }

  const membershipsResponse = await fetch(
    `${environment.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/company_memberships`,
    {
      method: "POST",
      headers,
      body: JSON.stringify([
        {
          company_id: companyId,
          user_id: userId,
          role: "company_admin",
        },
        {
          company_id: companyId,
          user_id: userId,
          role: "company_accounting",
        },
      ]),
    },
  );

  if (!membershipsResponse.ok) {
    throw new Error(
      `Unable to create E2E memberships: ${membershipsResponse.status} ${await membershipsResponse.text()}`,
    );
  }
}

async function getMagicLink(email: string): Promise<string | undefined> {
  const messagesResponse = await fetch(`${MAILPIT_URL}/api/v1/messages`);

  if (!messagesResponse.ok) {
    throw new Error(`Unable to read Mailpit: ${messagesResponse.status}`);
  }

  const mailbox = (await messagesResponse.json()) as {
    messages: MailpitMessage[];
  };
  const message = mailbox.messages.find((candidate) =>
    candidate.To.some((recipient) => recipient.Address === email),
  );

  if (!message) {
    return undefined;
  }

  const messageResponse = await fetch(
    `${MAILPIT_URL}/api/v1/message/${message.ID}`,
  );

  if (!messageResponse.ok) {
    throw new Error(
      `Unable to read Mailpit message: ${messageResponse.status}`,
    );
  }

  const detail = (await messageResponse.json()) as { Text: string };
  return detail.Text.match(/Log In \( (https?:\/\/\S+) \)/)?.[1];
}

async function removeTestData(
  environment: LocalEnvironment,
  email: string,
  companyId: string,
) {
  const headers = supabaseAdminHeaders(environment.SUPABASE_SERVICE_ROLE_KEY);
  const user = await findSupabaseUser(environment, email);

  if (user) {
    await fetch(
      `${environment.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${user.id}`,
      {
        method: "DELETE",
        headers,
      },
    );
  }

  await fetch(
    `${environment.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/companies?id=eq.${companyId}`,
    {
      method: "DELETE",
      headers,
    },
  );
}

test("unauthenticated user is redirected to magic-link sign in", async ({
  page,
}) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/sign-in/);
  await expect(page.getByRole("heading", { name: "Đăng nhập" })).toBeVisible();
  await expect(page.getByLabel("Email công ty")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "hộp thư thử nghiệm" }),
  ).toHaveAttribute("href", "http://127.0.0.1:54324");
});

test("public landing page identifies the product as a tracker", async ({
  page,
}) => {
  await page.goto("/");

  const brand = page.getByText("Oda InvoTrack", { exact: true });

  await expect(brand).toBeVisible();
  await expect(brand).toHaveCSS("text-transform", "none");
  await expect(page.getByText(/không thay thế kho lưu trữ/i)).toBeVisible();
});

test("company user can sign in, see distinct roles, and sign out", async ({
  page,
}) => {
  test.setTimeout(90_000);

  const environment = await getLocalEnvironment();
  const email = `phase0-e2e-${Date.now()}@example.com`;
  const companyId = crypto.randomUUID();

  try {
    const user = await createSupabaseUser(environment, email);
    await provisionCompanyRoles(environment, user.id, companyId);

    await page.goto("/sign-in");
    await page.getByLabel("Email công ty").fill(email);
    await page
      .getByRole("button", {
        name: "Gửi liên kết đăng nhập",
      })
      .click();

    await expect(
      page.getByText("Đã gửi liên kết đăng nhập. Vui lòng kiểm tra email."),
    ).toBeVisible({ timeout: 15_000 });

    let magicLink: string | undefined;
    await expect
      .poll(async () => {
        magicLink = await getMagicLink(email);
        return magicLink;
      })
      .toBeTruthy();

    await page.goto(magicLink!);
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(
      page.getByRole("heading", { name: "Oda Playwright Company" }),
    ).toHaveCount(2);
    await expect(
      page.getByText("company_admin", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("company_accounting", { exact: true }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Đăng xuất" }).click();
    await expect(page).toHaveURL(/\/sign-in$/);

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/sign-in\?next=%2Fdashboard$/);
  } finally {
    await removeTestData(environment, email, companyId);
  }
});
