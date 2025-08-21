import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"
import Link from "next/link"
import { PurchaseButton } from "@/components/tickets/purchase-button"
import { useWriteContract, useReadContract, useAccount, useSimulateContract } from "wagmi"
import { NFT_CONTRACT_ADDRESS } from "@/contract/address"
import Abi from "@/contract/abi.json";
import { makeContractMetadata } from "@/utils/UploadPinta"
import { fetchIPFSData, convertIPFSUrl } from "@/helper/fetchIPFS"
import { useState, useCallback, useEffect } from "react"
import { useEventContext } from "@/context/event-context"

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

interface EventCardProps {
  id: string;
}

export function EventCard({ id }: EventCardProps) {
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [eventDetails, setEventDetails] = useState<EventDescription | null>(null);
  const { setEventDetails: setEventDetailsContext } = useEventContext();

  // Fetch event data from contract
  const { data: contractEvent, error: contractError, isLoading: contractLoading } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: Abi.abi,
    functionName: "events",
    args: [id],
  });

  // Format contract data
  const formatEventData = useCallback(async () => {
    if (!contractEvent || !Array.isArray(contractEvent)) {
      console.error("contractEvent is empty or invalid:", contractEvent);
      return;
    }

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
  }, [contractEvent, id]);

  // Fetch IPFS metadata
  const fetchEventDetails = useCallback(async () => {
    if (!eventData?.eventDetails) return;

    try {
      const data = await fetchIPFSData(eventData.eventDetails);
      setEventDetails(data);

      // Share event details with context for search functionality
      if (data) {
        const eventDetailsForContext = {
          id,
          name: data.name || "Unknown Event",
          description: data.description || "",
          category: getCategoryName(eventData.category),
          image: data.image || "",
          basePrice: Number(eventData.basePrice) / 10 ** 18,
        };

        console.log(`Sharing event details for ID ${id}:`, eventDetailsForContext);
        setEventDetailsContext(id, eventDetailsForContext);
      }
    } catch (error) {
      console.error(`Error fetching IPFS data for ID ${id}:`, error);
    }
  }, [eventData?.eventDetails, id, eventData?.category, eventData?.basePrice, setEventDetailsContext]);

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
      month: "short",
      day: "numeric",
      year: "numeric",
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
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-green-200"
    }
  };

  useEffect(() => {
    formatEventData();
  }, [formatEventData]);

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  // Show loading state
  if (contractLoading) {
    return (
      <Card className="overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
          <div className="text-muted-foreground">Loading event...</div>
        </div>
      </Card>
    );
  }

  // Show error state
  if (contractError) {
    return (
      <Card className="overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
          <div className="text-red-600 text-center p-4">
            <p className="font-medium">Error loading event</p>
            <p className="text-sm">{contractError.message}</p>
          </div>
        </div>
      </Card>
    );
  }

  // Don't render if no event data
  if (!eventData || !eventDetails) {
    return (
      <Card className="overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
          <div className="text-muted-foreground">Event not found</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
        {eventDetails.image ? (
          <img
            src={eventDetails.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
            alt={eventDetails.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error(`Failed to load image for event ${id}:`, eventDetails.image);
              console.error(`Converted URL was:`, eventDetails.image.replace('ipfs://', 'https://ipfs.io/ipfs/'));
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
            onLoad={() => {
              console.log(`Image loaded successfully for event ${id}:`, eventDetails.image.replace('ipfs://', 'https://ipfs.io/ipfs/'));
            }}
          />
        ) : null}
        <div className={`text-muted-foreground text-center p-4 ${eventDetails.image ? 'hidden' : ''}`}>
          <p className="font-medium">No Image</p>
          <p className="text-sm">Event: {eventDetails.name}</p>
        </div>
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{getCategoryName(eventData.category)}</Badge>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              {Number(eventData.basePrice) / 10 ** 18} ZETA
            </span>
            <Badge className={getStatusColor(eventData.status)}>
              {getStatusName(eventData.status)}
            </Badge>
          </div>
        </div>
        <CardTitle className="font-sans">{eventDetails.name}</CardTitle>

        <CardDescription className="font-serif">
          <div className="flex items-center gap-2 mt-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(eventData.startTime)}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="h-4 w-4" />
            <span>{eventDetails.properties?.unit || "Location TBD"}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Users className="h-4 w-4" />
            <span>
              {Number(eventData.soldTickets).toLocaleString()} / {Number(eventData.totalTickets).toLocaleString()} sold
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/events/${id}`}>View Details</Link>
          </Button>
          <PurchaseButton
            event={{
              id,
              name: eventDetails.name,
              basePrice: Number(eventData.basePrice) / 10 ** 18,
              totalCapacity: Number(eventData.totalTickets),
              ticketsSold: Number(eventData.soldTickets),
              status: getStatusName(eventData.status),
            }}
            className="flex-1"
          />
        </div>
      </CardContent>
    </Card>
  )
}

