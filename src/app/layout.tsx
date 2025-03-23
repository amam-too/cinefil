import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { type Metadata } from "next";
import React, { type ReactNode } from "react";

export const metadata: Metadata = {
    title: "cinéfil",
    description: "application officielle"
};

export default async function RootLayout({children}: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="fr" className={ `dark` }>
        <body>
            <Navbar/>
            { children }
            <Toaster/>
        </body>
        </html>
    );
}
