import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Users, Share2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PurchaseButton } from "@/components/tickets/purchase-button"

// Mock data - in a real app, this would come from your database
const mockEvents = {
  "1": {
    id: "1",
    name: "Summer Music Festival",
    description:
      "A three-day music festival featuring top artists from around the world. Experience incredible performances, food trucks, and a vibrant community atmosphere in the heart of Central Park.",
    category: "Concert",
    startDate: "2024-07-15T18:00:00Z",
    endDate: "2024-07-17T23:00:00Z",
    location: "Central Park, NYC",
    basePrice: 50,
    totalCapacity: 2000,
    ticketsSold: 1250,
    status: "Active",
    imageUrl: "/placeholder.svg?height=400&width=800",
    organizer: "NYC Events Co.",
    features: [
      "3 days of live music",
      "20+ artists performing",
      "Food and beverage vendors",
      "VIP viewing areas available",
      "Free parking included",
    ],
  },
}

interface EventDetailPageProps {
  params: {
    id: string
  }
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const event = mockEvents[params?.id as keyof typeof mockEvents]

  if (!event) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
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

  const availableTickets = event.totalCapacity - event.ticketsSold
  const soldOutPercentage = (event.ticketsSold / event.totalCapacity) * 100

  const handlePurchaseSuccess = (txHash: string) => {
    // Redirect to dashboard or show success message
    console.log("Purchase successful:", txHash)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-accent/20 to-primary/20">
              <img src={event.imageUrl || "/placeholder.svg"} alt={event.name} className="w-full h-full object-cover" />
            </div>

            {/* Event Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{event.category}</Badge>
                <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4 font-sans">{event.name}</h1>
              <p className="text-lg text-muted-foreground font-serif leading-relaxed">{event.description}</p>
            </div>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sans">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-semibold">{formatDate(event.startDate)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(event.startDate)} - {formatTime(event.endDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-semibold">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-semibold">
                      {event.ticketsSold.toLocaleString()} / {event.totalCapacity.toLocaleString()} tickets sold
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {availableTickets.toLocaleString()} tickets remaining
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            {event.features && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-sans">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {event.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent rounded-full" />
                        <span className="font-serif">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="font-sans">Get Your Ticket</CardTitle>
                <CardDescription className="font-serif">Secure your spot with an NFT ticket</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{event.basePrice} ZETA</div>
                  <p className="text-sm text-muted-foreground">per ticket</p>
                </div>

                <Separator />

                {/* Availability Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Availability</span>
                    <span>{Math.round(soldOutPercentage)}% sold</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${soldOutPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {availableTickets.toLocaleString()} of {event.totalCapacity.toLocaleString()} remaining
                  </p>
                </div>

                <Separator />

                <PurchaseButton event={event} className="w-full" onPurchaseSuccess={handlePurchaseSuccess} />

                <Button variant="outline" className="w-full bg-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Event
                </Button>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sans">Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{event.organizer}</p>
                <p className="text-sm text-muted-foreground font-serif mt-1">Verified event organizer</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
