"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Upload, Plus, Minus, Eye, ArrowLeft, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import type { EventCategory } from "@/lib/mock-data"

interface EventFormData {
  // Basic Info
  title: string
  description: string
  category: EventCategory | ""
  image: string

  // Venue & Time
  venue: string
  address: string
  city: string
  state: string
  country: string
  startDate: Date | undefined
  endDate: Date | undefined
  startTime: string
  endTime: string

  // Ticket Configuration
  tiers: {
    general: { enabled: boolean; capacity: number; price: number }
    premium: { enabled: boolean; capacity: number; price: number }
    vip: { enabled: boolean; capacity: number; price: number }
  }

  // Blockchain Settings
  chains: string[]
  currency: string
}

const initialFormData: EventFormData = {
  title: "",
  description: "",
  category: "",
  image: "",
  venue: "",
  address: "",
  city: "",
  state: "",
  country: "",
  startDate: undefined,
  endDate: undefined,
  startTime: "",
  endTime: "",
  tiers: {
    general: { enabled: true, capacity: 100, price: 0.05 },
    premium: { enabled: false, capacity: 50, price: 0.1 },
    vip: { enabled: false, capacity: 20, price: 0.2 },
  },
  chains: ["Ethereum"],
  currency: "ETH",
}

interface EventCreationWizardProps {
  onSubmit: (data: EventFormData) => void
  onCancel: () => void
}

export function EventCreationWizard({ onSubmit, onCancel }: EventCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<EventFormData>(initialFormData)

  const steps = [
    { id: 1, title: "Basic Information", description: "Event details and description" },
    { id: 2, title: "Venue & Schedule", description: "Location and timing" },
    { id: 3, title: "Ticket Configuration", description: "Pricing and capacity" },
    { id: 4, title: "Blockchain Settings", description: "Networks and currency" },
    { id: 5, title: "Review & Publish", description: "Final review" },
  ]

  const categories: EventCategory[] = ["Concert", "Sports", "Conference", "Theater", "Festival", "Exhibition", "Other"]
  const chains = ["Ethereum", "Polygon", "Arbitrum", "Optimism", "ZetaChain"]

  const updateFormData = (updates: Partial<EventFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const updateTier = (tier: keyof EventFormData["tiers"], updates: Partial<EventFormData["tiers"]["general"]>) => {
    setFormData((prev) => ({
      ...prev,
      tiers: {
        ...prev.tiers,
        [tier]: { ...prev.tiers[tier], ...updates },
      },
    }))
  }

  const toggleChain = (chain: string) => {
    const newChains = formData.chains.includes(chain)
      ? formData.chains.filter((c) => c !== chain)
      : [...formData.chains, chain]
    updateFormData({ chains: newChains })
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.description && formData.category
      case 2:
        return formData.venue && formData.city && formData.startDate && formData.startTime
      case 3:
        return Object.values(formData.tiers).some((tier) => tier.enabled)
      case 4:
        return formData.chains.length > 0
      default:
        return true
    }
  }

  const getTotalCapacity = () => {
    return Object.values(formData.tiers)
      .filter((tier) => tier.enabled)
      .reduce((sum, tier) => sum + tier.capacity, 0)
  }

  const getLowestPrice = () => {
    const enabledTiers = Object.values(formData.tiers).filter((tier) => tier.enabled)
    return enabledTiers.length > 0 ? Math.min(...enabledTiers.map((tier) => tier.price)) : 0
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-serif">
                Event Title *
              </Label>
              <Input
                id="title"
                placeholder="Enter event title"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-serif">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your event..."
                rows={4}
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-serif">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => updateFormData({ category: value as EventCategory })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-serif">Event Image</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground font-serif">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="venue" className="font-serif">
                Venue Name *
              </Label>
              <Input
                id="venue"
                placeholder="Enter venue name"
                value={formData.venue}
                onChange={(e) => updateFormData({ venue: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="font-serif">
                Address
              </Label>
              <Input
                id="address"
                placeholder="Street address"
                value={formData.address}
                onChange={(e) => updateFormData({ address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="font-serif">
                  City *
                </Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => updateFormData({ city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="font-serif">
                  State/Province
                </Label>
                <Input
                  id="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => updateFormData({ state: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="font-serif">
                Country
              </Label>
              <Input
                id="country"
                placeholder="Country"
                value={formData.country}
                onChange={(e) => updateFormData({ country: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-serif">Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => updateFormData({ startDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label className="font-serif">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => updateFormData({ endDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="font-serif">
                  Start Time *
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => updateFormData({ startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime" className="font-serif">
                  End Time
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => updateFormData({ endTime: e.target.value })}
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold font-sans">Ticket Tiers</h3>

              {(Object.keys(formData.tiers) as Array<keyof typeof formData.tiers>).map((tierKey) => {
                const tier = formData.tiers[tierKey]
                const tierNames = {
                  general: "General Admission",
                  premium: "Premium",
                  vip: "VIP Experience",
                }

                return (
                  <Card key={tierKey} className={tier.enabled ? "border-primary" : "border-muted"}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={tier.enabled}
                            onChange={(e) => updateTier(tierKey, { enabled: e.target.checked })}
                            className="rounded"
                          />
                          <h4 className="font-semibold font-sans">{tierNames[tierKey]}</h4>
                        </div>
                        {tier.enabled && <Badge variant="outline">Enabled</Badge>}
                      </div>

                      {tier.enabled && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="font-serif">Capacity</Label>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateTier(tierKey, { capacity: Math.max(1, tier.capacity - 10) })}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={tier.capacity}
                                onChange={(e) =>
                                  updateTier(tierKey, { capacity: Number.parseInt(e.target.value) || 0 })
                                }
                                className="text-center"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateTier(tierKey, { capacity: tier.capacity + 10 })}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="font-serif">Price (ETH)</Label>
                            <Input
                              type="number"
                              step="0.001"
                              value={tier.price}
                              onChange={(e) => updateTier(tierKey, { price: Number.parseFloat(e.target.value) || 0 })}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold font-sans mb-2">Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="font-serif">Total Capacity:</span>
                    <span className="font-semibold">{getTotalCapacity()} tickets</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-serif">Starting Price:</span>
                    <span className="font-semibold">{getLowestPrice()} ETH</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="font-serif">Supported Blockchain Networks *</Label>
              <p className="text-sm text-muted-foreground font-serif">
                Select which networks your event tickets will be available on
              </p>
              <div className="flex flex-wrap gap-2">
                {chains.map((chain) => (
                  <Badge
                    key={chain}
                    variant={formData.chains.includes(chain) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleChain(chain)}
                  >
                    {chain}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-serif">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => updateFormData({ currency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="MATIC">MATIC</SelectItem>
                  <SelectItem value="ZETA">ZETA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold font-sans mb-2">Platform Fees</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-serif">Platform Fee:</span>
                    <span>2.5% per ticket sale</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-serif">Gas Fees:</span>
                    <span>Paid by ticket buyers</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-serif">Cross-chain Fees:</span>
                    <span>Variable by network</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-sans">Event Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-sans">{formData.title}</h3>
                    <p className="text-muted-foreground font-serif">{formData.description}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{formData.category}</Badge>
                      {formData.chains.map((chain) => (
                        <Badge key={chain} variant="secondary" className="text-xs">
                          {chain}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold font-sans">Venue</p>
                    <p className="text-muted-foreground font-serif">{formData.venue}</p>
                    <p className="text-muted-foreground font-serif">
                      {formData.city}
                      {formData.state && `, ${formData.state}`}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold font-sans">Date & Time</p>
                    <p className="text-muted-foreground font-serif">
                      {formData.startDate && format(formData.startDate, "PPP")}
                    </p>
                    <p className="text-muted-foreground font-serif">
                      {formData.startTime} {formData.endTime && `- ${formData.endTime}`}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="font-semibold font-sans mb-2">Ticket Tiers</p>
                  <div className="space-y-2">
                    {Object.entries(formData.tiers)
                      .filter(([, tier]) => tier.enabled)
                      .map(([tierKey, tier]) => {
                        const tierNames = {
                          general: "General Admission",
                          premium: "Premium",
                          vip: "VIP Experience",
                        }
                        return (
                          <div key={tierKey} className="flex justify-between text-sm">
                            <span className="font-serif">{tierNames[tierKey as keyof typeof tierNames]}</span>
                            <span>
                              {tier.capacity} tickets • {tier.price} {formData.currency}
                            </span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-serif">
                <strong>Ready to publish?</strong> Your event will be deployed to the blockchain and made available for
                ticket sales. This action cannot be undone.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress */}
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="font-serif">
            Step {currentStep} of {steps.length}
          </span>
          <span className="font-serif">{Math.round((currentStep / steps.length) * 100)}% Complete</span>
        </div>
        <Progress value={(currentStep / steps.length) * 100} />

        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step.id <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 ${step.id < currentStep ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sans">{steps[currentStep - 1].title}</CardTitle>
          <p className="text-muted-foreground font-serif">{steps[currentStep - 1].description}</p>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => (currentStep === 1 ? onCancel() : setCurrentStep(currentStep - 1))}
          className="bg-transparent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentStep === 1 ? "Cancel" : "Previous"}
        </Button>

        {currentStep < steps.length ? (
          <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={!canProceed()}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={() => onSubmit(formData)}>
            <Eye className="h-4 w-4 mr-2" />
            Publish Event
          </Button>
        )}
      </div>
    </div>
  )
}
