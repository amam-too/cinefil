import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { type Metadata } from "next";
import React, { type ReactNode } from "react";
import Footer from "@/components/footer";
import PopcornExplosionLayout from "@/utils/popcorn-explosion-layout";

export const metadata: Metadata = {
  title: "cinéfil",
  description: "application officielle",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr" className="dark">
      <body className="m-0 bg-background p-0 font-sans text-white">
        <Navbar />

        <PopcornExplosionLayout>
          <main className="relative z-10 w-full bg-background pb-10 shadow-2xl">
            {children}
          </main>
        </PopcornExplosionLayout>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
