"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { PurchaseModal } from "./purchase-modal"
import { useWallet } from "@/hooks/use-wallet"
import { useAccount } from "wagmi"

interface Event {
  id: string
  name: string
  basePrice: number
  totalCapacity: number
  ticketsSold: number
  status: string | number
}

interface PurchaseButtonProps {
  event: Event
  className?: string
  onPurchaseSuccess?: (txHash: string) => void
}

export function PurchaseButton({ event, className, onPurchaseSuccess }: PurchaseButtonProps) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

  const { isConnected } = useAccount()

  const availableTickets = event.totalCapacity - event.ticketsSold

  // Handle numeric status enum values: 0=Created, 1=Active, 2=SoldOut, 3=Cancelled, 4=Completed
  const isBlockedStatus = (status: number | string) => {
    if (typeof status === 'number') {
      // Block status 2 (SoldOut), 3 (Cancelled), 4 (Completed)
      return status === 2 || status === 3 || status === 4;
    } else {
      // Handle string status for backward compatibility
      const blockedStatuses = ["SoldOut", "Cancelled", "Completed"];
      return blockedStatuses.includes(status);
    }
  };

  const canPurchase = !isBlockedStatus(event.status) && availableTickets > 0;

  // Debug logging
  console.log("PurchaseButton Debug:", {
    eventId: event.id,
    eventStatus: event.status,
    statusType: typeof event.status,
    totalCapacity: event.totalCapacity,
    ticketsSold: event.ticketsSold,
    availableTickets,
    canPurchase,
    isBlocked: isBlockedStatus(event.status)
  });

  const handleClick = () => {
    if (!isConnected) {
      // Could trigger wallet connection modal here
      return
    }
    setShowPurchaseModal(true)
  }

  if (!canPurchase) {
    let buttonText = "Not Available";

    if (typeof event.status === 'number') {
      // Handle numeric status
      switch (event.status) {
        case 2: buttonText = "Sold Out"; break;
        case 3: buttonText = "Cancelled"; break;
        case 4: buttonText = "Completed"; break;
        default: buttonText = availableTickets <= 0 ? "No Tickets Available" : "Not Available";
      }
    } else {
      // Handle string status
      if (event.status === "SoldOut") {
        buttonText = "Sold Out";
      } else if (["Cancelled", "Completed"].includes(event.status)) {
        buttonText = event.status;
      } else if (availableTickets <= 0) {
        buttonText = "No Tickets Available";
      }
    }

    return (
      <Button disabled className={className}>
        {buttonText}
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
