"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, ExternalLink, AlertCircle } from "lucide-react"
import { useWallet } from "@/lib/wallet-context"

interface WalletConnectDialogProps {
  children: React.ReactNode
}

export function WalletConnectDialog({ children }: WalletConnectDialogProps) {
  const [open, setOpen] = useState(false)
  const { connectWallet, isConnecting, error } = useWallet()

  const walletOptions = [
    {
      name: "MetaMask",
      description: "Connect using browser extension",
      icon: "🦊",
      available: typeof window !== "undefined" && window.ethereum,
      action: connectWallet,
    },
    {
      name: "WalletConnect",
      description: "Connect using mobile wallet",
      icon: "📱",
      available: false,
      action: () => console.log("WalletConnect not implemented"),
    },
    {
      name: "Coinbase Wallet",
      description: "Connect using Coinbase",
      icon: "🔵",
      available: false,
      action: () => console.log("Coinbase Wallet not implemented"),
    },
  ]

  const handleConnect = async (wallet: (typeof walletOptions)[0]) => {
    if (!wallet.available) return

    try {
      await wallet.action()
      setOpen(false)
    } catch (error) {
      console.error("Connection failed:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-sans">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground font-serif">
            Choose your preferred wallet to connect to ZetaTickets
          </p>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            {walletOptions.map((wallet) => (
              <Card
                key={wallet.name}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !wallet.available ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handleConnect(wallet)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{wallet.icon}</span>
                      <div>
                        <h3 className="font-semibold font-sans">{wallet.name}</h3>
                        <p className="text-sm text-muted-foreground font-serif">{wallet.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {wallet.available ? (
                        <Badge variant="secondary">Available</Badge>
                      ) : (
                        <Badge variant="outline">Coming Soon</Badge>
                      )}
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground font-serif text-center">
              By connecting a wallet, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
