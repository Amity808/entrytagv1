"use client"

import { useConnect } from "wagmi"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Wallet, Smartphone, Globe } from "lucide-react"

interface WalletConnectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WalletConnectModal({ open, onOpenChange }: WalletConnectModalProps) {
  const { connectors, connect, isPending } = useConnect()

  const getConnectorIcon = (connectorId: string) => {
    switch (connectorId) {
      case "injected":
        return <Wallet className="h-6 w-6" />
      case "walletConnect":
        return <Smartphone className="h-6 w-6" />
      case "coinbaseWallet":
        return <Globe className="h-6 w-6" />
      default:
        return <Wallet className="h-6 w-6" />
    }
  }

  const getConnectorName = (connector: any) => {
    switch (connector.id) {
      case "injected":
        return "MetaMask"
      case "walletConnect":
        return "WalletConnect"
      case "coinbaseWallet":
        return "Coinbase Wallet"
      default:
        return connector.name
    }
  }

  const getConnectorDescription = (connectorId: string) => {
    switch (connectorId) {
      case "injected":
        return "Connect using MetaMask browser extension"
      case "walletConnect":
        return "Connect using WalletConnect protocol"
      case "coinbaseWallet":
        return "Connect using Coinbase Wallet"
      default:
        return "Connect using this wallet"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-sans">Connect Your Wallet</DialogTitle>
          <DialogDescription className="font-serif">
            Choose a wallet to connect to ZetaTickets. You'll need ZETA tokens to purchase tickets.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              variant="outline"
              className="w-full justify-start h-auto p-4 bg-transparent"
              onClick={() => {
                connect({ connector })
                onOpenChange(false)
              }}
              disabled={isPending}
            >
              <div className="flex items-center gap-4">
                {getConnectorIcon(connector.id)}
                <div className="text-left">
                  <div className="font-semibold">{getConnectorName(connector)}</div>
                  <div className="text-sm text-muted-foreground">{getConnectorDescription(connector.id)}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground font-serif">
          <p>
            New to wallets?{" "}
            <a href="#" className="text-accent hover:underline">
              Learn more
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
