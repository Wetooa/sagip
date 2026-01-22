import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Or your fonts
import "./globals.css"; // Ensure this points to the merged CSS

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hazard Map App",
  description: "Flood and hazard monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900`}>
        {/* The children (your page.tsx) will render inside here */}
        {children}
      </body>
    </html>
  );
}