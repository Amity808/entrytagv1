"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Ticket, Wallet, Loader2 } from "lucide-react"
import Link from "next/link"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { WalletBalance } from "@/components/wallet/wallet-balance"
import { TicketCard } from "@/components/tickets/ticket-card"
import { TransactionHistory } from "@/components/dashboard/transaction-history"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { useAccount, useReadContract } from "wagmi"
import { NFT_CONTRACT_ADDRESS } from "@/contract/address"
import Abi from "@/contract/abi.json"

// Interface for processed ticket data
interface ProcessedTicket {
  id: string
  tokenId: string
  eventId: string
  eventName: string
  eventDate: string
  eventLocation: string
  purchasePrice: number
  purchaseDate: string
  status: "Active" | "Used" | "Expired"
  transferable: boolean
  imageUrl: string
  qrCode: string
}

export default function DashboardPage() {
  const { isConnected, address, isConnecting } = useAccount()
  const [activeTab, setActiveTab] = useState("overview")
  const [userTickets, setUserTickets] = useState<ProcessedTicket[]>([])
  const [isLoadingTickets, setIsLoadingTickets] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch user's ticket IDs from contract
  const { data: userTicketIds, refetch: refetchUserTickets } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: Abi.abi,
    functionName: "userTickets",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  })

  // Helper function to safely get ticket count
  const getTicketCount = () => {
    if (!userTicketIds || !Array.isArray(userTicketIds)) return 0
    return userTicketIds.length
  }

  // Helper function to handle refresh button click
  const handleRefresh = () => {
    if (refetchUserTickets) {
      refetchUserTickets()
    }
  }

  // Process contract data into displayable format
  const processContractData = useCallback(async () => {
    if (!userTicketIds || !Array.isArray(userTicketIds) || userTicketIds.length === 0) {
      setUserTickets([])
      return
    }

    setIsLoadingTickets(true)
    setError(null)

    try {
      const processedTickets: ProcessedTicket[] = []

      for (const tokenId of userTicketIds) {
        try {
          // For now, we'll create placeholder tickets since the contract calls need to be handled differently
          // In a real implementation, you would need to create a custom hook or use batch contract calls

          const processedTicket: ProcessedTicket = {
            id: tokenId.toString(),
            tokenId: tokenId.toString(),
            eventId: "0", // Placeholder - would come from contract
            eventName: `Ticket #${tokenId}`,
            eventDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Placeholder future date
            eventLocation: "Location TBD",
            purchasePrice: 0.01, // Placeholder price
            purchaseDate: new Date().toISOString(),
            status: "Active" as const,
            transferable: true,
            imageUrl: "/placeholder.svg",
            qrCode: `QR${tokenId.toString().padStart(9, '0')}`,
          }

          processedTickets.push(processedTicket)
        } catch (error) {
          console.error(`Error processing ticket ${tokenId}:`, error)
          // Continue with other tickets even if one fails
        }
      }

      setUserTickets(processedTickets)
    } catch (error) {
      console.error('Error processing tickets:', error)
      setError('Failed to load tickets. Please try again.')
    } finally {
      setIsLoadingTickets(false)
    }
  }, [userTicketIds])

  // Helper function to determine ticket status
  const getTicketStatus = (eventStatus: number, eventStartTime: number): "Active" | "Used" | "Expired" => {
    const now = Math.floor(Date.now() / 1000)

    if (eventStatus === 2) return "Used" // SoldOut
    if (eventStatus === 3) return "Expired" // Cancelled
    if (eventStatus === 4) return "Expired" // Completed
    if (now > eventStartTime) return "Used" // Event has passed
    return "Active"
  }

  // Load tickets when userTicketIds changes
  useEffect(() => {
    if (userTicketIds) {
      processContractData()
    } else if (isConnected && !isLoadingTickets && isClient) {
      // Show sample data for demonstration when no real tickets are found
      // Only show on client side to prevent hydration issues
      const sampleTickets: ProcessedTicket[] = [
        {
          id: "sample-1",
          tokenId: "1001",
          eventId: "1",
          eventName: "Summer Music Festival",
          eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
          eventLocation: "Central Park, NYC",
          purchasePrice: 0.05,
          purchaseDate: new Date().toISOString(),
          status: "Active",
          transferable: true,
          imageUrl: "/placeholder.svg",
          qrCode: "QR000100001",
        },
        {
          id: "sample-2",
          tokenId: "1002",
          eventId: "2",
          eventName: "Blockchain Summit 2024",
          eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
          eventLocation: "Convention Center, SF",
          purchasePrice: 0.025,
          purchaseDate: new Date().toISOString(),
          status: "Active",
          transferable: true,
          imageUrl: "/placeholder.svg",
          qrCode: "QR000200002",
        }
      ]
      setUserTickets(sampleTickets)
    }
  }, [userTicketIds, processContractData, isConnected, isLoadingTickets, isClient])

  // Auto-refresh tickets when wallet changes
  useEffect(() => {
    if (address && isClient) {
      // Small delay to ensure wallet is fully connected
      const timer = setTimeout(() => {
        if (refetchUserTickets) {
          refetchUserTickets()
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [address, isClient, refetchUserTickets])

  // Show loading state while connecting
  if (isConnecting || !isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {!isClient ? "Initializing..." : "Connecting wallet..."}
          </p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Ticket className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground font-sans">ZetaTickets</span>
            </Link>
            <ConnectButton />
          </div>
        </header>

        {/* Connect Wallet Prompt */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4 font-sans">Connect Your Wallet</h1>
            <p className="text-lg text-muted-foreground mb-8 font-serif">
              Connect your wallet to view your NFT tickets and manage your account.
            </p>
            <ConnectButton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Ticket className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground font-sans">ZetaTickets</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/events">Browse Events</Link>
            </Button>
            <ConnectButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 font-sans">My Dashboard</h1>
          <p className="text-lg text-muted-foreground font-serif">Manage your NFT tickets and view your activity</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Dashboard Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">🎯 Dashboard Overview</h3>
              <div className="text-xs text-blue-800 space-y-1">
                <p>• <strong>Overview:</strong> See your ticket statistics and recent activity</p>
                <p>• <strong>My Tickets:</strong> View and manage all your NFT tickets</p>
                <p>• <strong>History:</strong> Track your transaction history</p>
                <p>• <strong>Settings:</strong> Manage your account preferences</p>
                <p>• <strong>Real-time Updates:</strong> Automatically refreshes when wallet changes</p>
              </div>
            </div>

            {/* Stats Cards */}
            <DashboardStats tickets={userTickets} />

            {/* Wallet Balance */}
            <WalletBalance />

            {/* Recent Tickets */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-sans">Recent Tickets</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("tickets")}>
                    View All
                  </Button>
                </div>
                <CardDescription className="font-serif">Your latest NFT ticket purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {userTickets.slice(0, 2).map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} compact />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Events */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sans">Recommended for You</CardTitle>
                <CardDescription className="font-serif">Events you might be interested in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
              
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-sans">My Tickets ({userTickets.length})</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoadingTickets}
                >
                  {isLoadingTickets ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Refresh"
                  )}
                </Button>
                <Button asChild>
                  <Link href="/events">Buy More Tickets</Link>
                </Button>
              </div>
            </div>

            {/* Sample Data Notice */}
            {userTickets.length > 0 && userTickets.some(t => t.id.startsWith('sample-')) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  📝 <strong>Note:</strong> Sample tickets shown for demonstration.
                  {getTicketCount() > 0 ? (
                    <span className="text-green-600"> Real tickets found: {getTicketCount()}</span>
                  ) : (
                    " Real tickets will appear here after you purchase them from events."
                  )}
                </p>
              </div>
            )}

            {/* Debug Information */}
            {isConnected && (
              <div className="space-y-2 p-4 bg-muted/50 rounded-lg mb-4">
                <h4 className="text-sm font-medium">Contract Integration Status</h4>
                <div className="text-xs space-y-1">
                  <p>Connected Address: {address}</p>
                  <p>Contract Address: {NFT_CONTRACT_ADDRESS}</p>
                  <p>User Ticket IDs: {getTicketCount()} found</p>
                  <p>Processed Tickets: {userTickets.length}</p>
                  <p>Sample Data: {userTickets.some(t => t.id.startsWith('sample-')) ? 'Yes' : 'No'}</p>
                  {getTicketCount() > 0 && (
                    <p className="text-green-600">✅ Real tickets found in contract!</p>
                  )}
                  {getTicketCount() === 0 && (
                    <p className="text-yellow-600">⚠️ No tickets found in contract (showing samples)</p>
                  )}
                </div>
              </div>
            )}

            {isLoadingTickets ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                <p>{error}</p>
                <Button onClick={handleRefresh} className="mt-4">Retry</Button>
              </div>
            ) : userTickets.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No tickets yet</h3>
                <p className="text-muted-foreground mb-6">Start by purchasing your first NFT ticket</p>
                <Button asChild>
                  <Link href="/events">Browse Events</Link>
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <h2 className="text-2xl font-bold font-sans">Transaction History</h2>
            <TransactionHistory />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold font-sans">Account Settings</h2>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-sans">Wallet Information</CardTitle>
                  <CardDescription className="font-serif">Your connected wallet details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Wallet Address:</span>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{address}</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Network:</span>
                    <Badge variant="secondary">ZetaChain</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-sans">Contract Integration</CardTitle>
                  <CardDescription className="font-serif">Smart contract connection status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Contract Address:</span>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{NFT_CONTRACT_ADDRESS}</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Connection Status:</span>
                    <Badge variant={isConnected ? "default" : "secondary"}>
                      {isConnected ? "Connected" : "Disconnected"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tickets Found:</span>
                    <Badge variant="outline">
                      {getTicketCount()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-sans">Preferences</CardTitle>
                  <CardDescription className="font-serif">Customize your experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Email notifications</span>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Privacy settings</span>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
