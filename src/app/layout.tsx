import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Oda InvoTrack",
  description: "Lightweight restaurant VAT e-invoice request tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
