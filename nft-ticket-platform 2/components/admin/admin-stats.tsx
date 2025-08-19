import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, DollarSign, TrendingUp, Ticket, AlertTriangle } from "lucide-react"

// Mock data for admin stats
const mockStats = {
  totalEvents: 12,
  activeEvents: 8,
  totalTicketsSold: 3420,
  totalRevenue: 85600,
  totalUsers: 1250,
  newUsersThisMonth: 180,
  platformFees: 4280,
  pendingPayouts: 2150,
}

export function AdminStats() {
  const stats = [
    {
      title: "Total Events",
      value: mockStats.totalEvents,
      description: `${mockStats.activeEvents} currently active`,
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Tickets Sold",
      value: mockStats.totalTicketsSold.toLocaleString(),
      description: "Across all events",
      icon: Ticket,
      color: "text-green-600",
    },
    {
      title: "Total Revenue",
      value: `${mockStats.totalRevenue.toLocaleString()} ZETA`,
      description: `${mockStats.platformFees.toLocaleString()} ZETA in fees`,
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      title: "Platform Users",
      value: mockStats.totalUsers.toLocaleString(),
      description: `+${mockStats.newUsersThisMonth} this month`,
      icon: Users,
      color: "text-orange-600",
    },
    {
      title: "Pending Payouts",
      value: `${mockStats.pendingPayouts.toLocaleString()} ZETA`,
      description: "To event organizers",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Growth Rate",
      value: "+24%",
      description: "Month over month",
      icon: TrendingUp,
      color: "text-emerald-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
