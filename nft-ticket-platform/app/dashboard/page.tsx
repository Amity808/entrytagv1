"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { TicketCard } from "@/components/ticket-card"
import { UserStatsComponent } from "@/components/user-stats"
import { TransactionHistory } from "@/components/transaction-history"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Ticket, User, History, Settings, Search } from "lucide-react"
import { useWallet } from "@/lib/wallet-context"
import { mockUserTickets, mockUserStats } from "@/lib/mock-user-data"

export default function DashboardPage() {
  const { address, isConnected } = useWallet()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [transferDialogOpen, setTransferDialogOpen] = useState(false)
  const [listDialogOpen, setListDialogOpen] = useState(false)
  const [selectedTicketId, setSelectedTicketId] = useState<string>("")

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container py-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold font-sans">Connect Your Wallet</h1>
            <p className="text-muted-foreground font-serif">
              Please connect your wallet to view your dashboard and manage your tickets.
            </p>
          </div>
        </main>
      </div>
    )
  }

  const filteredTickets = mockUserTickets.filter((ticket) => {
    const matchesSearch = ticket.event.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const allTransactions = mockUserTickets.flatMap((ticket) => ticket.transferHistory)

  const handleTransfer = (ticketId: string) => {
    setSelectedTicketId(ticketId)
    setTransferDialogOpen(true)
  }

  const handleList = (ticketId: string) => {
    setSelectedTicketId(ticketId)
    setListDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-sans">Dashboard</h1>
            <p className="text-muted-foreground font-serif">
              Welcome back! Manage your tickets and view your activity.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-serif">Connected wallet:</span>
              <Badge variant="outline" className="font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <UserStatsComponent stats={mockUserStats} />

          {/* Main Content */}
          <Tabs defaultValue="tickets" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tickets" className="flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                My Tickets
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tickets" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Label htmlFor="search" className="sr-only">
                        Search tickets
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Search your tickets..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tickets</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="used">Used</SelectItem>
                        <SelectItem value="transferred">Transferred</SelectItem>
                        <SelectItem value="listed">Listed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Tickets Grid */}
              {filteredTickets.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold font-sans mb-2">No tickets found</h3>
                    <p className="text-muted-foreground font-serif mb-4">
                      {searchQuery || statusFilter !== "all"
                        ? "Try adjusting your search or filters"
                        : "You haven't purchased any tickets yet"}
                    </p>
                    <Button>Browse Events</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} onTransfer={handleTransfer} onList={handleList} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              <TransactionHistory transactions={allTransactions} />
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="font-sans">Profile Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="display-name" className="font-serif">
                      Display Name
                    </Label>
                    <Input id="display-name" placeholder="Enter your display name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-serif">
                      Email (Optional)
                    </Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-serif">Notification Preferences</Label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm font-serif">Event reminders</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm font-serif">Price alerts</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm font-serif">Transfer notifications</span>
                      </label>
                    </div>
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="font-sans">Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold font-sans">Wallet Information</h3>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-serif mb-2">Connected Wallet Address:</p>
                      <p className="font-mono text-sm break-all">{address}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold font-sans">Security</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        Export Transaction History
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        Download Ticket Data
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Transfer Dialog */}
      <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-sans">Transfer Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient" className="font-serif">
                Recipient Address
              </Label>
              <Input id="recipient" placeholder="0x..." />
            </div>
            <p className="text-sm text-muted-foreground font-serif">
              The ticket will be transferred to the specified wallet address. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button className="flex-1">Transfer Ticket</Button>
              <Button variant="outline" onClick={() => setTransferDialogOpen(false)} className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* List for Sale Dialog */}
      <Dialog open={listDialogOpen} onOpenChange={setListDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-sans">List Ticket for Sale</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="font-serif">
                Sale Price (ETH)
              </Label>
              <Input id="price" type="number" step="0.001" placeholder="0.000" />
            </div>
            <p className="text-sm text-muted-foreground font-serif">
              Your ticket will be listed on the secondary market. A 2.5% platform fee will be deducted from the sale.
            </p>
            <div className="flex gap-2">
              <Button className="flex-1">List for Sale</Button>
              <Button variant="outline" onClick={() => setListDialogOpen(false)} className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
