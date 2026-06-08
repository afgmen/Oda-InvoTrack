import { redirect } from "next/navigation";

import type { CompanyRole } from "@/lib/auth/roles";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return user;
}

export async function getCurrentMemberships() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("company_memberships")
    .select("company_id, role, companies!inner(name)")
    .order("company_id");

  if (error) {
    throw new Error(`Unable to load company memberships: ${error.message}`);
  }

  return data;
}

export async function requireCompanyRole(companyId: string, role: CompanyRole) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("has_company_role", {
    target_company_id: companyId,
    required_role: role,
  });

  if (error || !data) {
    throw new Error("Forbidden");
  }
}

export async function getAuthenticatedCompanyRole(
  companyId: string,
  role: CompanyRole,
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { allowed: false as const, reason: "unauthenticated" as const };
  }

  const { data, error } = await supabase.rpc("has_company_role", {
    target_company_id: companyId,
    required_role: role,
  });

  if (error || !data) {
    return { allowed: false as const, reason: "forbidden" as const, user };
  }

  return { allowed: true as const, user };
}

export async function getAuthenticatedCompanyMember(companyId: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { allowed: false as const, reason: "unauthenticated" as const };
  }

  const { data, error } = await supabase.rpc("is_company_member", {
    target_company_id: companyId,
  });

  if (error || !data) {
    return { allowed: false as const, reason: "forbidden" as const, user };
  }

  return { allowed: true as const, user };
}
