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

  // Convert to numbers and ensure they're valid
  const totalCapacity = typeof event.totalCapacity === 'bigint' ? Number(event.totalCapacity) : event.totalCapacity
  const ticketsSold = typeof event.ticketsSold === 'bigint' ? Number(event.ticketsSold) : event.ticketsSold

  const availableTickets = totalCapacity - ticketsSold

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
    totalCapacity: totalCapacity,
    ticketsSold: ticketsSold,
    availableTickets,
    canPurchase,
    isBlocked: isBlockedStatus(event.status),
    rawTotalCapacity: event.totalCapacity,
    rawTicketsSold: event.ticketsSold,
    hasContractBug: totalCapacity === 0 && ticketsSold === 0,
    contractBugWarning: totalCapacity === 0 ? "⚠️ CONTRACT BUG: totalTickets was never set!" : "✅ Contract working correctly"
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
