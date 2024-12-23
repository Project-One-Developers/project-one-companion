import { ThemeProvider } from "@/components/providers/theme-provider";
import ProjectOneSidebar from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

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
