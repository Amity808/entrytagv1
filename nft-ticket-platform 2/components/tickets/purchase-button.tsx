"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { PurchaseModal } from "./purchase-modal"
import { useWallet } from "@/hooks/use-wallet"

interface Event {
  id: string
  name: string
  basePrice: number
  totalCapacity: number
  ticketsSold: number
  status: string
}

interface PurchaseButtonProps {
  event: Event
  className?: string
  onPurchaseSuccess?: (txHash: string) => void
}

export function PurchaseButton({ event, className, onPurchaseSuccess }: PurchaseButtonProps) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const { isConnected } = useWallet()

  const availableTickets = event.totalCapacity - event.ticketsSold
  const canPurchase = event.status === "Active" && availableTickets > 0

  const handleClick = () => {
    if (!isConnected) {
      // Could trigger wallet connection modal here
      return
    }
    setShowPurchaseModal(true)
  }

  if (!canPurchase) {
    return (
      <Button disabled className={className}>
        {event.status === "Sold Out" ? "Sold Out" : "Not Available"}
      </Button>
    )
  }

  return (
    <>
      <Button onClick={handleClick} className={className}>
        <Wallet className="h-4 w-4 mr-2" />
        {isConnected ? "Buy Ticket" : "Connect Wallet to Buy"}
      </Button>

      <PurchaseModal
        event={event}
        open={showPurchaseModal}
        onOpenChange={setShowPurchaseModal}
        onPurchaseSuccess={onPurchaseSuccess}
      />
    </>
  )
}
