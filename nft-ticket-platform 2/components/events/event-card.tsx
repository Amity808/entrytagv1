import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"
import Link from "next/link"
import { PurchaseButton } from "@/components/tickets/purchase-button"

interface Event {
  id: string
  name: string
  description: string
  category: string
  startDate: string
  endDate: string
  location: string
  basePrice: number
  totalCapacity: number
  ticketsSold: number
  status: string
  imageUrl: string
}

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Sold Out":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "Cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "Completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
        <img src={event.imageUrl || "/placeholder.svg"} alt={event.name} className="w-full h-full object-cover" />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{event.category}</Badge>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{event.basePrice} ZETA</span>
            <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
          </div>
        </div>
        <CardTitle className="font-sans">{event.name}</CardTitle>
        <CardDescription className="font-serif">
          <div className="flex items-center gap-2 mt-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(event.startDate)}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Users className="h-4 w-4" />
            <span>
              {event.ticketsSold.toLocaleString()} / {event.totalCapacity.toLocaleString()} sold
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/events/${event.id}`}>View Details</Link>
          </Button>
          <PurchaseButton event={event} className="flex-1" />
        </div>
      </CardContent>
    </Card>
  )
}
