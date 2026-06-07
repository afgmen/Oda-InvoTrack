import { getCurrentMemberships } from "@/lib/auth/authorization";
import { ROLE_LABELS } from "@/lib/auth/roles";

export default async function DashboardPage() {
  const memberships = await getCurrentMemberships();

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
          Phase 0 foundation
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Tổng quan</h1>
        <p className="text-muted-foreground">
          Xác thực và phân quyền công ty đã sẵn sàng. Chức năng theo dõi yêu cầu
          hóa đơn sẽ được xây dựng ở Phase 1.
        </p>
      </div>

      {memberships.length === 0 ? (
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-medium">Chưa có quyền truy cập công ty</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Quản trị viên hệ thống cần thêm tài khoản này vào một công ty.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {memberships.map((membership) => (
            <article
              className="rounded-xl border bg-card p-6"
              key={`${membership.company_id}:${membership.role}`}
            >
              <h2 className="font-medium">{membership.companies.name}</h2>
              <p className="mt-3 inline-flex rounded-full bg-muted px-3 py-1 font-mono text-xs">
                {ROLE_LABELS[membership.role]}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
