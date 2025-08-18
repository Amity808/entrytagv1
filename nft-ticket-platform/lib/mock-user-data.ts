import type { Event } from "@/lib/mock-data"

export interface UserTicket {
  id: string
  tokenId: string
  eventId: string
  event: Event
  tier: "general" | "premium" | "vip"
  purchasePrice: number
  purchaseDate: string
  status: "active" | "used" | "transferred" | "listed"
  transferLockUntil?: string
  qrCode: string
  resalePrice?: number
  transferHistory: TransferRecord[]
}

export interface TransferRecord {
  id: string
  from: string
  to: string
  date: string
  price?: number
  type: "purchase" | "transfer" | "resale"
  transactionHash: string
}

export interface UserStats {
  totalTickets: number
  activeTickets: number
  usedTickets: number
  totalSpent: number
  eventsAttended: number
  favoriteCategory: string
}

// Mock user tickets data
export const mockUserTickets: UserTicket[] = [
  {
    id: "ticket-1",
    tokenId: "0x1234567890abcdef",
    eventId: "1",
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
    purchasePrice: 0.08,
    purchaseDate: "2024-11-15T10:30:00Z",
    status: "active",
    transferLockUntil: "2024-11-16T10:30:00Z",
    qrCode: "QR_CODE_DATA_1",
    transferHistory: [
      {
        id: "transfer-1",
        from: "0x0000000000000000000000000000000000000000",
        to: "0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4",
        date: "2024-11-15T10:30:00Z",
        price: 0.08,
        type: "purchase",
        transactionHash: "0xabcdef1234567890",
      },
    ],
  },
  {
    id: "ticket-2",
    tokenId: "0xabcdef1234567890",
    eventId: "2",
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
    purchasePrice: 0.25,
    purchaseDate: "2024-11-10T14:20:00Z",
    status: "active",
    qrCode: "QR_CODE_DATA_2",
    transferHistory: [
      {
        id: "transfer-2",
        from: "0x0000000000000000000000000000000000000000",
        to: "0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4",
        date: "2024-11-10T14:20:00Z",
        price: 0.25,
        type: "purchase",
        transactionHash: "0x1234567890abcdef",
      },
    ],
  },
  {
    id: "ticket-3",
    tokenId: "0x9876543210fedcba",
    eventId: "5",
    event: {
      id: "5",
      title: "Rock Concert: Legends Tour",
      description: "Legendary rock band's farewell tour with special guests.",
      category: "Concert",
      startTime: "2024-10-28T19:30:00Z",
      endTime: "2024-10-28T23:30:00Z",
      location: "Chicago, IL",
      venue: "United Center",
      organizer: "Rock Promotions",
      basePrice: 0.09,
      currency: "ETH",
      totalTickets: 25000,
      soldTickets: 22000,
      image: "/placeholder.svg?height=400&width=600",
      featured: true,
      chains: ["Ethereum", "Polygon", "ZetaChain"],
      tierPrices: { general: 0.09, premium: 0.18, vip: 0.35 },
      tierCapacities: { general: 20000, premium: 4000, vip: 1000 },
      tierSold: { general: 18000, premium: 3500, vip: 500 },
    },
    tier: "general",
    purchasePrice: 0.09,
    purchaseDate: "2024-10-15T16:45:00Z",
    status: "used",
    qrCode: "QR_CODE_DATA_3",
    transferHistory: [
      {
        id: "transfer-3",
        from: "0x0000000000000000000000000000000000000000",
        to: "0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4",
        date: "2024-10-15T16:45:00Z",
        price: 0.09,
        type: "purchase",
        transactionHash: "0xfedcba0987654321",
      },
    ],
  },
]

export const mockUserStats: UserStats = {
  totalTickets: 3,
  activeTickets: 2,
  usedTickets: 1,
  totalSpent: 0.42,
  eventsAttended: 1,
  favoriteCategory: "Festival",
}
