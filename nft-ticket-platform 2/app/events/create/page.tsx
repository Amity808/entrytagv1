"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useWriteContract, useReadContract, useAccount, useSimulateContract } from "wagmi"
import { NFT_CONTRACT_ADDRESS } from "@/contract/address"
import Abi from "@/contract/abi.json";
import { makeContractMetadata } from "@/utils/UploadPinta"

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    location: "",
    basePrice: "",
    totalCapacity: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    image: "",
  })

  const { writeContractAsync } = useWriteContract()
  const { address, isConnected } = useAccount()

  // Simulate the contract call to check for errors
  const { data: simulationData, error: simulationError } = useSimulateContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: Abi.abi,
    functionName: "create_ticket",
    args: formData.name && formData.category && formData.startDate && formData.endDate && formData.basePrice && formData.totalCapacity ? [
      "ipfs://placeholder", // Placeholder metadata URI for simulation
      Number(formData.category),
      Math.ceil((formData.startDate as Date).getTime() / 1000),
      Math.ceil((formData.endDate as Date).getTime() / 1000),
      BigInt(Math.floor(Number(formData.basePrice) * 10 ** 18)),
      BigInt(formData.totalCapacity)
    ] : undefined,
    query: {
      enabled: !!(
        formData.name &&
        formData.category &&
        formData.startDate &&
        formData.endDate &&
        formData.basePrice &&
        formData.totalCapacity &&
        // Only simulate if dates are valid
        formData.startDate &&
        formData.startDate.getTime() > Date.now() + 60 * 60 * 1000 && // 1 hour in future
        formData.endDate &&
        formData.startDate &&
        formData.endDate.getTime() > formData.startDate.getTime() + 2 * 60 * 60 * 1000 // 2 hours after start
      )
    }
  })

  // Check if user is contract owner
  const { data: ownerData } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: Abi.abi,
    functionName: "owner",
  })

  // Check if contract is paused
  const { data: pausedData } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: Abi.abi,
    functionName: "paused",
  })

  // Get current block timestamp for comparison
  const { data: blockTimestampData } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: Abi.abi,
    functionName: "blockTimestamp",
  })

  const isOwner = ownerData && address && typeof ownerData === 'string' && ownerData.toLowerCase() === address.toLowerCase()
  const isPaused = pausedData === true

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if user is connected
    if (!isConnected || !address) {
      alert("Please connect your wallet first")
      return
    }

    // Basic validation
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Event name is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.basePrice || Number.parseFloat(formData.basePrice) <= 0) {
      newErrors.basePrice = "Valid price is required"
    }
    if (!formData.totalCapacity || Number.parseInt(formData.totalCapacity) <= 0) {
      newErrors.totalCapacity = "Valid capacity is required"
    }
    if (!formData.startDate) newErrors.startDate = "Start date is required"
    if (!formData.endDate) newErrors.endDate = "End date is required"
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = "End date must be after start date"
    }

    // Ensure start date is at least 5 minutes in the future
    if (formData.startDate) {
      const now = new Date()
      const minStartTime = new Date(now.getTime() + 5 * 60 * 1000) // 5 minutes from now
      if (formData.startDate <= minStartTime) {
        newErrors.startDate = "Start date must be at least 5 minutes in the future"
      }
    }

    // Ensure end date is at least 2 hours after start date
    if (formData.startDate && formData.endDate) {
      const minEndTime = new Date(formData.startDate.getTime() + 2 * 60 * 60 * 1000) // 2 hours after start
      if (formData.endDate < minEndTime) {
        newErrors.endDate = "End date must be at least 2 hours after start date"
      }
    }

    // Additional validation: ensure start time is at least 1 hour in the future for contract compatibility
    if (formData.startDate) {
      const now = new Date()
      const minStartTime = new Date(now.getTime() + 60 * 60 * 1000) // 1 hour from now
      if (formData.startDate <= minStartTime) {
        newErrors.startDate = "Start date must be at least 1 hour in the future for contract compatibility"
      }
    }

    setErrors(newErrors)

    // Only proceed if there are no validation errors
    if (Object.keys(newErrors).length > 0) {
      return
    }

    // Check simulation for errors
    if (simulationError) {
      console.error("Simulation error:", simulationError)
      alert(`Transaction simulation failed: ${simulationError.message}`)
      return
    }

    try {
      // Create metadata first
      const result = await makeContractMetadata({
        imageFile: new File([], "image.png"),
        name: formData.name,
        description: formData.description,
        tiers: formData.category,
        totalCapacity: Number(formData.totalCapacity),
        location: formData.location,
      })

      console.log("Metadata created:", result)
      console.log("User address:", address)
      console.log("Contract address:", NFT_CONTRACT_ADDRESS)

      const tx = await writeContractAsync({
        address: NFT_CONTRACT_ADDRESS,
        abi: Abi.abi,
        functionName: "create_ticket",
        args: [
          result,
          Number(formData.category),
          Math.ceil((formData.startDate as Date).getTime() / 1000),
          Math.ceil((formData.endDate as Date).getTime() / 1000),
          BigInt(Math.floor(Number(formData.basePrice) * 10 ** 18)),
          BigInt(formData.totalCapacity)
        ],
      })

      console.log("Transaction hash:", tx)

      // Transaction submitted successfully
      alert("Event creation transaction submitted! Check your wallet for confirmation.")

    } catch (error: any) {
      console.error("Transaction failed:", error)

      // Provide more specific error information
      if (error.message) {
        alert(`Transaction failed: ${error.message}`)
      } else if (error.reason) {
        alert(`Transaction failed: ${error.reason}`)
      } else {
        alert("Transaction failed. Check console for details.")
      }
    }
  }

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
          <h1 className="text-2xl font-bold text-foreground font-sans">Create New Event</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Event Details</CardTitle>
            <CardDescription className="font-serif">
              Fill in the information below to create your NFT event tickets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contract Requirements Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">📋 Contract Requirements</h3>
                <div className="text-xs text-blue-800 space-y-1">
                  <p>• Start time must be at least 1 hour in the future</p>
                  <p>• End time must be at least 2 hours after start time</p>
                  <p>• All times are converted to Unix timestamps (seconds since epoch)</p>
                  <p>• The contract will reject events with past start times</p>
                </div>
              </div>

              {/* Event Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Event Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter event name"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              {/* Event Image */}
              <div className="space-y-2">
                <Label htmlFor="image">Event Image *</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setFormData({ ...formData, image: file.name })
                    }
                  }}
                  placeholder="Select event image"
                  className={errors.image ? "border-destructive" : ""}
                />
                {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your event"
                  rows={4}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Concert</SelectItem>
                    <SelectItem value="1">Sports</SelectItem>
                    <SelectItem value="2">Conference</SelectItem>
                    <SelectItem value="3">Theater</SelectItem>
                    <SelectItem value="4">Festival</SelectItem>
                    <SelectItem value="5">Exhibition</SelectItem>
                    <SelectItem value="6">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Event location"
                  className={errors.location ? "border-destructive" : ""}
                />
                {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
              </div>

              {/* Date Range */}
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  <p className="font-medium mb-1">⚠️ Important Timing Requirements:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Start date must be at least 1 hour in the future</li>
                    <li>End date must be at least 2 hours after start date</li>
                    <li>These restrictions ensure contract compatibility</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.startDate && "text-muted-foreground",
                            errors.startDate && "border-destructive",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => setFormData({ ...formData, startDate: date })}
                          initialFocus
                          disabled={(date) => {
                            // Disable past dates and dates less than 1 hour from now
                            const now = new Date()
                            const minStartTime = new Date(now.getTime() + 60 * 60 * 1000) // 1 hour from now
                            return date < minStartTime
                          }}
                          fromDate={new Date(Date.now() + 60 * 60 * 1000)} // 1 hour from now
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>End Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.endDate && "text-muted-foreground",
                            errors.endDate && "border-destructive",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date) => setFormData({ ...formData, endDate: date })}
                          initialFocus
                          disabled={(date) => {
                            // Disable dates before start date and dates less than 2 hours from start date
                            if (!formData.startDate) return true
                            const minEndTime = new Date(formData.startDate.getTime() + 2 * 60 * 60 * 1000) // 2 hours after start
                            return date <= formData.startDate || date < minEndTime
                          }}
                          fromDate={formData.startDate ? new Date(formData.startDate.getTime() + 2 * 60 * 60 * 1000) : undefined}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
                  </div>
                </div>
              </div>

              {/* Price and Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Ticket Price (ZETA) *</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    placeholder="0.00"
                    className={errors.basePrice ? "border-destructive" : ""}
                  />
                  {errors.basePrice && <p className="text-sm text-destructive">{errors.basePrice}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalCapacity">Total Capacity *</Label>
                  <Input
                    id="totalCapacity"
                    type="number"
                    min="1"
                    value={formData.totalCapacity}
                    onChange={(e) => setFormData({ ...formData, totalCapacity: e.target.value })}
                    placeholder="100"
                    className={errors.totalCapacity ? "border-destructive" : ""}
                  />
                  {errors.totalCapacity && <p className="text-sm text-destructive">{errors.totalCapacity}</p>}
                </div>
              </div>

              {/* Debug Information */}
              {isConnected && (
                <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <h4 className="text-sm font-medium">Debug Information</h4>
                  <div className="text-xs space-y-1">
                    <p>Connected Address: {address}</p>
                    <p>Contract Address: {NFT_CONTRACT_ADDRESS}</p>
                    <p>Is Owner: {isOwner ? "Yes ✓" : "No ✗"}</p>
                    <p>Is Paused: {isPaused ? "Yes ✗" : "No ✓"}</p>
                    <p>Current Time: {new Date().toISOString()}</p>
                    <p>Current Timestamp: {Math.floor(Date.now() / 1000)}</p>
                    {formData.startDate && (
                      <p>Start Timestamp: {Math.ceil(formData.startDate.getTime() / 1000)} ({formData.startDate.toISOString()})</p>
                    )}
                    {formData.endDate && (
                      <p>End Timestamp: {Math.ceil(formData.endDate.getTime() / 1000)} ({formData.endDate.toISOString()})</p>
                    )}
                    {formData.startDate && (
                      <p>Time Until Start: {Math.max(0, Math.floor((formData.startDate.getTime() - Date.now()) / 1000))} seconds</p>
                    )}
                    {formData.startDate && formData.endDate && (
                      <div className="space-y-1">
                        <p className="font-medium">Contract Parameters:</p>
                        <p>Start: {Math.ceil(formData.startDate.getTime() / 1000)} ({formData.startDate.toISOString()})</p>
                        <p>End: {Math.ceil(formData.endDate.getTime() / 1000)} ({formData.endDate.toISOString()})</p>
                        <p>Current: {Math.floor(Date.now() / 1000)} ({new Date().toISOString()})</p>
                        <p>Start Date Object: {formData.startDate.toString()}</p>
                        <p>Start Date getTime(): {formData.startDate.getTime()}</p>
                        <p>Current Date getTime(): {Date.now()}</p>
                        <p>Difference (ms): {formData.startDate.getTime() - Date.now()}</p>
                        <p>Difference (seconds): {(formData.startDate.getTime() - Date.now()) / 1000}</p>
                        {Math.ceil(formData.startDate.getTime() / 1000) <= Math.floor(Date.now() / 1000) && (
                          <p className="text-destructive font-medium">⚠️ Start time is in the past!</p>
                        )}
                        {Math.ceil(formData.endDate.getTime() / 1000) <= Math.ceil(formData.startDate.getTime() / 1000) && (
                          <p className="text-destructive font-medium">⚠️ End time is before or equal to start time!</p>
                        )}
                      </div>
                    )}
                    {simulationError && (
                      <p className="text-destructive">
                        Simulation Error: {simulationError.message}
                      </p>
                    )}
                    {!simulationData && !simulationError && formData.startDate && (
                      <p className="text-yellow-600">
                        Simulation disabled - ensure all fields are filled and dates are valid
                      </p>
                    )}
                    {simulationData && (
                      <p className="text-green-600">
                        Simulation Successful ✓
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                // disabled={!isOwner}
                // title={!isOwner ? "Only the contract owner can create events" : ""}
                >
                  Create Event
                </Button>
                <Button type="button" variant="outline" className="flex-1 bg-transparent" asChild>
                  <Link href="/events">Cancel</Link>
                </Button>
              </div>

              {/* Test Button for Debugging */}
              <div className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    try {
                      // Test with clearly future dates
                      const testStartDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
                      const testEndDate = new Date(testStartDate.getTime() + 3 * 60 * 60 * 1000) // 3 hours after start

                      console.log("Testing with dates:", {
                        start: testStartDate.toISOString(),
                        end: testEndDate.toISOString(),
                        startTimestamp: Math.ceil(testStartDate.getTime() / 1000),
                        endTimestamp: Math.ceil(testEndDate.getTime() / 1000),
                        currentTimestamp: Math.floor(Date.now() / 1000)
                      })

                      const tx = await writeContractAsync({
                        address: NFT_CONTRACT_ADDRESS,
                        abi: Abi.abi,
                        functionName: "create_ticket",
                        args: [
                          "ipfs://test-metadata",
                          Number(2), // Conference category
                          Math.ceil(testStartDate.getTime() / 1000),
                          Math.ceil(testEndDate.getTime() / 1000),
                          BigInt(10000000000000000), // 0.01 ZETA
                          BigInt(100)
                        ],
                      })

                      console.log("Test transaction hash:", tx)
                      alert("Test event created successfully!")
                    } catch (error: any) {
                      console.error("Test transaction failed:", error)
                      alert(`Test failed: ${error.message || error.reason || 'Unknown error'}`)
                    }
                  }}
                  className="w-full"
                >
                  🧪 Test: Create Event with Future Dates
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
