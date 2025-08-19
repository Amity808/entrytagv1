"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, Edit, Trash2, Pause, Play, Download } from "lucide-react"
import Link from "next/link"

// Mock events data
const mockEvents = [
  {
    id: "1",
    name: "Summer Music Festival",
    organizer: "NYC Events Co.",
    category: "Concert",
    date: "2024-07-15",
    status: "Active",
    ticketsSold: 1250,
    totalCapacity: 2000,
    revenue: 62500,
    price: 50,
  },
  {
    id: "2",
    name: "Blockchain Summit 2024",
    organizer: "Tech Conferences Inc.",
    category: "Conference",
    date: "2024-08-20",
    status: "Active",
    ticketsSold: 800,
    totalCapacity: 1500,
    revenue: 20000,
    price: 25,
  },
  {
    id: "3",
    name: "Digital Art Showcase",
    organizer: "Art Gallery NYC",
    category: "Exhibition",
    date: "2024-09-01",
    status: "Active",
    ticketsSold: 300,
    totalCapacity: 500,
    revenue: 4500,
    price: 15,
  },
  {
    id: "4",
    name: "Tech Startup Pitch Night",
    organizer: "Innovation Hub",
    category: "Other",
    date: "2024-06-30",
    status: "Completed",
    ticketsSold: 200,
    totalCapacity: 200,
    revenue: 4000,
    price: 20,
  },
]

export function EventManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || event.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "Paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-sans">Event Management</CardTitle>
            <CardDescription className="font-serif">Manage all platform events</CardDescription>
          </div>
          <Button asChild>
            <Link href="/events/create">Create New Event</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events or organizers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Events Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Organizer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div>
                      <div className="font-semibold">{event.name}</div>
                      <div className="text-sm text-muted-foreground">{event.category}</div>
                    </div>
                  </TableCell>
                  <TableCell>{event.organizer}</TableCell>
                  <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(event.status)} variant="secondary">
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold">
                        {event.ticketsSold.toLocaleString()} / {event.totalCapacity.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round((event.ticketsSold / event.totalCapacity) * 100)}% sold
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{event.revenue.toLocaleString()} ZETA</div>
                    <div className="text-sm text-muted-foreground">{event.price} ZETA each</div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/events/${event.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Event
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {event.status === "Active" ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause Event
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Resume Event
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Cancel Event
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No events found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
