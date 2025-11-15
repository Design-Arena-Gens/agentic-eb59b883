import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wellness & Productivity Hub",
  description: "Your intelligent companion for health and productivity tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
