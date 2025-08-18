import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Zap } from "lucide-react"
import { format } from "date-fns"
import type { Event } from "@/lib/mock-data"

interface EventCardProps {
  event: Event
  view?: "grid" | "list"
}

export function EventCard({ event, view = "grid" }: EventCardProps) {
  const soldPercentage = (event.soldTickets / event.totalTickets) * 100
  const isAlmostSoldOut = soldPercentage > 90
  const isSoldOut = soldPercentage >= 100

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy")
  }

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a")
  }

  if (view === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
        <CardContent className="p-0">
          <div className="flex">
            <div className="relative w-48 h-32 flex-shrink-0">
              <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
              {event.featured && (
                <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">Featured</Badge>
              )}
              {isSoldOut && <Badge className="absolute top-2 right-2 bg-destructive">Sold Out</Badge>}
              {isAlmostSoldOut && !isSoldOut && (
                <Badge className="absolute top-2 right-2 bg-orange-500 text-white">Almost Sold Out</Badge>
              )}
            </div>
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{event.category}</Badge>
                    <div className="flex gap-1">
                      {event.chains.slice(0, 2).map((chain) => (
                        <Badge key={chain} variant="secondary" className="text-xs">
                          {chain}
                        </Badge>
                      ))}
                      {event.chains.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{event.chains.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold font-sans">{event.title}</h3>
                  <p className="text-muted-foreground font-serif line-clamp-2">{event.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {event.basePrice} {event.currency}
                  </p>
                  <p className="text-sm text-muted-foreground">Starting at</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span className="font-serif">
                      {formatDate(event.startTime)} • {formatTime(event.startTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="font-serif">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="font-serif">{event.totalTickets - event.soldTickets} left</span>
                  </div>
                </div>
                <Link href={`/events/${event.id}`}>
                  <Button disabled={isSoldOut}>{isSoldOut ? "Sold Out" : "View Event"}</Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {event.featured && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
              <Zap className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {isSoldOut && <Badge className="absolute top-3 right-3 bg-destructive">Sold Out</Badge>}
          {isAlmostSoldOut && !isSoldOut && (
            <Badge className="absolute top-3 right-3 bg-orange-500 text-white">Almost Sold Out</Badge>
          )}
          <div className="absolute bottom-3 left-3 flex gap-1">
            {event.chains.slice(0, 2).map((chain) => (
              <Badge key={chain} variant="secondary" className="text-xs bg-background/90">
                {chain}
              </Badge>
            ))}
            {event.chains.length > 2 && (
              <Badge variant="secondary" className="text-xs bg-background/90">
                +{event.chains.length - 2}
              </Badge>
            )}
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline">{event.category}</Badge>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">
                {event.basePrice} {event.currency}
              </p>
              <p className="text-xs text-muted-foreground">Starting at</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold font-sans text-lg mb-1 line-clamp-1">{event.title}</h3>
            <p className="text-sm text-muted-foreground font-serif line-clamp-2">{event.description}</p>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="font-serif">
                {formatDate(event.startTime)} • {formatTime(event.startTime)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="font-serif">
                {event.venue}, {event.location}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="font-serif">{event.totalTickets - event.soldTickets} tickets available</span>
            </div>
          </div>

          <Link href={`/events/${event.id}`} className="block">
            <Button className="w-full" disabled={isSoldOut}>
              {isSoldOut ? "Sold Out" : "View Event"}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
