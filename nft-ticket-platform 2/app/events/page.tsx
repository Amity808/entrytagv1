"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import { EventCard } from "@/components/events/event-card"
import { WalletConnectButton } from "@/components/wallet/wallet-connect-button"
import { useWriteContract, useReadContract, useAccount, useSimulateContract } from "wagmi"
import { NFT_CONTRACT_ADDRESS } from "@/contract/address"
import Abi from "@/contract/abi.json";
import { EventProvider, EventDetails } from "@/context/event-context"

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [eventIds, setEventIds] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredEventIds, setFilteredEventIds] = useState<Map<string, string>>(new Map());
  const [eventDetails, setEventDetails] = useState<Map<string, EventDetails>>(new Map());

  // Context functions
  const setEventDetailsContext = useCallback((id: string, details: EventDetails) => {
    setEventDetails(prev => new Map(prev).set(id, details));
  }, []);

  const removeEventDetailsContext = useCallback((id: string) => {
    setEventDetails(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const contextValue = {
    eventDetails,
    setEventDetails: setEventDetailsContext,
    removeEventDetails: removeEventDetailsContext,
  };

  // Fetch total event count from contract
  const { data: eventCount, error: countError, isLoading: countLoading } = useReadContract({
    abi: Abi.abi,
    address: NFT_CONTRACT_ADDRESS,
    functionName: "_nextEventId",
    args: [],
  });

  // Get all event IDs
  const getEventIds = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);

      if (!eventCount) {
        setEventIds(new Map());
        setFilteredEventIds(new Map());
        setIsLoading(false);
        return;
      }

      const newMap = new Map<string, string>();
      if (typeof eventCount === 'bigint' && eventCount > 0) {
        for (let i = 0; i < eventCount; i++) {
          newMap.set(i.toString(), i.toString());
        }
        setEventIds(new Map(newMap));
        setFilteredEventIds(new Map(newMap));
      } else {
        setEventIds(new Map());
        setFilteredEventIds(new Map());
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error setting event IDs:", error);
      setError("Failed to load events from contract");
      setIsLoading(false);
    }
  }, [eventCount]);

  // Filter events based on search query and filters
  const filterEvents = useCallback(() => {
    console.log("Filtering events:", { searchQuery, selectedCategory, priceRange, eventIdsSize: eventIds.size, eventDetailsSize: eventDetails.size });

    if (!searchQuery.trim() && selectedCategory === "all" && priceRange === "all") {
      setFilteredEventIds(new Map(eventIds));
      return;
    }

    const filtered = new Map<string, string>();

    // Filter events based on loaded event details
    for (const [id, eventId] of eventIds) {
      const details = eventDetails.get(eventId);

      if (!details) {
        // If we don't have details yet, include the event (it will be filtered later)
        filtered.set(id, eventId);
        continue;
      }

      let shouldInclude = true;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          details.name.toLowerCase().includes(query) ||
          details.description.toLowerCase().includes(query) ||
          details.category.toLowerCase().includes(query);

        if (!matchesSearch) {
          shouldInclude = false;
        }
      }

      // Category filter
      if (selectedCategory !== "all" && details.category !== selectedCategory) {
        shouldInclude = false;
      }

      // Price range filter
      if (priceRange !== "all") {
        const price = details.basePrice;
        switch (priceRange) {
          case "0-25":
            if (price > 25) shouldInclude = false;
            break;
          case "25-50":
            if (price <= 25 || price > 50) shouldInclude = false;
            break;
          case "50+":
            if (price <= 50) shouldInclude = false;
            break;
        }
      }

      if (shouldInclude) {
        filtered.set(id, eventId);
      }
    }

    console.log("Filtered results:", { filteredSize: filtered.size, filteredEvents: Array.from(filtered.values()) });
    setFilteredEventIds(filtered);
  }, [searchQuery, selectedCategory, priceRange, eventIds, eventDetails]);

  // Trigger filtering when any of the dependencies change
  useEffect(() => {
    filterEvents();
  }, [filterEvents]);

  // Also trigger filtering when eventDetails change (for real-time updates)
  useEffect(() => {
    if (eventDetails.size > 0) {
      filterEvents();
    }
  }, [eventDetails, filterEvents]);

  useEffect(() => {
    getEventIds();
  }, [eventCount, getEventIds]);

  useEffect(() => {
    if (countError) {
      setError(`Failed to load event count: ${countError.message}`);
      setIsLoading(false);
    }
  }, [countError]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handlePriceRangeChange = (range: string) => {
    setPriceRange(range);
  };

  return (
    <EventProvider value={contextValue}>
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
                  className="pl-10 pr-20"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-2"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
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
              <Select value={priceRange} onValueChange={handlePriceRangeChange}>
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
              {isLoading ? "Loading events from smart contract..." :
                error ? `Error: ${error}` :
                  searchQuery.trim() ?
                    `Showing ${filteredEventIds.size} events matching "${searchQuery}"` :
                    `Showing ${filteredEventIds.size} events from smart contract`}
            </p>
            {searchQuery.trim() && filteredEventIds.size === 0 && (
              <p className="text-sm text-red-600 mt-1">
                No events found matching your search criteria.
              </p>
            )}
            <div className="mt-2 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log("Current state:", {
                    searchQuery,
                    selectedCategory,
                    priceRange,
                    eventIds: Array.from(eventIds.values()),
                    eventDetails: Array.from(eventDetails.entries()),
                    filteredEventIds: Array.from(filteredEventIds.values())
                  });
                }}
              >
                Debug State
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => filterEvents()}
              >
                Force Filter
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-800 font-medium">Error Loading Events</p>
              <p className="text-red-600 text-sm">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground font-serif">Loading events from blockchain...</p>
            </div>
          )}

          {/* Events Grid */}
          {!isLoading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...filteredEventIds.entries()].map(([key, value]) => (
                <EventCard key={key} id={value} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredEventIds.size === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground font-serif mb-4">
                {eventCount && eventCount.toString() === "0" ? "No events have been created yet" : "No events found"}
              </p>
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
    </EventProvider>
  )
}
