"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import {
    RainbowKitProvider,
    darkTheme,
    lightTheme,
} from "@rainbow-me/rainbowkit";
import { config } from "@/config/wagmi";
import { useTheme, ThemeProvider as NextThemesProvider } from "next-themes";

const queryClient = new QueryClient();

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Return a placeholder that matches server-side rendering
    if (!mounted) {
        return (
            <div suppressHydrationWarning>
                <div style={{ visibility: 'hidden' }}>
                    {children}
                </div>
            </div>
        );
    }

    const rainbowKitTheme = theme === "dark" ? darkTheme() : lightTheme();

    return (
        <RainbowKitProvider theme={rainbowKitTheme}>{children}</RainbowKitProvider>
    );
};

const WagmiWrapper = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // During SSR and initial hydration, render a minimal structure
    // that matches what the client will eventually render
    if (!mounted) {
        return (
            <div suppressHydrationWarning>
                <div style={{ visibility: 'hidden' }}>
                    {children}
                </div>
            </div>
        );
    }

    return (
        <WagmiProvider config={config as any}>
            <QueryClientProvider client={queryClient}>
                <NextThemesProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <WagmiWrapper>
                        <ThemeProvider>{children}</ThemeProvider>
                    </WagmiWrapper>
                </NextThemesProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};