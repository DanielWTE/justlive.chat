import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "justlive.chat - Free Live Chat for Your Website",
  description: "Add a beautiful, unbranded live chat widget to your website for free. Connect with your visitors in real-time and provide instant support.",
  keywords: "live chat, website chat, customer support, free chat widget, unbranded chat",
  metadataBase: new URL('https://justlive.chat'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://justlive.chat',
    title: 'justlive.chat - Free Live Chat for Your Website',
    description: 'Add a beautiful, unbranded live chat widget to your website for free. Connect with your visitors in real-time and provide instant support.',
    siteName: 'justlive.chat',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'justlive.chat - Free Live Chat for Your Website',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'justlive.chat - Free Live Chat for Your Website',
    description: 'Add a beautiful, unbranded live chat widget to your website for free. Connect with your visitors in real-time and provide instant support.',
    images: ['/twitter-image'],
    creator: '@justlivechat',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="bottom-right" />
        <script src="http://localhost:4000/embed.js?id=cm7v15246000171nzk63vznsq&colorPreset=dark"></script>
      </body>
    </html>
  );
}
