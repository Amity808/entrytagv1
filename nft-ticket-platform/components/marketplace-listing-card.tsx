"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, TrendingUp, TrendingDown, User } from "lucide-react"
import { format } from "date-fns"
import type { MarketplaceListing } from "@/lib/mock-marketplace-data"

interface MarketplaceListingCardProps {
  listing: MarketplaceListing
  onPurchase?: (listingId: string) => void
}

export function MarketplaceListingCard({ listing, onPurchase }: MarketplaceListingCardProps) {
  const tierInfo = {
    general: { name: "General Admission", color: "bg-muted text-muted-foreground" },
    premium: { name: "Premium", color: "bg-accent text-accent-foreground" },
    vip: { name: "VIP Experience", color: "bg-primary text-primary-foreground" },
  }

  const priceChange = listing.listingPrice - listing.originalPrice
  const priceChangePercent = ((priceChange / listing.originalPrice) * 100).toFixed(1)
  const isPriceUp = priceChange > 0

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy")
  }

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a")
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={listing.event.image || "/placeholder.svg"}
            alt={listing.event.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge className={tierInfo[listing.tier].color}>{tierInfo[listing.tier].name}</Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-background/90">
              Resale
            </Badge>
          </div>
          <div className="absolute bottom-3 left-3 flex gap-1">
            {listing.event.chains.slice(0, 2).map((chain) => (
              <Badge key={chain} variant="secondary" className="text-xs bg-background/90">
                {chain}
              </Badge>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline">{listing.event.category}</Badge>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">
                {listing.listingPrice} {listing.event.currency}
              </p>
              <div className="flex items-center gap-1 text-xs">
                {isPriceUp ? (
                  <TrendingUp className="h-3 w-3 text-red-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-green-500" />
                )}
                <span className={isPriceUp ? "text-red-500" : "text-green-500"}>
                  {isPriceUp ? "+" : ""}
                  {priceChangePercent}%
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold font-sans text-lg mb-1 line-clamp-1">{listing.event.title}</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="font-serif">
                  {formatDate(listing.event.startTime)} • {formatTime(listing.event.startTime)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="font-serif">
                  {listing.event.venue}, {listing.event.location}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span className="font-serif">Seller: {formatAddress(listing.seller)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-muted-foreground font-serif">Original Price</p>
              <p className="font-semibold line-through text-muted-foreground">
                {listing.originalPrice} {listing.event.currency}
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground font-serif">Listed</p>
              <p className="font-serif text-xs">{format(new Date(listing.listedDate), "MMM dd")}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link href={`/events/${listing.event.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                View Event
              </Button>
            </Link>
            <Button size="sm" onClick={() => onPurchase?.(listing.id)} className="flex-1">
              Buy Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
