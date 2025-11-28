import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Toaster } from "@/components/ui/sonner";
import { GlobalErrorBoundary } from "@/components/layout/GlobalErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fleet Maintenance System",
  description: "Manage your fleet efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalErrorBoundary>
          <Providers>
            <ProgressBar />
            {children}
            <Toaster />
          </Providers>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
