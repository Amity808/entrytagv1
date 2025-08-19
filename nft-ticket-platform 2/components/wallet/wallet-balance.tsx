"use client"

import { useAccount, useBalance } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, TrendingUp } from "lucide-react"

export function WalletBalance() {
  const { address, isConnected } = useAccount()
  const { data: balance, isLoading } = useBalance({ address })

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sans">
            <Wallet className="h-5 w-5" />
            Wallet Balance
          </CardTitle>
          <CardDescription className="font-serif">Connect your wallet to view balance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">No wallet connected</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sans">
            <Wallet className="h-5 w-5" />
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-32 mb-2"></div>
            <div className="h-4 bg-muted rounded w-24"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatBalance = (balance: any) => {
    if (!balance) return "0.00"
    return Number.parseFloat(balance.formatted).toFixed(4)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-sans">
          <Wallet className="h-5 w-5" />
          Wallet Balance
        </CardTitle>
        <CardDescription className="font-serif">Your current {balance?.symbol || "ZETA"} balance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div>
            <div className="text-3xl font-bold text-foreground">{formatBalance(balance)}</div>
            <div className="text-sm text-muted-foreground">{balance?.symbol || "ZETA"}</div>
          </div>
          <div className="flex-1 flex justify-end">
            <TrendingUp className="h-8 w-8 text-accent" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
