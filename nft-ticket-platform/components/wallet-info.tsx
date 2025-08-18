"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Copy, ExternalLink, LogOut, Settings, User, Wallet } from "lucide-react"
import { useWallet } from "@/lib/wallet-context"

export function WalletInfo() {
  const { address, balance, chainId, disconnectWallet } = useWallet()
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getChainName = (id: number) => {
    const chains: Record<number, string> = {
      1: "Ethereum",
      137: "Polygon",
      56: "BSC",
      42161: "Arbitrum",
      10: "Optimism",
      7000: "ZetaChain",
    }
    return chains[id] || `Chain ${id}`
  }

  if (!address) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">{formatAddress(address)}</span>
          <Badge variant="secondary" className="hidden md:inline-flex">
            {balance} ETH
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium font-sans">Wallet Address</span>
                  <Button variant="ghost" size="sm" onClick={copyAddress} className="h-auto p-1">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm font-mono bg-muted p-2 rounded">{address}</p>
                {copied && <p className="text-xs text-green-600">Address copied!</p>}

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-sm font-medium font-sans">Balance</p>
                    <p className="text-lg font-bold">{balance} ETH</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium font-sans">Network</p>
                    <Badge variant="outline">{getChainName(chainId || 1)}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <User className="h-4 w-4 mr-2" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Explorer
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={disconnectWallet}>
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
