"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Settings, Plus, Download } from "lucide-react"
import Link from "next/link"
import { ConnectButton } from "@rainbow-me/rainbowkit"

import { AdminStats } from "@/components/admin/admin-stats"
import { EventManagement } from "@/components/admin/event-management"
import { AttendeeManagement } from "@/components/admin/attendee-management"
import { PlatformControls } from "@/components/admin/platform-controls"
import { RevenueAnalytics } from "@/components/admin/revenue-analytics"
import { useAccount } from "wagmi"

// Mock admin check - in a real app, this would check against smart contract or backend
const isAdmin = (address?: string) => {
  // Mock admin addresses
  const adminAddresses = ["0x1234567890123456789012345678901234567890", "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"]
  return address && adminAddresses.includes(address.toLowerCase())

}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { address, isConnected } = useAccount()
  // Check if user is admin
  const userIsAdmin = isAdmin(address || "")

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground font-sans">ZetaTickets Admin</span>
            </Link>
            <ConnectButton />
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4 font-sans">Admin Access Required</h1>
            <p className="text-lg text-muted-foreground mb-8 font-serif">
              Connect your wallet to access the admin dashboard.
            </p>
            <ConnectButton />
          </div>
        </div>
      </div>
    )
  }

  // if (!userIsAdmin) {
  //   return (
  //     <div className="min-h-screen bg-background">
  //       <header className="border-b border-border bg-card/50 backdrop-blur-sm">
  //         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
  //           <Link href="/" className="flex items-center gap-2">
  //             <span className="text-2xl font-bold text-foreground font-sans">ZetaTickets</span>
  //           </Link>
  //           <ConnectButton />
  //         </div>
  //       </header>

  //       <div className="container mx-auto px-4 py-16">
  //         <div className="max-w-md mx-auto text-center">
  //           <Settings className="h-16 w-16 text-destructive mx-auto mb-6" />
  //           <h1 className="text-3xl font-bold text-foreground mb-4 font-sans">Access Denied</h1>
  //           <p className="text-lg text-muted-foreground mb-8 font-serif">
  //             You don't have permission to access the admin dashboard.
  //           </p>
  //           <Button asChild>
  //             <Link href="/">Return Home</Link>
  //           </Button>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground font-sans">Admin Dashboard</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/events">View Platform</Link>
            </Button>
            <ConnectButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 font-sans">Platform Administration</h1>
          <p className="text-lg text-muted-foreground font-serif">Manage events, users, and platform settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="attendees">Attendees</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <AdminStats />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sans">Quick Actions</CardTitle>
                <CardDescription className="font-serif">Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex-col gap-2" asChild>
                    <Link href="/events/create">
                      <Plus className="h-6 w-6" />
                      Create Event
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Download className="h-6 w-6" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <BarChart3 className="h-6 w-6" />
                    View Reports
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Settings className="h-6 w-6" />
                    Platform Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sans">Recent Activity</CardTitle>
                <CardDescription className="font-serif">Latest platform events and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "New event created", event: "Jazz Night Under the Stars", time: "2 hours ago" },
                    { action: "Ticket purchased", event: "Summer Music Festival", time: "4 hours ago" },
                    { action: "Event updated", event: "Blockchain Summit 2024", time: "6 hours ago" },
                    { action: "User registered", event: "Platform", time: "8 hours ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <p className="font-semibold">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.event}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <EventManagement />
          </TabsContent>

          {/* Attendees Tab */}
          <TabsContent value="attendees" className="space-y-6">
            <AttendeeManagement />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <RevenueAnalytics />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <PlatformControls />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
