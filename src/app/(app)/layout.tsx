import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardIcon, ShieldCheckIcon } from "@/components/oda-icons";
import { OdaBrand } from "@/components/oda-brand";
import { requireUser } from "@/lib/auth/authorization";

function UserInitial({ email }: { email?: string }) {
  const initial = email?.trim().charAt(0).toUpperCase() || "O";

  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary-hover">
      {initial}
    </span>
  );
}

export default async function AuthenticatedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className="relative z-20 hidden w-[260px] shrink-0 flex-col bg-card oda-header-shadow lg:flex"
        data-testid="app-sidebar"
      >
        <div className="flex h-20 items-center border-b px-6">
          <OdaBrand href="/dashboard" />
        </div>

        <nav aria-label="Điều hướng chính" className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-semibold tracking-[0.12em] text-subtle uppercase">
            Không gian làm việc
          </p>
          <Link
            className="flex min-h-12 items-center gap-3 rounded-[5px] bg-primary px-4 text-sm font-semibold text-white oda-action-shadow hover:bg-primary-hover"
            data-testid="active-navigation-item"
            href="/dashboard"
          >
            <DashboardIcon className="size-5" />
            Tổng quan
          </Link>

          <div className="mt-8 rounded-[8px] bg-muted p-4">
            <span className="flex size-9 items-center justify-center rounded-[8px] bg-card text-primary oda-card-shadow">
              <ShieldCheckIcon className="size-5" />
            </span>
            <p className="mt-3 text-sm font-semibold text-heading">
              Phân quyền độc lập
            </p>
            <p className="mt-1 text-xs leading-5 text-foreground">
              Quyền quản trị và kế toán được kiểm soát riêng theo từng công ty.
            </p>
          </div>
        </nav>

        <div className="border-t p-4">
          <div className="flex items-center gap-3 rounded-[8px] bg-[#f7f7f8] p-3">
            <UserInitial email={user.email} />
            <div className="min-w-0">
              <p className="text-xs text-subtle">Tài khoản đang dùng</p>
              <p className="truncate text-sm font-semibold text-heading">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur oda-header-shadow">
          <div className="flex h-20 items-center justify-between gap-4 px-5 sm:px-8">
            <div className="lg:hidden">
              <OdaBrand href="/dashboard" />
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-medium text-subtle">Oda InvoTrack</p>
              <p className="mt-0.5 text-sm font-semibold text-heading">
                Không gian quản trị
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 sm:flex">
                <UserInitial email={user.email} />
                <span className="hidden max-w-56 truncate text-sm font-medium text-heading md:inline">
                  {user.email}
                </span>
              </div>
              <SignOutButton />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
