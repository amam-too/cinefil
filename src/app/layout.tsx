import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { NextUIProvider } from "@nextui-org/system";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import React, { type ReactNode, Suspense } from "react";

export const metadata: Metadata = {
    title: "cinéfil",
    description: "application officielle"
};

const geist = Geist({subsets: ["latin"]})

export default async function RootLayout({children}: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="fr" className={ `${ geist.className } bg-stone-950 dark` }>
        <body>
            <NextUIProvider>
                <Suspense>
                    <Navbar/>
                </Suspense>
                { children }
            </NextUIProvider>
            <Toaster/>
        </body>
        </html>
    );
}
