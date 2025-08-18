"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { EventCard } from "@/components/event-card"
import { EventFiltersComponent, type EventFilters } from "@/components/event-filters"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Grid, List, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { mockEvents } from "@/lib/mock-data"

export default function EventsPage() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<EventFilters>({
    search: "",
    category: "All",
    location: "",
    priceRange: [0, 1],
    dateRange: { from: undefined, to: undefined },
    chains: [],
    sortBy: "date",
  })

  const filteredEvents = useMemo(() => {
    const filtered = mockEvents.filter((event) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (
          !event.title.toLowerCase().includes(searchLower) &&
          !event.venue.toLowerCase().includes(searchLower) &&
          !event.organizer.toLowerCase().includes(searchLower) &&
          !event.location.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }

      // Category filter
      if (filters.category !== "All" && event.category !== filters.category) {
        return false
      }

      // Location filter
      if (filters.location && !event.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false
      }

      // Price filter
      if (event.basePrice < filters.priceRange[0] || event.basePrice > filters.priceRange[1]) {
        return false
      }

      // Date filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const eventDate = new Date(event.startTime)
        if (filters.dateRange.from && eventDate < filters.dateRange.from) {
          return false
        }
        if (filters.dateRange.to && eventDate > filters.dateRange.to) {
          return false
        }
      }

      // Chain filter
      if (filters.chains.length > 0) {
        if (!filters.chains.some((chain) => event.chains.includes(chain))) {
          return false
        }
      }

      return true
    })

    // Sort events
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "date":
          return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        case "price":
          return a.basePrice - b.basePrice
        case "popularity":
          return b.soldTickets - a.soldTickets
        default:
          return 0
      }
    })

    return filtered
  }, [filters])

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "All",
      location: "",
      priceRange: [0, 1],
      dateRange: { from: undefined, to: undefined },
      chains: [],
      sortBy: "date",
    })
  }

  const activeFiltersCount = [
    filters.search,
    filters.category !== "All",
    filters.location,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 1,
    filters.dateRange.from || filters.dateRange.to,
    filters.chains.length > 0,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <EventFiltersComponent filters={filters} onFiltersChange={setFilters} onClearFilters={clearFilters} />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold font-sans">Discover Events</h1>
                <p className="text-muted-foreground font-serif">
                  {filteredEvents.length} events found
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
                    <div className="p-6">
                      <EventFiltersComponent
                        filters={filters}
                        onFiltersChange={setFilters}
                        onClearFilters={clearFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* View Toggle */}
                <div className="flex border rounded-lg p-1">
                  <Button
                    variant={view === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setView("grid")}
                    className="h-8 w-8 p-0"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={view === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setView("list")}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Events Grid/List */}
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground font-serif">No events found matching your criteria.</p>
                <Button variant="outline" onClick={clearFilters} className="mt-4 bg-transparent">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} view={view} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
