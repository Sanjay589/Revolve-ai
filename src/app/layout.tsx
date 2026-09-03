import type { Metadata } from "next";
import Script from "next/script";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Revolve AI — AI-Powered Revenue Growth",
  description: "AI that grows your revenue. Safely. Explainable AI recommendations, bounded actions, policy engine, and real Razorpay payment integration.",
  keywords: ["AI", "revenue growth", "Razorpay", "fintech", "commerce", "agentic AI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <Script
          id="razorpay-checkout-script"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </head>
      <body suppressHydrationWarning className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
