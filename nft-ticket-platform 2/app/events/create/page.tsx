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
import { useWriteContract, useReadContract, useAccount } from "wagmi"
import { NFT_CONTRACT_ADDRESS } from "@/contract/address"
import Abi from "@/contract/abi.json";
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
  })

  const { writeContractAsync } = useWriteContract()

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      // Handle form submission
      console.log("Form submitted:", formData)

      try {
        const tx = await writeContractAsync({
          address: NFT_CONTRACT_ADDRESS,
          abi: Abi.abi,
          functionName: "create_ticket",
          args: [formData.name, formData.category, formData.location, formData.basePrice, formData.totalCapacity, formData.startDate, formData.endDate],
        })
        console.log("Transaction successful:", tx)
      } catch (error) {
        console.error("Transaction failed:", error)
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
                    <SelectItem value="Concert">Concert</SelectItem>
                    <SelectItem value="Conference">Conference</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Theater">Theater</SelectItem>
                    <SelectItem value="Festival">Festival</SelectItem>
                    <SelectItem value="Exhibition">Exhibition</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
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
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
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

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  Create Event
                </Button>
                <Button type="button" variant="outline" className="flex-1 bg-transparent" asChild>
                  <Link href="/events">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
