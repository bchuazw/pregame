import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pre-Game — a soundtrack for the moment right before",
  description:
    "Tell us what you're about to do. We score it with original music + SFX, and show you who else is right here with you. Powered by turbopuffer + ElevenLabs.",
  openGraph: {
    title: "Pre-Game",
    description:
      "The moment right before deserves a soundtrack. Live hype line powered by AI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pre-Game",
    description:
      "The moment right before deserves a soundtrack. Live hype line.",
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
