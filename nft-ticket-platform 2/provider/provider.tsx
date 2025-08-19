"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, useChainId, useWalletClient } from "wagmi";
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import dynamic from "next/dynamic";

const UniversalKitProvider = dynamic(
  () => import("@zetachain/universalkit").then((mod) => mod.UniversalKitProvider),
  { ssr: false }
);
import { config } from "@/config/wagmi";
import { useTheme, ThemeProvider as NextThemesProvider } from "next-themes";

const queryClient = new QueryClient();

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const rainbowKitTheme = theme === "dark" ? darkTheme() : lightTheme();

  return (
    <RainbowKitProvider theme={rainbowKitTheme}>{children}</RainbowKitProvider>
  );
};

const UniversalKitWrapper = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <UniversalKitProvider config={config} client={queryClient}>
      {children}
    </UniversalKitProvider>
  );
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <UniversalKitWrapper>
          <ThemeProvider>{children}</ThemeProvider>
        </UniversalKitWrapper>
      </NextThemesProvider>
    </QueryClientProvider>
  );
};