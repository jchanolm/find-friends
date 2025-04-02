import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "WarpBuddy",
  description: "Find your Farcaster community",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://warpbuddy.app/og-image.png",
      button: {
        title: "Find Your People",
        action: {
          type: "launch_frame",
          name: "WarpBuddy",
          url: "https://warpbuddy.app",
          splashImageUrl: "https://warpbuddy.app/logo.png",
          splashBackgroundColor: "#f0f4f9"
        }
      }
    })
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
          {children}
        </div>
      </body>
    </html>
  );
}