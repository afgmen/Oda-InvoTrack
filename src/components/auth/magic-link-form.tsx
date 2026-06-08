"use client";

import { FormEvent, useState } from "react";

import { ArrowRightIcon } from "@/components/oda-icons";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type FormMessage = {
  text: string;
  tone: "success" | "error";
};

export function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<FormMessage>();
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
        ? {
            text: "Không thể gửi liên kết đăng nhập. Vui lòng thử lại.",
            tone: "error",
          }
        : {
            text: "Đã gửi liên kết đăng nhập. Vui lòng kiểm tra email.",
            tone: "success",
          },
    );
    setIsPending(false);
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label
          className="block text-sm font-semibold text-heading"
          htmlFor="email"
        >
          Email công ty
        </label>
        <input
          autoComplete="email"
          className="h-12 w-full rounded-[5px] border bg-card px-4 text-[15px] font-normal text-heading outline-none placeholder:text-[#9f9daa] hover:border-[#cac8d0] focus:border-primary focus:ring-3 focus:ring-primary/15"
          id="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="accounting@example.com"
          required
          type="email"
          value={email}
        />
      </div>
      <button
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[5px] bg-primary px-5 text-base font-semibold text-primary-foreground oda-action-shadow hover:-translate-y-0.5 hover:bg-primary-hover disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-[#b9b9c3] disabled:shadow-none"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Đang gửi..." : "Gửi liên kết đăng nhập"}
        {!isPending ? <ArrowRightIcon className="size-5" /> : null}
      </button>
      {message ? (
        <p
          aria-live="polite"
          className={
            message.tone === "success"
              ? "rounded-[8px] border border-primary/20 bg-primary-soft px-4 py-3 text-sm leading-5 text-primary-hover"
              : "rounded-[8px] border border-danger/25 bg-danger/5 px-4 py-3 text-sm leading-5 text-[#c84747]"
          }
        >
          {message.text}
        </p>
      ) : null}
    </form>
  );
}
