import { NextResponse, type NextRequest } from "next/server";

import { getPublicEnv } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const appOrigin = getPublicEnv().NEXT_PUBLIC_APP_URL ?? requestUrl.origin;
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const safeNext =
    next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(safeNext, appOrigin));
    }
  }

  return NextResponse.redirect(
    new URL("/sign-in?error=invalid_magic_link", appOrigin),
  );
}
