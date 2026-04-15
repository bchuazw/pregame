import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vibe Check — the audio roast of any content",
  description:
    "Paste a tweet, email, or post. Get an original score + sound effects that expose its true vibe. Powered by turbopuffer + ElevenLabs.",
  openGraph: {
    title: "Vibe Check",
    description:
      "Paste anything. Hear its true vibe, scored and SFX'd by AI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibe Check",
    description: "Paste anything. Hear its true vibe.",
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
