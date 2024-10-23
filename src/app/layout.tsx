import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/themeProvider";
import { Toaster } from "@/components/ui/sonner";
import { NextUIProvider } from "@nextui-org/system";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import React, { type ReactNode, Suspense } from "react";

export const metadata: Metadata = {
  title: "cinéfil",
  description: "application officielle",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr" className={`${GeistSans.variable} bg-stone-950`}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextUIProvider>
            <Suspense>
              <Navbar />
            </Suspense>
            {children}
          </NextUIProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
