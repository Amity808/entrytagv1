"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, User, Wallet } from "lucide-react"
import { useWallet } from "@/lib/wallet-context"
import { WalletConnectDialog } from "@/components/wallet-connect-dialog"
import { WalletInfo } from "@/components/wallet-info"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { isConnected, isConnecting } = useWallet()

  const navItems = [
    { href: "/events", label: "Browse Events" },
    { href: "/create", label: "Create Event" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/about", label: "How it Works" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">Z</span>
          </div>
          <span className="font-bold text-xl font-sans">ZetaTickets</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground/80 hover:text-foreground transition-colors font-serif"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>

          {isConnected ? (
            <WalletInfo />
          ) : (
            <WalletConnectDialog>
              <Button variant="outline" size="sm" disabled={isConnecting}>
                <Wallet className="h-4 w-4 mr-2" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            </WalletConnectDialog>
          )}

          {isConnected && (
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col space-y-4 mt-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors py-2 font-serif"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t space-y-3">
                {isConnected ? (
                  <div className="space-y-2">
                    <WalletInfo />
                  </div>
                ) : (
                  <WalletConnectDialog>
                    <Button className="w-full bg-transparent" variant="outline" disabled={isConnecting}>
                      <Wallet className="h-4 w-4 mr-2" />
                      {isConnecting ? "Connecting..." : "Connect Wallet"}
                    </Button>
                  </WalletConnectDialog>
                )}
                <Button className="w-full" variant="ghost">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
