"use client"

import { useAccount, useBalance, useChainId, useDisconnect } from "wagmi"

export function useWallet() {
  const { address, isConnected, isConnecting } = useAccount()
  const { data: balance, isLoading: isBalanceLoading } = useBalance({ address })
  const chainId = useChainId()
  const { disconnect } = useDisconnect()

  const isZetaChain = chainId === 7000 || chainId === 7001

  const formatBalance = (balance: any) => {
    if (!balance) return "0.00"
    return Number.parseFloat(balance.formatted).toFixed(4)
  }

  const formatAddress = (addr?: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return {
    address,
    isConnected,
    isConnecting,
    balance,
    formattedBalance: formatBalance(balance),
    isBalanceLoading,
    chainId,
    isZetaChain,
    formatAddress: () => formatAddress(address),
    disconnect,
  }
}
