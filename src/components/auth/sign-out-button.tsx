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
      className="inline-flex min-h-11 items-center justify-center rounded-[5px] border bg-card px-4 text-sm font-semibold text-heading hover:border-primary hover:bg-primary-soft hover:text-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isPending}
      onClick={signOut}
      type="button"
    >
      {isPending ? "Đang đăng xuất..." : "Đăng xuất"}
    </button>
  );
}
