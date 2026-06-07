import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16">
      <section className="max-w-2xl space-y-8">
        <p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Oda InvoTrack
        </p>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Theo dõi yêu cầu hóa đơn, không thay thế kho lưu trữ.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            Công cụ nhẹ để công ty theo dõi yêu cầu hóa đơn điện tử GTGT từ nhà
            hàng. Hóa đơn gốc vẫn được lưu trong hệ thống kế toán của công ty.
          </p>
        </div>
        <Link
          className="inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground"
          href="/sign-in"
        >
          Đăng nhập quản trị
        </Link>
      </section>
    </main>
  );
}
