"use client"

import { useState } from "react"
import { useAccount, useDisconnect, useBalance, useChainId, useSwitchChain } from "wagmi"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, AlertTriangle } from "lucide-react"
import { WalletConnectModal } from "./wallet-connect-modal"

export function WalletConnectButton() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [showNetworkModal, setShowNetworkModal] = useState(false)

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatBalance = (balance: any) => {
    if (!balance) return "0.00"
    return Number.parseFloat(balance.formatted).toFixed(4)
  }

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 7000:
        return "ZetaChain Mainnet"
      case 7001:
        return "ZetaChain Testnet"
      case 1:
        return "Ethereum"
      case 11155111:
        return "Sepolia"
      default:
        return "Unknown Network"
    }
  }

  const getNetworkColor = (chainId: number) => {
    switch (chainId) {
      case 7000:
      case 7001:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case 1:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case 11155111:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const isZetaChain = chainId === 7000 || chainId === 7001

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
    }
  }

  const openExplorer = () => {
    if (!address) return
    let explorerUrl = ""
    switch (chainId) {
      case 7000:
        explorerUrl = `https://explorer.zetachain.com/address/${address}`
        break
      case 7001:
        explorerUrl = `https://athens.explorer.zetachain.com/address/${address}`
        break
      case 1:
        explorerUrl = `https://etherscan.io/address/${address}`
        break
      case 11155111:
        explorerUrl = `https://sepolia.etherscan.io/address/${address}`
        break
    }
    if (explorerUrl) {
      window.open(explorerUrl, "_blank")
    }
  }

  if (!isConnected) {
    return (
      <>
        <Button onClick={() => setShowConnectModal(true)} variant="outline" size="sm">
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </Button>
        <WalletConnectModal open={showConnectModal} onOpenChange={setShowConnectModal} />
      </>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">{formatAddress(address!)}</span>
              <Badge className={getNetworkColor(chainId)} variant="secondary">
                {balance?.symbol || "ZETA"}
              </Badge>
            </div>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Wallet Connected</span>
                <Badge className={getNetworkColor(chainId)} variant="secondary">
                  {getNetworkName(chainId)}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground font-mono">{formatAddress(address!)}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Balance Display */}
          <div className="px-2 py-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Balance:</span>
              <span className="text-sm font-semibold">
                {formatBalance(balance)} {balance?.symbol || "ZETA"}
              </span>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Network Warning */}
          {!isZetaChain && (
            <>
              <div className="px-2 py-2">
                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs">Switch to ZetaChain for full functionality</span>
                </div>
              </div>
              <DropdownMenuItem onClick={() => setShowNetworkModal(true)}>Switch Network</DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem onClick={copyAddress}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Address
          </DropdownMenuItem>

          <DropdownMenuItem onClick={openExplorer}>
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Explorer
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => disconnect()} className="text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Network Switch Modal */}
      <Dialog open={showNetworkModal} onOpenChange={setShowNetworkModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch Network</DialogTitle>
            <DialogDescription>
              Choose a network to connect to. ZetaChain is recommended for the best experience.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => {
                switchChain({ chainId: 7000 })
                setShowNetworkModal(false)
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span>ZetaChain Mainnet</span>
                <Badge variant="secondary">Recommended</Badge>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => {
                switchChain({ chainId: 7001 })
                setShowNetworkModal(false)
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span>ZetaChain Testnet</span>
                <Badge variant="secondary">Testing</Badge>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
