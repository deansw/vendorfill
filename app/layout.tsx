// app/layout.tsx — FIXED & WORKING
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VendorFill AI – Never fill a vendor form again",
  description: "Upload any vendor packet. Get back a perfectly filled + signed PDF in minutes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white">
        {children}
      </body>
    </html>
  );
}
