"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function signOut() {
    setIsPending(true);
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.replace("/sign-in");
    router.refresh();
  }

  return (
    <button
      className="rounded-md border bg-card px-3 py-2 text-sm font-medium disabled:opacity-60"
      disabled={isPending}
      onClick={signOut}
      type="button"
    >
      Đăng xuất
    </button>
  );
}
