import type { Metadata } from "next";
import "./globals.css";
import "./editorial.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "AUREVIA Global Advisory — Strategy, Technology & Transformation",
  description:
    "Global advisory firm helping organizations navigate strategy, technology, operations and transformation.",
  openGraph: {
    title: "AUREVIA Global Advisory",
    description: "Complex markets. Clear decisions.",
    type: "website",
    images: ["/assets/og-aurevia.jpg"],
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
