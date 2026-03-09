import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "ProConnect — Find Skilled Professionals Near You",
    template: "%s | ProConnect",
  },
  description:
    "Connect with verified local professionals for any job. Find experts in home services, design, photography, and more — and hire with confidence.",
  keywords: [
    "professionals",
    "freelancers",
    "services",
    "hire",
    "developers",
    "designers",
    "consultants",
    "home services",
    "local professionals",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://proconnect.app"),
  openGraph: {
    siteName: "ProConnect",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",  // allows CSS env(safe-area-inset-*) to work on iOS
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
