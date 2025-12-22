import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "BillOS - Electricity Bill Management for India",
  description: "AI-powered platform to understand, audit, optimize, and manage electricity bills across Indian DISCOMs. Save money, detect errors, and automate workflows.",
  keywords: ["electricity bill", "DISCOM", "India", "bill audit", "energy management", "tariff optimization"],
  authors: [{ name: "BillOS Team" }],
  openGraph: {
    title: "BillOS - Electricity Bill OS for India",
    description: "AI-powered electricity bill management, audit, and optimization platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
