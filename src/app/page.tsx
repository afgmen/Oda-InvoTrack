import Link from "next/link";

import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  QrCodeIcon,
} from "@/components/oda-icons";
import { OdaBrand } from "@/components/oda-brand";

const processSteps = [
  {
    label: "Yêu cầu đã tạo",
    detail: "Quét QR và ghi nhận thông tin biên lai",
    icon: QrCodeIcon,
  },
  {
    label: "Đang chờ hóa đơn",
    detail: "Theo dõi trong cửa sổ hiển thị 60 ngày",
    icon: ClockIcon,
  },
  {
    label: "Kế toán kiểm tra",
    detail: "Chỉ kế toán công ty mới được đóng yêu cầu",
    icon: CheckIcon,
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="absolute -top-40 right-[-12rem] size-[34rem] rounded-full bg-primary/10 blur-3xl"
      />
      <header className="relative z-10 border-b bg-card/95 oda-header-shadow">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <OdaBrand href="/" />
          <Link
            className="inline-flex min-h-11 items-center rounded-[5px] border bg-card px-4 text-sm font-semibold text-heading hover:border-primary hover:text-primary"
            href="/sign-in"
          >
            Đăng nhập
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-14 px-5 py-14 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1.5 text-sm font-semibold text-primary-hover">
            <span className="size-2 rounded-full bg-primary" />
            Theo dõi yêu cầu hóa đơn điện tử GTGT
          </div>

          <h1 className="text-[34px] leading-[1.18] font-medium tracking-[-0.025em] text-heading sm:text-[48px] sm:leading-[1.12]">
            Yêu cầu hóa đơn rõ ràng,{" "}
            <span className="text-primary">theo dõi nhẹ nhàng.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-foreground sm:text-lg sm:leading-8">
            Oda InvoTrack giúp công ty theo dõi yêu cầu hóa đơn từ nhà hàng qua
            một luồng đơn giản, có trạng thái và người chịu trách nhiệm rõ ràng.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[5px] bg-primary px-6 text-base font-semibold text-primary-foreground oda-action-shadow hover:-translate-y-0.5 hover:bg-primary-hover"
              href="/sign-in"
            >
              Đăng nhập quản trị
              <ArrowRightIcon className="size-5" />
            </Link>
            <span className="text-sm text-subtle">
              Đăng nhập an toàn bằng liên kết email một lần
            </span>
          </div>

          <div className="mt-10 max-w-xl rounded-[8px] border bg-card p-4 oda-card-shadow">
            <p className="text-sm leading-6 text-foreground">
              <strong className="font-semibold text-heading">
                InvoTrack là công cụ theo dõi,
              </strong>{" "}
              không thay thế kho lưu trữ hay hệ thống kế toán. Hóa đơn gốc vẫn
              được lưu ở nơi công ty quản lý hồ sơ kế toán.
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div
            aria-hidden="true"
            className="absolute inset-x-8 top-8 bottom-[-1.25rem] rounded-[20px] bg-primary/10 blur-xl"
          />
          <div className="relative overflow-hidden rounded-[12px] border bg-card oda-card-shadow">
            <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.08em] text-primary uppercase">
                  Minh họa quy trình
                </p>
                <h2 className="mt-1 text-lg font-semibold text-heading">
                  Yêu cầu hóa đơn nhà hàng
                </h2>
              </div>
              <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-hover">
                Đang theo dõi
              </span>
            </div>

            <div className="space-y-2 p-4 sm:p-6">
              {processSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    className="flex items-start gap-4 rounded-[8px] border border-transparent p-3 hover:border-border hover:bg-[#f7f7f8]"
                    key={step.label}
                  >
                    <span
                      className={
                        index === 0
                          ? "flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-primary text-white"
                          : "flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-muted text-subtle"
                      }
                    >
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-heading">{step.label}</p>
                      <p className="mt-1 text-sm leading-5 text-foreground">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 border-t bg-[#f7f7f8]">
              <div className="border-r px-5 py-4 sm:px-6">
                <p className="text-xs text-subtle">Mã QR</p>
                <p className="mt-1 font-mono text-sm font-semibold text-heading">
                  E-001
                </p>
              </div>
              <div className="px-5 py-4 sm:px-6">
                <p className="text-xs text-subtle">Hiển thị đến</p>
                <p className="mt-1 text-sm font-semibold text-heading">
                  60 ngày từ lúc tạo
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
