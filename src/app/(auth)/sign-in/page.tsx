import { MagicLinkForm } from "@/components/auth/magic-link-form";
import { CheckIcon, ShieldCheckIcon } from "@/components/oda-icons";
import { OdaBrand } from "@/components/oda-brand";

const assurances = [
  "Không cần mật khẩu",
  "Phân quyền theo công ty",
  "Kế toán kiểm soát trạng thái cuối",
];

export default function SignInPage() {
  return (
    <main className="grid min-h-screen bg-card lg:grid-cols-[0.88fr_1.12fr]">
      <section className="relative hidden overflow-hidden bg-[#f3f8f4] px-12 py-10 lg:flex lg:flex-col xl:px-20 xl:py-14">
        <div
          aria-hidden="true"
          className="absolute -bottom-40 -left-24 size-[30rem] rounded-full bg-primary/15 blur-3xl"
        />
        <OdaBrand href="/" />

        <div className="relative my-auto max-w-lg py-16">
          <span className="mb-7 flex size-14 items-center justify-center rounded-[12px] bg-primary text-white oda-action-shadow">
            <ShieldCheckIcon className="size-8" />
          </span>
          <p className="text-sm font-semibold tracking-[0.08em] text-primary-hover uppercase">
            Không gian quản trị công ty
          </p>
          <h2 className="mt-3 text-[34px] leading-[1.25] font-medium tracking-[-0.02em] text-heading">
            Theo dõi yêu cầu hóa đơn trong một luồng minh bạch.
          </h2>
          <p className="mt-5 text-base leading-7 text-foreground">
            Đăng nhập để quản lý mã QR, phân công và theo dõi yêu cầu trong cửa
            sổ hiển thị của InvoTrack.
          </p>

          <ul className="mt-8 space-y-4">
            {assurances.map((assurance) => (
              <li
                className="flex items-center gap-3 text-sm font-medium text-heading"
                key={assurance}
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-card text-primary oda-card-shadow">
                  <CheckIcon className="size-4" />
                </span>
                {assurance}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs leading-5 text-subtle">
          InvoTrack là công cụ theo dõi, không phải kho lưu trữ hóa đơn hoặc hệ
          thống kế toán.
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-background px-5 py-10 sm:px-8 lg:bg-card">
        <div className="w-full max-w-[440px]">
          <div className="mb-10 lg:hidden">
            <OdaBrand href="/" />
          </div>

          <div className="rounded-[12px] border bg-card p-6 oda-card-shadow sm:p-9 lg:border-0 lg:p-0 lg:shadow-none">
            <div className="mb-8">
              <p className="text-sm font-semibold text-primary-hover">
                Chào mừng trở lại
              </p>
              <h1 className="mt-2 text-[28px] leading-10 font-medium tracking-[-0.015em] text-heading">
                Đăng nhập
              </h1>
              <p className="mt-3 text-sm leading-6 text-foreground">
                Nhập email công ty. Chúng tôi sẽ gửi liên kết đăng nhập một lần.
              </p>
            </div>

            <MagicLinkForm />

            {process.env.NODE_ENV === "development" ? (
              <p className="mt-6 rounded-[8px] bg-muted px-4 py-3 text-sm leading-6 text-foreground">
                Email local không được gửi ra ngoài. Mở{" "}
                <a
                  className="font-semibold text-primary-hover underline decoration-primary/40 underline-offset-4 hover:text-primary"
                  href="http://127.0.0.1:54324"
                  rel="noreferrer"
                  target="_blank"
                >
                  hộp thư thử nghiệm
                </a>{" "}
                để lấy liên kết đăng nhập.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
