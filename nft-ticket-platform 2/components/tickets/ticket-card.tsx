import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, QrCode, Send, Eye, ExternalLink } from "lucide-react"

interface Ticket {
  id: string
  tokenId: string
  eventId: string
  eventName: string
  eventDate: string
  eventLocation: string
  purchasePrice: number
  purchaseDate: string
  status: "Active" | "Used" | "Expired"
  transferable: boolean
  imageUrl: string
  qrCode: string
}

interface TicketCardProps {
  ticket: Ticket
  compact?: boolean
}

export function TicketCard({ ticket, compact = false }: TicketCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Used":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Expired":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const isUpcoming = new Date(ticket.eventDate) > new Date()

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div
        className={`${compact ? "h-32" : "h-48"} bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center relative`}
      >
        <img
          src={ticket.imageUrl || "/placeholder.svg"}
          alt={ticket.eventName}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
        </div>
      </div>

      <CardHeader className={compact ? "pb-2" : ""}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className={`font-sans ${compact ? "text-base" : ""}`}>{ticket.eventName}</CardTitle>
            <CardDescription className="font-serif">
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">
                  {formatDate(ticket.eventDate)} at {formatTime(ticket.eventDate)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-3 w-3" />
                <span className="text-xs">{ticket.eventLocation}</span>
              </div>
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold">{ticket.purchasePrice} ZETA</div>
            <div className="text-xs text-muted-foreground">Token #{ticket.tokenId}</div>
          </div>
        </div>
      </CardHeader>

      {!compact && (
        <CardContent>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1">
              <QrCode className="h-3 w-3 mr-1" />
              Show QR
            </Button>

            {ticket.transferable && ticket.status === "Active" && (
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Send className="h-3 w-3 mr-1" />
                Transfer
              </Button>
            )}

            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              <Eye className="h-3 w-3 mr-1" />
              Details
            </Button>
          </div>

          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Purchased: {formatDate(ticket.purchaseDate)}</span>
              <Button variant="ghost" size="sm" className="h-auto p-0">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
