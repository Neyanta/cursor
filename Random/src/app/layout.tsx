import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SP Research Copilot",
  description: "Internal tool for BDMs to research businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

