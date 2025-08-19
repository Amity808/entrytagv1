"use client"

import { useState } from "react"
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Wallet, AlertTriangle, CheckCircle, XCircle, ExternalLink } from "lucide-react"

interface Event {
  id: string
  name: string
  basePrice: number
  totalCapacity: number
  ticketsSold: number
  status: string
}

interface PurchaseModalProps {
  event: Event
  open: boolean
  onOpenChange: (open: boolean) => void
  onPurchaseSuccess?: (txHash: string) => void
}

// Mock contract ABI - in a real app, this would be the actual NFT contract ABI
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

const MOCK_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"

export function PurchaseModal({ event, open, onOpenChange, onPurchaseSuccess }: PurchaseModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [isWaitingForTx, setIsWaitingForTx] = useState(false)

  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const { writeContract, data: hash, error, isPending } = useWriteContract()

  const { isLoading, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const totalPrice = event.basePrice * quantity
  const availableTickets = event.totalCapacity - event.ticketsSold
  const hasInsufficientBalance = balance ? Number.parseFloat(balance.formatted) < totalPrice : true

  const handlePurchase = async () => {
    if (!isConnected || !address) return

    setIsWaitingForTx(true)

    try {
      await writeContract({
        address: MOCK_CONTRACT_ADDRESS,
        abi: mockContractABI,
        functionName: "purchaseTicket",
        args: [BigInt(event.id), BigInt(quantity)],
        value: parseEther(totalPrice.toString()),
      })
    } catch (err) {
      console.error("Purchase failed:", err)
      setIsWaitingForTx(false)
    }
  }

  const handleClose = () => {
    if (!isPending && !isWaitingForTx) {
      onOpenChange(false)
      setQuantity(1)
      setIsWaitingForTx(false)
    }
  }

  const getTransactionUrl = (hash: string) => {
    // This would be dynamic based on the current chain
    return `https://athens.explorer.zetachain.com/tx/${hash}`
  }

  // Success state
  if (isConfirmed && hash) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <DialogTitle className="font-sans">Purchase Successful!</DialogTitle>
            </div>
            <DialogDescription className="font-serif">
              Your NFT ticket has been successfully purchased and minted to your wallet.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{event.name}</h4>
              <div className="flex justify-between text-sm">
                <span>Quantity:</span>
                <span>
                  {quantity} ticket{quantity > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Paid:</span>
                <span>{totalPrice} ZETA</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                onClick={() => window.open(getTransactionUrl(hash), "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Transaction
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={() => {
                  onPurchaseSuccess?.(hash)
                  handleClose()
                }}
              >
                View My Tickets
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Error state
  if (error) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-destructive" />
              <DialogTitle className="font-sans">Purchase Failed</DialogTitle>
            </div>
            <DialogDescription className="font-serif">
              There was an error processing your transaction.
            </DialogDescription>
          </DialogHeader>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error.message || "Transaction failed. Please try again."}</AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                setIsWaitingForTx(false)
                // Reset error state would go here
              }}
            >
              Try Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Transaction pending state
  if (isPending || isLoading) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
              <DialogTitle className="font-sans">
                {isPending ? "Confirm Transaction" : "Processing Purchase"}
              </DialogTitle>
            </div>
            <DialogDescription className="font-serif">
              {isPending
                ? "Please confirm the transaction in your wallet."
                : "Your transaction is being processed on the blockchain."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{event.name}</h4>
              <div className="flex justify-between text-sm">
                <span>Quantity:</span>
                <span>
                  {quantity} ticket{quantity > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total:</span>
                <span>{totalPrice} ZETA</span>
              </div>
            </div>

            {hash && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Transaction Hash:</p>
                <Button variant="outline" size="sm" onClick={() => window.open(getTransactionUrl(hash), "_blank")}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Explorer
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Main purchase modal
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-sans">Purchase Tickets</DialogTitle>
          <DialogDescription className="font-serif">Buy NFT tickets for {event.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quantity Selection */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={Math.min(10, availableTickets)}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="text-center"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.min(availableTickets, quantity + 1))}
                disabled={quantity >= Math.min(10, availableTickets)}
              >
                +
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Maximum 10 tickets per transaction. {availableTickets} available.
            </p>
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Price per ticket:</span>
              <span>{event.basePrice} ZETA</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity:</span>
              <span>{quantity}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>{totalPrice} ZETA</span>
            </div>
          </div>

          <Separator />

          {/* Wallet Info */}
          {isConnected ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Your balance:</span>
                <span>
                  {balance ? Number.parseFloat(balance.formatted).toFixed(4) : "0.00"} {balance?.symbol || "ZETA"}
                </span>
              </div>
              {hasInsufficientBalance && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Insufficient balance. You need {totalPrice} ZETA to complete this purchase.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <Alert>
              <Wallet className="h-4 w-4" />
              <AlertDescription>Please connect your wallet to purchase tickets.</AlertDescription>
            </Alert>
          )}

          {/* Purchase Button */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handlePurchase}
              disabled={!isConnected || hasInsufficientBalance || isPending || isLoading}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Purchase for {totalPrice} ZETA
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
