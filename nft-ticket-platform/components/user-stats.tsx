import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Ticket, Calendar, TrendingUp, Star } from "lucide-react"
import type { UserStats } from "@/lib/mock-user-data"

interface UserStatsProps {
  stats: UserStats
}

export function UserStatsComponent({ stats }: UserStatsProps) {
  const statCards = [
    {
      title: "Total Tickets",
      value: stats.totalTickets,
      icon: Ticket,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Tickets",
      value: stats.activeTickets,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Events Attended",
      value: stats.eventsAttended,
      icon: Star,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Total Spent",
      value: `${stats.totalSpent} ETH`,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-serif">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-sans">{stat.value}</div>
              {stat.title === "Total Tickets" && stats.favoriteCategory && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    Favorite: {stats.favoriteCategory}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
