"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import { EventCard } from "@/components/events/event-card"
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button"

// Mock data for events
const mockEvents = [
  {
    id: "1",
    name: "Summer Music Festival",
    description: "A three-day music festival featuring top artists from around the world.",
    category: "Concert",
    startDate: "2024-07-15T18:00:00Z",
    endDate: "2024-07-17T23:00:00Z",
    location: "Central Park, NYC",
    basePrice: 50,
    totalCapacity: 2000,
    ticketsSold: 1250,
    status: "Active",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "2",
    name: "Blockchain Summit 2024",
    description: "The premier blockchain and cryptocurrency conference.",
    category: "Conference",
    startDate: "2024-08-20T09:00:00Z",
    endDate: "2024-08-22T17:00:00Z",
    location: "Convention Center, SF",
    basePrice: 25,
    totalCapacity: 1500,
    ticketsSold: 800,
    status: "Active",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "3",
    name: "Digital Art Showcase",
    description: "Explore the future of digital art and NFTs.",
    category: "Exhibition",
    startDate: "2024-09-01T10:00:00Z",
    endDate: "2024-09-30T18:00:00Z",
    location: "Modern Art Museum",
    basePrice: 15,
    totalCapacity: 500,
    ticketsSold: 300,
    status: "Active",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "4",
    name: "Tech Startup Pitch Night",
    description: "Watch innovative startups pitch their ideas to investors.",
    category: "Other",
    startDate: "2024-06-30T19:00:00Z",
    endDate: "2024-06-30T22:00:00Z",
    location: "Innovation Hub, Austin",
    basePrice: 20,
    totalCapacity: 200,
    ticketsSold: 200,
    status: "Sold Out",
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
]

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "0-25" && event.basePrice <= 25) ||
      (priceRange === "25-50" && event.basePrice > 25 && event.basePrice <= 50) ||
      (priceRange === "50+" && event.basePrice > 50)

    return matchesSearch && matchesCategory && matchesPrice
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground font-sans">ZetaTickets</span>
          </Link>
          <div className="flex items-center gap-4">
            <WalletConnectButton />
            <Button asChild>
              <Link href="/events/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 font-sans">Browse Events</h1>
          <p className="text-lg text-muted-foreground font-serif">
            Discover amazing events and purchase NFT tickets on the blockchain
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Concert">Concert</SelectItem>
                <SelectItem value="Conference">Conference</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Theater">Theater</SelectItem>
                <SelectItem value="Festival">Festival</SelectItem>
                <SelectItem value="Exhibition">Exhibition</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-25">0-25 ZETA</SelectItem>
                <SelectItem value="25-50">25-50 ZETA</SelectItem>
                <SelectItem value="50+">50+ ZETA</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground font-serif">
            Showing {filteredEvents.length} of {mockEvents.length} events
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground font-serif mb-4">No events found matching your criteria</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setPriceRange("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
