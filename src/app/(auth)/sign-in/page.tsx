import { MagicLinkForm } from "@/components/auth/magic-link-form";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-16">
      <section className="w-full rounded-xl border bg-card p-7 shadow-sm">
        <div className="mb-7 space-y-2">
          <p className="font-mono text-xs font-medium tracking-[0.18em] text-primary">
            Oda InvoTrack
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Đăng nhập</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Nhập email công ty. Chúng tôi sẽ gửi liên kết đăng nhập một lần.
          </p>
        </div>
        <MagicLinkForm />
      </section>
    </main>
  );
}
