"use client"

import { useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"

// Mock contract configuration
const MOCK_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"
const mockContractABI = [
  {
    name: "purchaseTicket",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "eventId", type: "uint256" },
      { name: "quantity", type: "uint256" },
    ],
    outputs: [],
  },
] as const

export function usePurchase() {
  const [isConfirming, setIsConfirming] = useState(false)
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, error, isPending } = useWriteContract()

  const { isLoading: isWaitingForTx, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const purchaseTicket = async (eventId: string, quantity: number, pricePerTicket: number) => {
    if (!isConnected || !address) {
      throw new Error("Wallet not connected")
    }

    setIsConfirming(true)

    try {
      const totalPrice = pricePerTicket * quantity

      await writeContract({
        address: MOCK_CONTRACT_ADDRESS,
        abi: mockContractABI,
        functionName: "purchaseTicket",
        args: [BigInt(eventId), BigInt(quantity)],
        value: parseEther(totalPrice.toString()),
      })
    } catch (err) {
      setIsConfirming(false)
      throw err
    }
  }

  const reset = () => {
    setIsConfirming(false)
  }

  return {
    purchaseTicket,
    hash,
    error,
    isPending,
    isWaitingForTx,
    isConfirmed,
    isConfirming,
    reset,
  }
}
