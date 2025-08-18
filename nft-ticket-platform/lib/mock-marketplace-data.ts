import type { Event } from "@/lib/mock-data"

export interface MarketplaceListing {
  id: string
  tokenId: string
  event: Event
  tier: "general" | "premium" | "vip"
  originalPrice: number
  listingPrice: number
  seller: string
  listedDate: string
  status: "active" | "sold" | "cancelled"
  priceHistory: PriceHistoryEntry[]
}

export interface PriceHistoryEntry {
  price: number
  date: string
  type: "listed" | "price_change" | "sold"
}

export const mockMarketplaceListings: MarketplaceListing[] = [
  {
    id: "listing-1",
    tokenId: "0x1234567890abcdef",
    event: {
      id: "1",
      title: "Electronic Music Festival 2024",
      description: "The biggest electronic music festival featuring world-class DJs and artists.",
      category: "Festival",
      startTime: "2024-12-15T18:00:00Z",
      endTime: "2024-12-17T02:00:00Z",
      location: "Los Angeles, CA",
      venue: "LA Convention Center",
      organizer: "Festival Productions",
      basePrice: 0.05,
      currency: "ETH",
      totalTickets: 10000,
      soldTickets: 7500,
      image: "/placeholder.svg?height=400&width=600",
      featured: true,
      chains: ["Ethereum", "Polygon", "ZetaChain"],
      tierPrices: { general: 0.05, premium: 0.08, vip: 0.15 },
      tierCapacities: { general: 7000, premium: 2500, vip: 500 },
      tierSold: { general: 5500, premium: 1800, vip: 200 },
    },
    tier: "premium",
    originalPrice: 0.08,
    listingPrice: 0.12,
    seller: "0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4",
    listedDate: "2024-11-20T14:30:00Z",
    status: "active",
    priceHistory: [
      { price: 0.15, date: "2024-11-20T14:30:00Z", type: "listed" },
      { price: 0.12, date: "2024-11-22T10:15:00Z", type: "price_change" },
    ],
  },
  {
    id: "listing-2",
    tokenId: "0xabcdef1234567890",
    event: {
      id: "2",
      title: "Tech Conference 2024",
      description: "Annual technology conference featuring industry leaders and innovators.",
      category: "Conference",
      startTime: "2024-12-20T09:00:00Z",
      endTime: "2024-12-20T18:00:00Z",
      location: "San Francisco, CA",
      venue: "Moscone Center",
      organizer: "Tech Events Inc",
      basePrice: 0.08,
      currency: "ETH",
      totalTickets: 2000,
      soldTickets: 1200,
      image: "/placeholder.svg?height=400&width=600",
      featured: true,
      chains: ["Ethereum", "Arbitrum"],
      tierPrices: { general: 0.08, premium: 0.12, vip: 0.25 },
      tierCapacities: { general: 1500, premium: 400, vip: 100 },
      tierSold: { general: 900, premium: 250, vip: 50 },
    },
    tier: "vip",
    originalPrice: 0.25,
    listingPrice: 0.22,
    seller: "0x123456789abcdef0123456789abcdef012345678",
    listedDate: "2024-11-18T16:45:00Z",
    status: "active",
    priceHistory: [{ price: 0.22, date: "2024-11-18T16:45:00Z", type: "listed" }],
  },
  {
    id: "listing-3",
    tokenId: "0x9876543210fedcba",
    event: {
      id: "3",
      title: "Basketball Championship Finals",
      description: "Championship finals featuring the top teams of the season.",
      category: "Sports",
      startTime: "2024-12-22T19:00:00Z",
      endTime: "2024-12-22T22:00:00Z",
      location: "New York, NY",
      venue: "Madison Square Garden",
      organizer: "Sports League",
      basePrice: 0.12,
      currency: "ETH",
      totalTickets: 20000,
      soldTickets: 18500,
      image: "/placeholder.svg?height=400&width=600",
      featured: false,
      chains: ["Ethereum", "Polygon"],
      tierPrices: { general: 0.12, premium: 0.25, vip: 0.5 },
      tierCapacities: { general: 15000, premium: 4000, vip: 1000 },
      tierSold: { general: 14000, premium: 3500, vip: 1000 },
    },
    tier: "general",
    originalPrice: 0.12,
    listingPrice: 0.18,
    seller: "0xfedcba9876543210fedcba9876543210fedcba98",
    listedDate: "2024-11-19T11:20:00Z",
    status: "active",
    priceHistory: [{ price: 0.18, date: "2024-11-19T11:20:00Z", type: "listed" }],
  },
]
