"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Users, Share2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PurchaseButton } from "@/components/tickets/purchase-button"
import { useReadContract } from "wagmi"
import { NFT_CONTRACT_ADDRESS } from "@/contract/address"
import Abi from "@/contract/abi.json"
import { fetchIPFSData } from "@/helper/fetchIPFS"
import { useState, useCallback, useEffect, use } from "react"

interface EventDescription {
  description: string;
  external_link: string;
  image: string;
  name: string;
  properties: {
    category: string;
    unit: string;
  };
}

interface EventData {
  eventDetails: string;
  category: number;
  startTime: bigint;
  endTime: bigint;
  status: number;
  organizer: `0x${string}`;
  totalTickets: bigint;
  soldTickets: bigint;
  basePrice: bigint;
}

interface EventDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  // Unwrap params using React.use() - Next.js 15 compatibility
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [eventDetails, setEventDetails] = useState<EventDescription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch total event count to check if the requested ID exists
  const { data: totalEventCount } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: Abi.abi,
    functionName: "_nextEventId",
    args: [],
  });

  // Fetch event data from contract
  const { data: contractEvent, error: contractError, isLoading: contractLoading } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: Abi.abi,
    functionName: "events",
    args: [id],
    query: {
      enabled: () => {
        const eventId = parseInt(id);
        const totalCount = totalEventCount ? Number(totalEventCount) : 0;
        return !isNaN(eventId) && eventId >= 0 && eventId < totalCount;
      }
    }
  });

  useEffect(() => {
    console.log("Event Detail Page Debug:", {
      eventId: id,
      totalEventCount: totalEventCount?.toString(),
      contractEvent,
      contractError,
      contractLoading,
      contractAddress: NFT_CONTRACT_ADDRESS
    });
  }, [id, totalEventCount, contractEvent, contractError, contractLoading]);

  const formatEventData = useCallback(async () => {
    console.log("Formatting event data:", { contractEvent, eventId: id });

    if (!contractEvent) {
      console.log("No contract event data received");
      if (contractError) {
        setError(`Contract error: ${contractError.message}`);
      } else {
        setError("No event data received from contract");
      }
      setIsLoading(false);
      return;
    }

    if (!Array.isArray(contractEvent)) {
      console.error("Contract event is not an array:", contractEvent);
      setError("Invalid event data format from contract");
      setIsLoading(false);
      return;
    }

    if (contractEvent.length === 0) {
      console.log("Contract event array is empty");
      setError("Event not found in contract");
      setIsLoading(false);
      return;
    }

    console.log("Contract event data:", contractEvent);

    setEventData({
      eventDetails: contractEvent[0],
      category: Number(contractEvent[1]),
      startTime: contractEvent[2],
      endTime: contractEvent[3],
      status: Number(contractEvent[4]),
      organizer: contractEvent[5],
      totalTickets: contractEvent[6],
      soldTickets: contractEvent[7],
      basePrice: contractEvent[8],
    });
  }, [contractEvent, id, contractError]);

  // Fetch IPFS metadata
  const fetchEventDetails = useCallback(async () => {
    if (!eventData?.eventDetails) return;

    try {
      const data = await fetchIPFSData(eventData.eventDetails);
      setEventDetails(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching IPFS data:', error);
      setError("Failed to load event details from IPFS");
      setIsLoading(false);
    }
  }, [eventData?.eventDetails]);

  // Get category name from enum
  const getCategoryName = (category: number) => {
    const categories = ["Concert", "Sports", "Conference", "Theater", "Festival", "Exhibition", "Other"];
    return categories[category] || "Unknown";
  };

  // Get status name from enum
  const getStatusName = (status: number) => {
    const statuses = ["Created", "Active", "SoldOut", "Cancelled", "Completed"];
    return statuses[status] || "Unknown";
  };

  // Format date from timestamp
  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time from timestamp
  const formatTime = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: number) => {
    switch (getStatusName(status)) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "SoldOut":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "Cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "Completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  };

  useEffect(() => {
    formatEventData();
  }, [formatEventData]);

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  // Handle contract errors
  useEffect(() => {
    if (contractError) {
      setError(`Failed to load event: ${contractError.message}`);
      setIsLoading(false);
    }
  }, [contractError]);

  // Show loading state
  if (!isClient || isLoading || contractLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground font-serif">Loading event details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !eventData || !eventDetails) {
    const eventId = parseInt(id);
    const totalCount = totalEventCount ? Number(totalEventCount) : 0;
    const isValidId = !isNaN(eventId) && eventId >= 0;
    const idExists = isValidId && eventId < totalCount;

    let errorMessage = error || "Failed to load event details";
    let suggestion = "";

    if (totalCount === 0) {
      errorMessage = "No events have been created yet";
      suggestion = "Create your first event to get started!";
    } else if (!isValidId) {
      errorMessage = "Invalid event ID";
      suggestion = "Event ID must be a valid number";
    } else if (!idExists) {
      errorMessage = `Event ID ${eventId} does not exist`;
      suggestion = `Available event IDs: 0 to ${totalCount - 1}`;
    }

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/events">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Link>
            </Button>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-2">{errorMessage}</p>
          {suggestion && (
            <p className="text-sm text-blue-600 mb-6">{suggestion}</p>
          )}
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Total events in contract: {totalCount}</p>
              <p>Requested event ID: {id}</p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button asChild>
                <Link href="/events">Back to Events</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/events/create">Create Event</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const availableTickets = Number(eventData.totalTickets) - Number(eventData.soldTickets);
  const soldOutPercentage = (Number(eventData.soldTickets) / Number(eventData.totalTickets)) * 100;

  const handlePurchaseSuccess = (txHash: string) => {
    // Redirect to dashboard or show success message
    console.log("Purchase successful:", txHash);
  }

  // Utility function to truncate address
  const truncateAddress = (address: string) => {
    if (!address) return "Unknown";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const eventForPurchase = {
    id: id,
    name: eventDetails.name,
    description: eventDetails.description,
    category: getCategoryName(eventData.category),
    startDate: formatDate(eventData.startTime),
    endDate: formatDate(eventData.endTime),
    location: eventDetails.properties?.unit || "Location TBD",
    basePrice: Number(eventData.basePrice) / 10 ** 18,
    totalCapacity: Number(eventData.totalTickets),
    ticketsSold: Number(eventData.soldTickets),
    status: eventData.status, // Pass raw numeric status instead of converted string
    imageUrl: eventDetails.image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
  };

  // Debug logging for purchase button
  console.log("Event for purchase:", {
    eventId: id,
    rawStatus: eventData.status,
    convertedStatus: getStatusName(eventData.status),
    totalCapacity: Number(eventData.totalTickets),
    ticketsSold: Number(eventData.soldTickets),
    availableTickets: Number(eventData.totalTickets) - Number(eventData.soldTickets),
    canPurchase: getStatusName(eventData.status) === "Active" && (Number(eventData.totalTickets) - Number(eventData.soldTickets)) > 0
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-accent/20 to-primary/20">
              <img src={eventForPurchase.imageUrl || "/placeholder.svg"} alt={eventForPurchase.name} className="w-full h-full object-cover" />
            </div>

            {/* Event Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{eventForPurchase.category}</Badge>
                <Badge className={getStatusColor(eventData.status)}>{getStatusName(eventData.status)}</Badge>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4 font-sans">{eventForPurchase.name}</h1>
              <p className="text-lg text-muted-foreground font-serif leading-relaxed">{eventForPurchase.description}</p>
            </div>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sans">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-semibold">{formatDate(eventData.startTime)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(eventData.startTime)} - {formatTime(eventData.endTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-semibold">{eventForPurchase.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-semibold">
                      {Number(eventData.soldTickets).toLocaleString()} / {Number(eventData.totalTickets).toLocaleString()} tickets sold
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {availableTickets.toLocaleString()} tickets remaining
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            {eventDetails.properties && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-sans">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {Object.entries(eventDetails.properties).map(([key, value]) => (
                      <li key={key} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent rounded-full" />
                        <span className="font-serif">{key}: {value}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="font-sans">Get Your Ticket</CardTitle>
                <CardDescription className="font-serif">Secure your spot with an NFT ticket</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{eventForPurchase.basePrice} ZETA</div>
                  <p className="text-sm text-muted-foreground">per ticket</p>
                </div>

                <Separator />

                {/* Availability Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Availability</span>
                    <span>{Math.round(soldOutPercentage)}% sold</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${soldOutPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {availableTickets.toLocaleString()} of {Number(eventData.totalTickets).toLocaleString()} remaining
                  </p>
                </div>

                <Separator />

                <PurchaseButton event={eventForPurchase} className="w-full" onPurchaseSuccess={handlePurchaseSuccess} />

                <Button variant="outline" className="w-full bg-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Event
                </Button>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sans">Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{truncateAddress(eventData.organizer)}</p>
                <p className="text-sm text-muted-foreground font-serif mt-1">Verified event organizer</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
