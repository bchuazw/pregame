import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SoundPost — your life, with a score",
  description:
    "Tell SoundPost what today was. It writes a custom score, layers SFX, and prints a shareable card. Every post makes the next one sharper.",
  openGraph: {
    title: "SoundPost",
    description:
      "Some days don't need words. Just a soundtrack. AI-scored journaling, live.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoundPost",
    description:
      "Some days don't need words. Just a soundtrack.",
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
