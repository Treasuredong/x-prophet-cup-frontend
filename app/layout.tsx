import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";

const Providers = dynamic(() => import("./providers").then((mod) => mod.Providers), {
  ssr: false
});

export const metadata: Metadata = {
  title: "X Prophet Cup",
  description: "World Cup-native prediction market for X Layer with tribes, streaks, hype, and collectible NFTs.",
  metadataBase: new URL("https://x-prophet-cup.vercel.app"),
  openGraph: {
    title: "X Prophet Cup",
    description: "World Cup-native prediction market for X Layer with tribes, streaks, hype, and collectible NFTs.",
    images: ["/images/x-share-card.svg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "X Prophet Cup",
    description: "World Cup-native prediction market for X Layer with tribes, streaks, hype, and collectible NFTs.",
    images: ["/images/x-share-card.svg"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
