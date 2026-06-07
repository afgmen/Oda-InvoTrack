export const COMPANY_ROLES = ["company_admin", "company_accounting"] as const;

export type CompanyRole = (typeof COMPANY_ROLES)[number];

export const ROLE_LABELS: Record<CompanyRole, string> = {
  company_admin: "company_admin",
  company_accounting: "company_accounting",
};

export function hasCompanyRole(
  roles: readonly CompanyRole[],
  requiredRole: CompanyRole,
): boolean {
  return roles.includes(requiredRole);
}
