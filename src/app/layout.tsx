import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

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
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
