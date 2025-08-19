import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Ticket, Shield } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground font-sans">ZetaTickets</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/events" className="text-muted-foreground hover:text-foreground transition-colors">
              Events
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            Built on ZetaChain
          </Badge>
          <h2 className="text-5xl font-bold text-foreground mb-6 font-sans">Universal NFT Event Tickets</h2>
          <p className="text-xl text-muted-foreground mb-8 font-serif leading-relaxed">
            Create, buy, and manage event tickets as NFTs across multiple blockchain networks. Secure, transferable, and
            truly yours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/events">Browse Events</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent" asChild>
              <Link href="/events/create">Create Event</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center mb-12 font-sans">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Calendar className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle className="font-sans">Create Events</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-serif">
                  Event organizers can easily create events with customizable ticket types, pricing, and capacity
                  limits.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Ticket className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle className="font-sans">Buy NFT Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-serif">
                  Purchase tickets as NFTs using ZETA tokens. Each ticket is unique, verifiable, and stored on the
                  blockchain.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle className="font-sans">Secure & Transferable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="font-serif">
                  Your tickets are secured by blockchain technology and can be transferred or resold if the event allows
                  it.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Events Preview */}
      <section id="events" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-bold font-sans">Featured Events</h3>
            <Button variant="outline" asChild>
              <Link href="/events">View All Events</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Event Cards */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=200&width=400"
                  alt="Concert Event"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Concert</Badge>
                  <span className="text-sm text-muted-foreground">50 ZETA</span>
                </div>
                <CardTitle className="font-sans">Summer Music Festival</CardTitle>
                <CardDescription className="font-serif">
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4" />
                    <span>July 15, 2024</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>Central Park, NYC</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="h-4 w-4" />
                    <span>1,250 / 2,000 sold</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Buy Ticket</Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=200&width=400"
                  alt="Tech Conference"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Conference</Badge>
                  <span className="text-sm text-muted-foreground">25 ZETA</span>
                </div>
                <CardTitle className="font-sans">Blockchain Summit 2024</CardTitle>
                <CardDescription className="font-serif">
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4" />
                    <span>Aug 20-22, 2024</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>Convention Center, SF</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="h-4 w-4" />
                    <span>800 / 1,500 sold</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Buy Ticket</Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=200&width=400"
                  alt="Art Exhibition"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Exhibition</Badge>
                  <span className="text-sm text-muted-foreground">15 ZETA</span>
                </div>
                <CardTitle className="font-sans">Digital Art Showcase</CardTitle>
                <CardDescription className="font-serif">
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4" />
                    <span>Sep 1-30, 2024</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>Modern Art Museum</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="h-4 w-4" />
                    <span>300 / 500 sold</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Buy Ticket</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Ticket className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold font-sans">ZetaTickets</span>
              </div>
              <p className="text-muted-foreground font-serif">The future of event ticketing on the blockchain.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-sans">Platform</h4>
              <ul className="space-y-2 text-muted-foreground font-serif">
                <li>
                  <Link href="/events" className="hover:text-foreground transition-colors">
                    Browse Events
                  </Link>
                </li>
                <li>
                  <Link href="/events/create" className="hover:text-foreground transition-colors">
                    Create Event
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-foreground transition-colors">
                    My Tickets
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-sans">Support</h4>
              <ul className="space-y-2 text-muted-foreground font-serif">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-sans">Legal</h4>
              <ul className="space-y-2 text-muted-foreground font-serif">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground font-serif">
            <p>&copy; 2024 ZetaTickets. Built on ZetaChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
