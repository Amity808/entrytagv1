"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { QrCode, Calendar, MapPin, Send, DollarSign, ExternalLink, Clock } from "lucide-react"
import { format, isAfter } from "date-fns"
import type { UserTicket } from "@/lib/mock-user-data"

interface TicketCardProps {
  ticket: UserTicket
  onTransfer?: (ticketId: string) => void
  onList?: (ticketId: string) => void
}

export function TicketCard({ ticket, onTransfer, onList }: TicketCardProps) {
  const [qrDialogOpen, setQrDialogOpen] = useState(false)

  const tierInfo = {
    general: { name: "General Admission", color: "bg-muted text-muted-foreground" },
    premium: { name: "Premium", color: "bg-accent text-accent-foreground" },
    vip: { name: "VIP Experience", color: "bg-primary text-primary-foreground" },
  }

  const statusInfo = {
    active: { label: "Active", color: "bg-green-100 text-green-800" },
    used: { label: "Used", color: "bg-gray-100 text-gray-800" },
    transferred: { label: "Transferred", color: "bg-blue-100 text-blue-800" },
    listed: { label: "Listed for Sale", color: "bg-orange-100 text-orange-800" },
  }

  const isTransferLocked = ticket.transferLockUntil && isAfter(new Date(ticket.transferLockUntil), new Date())
  const isEventPast = isAfter(new Date(), new Date(ticket.event.endTime))
  const canTransfer = ticket.status === "active" && !isTransferLocked && !isEventPast
  const canList = ticket.status === "active" && !isTransferLocked

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy")
  }

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a")
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={ticket.event.image || "/placeholder.svg"}
            alt={ticket.event.title}
            className="w-full h-32 object-cover"
          />
          <div className="absolute top-2 left-2">
            <Badge className={tierInfo[ticket.tier].color}>{tierInfo[ticket.tier].name}</Badge>
          </div>
          <div className="absolute top-2 right-2">
            <Badge className={statusInfo[ticket.status].color}>{statusInfo[ticket.status].label}</Badge>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h3 className="font-bold font-sans text-lg mb-1 line-clamp-1">{ticket.event.title}</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="font-serif">
                  {formatDate(ticket.event.startTime)} • {formatTime(ticket.event.startTime)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="font-serif">
                  {ticket.event.venue}, {ticket.event.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-muted-foreground font-serif">Purchase Price</p>
              <p className="font-semibold">
                {ticket.purchasePrice} {ticket.event.currency}
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground font-serif">Token ID</p>
              <p className="font-mono text-xs">{ticket.tokenId.slice(0, 10)}...</p>
            </div>
          </div>

          {isTransferLocked && (
            <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
              <Clock className="h-4 w-4 text-orange-600" />
              <p className="text-xs text-orange-800 font-serif">
                Transfer locked until {format(new Date(ticket.transferLockUntil!), "MMM dd, h:mm a")}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <QrCode className="h-4 w-4 mr-2" />
                  QR Code
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-sans">Ticket QR Code</DialogTitle>
                </DialogHeader>
                <div className="text-center space-y-4">
                  <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold font-sans">{ticket.event.title}</p>
                    <p className="text-sm text-muted-foreground font-serif">
                      {tierInfo[ticket.tier].name} • {formatDate(ticket.event.startTime)}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">Token: {ticket.tokenId}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {canTransfer && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTransfer?.(ticket.id)}
                className="flex-1 bg-transparent"
              >
                <Send className="h-4 w-4 mr-2" />
                Transfer
              </Button>
            )}

            {canList && (
              <Button variant="outline" size="sm" onClick={() => onList?.(ticket.id)} className="flex-1 bg-transparent">
                <DollarSign className="h-4 w-4 mr-2" />
                List for Sale
              </Button>
            )}

            <Button variant="ghost" size="sm" className="px-2">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
