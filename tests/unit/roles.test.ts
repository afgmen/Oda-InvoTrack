import { describe, expect, it } from "vitest";

import {
  COMPANY_ROLES,
  hasCompanyRole,
  type CompanyRole,
} from "@/lib/auth/roles";

describe("company roles", () => {
  it("defines only company_admin and company_accounting", () => {
    expect(COMPANY_ROLES).toEqual(["company_admin", "company_accounting"]);
  });

  it("does not imply company_accounting from company_admin", () => {
    expect(hasCompanyRole(["company_admin"], "company_accounting")).toBe(false);
  });

  it("supports a company_accounting-only user", () => {
    expect(hasCompanyRole(["company_accounting"], "company_accounting")).toBe(
      true,
    );
    expect(hasCompanyRole(["company_accounting"], "company_admin")).toBe(false);
  });

  it("supports a user holding both roles", () => {
    const roles: CompanyRole[] = ["company_admin", "company_accounting"];

    expect(hasCompanyRole(roles, "company_admin")).toBe(true);
    expect(hasCompanyRole(roles, "company_accounting")).toBe(true);
  });
});
