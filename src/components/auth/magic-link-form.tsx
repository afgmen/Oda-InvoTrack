"use client";

import { FormEvent, useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string>();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setMessage(undefined);

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    setMessage(
      error
        ? "Không thể gửi liên kết đăng nhập. Vui lòng thử lại."
        : "Đã gửi liên kết đăng nhập. Vui lòng kiểm tra email.",
    );
    setIsPending(false);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block space-y-2 text-sm font-medium" htmlFor="email">
        Email công ty
        <input
          autoComplete="email"
          className="h-11 w-full rounded-md border bg-background px-3 font-normal outline-none ring-primary focus:ring-2"
          id="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="accounting@example.com"
          required
          type="email"
          value={email}
        />
      </label>
      <button
        className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Đang gửi..." : "Gửi liên kết đăng nhập"}
      </button>
      {message ? (
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {message}
        </p>
      ) : null}
    </form>
  );
}
