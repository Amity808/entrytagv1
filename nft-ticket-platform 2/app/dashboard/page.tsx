"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Ticket, Wallet } from "lucide-react"
import Link from "next/link"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { WalletBalance } from "@/components/wallet/wallet-balance"
import { TicketCard } from "@/components/tickets/ticket-card"
import { TransactionHistory } from "@/components/dashboard/transaction-history"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { useAccount } from "wagmi"

// Mock data for user tickets
const mockUserTickets = [
  {
    id: "ticket-1",
    tokenId: "1001",
    eventId: "1",
    eventName: "Summer Music Festival",
    eventDate: "2024-07-15T18:00:00Z",
    eventLocation: "Central Park, NYC",
    purchasePrice: 50,
    purchaseDate: "2024-06-01T10:30:00Z",
    status: "Active",
    transferable: true,
    imageUrl: "/placeholder.svg?height=200&width=300",
    qrCode: "QR123456789",
  },
  {
    id: "ticket-2",
    tokenId: "1002",
    eventId: "2",
    eventName: "Blockchain Summit 2024",
    eventDate: "2024-08-20T09:00:00Z",
    eventLocation: "Convention Center, SF",
    purchasePrice: 25,
    purchaseDate: "2024-06-15T14:20:00Z",
    status: "Active",
    transferable: true,
    imageUrl: "/placeholder.svg?height=200&width=300",
    qrCode: "QR987654321",
  },
  {
    id: "ticket-3",
    tokenId: "1003",
    eventId: "4",
    eventName: "Tech Startup Pitch Night",
    eventDate: "2024-06-30T19:00:00Z",
    eventLocation: "Innovation Hub, Austin",
    purchasePrice: 20,
    purchaseDate: "2024-06-25T16:45:00Z",
    status: "Used",
    transferable: false,
    imageUrl: "/placeholder.svg?height=200&width=300",
    qrCode: "QR456789123",
  },
]

// Mock data for recommended events
const mockRecommendedEvents = [
  {
    id: "5",
    name: "Jazz Night Under the Stars",
    category: "Concert",
    date: "2024-09-15T20:00:00Z",
    location: "Rooftop Venue, NYC",
    price: 35,
    imageUrl: "/placeholder.svg?height=150&width=250",
  },
  {
    id: "6",
    name: "Web3 Developer Conference",
    category: "Conference",
    date: "2024-10-05T09:00:00Z",
    location: "Tech Center, SF",
    price: 45,
    imageUrl: "/placeholder.svg?height=150&width=250",
  },
]

export default function DashboardPage() {
  const { isConnected, address } = useAccount()
  const [activeTab, setActiveTab] = useState("overview")

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Ticket className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground font-sans">ZetaTickets</span>
            </Link>
            <ConnectButton />
          </div>
        </header>

        {/* Connect Wallet Prompt */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4 font-sans">Connect Your Wallet</h1>
            <p className="text-lg text-muted-foreground mb-8 font-serif">
              Connect your wallet to view your NFT tickets and manage your account.
            </p>
            <ConnectButton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Ticket className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground font-sans">ZetaTickets</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/events">Browse Events</Link>
            </Button>
            <ConnectButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 font-sans">My Dashboard</h1>
          <p className="text-lg text-muted-foreground font-serif">Manage your NFT tickets and view your activity</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <DashboardStats tickets={mockUserTickets} />

            {/* Wallet Balance */}
            <WalletBalance />

            {/* Recent Tickets */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-sans">Recent Tickets</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("tickets")}>
                    View All
                  </Button>
                </div>
                <CardDescription className="font-serif">Your latest NFT ticket purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {mockUserTickets.slice(0, 2).map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} compact />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Events */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sans">Recommended for You</CardTitle>
                <CardDescription className="font-serif">Events you might be interested in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {mockRecommendedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        <img
                          src={event.imageUrl || "/placeholder.svg"}
                          alt={event.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{event.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(event.date).toLocaleDateString()} • {event.location}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{event.category}</Badge>
                            <span className="text-sm font-semibold">{event.price} ZETA</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-3" asChild>
                        <Link href={`/events/${event.id}`}>View Event</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-sans">My Tickets ({mockUserTickets.length})</h2>
              <Button asChild>
                <Link href="/events">Buy More Tickets</Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockUserTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>

            {mockUserTickets.length === 0 && (
              <div className="text-center py-12">
                <Ticket className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No tickets yet</h3>
                <p className="text-muted-foreground mb-6">Start by purchasing your first NFT ticket</p>
                <Button asChild>
                  <Link href="/events">Browse Events</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <h2 className="text-2xl font-bold font-sans">Transaction History</h2>
            <TransactionHistory />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold font-sans">Account Settings</h2>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-sans">Wallet Information</CardTitle>
                  <CardDescription className="font-serif">Your connected wallet details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Wallet Address:</span>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{address}</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Network:</span>
                    <Badge variant="secondary">ZetaChain</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-sans">Preferences</CardTitle>
                  <CardDescription className="font-serif">Customize your experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Email notifications</span>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Privacy settings</span>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
