import React from "react";
import type { AppProps } from "next/app";

import "../styles/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Head from "next/head";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ProjectOneSidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Project One Companion</title>
            </Head>
            <SidebarProvider defaultOpen={true}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    forcedTheme="dark"
                    disableTransitionOnChange
                >
                    <ProjectOneSidebar />
                    <SidebarTrigger />
                    <Component {...pageProps} />
                    <Toaster />
                </ThemeProvider>
            </SidebarProvider>
        </>
    );
}

export default MyApp;
