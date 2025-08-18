"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { TicketSelector, type TicketTier } from "@/components/ticket-selector"
import { PurchaseDialog } from "@/components/purchase-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, Share2, Heart, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { mockEvents } from "@/lib/mock-data"

interface TicketSelection {
  tier: TicketTier
  quantity: number
  price: number
}

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params.id as string
  const event = mockEvents.find((e) => e.id === eventId)

  const [ticketSelections, setTicketSelections] = useState<TicketSelection[]>([])
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false)

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold font-sans mb-4">Event Not Found</h1>
            <p className="text-muted-foreground font-serif">The event you're looking for doesn't exist.</p>
          </div>
        </main>
      </div>
    )
  }

  const totalTickets = ticketSelections.reduce((sum, selection) => sum + selection.quantity, 0)
  const totalPrice = ticketSelections.reduce((sum, selection) => sum + selection.quantity * selection.price, 0)
  const soldPercentage = (event.soldTickets / event.totalTickets) * 100

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEEE, MMMM dd, yyyy")
  }

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="relative">
              <img
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-64 md:h-80 object-cover rounded-lg"
              />
              {event.featured && (
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">Featured Event</Badge>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button variant="outline" size="sm" className="bg-background/90">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="bg-background/90">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Event Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{event.category}</Badge>
                  <div className="flex gap-1">
                    {event.chains.map((chain) => (
                      <Badge key={chain} variant="secondary" className="text-xs">
                        {chain}
                      </Badge>
                    ))}
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold font-sans mb-4">{event.title}</h1>
                <p className="text-lg text-muted-foreground font-serif leading-relaxed">{event.description}</p>
              </div>

              {/* Event Details */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold font-sans mb-4">Event Details</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-semibold font-sans">Date & Time</p>
                          <p className="text-muted-foreground font-serif">{formatDate(event.startTime)}</p>
                          <p className="text-muted-foreground font-serif">
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-semibold font-sans">Venue</p>
                          <p className="text-muted-foreground font-serif">{event.venue}</p>
                          <p className="text-muted-foreground font-serif">{event.location}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-semibold font-sans">Capacity</p>
                          <p className="text-muted-foreground font-serif">
                            {event.totalTickets - event.soldTickets} of {event.totalTickets} tickets available
                          </p>
                          <div className="w-full bg-muted rounded-full h-2 mt-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${soldPercentage}%` }} />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-semibold font-sans">Organizer</p>
                          <p className="text-muted-foreground font-serif">{event.organizer}</p>
                          <Button variant="link" className="p-0 h-auto text-primary">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold font-sans mb-4">Important Information</h2>
                  <div className="space-y-3 text-sm text-muted-foreground font-serif">
                    <p>• Tickets are minted as NFTs on the blockchain and transferred to your wallet</p>
                    <p>• There is a 24-hour transfer lock after purchase for security purposes</p>
                    <p>• Tickets can be resold on the secondary market after the lock period</p>
                    <p>• Please arrive at least 30 minutes before the event start time</p>
                    <p>• Valid ID required for entry</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar - Ticket Selection */}
          <div className="space-y-6">
            <div className="sticky top-24">
              <TicketSelector event={event} onSelectionChange={setTicketSelections} />

              {totalTickets > 0 && (
                <Card className="mt-6">
                  <CardContent className="p-4">
                    <Button onClick={() => setPurchaseDialogOpen(true)} className="w-full" size="lg">
                      Purchase {totalTickets} Ticket{totalTickets > 1 ? "s" : ""} - {totalPrice.toFixed(3)}{" "}
                      {event.currency}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <PurchaseDialog
        open={purchaseDialogOpen}
        onOpenChange={setPurchaseDialogOpen}
        event={event}
        selections={ticketSelections}
        total={totalPrice}
      />
    </div>
  )
}
