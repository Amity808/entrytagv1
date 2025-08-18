"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { MarketplaceListingCard } from "@/components/marketplace-listing-card"
import { MarketplacePurchaseDialog } from "@/components/marketplace-purchase-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal, TrendingUp, ShoppingCart, Users, DollarSign } from "lucide-react"
import { mockMarketplaceListings } from "@/lib/mock-marketplace-data"
import type { EventCategory } from "@/lib/mock-data"
import type { MarketplaceListing } from "@/lib/mock-marketplace-data"

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | "All">("All")
  const [tierFilter, setTierFilter] = useState<"all" | "general" | "premium" | "vip">("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1])
  const [sortBy, setSortBy] = useState<"price_low" | "price_high" | "date" | "discount">("price_low")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null)
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false)

  const categories: (EventCategory | "All")[] = [
    "All",
    "Concert",
    "Sports",
    "Conference",
    "Theater",
    "Festival",
    "Exhibition",
    "Other",
  ]

  const filteredListings = useMemo(() => {
    const filtered = mockMarketplaceListings.filter((listing) => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        if (
          !listing.event.title.toLowerCase().includes(searchLower) &&
          !listing.event.venue.toLowerCase().includes(searchLower) &&
          !listing.event.location.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }

      // Category filter
      if (categoryFilter !== "All" && listing.event.category !== categoryFilter) {
        return false
      }

      // Tier filter
      if (tierFilter !== "all" && listing.tier !== tierFilter) {
        return false
      }

      // Price filter
      if (listing.listingPrice < priceRange[0] || listing.listingPrice > priceRange[1]) {
        return false
      }

      return true
    })

    // Sort listings
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price_low":
          return a.listingPrice - b.listingPrice
        case "price_high":
          return b.listingPrice - a.listingPrice
        case "date":
          return new Date(a.event.startTime).getTime() - new Date(b.event.startTime).getTime()
        case "discount":
          const discountA = ((a.originalPrice - a.listingPrice) / a.originalPrice) * 100
          const discountB = ((b.originalPrice - b.listingPrice) / b.originalPrice) * 100
          return discountB - discountA
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, categoryFilter, tierFilter, priceRange, sortBy])

  const handlePurchase = (listingId: string) => {
    const listing = mockMarketplaceListings.find((l) => l.id === listingId)
    if (listing) {
      setSelectedListing(listing)
      setPurchaseDialogOpen(true)
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setCategoryFilter("All")
    setTierFilter("all")
    setPriceRange([0, 1])
    setSortBy("price_low")
  }

  const activeFiltersCount = [
    searchQuery,
    categoryFilter !== "All",
    tierFilter !== "all",
    priceRange[0] > 0 || priceRange[1] < 1,
  ].filter(Boolean).length

  // Calculate marketplace stats
  const totalListings = mockMarketplaceListings.length
  const averagePrice = mockMarketplaceListings.reduce((sum, l) => sum + l.listingPrice, 0) / totalListings
  const totalVolume = mockMarketplaceListings.reduce((sum, l) => sum + l.listingPrice, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold font-sans">Secondary Marketplace</h1>
              <p className="text-xl text-muted-foreground font-serif max-w-2xl mx-auto">
                Buy and sell event tickets from other users. All transactions are secure and verified on the blockchain.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold font-sans">{totalListings}</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-serif">Active Listings</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-accent" />
                    <span className="text-2xl font-bold font-sans">{averagePrice.toFixed(3)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-serif">Average Price (ETH)</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold font-sans">{totalVolume.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-serif">Total Volume (ETH)</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold font-sans">24</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-serif">Active Sellers</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between font-sans">
                      <span>Filters</span>
                      {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                          Clear All
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Search */}
                    <div className="space-y-2">
                      <Label htmlFor="search" className="font-serif">
                        Search
                      </Label>
                      <Input
                        id="search"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label className="font-serif">Category</Label>
                      <Select
                        value={categoryFilter}
                        onValueChange={(value) => setCategoryFilter(value as EventCategory | "All")}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Ticket Tier */}
                    <div className="space-y-2">
                      <Label className="font-serif">Ticket Tier</Label>
                      <Select value={tierFilter} onValueChange={(value) => setTierFilter(value as any)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Tiers</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="vip">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-3">
                      <Label className="font-serif">Price Range (ETH)</Label>
                      <div className="px-2">
                        <Slider
                          value={priceRange}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                          max={1}
                          min={0}
                          step={0.01}
                          className="w-full"
                        />
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{priceRange[0].toFixed(2)} ETH</span>
                        <span>{priceRange[1].toFixed(2)} ETH</span>
                      </div>
                    </div>

                    {/* Sort By */}
                    <div className="space-y-2">
                      <Label className="font-serif">Sort By</Label>
                      <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="price_low">Price: Low to High</SelectItem>
                          <SelectItem value="price_high">Price: High to Low</SelectItem>
                          <SelectItem value="date">Event Date</SelectItem>
                          <SelectItem value="discount">Best Discount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Mobile Filters & Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-muted-foreground font-serif">
                    {filteredListings.length} listings found
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""} active
                      </Badge>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Mobile Filters */}
                  <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <SheetTrigger asChild className="lg:hidden">
                      <Button variant="outline" size="sm">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filters
                        {activeFiltersCount > 0 && (
                          <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <div className="p-6">{/* Mobile filters content - same as desktop */}</div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Listings Grid */}
              {filteredListings.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold font-sans mb-2">No listings found</h3>
                    <p className="text-muted-foreground font-serif mb-4">
                      Try adjusting your search criteria or check back later for new listings.
                    </p>
                    <Button variant="outline" onClick={clearFilters} className="bg-transparent">
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredListings.map((listing) => (
                    <MarketplaceListingCard key={listing.id} listing={listing} onPurchase={handlePurchase} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <MarketplacePurchaseDialog
        open={purchaseDialogOpen}
        onOpenChange={setPurchaseDialogOpen}
        listing={selectedListing}
      />
    </div>
  )
}
