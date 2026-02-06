import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PodifyAI - Turn PDFs into Podcasts in 60 Seconds",
  description: "Upload any PDF and transform it into a professional podcast with AI. Perfect for learning on the go, content repurposing, and making documents accessible.",
  openGraph: {
    title: "PodifyAI - Turn PDFs into Podcasts in 60 Seconds",
    description: "Upload any PDF and transform it into a professional podcast with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
