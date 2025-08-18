"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"
import type { EventCategory } from "@/lib/mock-data"

export interface EventFilters {
  search: string
  category: EventCategory | "All"
  location: string
  priceRange: [number, number]
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  chains: string[]
  sortBy: "date" | "price" | "popularity"
}

interface EventFiltersProps {
  filters: EventFilters
  onFiltersChange: (filters: EventFilters) => void
  onClearFilters: () => void
}

export function EventFiltersComponent({ filters, onFiltersChange, onClearFilters }: EventFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

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

  const chains = ["Ethereum", "Polygon", "Arbitrum", "Optimism", "ZetaChain"]

  const updateFilters = (updates: Partial<EventFilters>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const toggleChain = (chain: string) => {
    const newChains = filters.chains.includes(chain)
      ? filters.chains.filter((c) => c !== chain)
      : [...filters.chains, chain]
    updateFilters({ chains: newChains })
  }

  const hasActiveFilters =
    filters.search ||
    filters.category !== "All" ||
    filters.location ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1 ||
    filters.dateRange.from ||
    filters.dateRange.to ||
    filters.chains.length > 0

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-sans">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="font-serif">
            Search Events
          </Label>
          <Input
            id="search"
            placeholder="Search by event name, venue, or organizer..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="font-serif">Category</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => updateFilters({ category: value as EventCategory | "All" })}
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

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="font-serif">
            Location
          </Label>
          <Input
            id="location"
            placeholder="City, State or Country"
            value={filters.location}
            onChange={(e) => updateFilters({ location: e.target.value })}
          />
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="font-serif">Price Range (ETH)</Label>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
              max={1}
              min={0}
              step={0.01}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{filters.priceRange[0].toFixed(2)} ETH</span>
            <span>{filters.priceRange[1].toFixed(2)} ETH</span>
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label className="font-serif">Date Range</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex-1 justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.from ? format(filters.dateRange.from, "MMM dd") : "From"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.from}
                  onSelect={(date) => updateFilters({ dateRange: { ...filters.dateRange, from: date } })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex-1 justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.to ? format(filters.dateRange.to, "MMM dd") : "To"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.to}
                  onSelect={(date) => updateFilters({ dateRange: { ...filters.dateRange, to: date } })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Blockchain Networks */}
        <div className="space-y-3">
          <Label className="font-serif">Blockchain Networks</Label>
          <div className="flex flex-wrap gap-2">
            {chains.map((chain) => (
              <Badge
                key={chain}
                variant={filters.chains.includes(chain) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleChain(chain)}
              >
                {chain}
              </Badge>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label className="font-serif">Sort By</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => updateFilters({ sortBy: value as "date" | "price" | "popularity" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
