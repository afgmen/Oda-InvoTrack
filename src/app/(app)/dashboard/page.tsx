import {
  CheckIcon,
  ClockIcon,
  QrCodeIcon,
  ShieldCheckIcon,
} from "@/components/oda-icons";
import { getCurrentMemberships } from "@/lib/auth/authorization";
import { ROLE_LABELS } from "@/lib/auth/roles";

const foundationItems = [
  {
    title: "Xác thực công ty",
    detail: "Đăng nhập không mật khẩu qua email",
    icon: ShieldCheckIcon,
  },
  {
    title: "Mã QR bảo mật",
    detail: "Token ngẫu nhiên, không để lộ dữ liệu nội bộ",
    icon: QrCodeIcon,
  },
  {
    title: "Cửa sổ theo dõi",
    detail: "Ngày hết hạn 60 ngày có thể truy vấn",
    icon: ClockIcon,
  },
];

export default async function DashboardPage() {
  const memberships = await getCurrentMemberships();

  return (
    <section className="space-y-8">
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary-hover">
            <span className="size-2 rounded-full bg-primary" />
            Phase 1 · Nền tảng miền nghiệp vụ
          </div>
          <h1 className="text-[28px] leading-10 font-medium tracking-[-0.015em] text-heading sm:text-[34px] sm:leading-12">
            Tổng quan
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-6 text-foreground">
            Xác thực, phân quyền công ty và nền tảng theo dõi yêu cầu hóa đơn đã
            sẵn sàng cho các luồng giao diện tiếp theo.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-[8px] border bg-card px-4 py-3 text-sm font-semibold text-heading oda-card-shadow">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary-soft text-primary">
            <CheckIcon className="size-4" />
          </span>
          Nền tảng hoạt động
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[8px] border bg-card oda-card-shadow">
          <div className="border-b px-5 py-5 sm:px-6">
            <p className="text-xs font-semibold tracking-[0.08em] text-primary-hover uppercase">
              Quyền truy cập
            </p>
            <h2 className="mt-1 text-lg font-semibold text-heading">
              Thành viên theo công ty
            </h2>
            <p className="mt-1 text-sm leading-6 text-foreground">
              Một tài khoản có thể giữ nhiều quyền độc lập trong cùng công ty.
            </p>
          </div>

          {memberships.length === 0 ? (
            <div className="p-5 sm:p-6">
              <div className="rounded-[8px] border border-dashed bg-[#f7f7f8] p-6 text-center">
                <h3 className="font-semibold text-heading">
                  Chưa có quyền truy cập công ty
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground">
                  Quản trị viên hệ thống cần thêm tài khoản này vào một công ty.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 p-5 sm:p-6 md:grid-cols-2">
              {memberships.map((membership) => (
                <article
                  className="rounded-[8px] border bg-card p-5 transition-shadow hover:shadow-[var(--shadow-card)]"
                  key={`${membership.company_id}:${membership.role}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-primary-soft text-primary-hover">
                      <ShieldCheckIcon className="size-5" />
                    </span>
                    <span className="rounded-full bg-muted px-3 py-1 font-mono text-[11px] font-semibold text-heading">
                      {ROLE_LABELS[membership.role]}
                    </span>
                  </div>
                  <h2 className="mt-5 text-base font-semibold text-heading">
                    {membership.companies.name}
                  </h2>
                  <p className="mt-1 text-sm leading-5 text-foreground">
                    Quyền được áp dụng riêng trong phạm vi công ty này.
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="rounded-[8px] border bg-card oda-card-shadow">
          <div className="border-b px-5 py-5 sm:px-6">
            <p className="text-xs font-semibold tracking-[0.08em] text-primary-hover uppercase">
              Trạng thái nền tảng
            </p>
            <h2 className="mt-1 text-lg font-semibold text-heading">
              Sẵn sàng cho luồng sản phẩm
            </h2>
          </div>
          <div className="divide-y px-5 sm:px-6">
            {foundationItems.map((item) => {
              const Icon = item.icon;

              return (
                <div className="flex gap-4 py-5" key={item.title}>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-muted text-primary-hover">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-heading">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-foreground">
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      <div className="rounded-[8px] border border-primary/15 bg-primary-soft px-5 py-4 sm:px-6">
        <p className="text-sm leading-6 text-primary-hover">
          <strong className="font-semibold">Phạm vi MVP:</strong> InvoTrack theo
          dõi yêu cầu trong 60 ngày. Hệ thống không phát hành hóa đơn và không
          đóng vai trò kho lưu trữ pháp lý.
        </p>
      </div>
    </section>
  );
}
