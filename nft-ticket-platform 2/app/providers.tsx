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

    if (!mounted) {
        return <div>Loading theme...</div>;
    }

    const rainbowKitTheme = theme === "dark" ? darkTheme() : lightTheme();

    return (
        <RainbowKitProvider theme={rainbowKitTheme}>{children}</RainbowKitProvider>
    );
};

const WagmiWrapper = ({ children }: { children: React.ReactNode }) => {
    // Temporarily simplified to test
    return <>{children}</>;
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <WagmiProvider config={config}>
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