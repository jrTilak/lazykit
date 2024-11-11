import type { Metadata } from "next";
import "@/app/globals.css";
import { META_DATA } from "@/data/metadata";
import Header from "@/components/globals/top-header";
import { ThemeProvider } from "@/providers/theme-provider";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import TopLoader from "@/components/loaders/top-loader";


export const metadata: Metadata = META_DATA;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <div className="h-[calc(100vh-55px)] overflow-y-scroll">
            {children}
          </div>
          <Toaster />
          <TopLoader />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
