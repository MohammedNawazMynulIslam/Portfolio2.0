import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio.mynul.dev"),
  title: {
    default: "Mynul Islam | Portfolio OS",
    template: "%s | Mynul Islam",
  },
  description:
    "A macOS-inspired interactive portfolio built with Next.js, GSAP, and polished desktop-style UI.",
  openGraph: {
    title: "Mynul Islam | Portfolio OS",
    description:
      "Explore a desktop-inspired interactive portfolio with animated windows, a dock, and polished product details.",
    type: "website",
    url: "https://portfolio.mynul.dev",
    images: [
      {
        url: "https://picsum.photos/seed/portfolio-os-cover/1200/630",
        width: 1200,
        height: 630,
        alt: "Portfolio OS preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mynul Islam | Portfolio OS",
    description:
      "A macOS-inspired interactive portfolio built with Next.js, GSAP, and polished desktop-style UI.",
    images: ["https://picsum.photos/seed/portfolio-os-cover/1200/630"],
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text y="50" font-size="48">🖥️</text></svg>',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full bg-background font-georama text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
