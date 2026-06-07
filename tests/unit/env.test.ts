import { describe, expect, it } from "vitest";

import { parsePublicEnv, parseServerEnv } from "@/lib/env";

const publicEnv = {
  NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "public-key",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
};

describe("environment boundaries", () => {
  it("accepts the publishable Supabase client configuration", () => {
    expect(parsePublicEnv(publicEnv)).toEqual(publicEnv);
  });

  it("requires a server-only service-role key for admin access", () => {
    expect(
      parseServerEnv({
        ...publicEnv,
        SUPABASE_SERVICE_ROLE_KEY: "server-only-key",
      }),
    ).toMatchObject({
      SUPABASE_SERVICE_ROLE_KEY: "server-only-key",
    });
  });

  it("rejects a public service-role environment variable", () => {
    expect(() =>
      parseServerEnv({
        ...publicEnv,
        SUPABASE_SERVICE_ROLE_KEY: "server-only-key",
        NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: "leaked-key",
      }),
    ).toThrow("service-role credentials must remain server-only");
  });

  it("rejects malformed Supabase URLs", () => {
    expect(() =>
      parsePublicEnv({
        ...publicEnv,
        NEXT_PUBLIC_SUPABASE_URL: "not-a-url",
      }),
    ).toThrow();
  });
});
