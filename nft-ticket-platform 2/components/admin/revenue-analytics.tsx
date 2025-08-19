import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, Users, Calendar } from "lucide-react"

// Mock analytics data
const mockAnalytics = {
  totalRevenue: 85600,
  monthlyRevenue: 12400,
  revenueGrowth: 24.5,
  averageTicketPrice: 32.5,
  topEvents: [
    { name: "Summer Music Festival", revenue: 62500, tickets: 1250 },
    { name: "Blockchain Summit 2024", revenue: 20000, tickets: 800 },
    { name: "Digital Art Showcase", revenue: 4500, tickets: 300 },
  ],
  monthlyData: [
    { month: "Jan", revenue: 8500, tickets: 340 },
    { month: "Feb", revenue: 9200, tickets: 368 },
    { month: "Mar", revenue: 11800, tickets: 472 },
    { month: "Apr", revenue: 10600, tickets: 424 },
    { month: "May", revenue: 13200, tickets: 528 },
    { month: "Jun", revenue: 12400, tickets: 496 },
  ],
}

export function RevenueAnalytics() {
  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-sans">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.totalRevenue.toLocaleString()} ZETA</div>
            <p className="text-xs text-muted-foreground font-serif">All time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-sans">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.monthlyRevenue.toLocaleString()} ZETA</div>
            <p className="text-xs text-green-600 font-serif">+{mockAnalytics.revenueGrowth}% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-sans">Avg. Ticket Price</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.averageTicketPrice} ZETA</div>
            <p className="text-xs text-muted-foreground font-serif">Across all events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-sans">Platform Fees</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,280 ZETA</div>
            <p className="text-xs text-muted-foreground font-serif">5% of total revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Events */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sans">Top Performing Events</CardTitle>
          <CardDescription className="font-serif">Events with highest revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAnalytics.topEvents.map((event, index) => (
              <div key={event.name} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{event.name}</div>
                    <div className="text-sm text-muted-foreground">{event.tickets.toLocaleString()} tickets sold</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{event.revenue.toLocaleString()} ZETA</div>
                  <div className="text-sm text-muted-foreground">
                    {(event.revenue / event.tickets).toFixed(1)} ZETA avg
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sans">Monthly Trends</CardTitle>
          <CardDescription className="font-serif">Revenue and ticket sales over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAnalytics.monthlyData.map((month) => (
              <div key={month.month} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 text-center font-semibold">{month.month}</div>
                  <div>
                    <div className="font-semibold">{month.revenue.toLocaleString()} ZETA</div>
                    <div className="text-sm text-muted-foreground">{month.tickets.toLocaleString()} tickets</div>
                  </div>
                </div>
                <div className="w-32 bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: `${(month.revenue / 15000) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
