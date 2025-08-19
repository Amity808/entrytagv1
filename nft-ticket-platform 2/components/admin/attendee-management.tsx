"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Mail, Ban } from "lucide-react"

// Mock attendee data
const mockAttendees = [
  {
    id: "1",
    address: "0x1234...5678",
    email: "john@example.com",
    ticketsOwned: 3,
    totalSpent: 95,
    joinDate: "2024-05-15",
    lastActivity: "2024-06-20",
    status: "Active",
    events: ["Summer Music Festival", "Blockchain Summit 2024"],
  },
  {
    id: "2",
    address: "0xabcd...efgh",
    email: "sarah@example.com",
    ticketsOwned: 1,
    totalSpent: 25,
    joinDate: "2024-06-01",
    lastActivity: "2024-06-15",
    status: "Active",
    events: ["Blockchain Summit 2024"],
  },
  {
    id: "3",
    address: "0x9876...4321",
    email: "mike@example.com",
    ticketsOwned: 2,
    totalSpent: 70,
    joinDate: "2024-04-20",
    lastActivity: "2024-06-25",
    status: "Active",
    events: ["Summer Music Festival", "Digital Art Showcase"],
  },
]

export function AttendeeManagement() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredAttendees = mockAttendees.filter((attendee) => {
    return (
      attendee.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-sans">Attendee Management</CardTitle>
            <CardDescription className="font-serif">Manage platform users and ticket holders</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-transparent">
              <Mail className="h-4 w-4 mr-2" />
              Send Newsletter
            </Button>
            <Button variant="outline" className="bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export Users
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by wallet address or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Attendees Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Tickets Owned</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendees.map((attendee) => (
                <TableRow key={attendee.id}>
                  <TableCell>
                    <div>
                      <div className="font-semibold font-mono">{formatAddress(attendee.address)}</div>
                      <div className="text-sm text-muted-foreground">{attendee.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold">{attendee.ticketsOwned}</div>
                      <div className="text-sm text-muted-foreground">{attendee.events.length} events</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{attendee.totalSpent} ZETA</div>
                  </TableCell>
                  <TableCell>{new Date(attendee.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(attendee.lastActivity).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        attendee.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }
                      variant="secondary"
                    >
                      {attendee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Mail className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent text-destructive">
                        <Ban className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredAttendees.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No attendees found matching your criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
