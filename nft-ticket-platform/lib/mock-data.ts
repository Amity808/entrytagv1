export interface Event {
  id: string
  title: string
  description: string
  category: EventCategory
  startTime: string
  endTime: string
  location: string
  venue: string
  organizer: string
  basePrice: number
  currency: string
  totalTickets: number
  soldTickets: number
  image: string
  featured: boolean
  chains: string[]
  tierPrices: {
    general: number
    premium: number
    vip: number
  }
  tierCapacities: {
    general: number
    premium: number
    vip: number
  }
  tierSold: {
    general: number
    premium: number
    vip: number
  }
}

export type EventCategory = "Concert" | "Sports" | "Conference" | "Theater" | "Festival" | "Exhibition" | "Other"

export const mockEvents: Event[] = [
  {
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
  {
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
  {
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
  {
    id: "4",
    title: "Broadway Musical: The Future",
    description: "A groundbreaking musical about technology and humanity.",
    category: "Theater",
    startTime: "2024-12-25T20:00:00Z",
    endTime: "2024-12-25T23:00:00Z",
    location: "New York, NY",
    venue: "Broadway Theater",
    organizer: "Broadway Productions",
    basePrice: 0.06,
    currency: "ETH",
    totalTickets: 1500,
    soldTickets: 800,
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    chains: ["Ethereum"],
    tierPrices: { general: 0.06, premium: 0.1, vip: 0.2 },
    tierCapacities: { general: 1000, premium: 400, vip: 100 },
    tierSold: { general: 600, premium: 150, vip: 50 },
  },
  {
    id: "5",
    title: "Rock Concert: Legends Tour",
    description: "Legendary rock band's farewell tour with special guests.",
    category: "Concert",
    startTime: "2024-12-28T19:30:00Z",
    endTime: "2024-12-28T23:30:00Z",
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
  {
    id: "6",
    title: "Art Exhibition: Digital Renaissance",
    description: "Contemporary digital art exhibition featuring NFT artists.",
    category: "Exhibition",
    startTime: "2024-12-30T10:00:00Z",
    endTime: "2025-01-15T18:00:00Z",
    location: "Miami, FL",
    venue: "Art Basel Gallery",
    organizer: "Digital Art Collective",
    basePrice: 0.03,
    currency: "ETH",
    totalTickets: 5000,
    soldTickets: 2500,
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    chains: ["Ethereum", "Polygon"],
    tierPrices: { general: 0.03, premium: 0.05, vip: 0.1 },
    tierCapacities: { general: 4000, premium: 800, vip: 200 },
    tierSold: { general: 2000, premium: 400, vip: 100 },
  },
]
