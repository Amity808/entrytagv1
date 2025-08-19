import type React from "react"

import "./globals.css"

import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "@/app/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="antialiased">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
