import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Shield, Zap, Globe } from "lucide-react"

export function HeroSection() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Electronic Music Festival",
      date: "Dec 15, 2024",
      location: "Los Angeles, CA",
      price: "0.05 ETH",
      category: "Concert",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "Tech Conference 2024",
      date: "Dec 20, 2024",
      location: "San Francisco, CA",
      price: "0.08 ETH",
      category: "Conference",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Basketball Championship",
      date: "Dec 22, 2024",
      location: "New York, NY",
      price: "0.12 ETH",
      category: "Sports",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <section className="relative py-20 lg:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                Powered by ZetaChain
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold font-sans leading-tight">
                The Future of
                <span className="text-primary block">Event Tickets</span>
              </h1>
              <p className="text-xl text-muted-foreground font-serif leading-relaxed">
                Buy, sell, and transfer event tickets as NFTs across multiple blockchains. Secure, transparent, and
                truly yours.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8">
                Browse Events
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Create Event
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold font-sans">Secure NFTs</h3>
                  <p className="text-sm text-muted-foreground font-serif">Blockchain verified</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold font-sans">Cross-Chain</h3>
                  <p className="text-sm text-muted-foreground font-serif">Multiple networks</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold font-sans">Instant Transfer</h3>
                  <p className="text-sm text-muted-foreground font-serif">Fast & reliable</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold font-sans">Easy Management</h3>
                  <p className="text-sm text-muted-foreground font-serif">Simple dashboard</p>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Events */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold font-sans mb-2">Featured Events</h2>
              <p className="text-muted-foreground font-serif">Discover upcoming events as NFT tickets</p>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="flex">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-24 h-24 object-cover"
                      />
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <Badge variant="outline" className="text-xs">
                              {event.category}
                            </Badge>
                            <h3 className="font-semibold font-sans">{event.title}</h3>
                            <p className="text-sm text-muted-foreground font-serif">
                              {event.date} • {event.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">{event.price}</p>
                            <p className="text-xs text-muted-foreground">Starting at</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
