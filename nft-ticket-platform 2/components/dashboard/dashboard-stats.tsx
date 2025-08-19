import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, TrendingUp, Wallet } from "lucide-react"

interface DashboardStatsProps {
  tickets: {
    id: string
    status: "Active" | "Used" | "Expired"
    purchasePrice: number
    eventDate: string
  }[]
}

export function DashboardStats({ tickets }: DashboardStatsProps) {
  const totalTickets = tickets.length
  const activeTickets = tickets.filter((t) => t.status === "Active").length
  const upcomingEvents = tickets.filter((t) => new Date(t.eventDate) > new Date()).length
  const totalSpent = tickets.reduce((sum, ticket) => sum + ticket.purchasePrice, 0)

  const stats = [
    {
      title: "Total Tickets",
      value: totalTickets,
      description: "NFT tickets owned",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Active Tickets",
      value: activeTickets,
      description: "Ready to use",
      icon: Calendar,
      color: "text-green-600",
    },
    {
      title: "Upcoming Events",
      value: upcomingEvents,
      description: "Events to attend",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Total Spent",
      value: `${totalSpent} ZETA`,
      description: "On ticket purchases",
      icon: Wallet,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-sans">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground font-serif">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
