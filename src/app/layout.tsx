import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio.mynul.dev"),
  title: {
    default: "Mynul Islam — Software Engineer",
    template: "%s — Mynul Islam",
  },
  description:
    "Mynul Islam is a software engineer building fast, scalable web apps with React, Next.js & TypeScript — across enterprise and government platforms.",
  openGraph: {
    title: "Mynul Islam — Software Engineer",
    description:
      "Software engineer building fast, scalable web apps with React, Next.js & TypeScript across enterprise and government platforms.",
    type: "website",
    url: "https://portfolio.mynul.dev",
    images: [
      {
        url: "https://picsum.photos/seed/mynul-og/1200/630",
        width: 1200,
        height: 630,
        alt: "Mynul Islam — portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mynul Islam — Software Engineer",
    description:
      "Software engineer building fast, scalable web apps with React, Next.js & TypeScript.",
    images: ["https://picsum.photos/seed/mynul-og/1200/630"],
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text y="52" font-size="56" font-family="serif">M</text></svg>',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth">
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <div className="grain" aria-hidden="true" />
        <noscript>
          <style>{`[data-preloader]{display:none !important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
