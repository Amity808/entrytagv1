"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Wallet, AlertCircle, ExternalLink } from "lucide-react"
import { useWallet } from "@/lib/wallet-context"
import type { Event } from "@/lib/mock-data"
import type { TicketTier } from "@/components/ticket-selector"

interface TicketSelection {
  tier: TicketTier
  quantity: number
  price: number
}

interface PurchaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: Event
  selections: TicketSelection[]
  total: number
  promoDiscount?: number
}

type PurchaseStep = "confirm" | "processing" | "success" | "error"

export function PurchaseDialog({
  open,
  onOpenChange,
  event,
  selections,
  total,
  promoDiscount = 0,
}: PurchaseDialogProps) {
  const [step, setStep] = useState<PurchaseStep>("confirm")
  const [transactionHash, setTransactionHash] = useState<string>("")
  const [error, setError] = useState<string>("")
  const { address, isConnected } = useWallet()

  const tierNames = {
    general: "General Admission",
    premium: "Premium",
    vip: "VIP Experience",
  }

  const handlePurchase = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first")
      setStep("error")
      return
    }

    setStep("processing")
    setError("")

    try {
      // Simulate transaction processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock transaction hash
      const mockTxHash = "0x" + Math.random().toString(16).substr(2, 64)
      setTransactionHash(mockTxHash)
      setStep("success")
    } catch (err: any) {
      setError(err.message || "Transaction failed")
      setStep("error")
    }
  }

  const resetDialog = () => {
    setStep("confirm")
    setError("")
    setTransactionHash("")
  }

  const handleClose = () => {
    resetDialog()
    onOpenChange(false)
  }

  const totalTickets = selections.reduce((sum, selection) => sum + selection.quantity, 0)
  const estimatedGasFee = 0.002 // Mock gas fee

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-sans">
            {step === "confirm" && "Confirm Purchase"}
            {step === "processing" && "Processing Transaction"}
            {step === "success" && "Purchase Successful!"}
            {step === "error" && "Transaction Failed"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {step === "confirm" && (
            <>
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold font-sans">{event.title}</h3>
                      <p className="text-sm text-muted-foreground font-serif">
                        {event.venue}, {event.location}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {event.category}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    {selections.map((selection, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="font-serif">
                          {tierNames[selection.tier]} × {selection.quantity}
                        </span>
                        <span className="font-semibold">
                          {(selection.quantity * selection.price).toFixed(3)} {event.currency}
                        </span>
                      </div>
                    ))}

                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="font-serif">Discount ({promoDiscount}%)</span>
                        <span className="font-semibold">
                          -{(total / (1 - promoDiscount / 100) - total).toFixed(3)} {event.currency}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span className="font-serif">Estimated Gas Fee</span>
                      <span>{estimatedGasFee} ETH</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span className="font-sans">Total</span>
                      <span>
                        {total.toFixed(3)} {event.currency}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wallet className="h-4 w-4" />
                  <span className="font-serif">
                    Paying with: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
                  </span>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-serif">
                    <strong>Important:</strong> Your tickets will be minted as NFTs and transferred to your wallet.
                    There is a 24-hour transfer lock after purchase for security.
                  </p>
                </div>
              </div>

              <Button onClick={handlePurchase} className="w-full" size="lg" disabled={!isConnected}>
                {isConnected
                  ? `Purchase ${totalTickets} Ticket${totalTickets > 1 ? "s" : ""}`
                  : "Connect Wallet to Purchase"}
              </Button>
            </>
          )}

          {step === "processing" && (
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Clock className="h-8 w-8 text-primary animate-spin" />
                </div>
                <div>
                  <h3 className="font-semibold font-sans mb-2">Processing Your Purchase</h3>
                  <p className="text-sm text-muted-foreground font-serif">
                    Please confirm the transaction in your wallet and wait for blockchain confirmation.
                  </p>
                </div>
              </div>

              <Progress value={66} className="w-full" />

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-serif">Transaction submitted</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 animate-spin" />
                  <span className="font-serif">Waiting for confirmation...</span>
                </div>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold font-sans mb-2">Tickets Purchased Successfully!</h3>
                  <p className="text-sm text-muted-foreground font-serif">
                    Your NFT tickets have been minted and transferred to your wallet.
                  </p>
                </div>
              </div>

              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-serif">Transaction Hash:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs">
                        {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                      </span>
                      <Button variant="ghost" size="sm" className="h-auto p-1">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-serif">Tickets Purchased:</span>
                    <span className="font-semibold">{totalTickets}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-serif">Total Paid:</span>
                    <span className="font-semibold">
                      {total.toFixed(3)} {event.currency}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button onClick={handleClose} className="w-full">
                  View My Tickets
                </Button>
                <Button variant="outline" onClick={handleClose} className="w-full bg-transparent">
                  Continue Browsing
                </Button>
              </div>
            </div>
          )}

          {step === "error" && (
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold font-sans mb-2">Transaction Failed</h3>
                  <p className="text-sm text-muted-foreground font-serif">{error}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button onClick={() => setStep("confirm")} className="w-full">
                  Try Again
                </Button>
                <Button variant="outline" onClick={handleClose} className="w-full bg-transparent">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
