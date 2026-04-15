import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hypeman — your personal hypeman for the leap",
  description:
    "Tell Hypeman what you're about to do. He brings the music, the punch, and the proof you're not alone — exactly when you need to go do it.",
  openGraph: {
    title: "Hypeman",
    description:
      "Your personal hypeman for the leap right in front of you. AI-scored. Live.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hypeman",
    description:
      "Your personal hypeman for the leap right in front of you.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
        />
      </head>
      <body className="min-h-screen relative overflow-x-hidden">
        <div className="aurora" aria-hidden />
        <div className="grain" aria-hidden />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
