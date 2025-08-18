"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Tag, Users, Zap, Crown, Star } from "lucide-react"
import type { Event } from "@/lib/mock-data"

export type TicketTier = "general" | "premium" | "vip"

interface TicketSelection {
  tier: TicketTier
  quantity: number
  price: number
}

interface TicketSelectorProps {
  event: Event
  onSelectionChange: (selections: TicketSelection[]) => void
}

export function TicketSelector({ event, onSelectionChange }: TicketSelectorProps) {
  const [selections, setSelections] = useState<Record<TicketTier, number>>({
    general: 0,
    premium: 0,
    vip: 0,
  })
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)

  const tierInfo = {
    general: {
      name: "General Admission",
      icon: Users,
      description: "Standard access to the event",
      features: ["Event access", "Standard seating", "Basic amenities"],
      color: "text-muted-foreground",
      bgColor: "bg-muted/10",
    },
    premium: {
      name: "Premium",
      icon: Star,
      description: "Enhanced experience with premium perks",
      features: ["Priority entry", "Premium seating", "Complimentary refreshments", "Event merchandise"],
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    vip: {
      name: "VIP Experience",
      icon: Crown,
      description: "Ultimate luxury experience",
      features: [
        "VIP entrance",
        "Best seating/viewing area",
        "Meet & greet opportunities",
        "Premium catering",
        "Exclusive merchandise",
        "Dedicated concierge",
      ],
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  }

  const updateQuantity = (tier: TicketTier, change: number) => {
    const newQuantity = Math.max(0, Math.min(10, selections[tier] + change))
    const newSelections = { ...selections, [tier]: newQuantity }
    setSelections(newSelections)

    // Convert to array format for parent component
    const selectionArray: TicketSelection[] = Object.entries(newSelections)
      .filter(([, quantity]) => quantity > 0)
      .map(([tier, quantity]) => ({
        tier: tier as TicketTier,
        quantity,
        price: event.tierPrices[tier as keyof typeof event.tierPrices],
      }))

    onSelectionChange(selectionArray)
  }

  const applyPromoCode = () => {
    // Mock promo code validation
    const validCodes = {
      EARLY20: 20,
      STUDENT10: 10,
      VIP5: 5,
    }

    const discount = validCodes[promoCode as keyof typeof validCodes]
    if (discount) {
      setPromoApplied(true)
      setPromoDiscount(discount)
    } else {
      setPromoApplied(false)
      setPromoDiscount(0)
    }
  }

  const removePromoCode = () => {
    setPromoCode("")
    setPromoApplied(false)
    setPromoDiscount(0)
  }

  const getAvailableTickets = (tier: TicketTier) => {
    return event.tierCapacities[tier] - event.tierSold[tier]
  }

  const isTicketAvailable = (tier: TicketTier) => {
    return getAvailableTickets(tier) > 0
  }

  const totalTickets = Object.values(selections).reduce((sum, qty) => sum + qty, 0)
  const subtotal = Object.entries(selections).reduce((sum, [tier, quantity]) => {
    return sum + quantity * event.tierPrices[tier as keyof typeof event.tierPrices]
  }, 0)

  const discountAmount = (subtotal * promoDiscount) / 100
  const total = subtotal - discountAmount

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sans">
            <Zap className="h-5 w-5 text-primary" />
            Select Tickets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {(Object.keys(tierInfo) as TicketTier[]).map((tier) => {
            const info = tierInfo[tier]
            const Icon = info.icon
            const available = getAvailableTickets(tier)
            const isAvailable = isTicketAvailable(tier)
            const price = event.tierPrices[tier]

            return (
              <Card key={tier} className={`${isAvailable ? "border-border" : "border-muted opacity-60"}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${info.bgColor}`}>
                        <Icon className={`h-5 w-5 ${info.color}`} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold font-sans">{info.name}</h3>
                        <p className="text-sm text-muted-foreground font-serif">{info.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {info.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {price} {event.currency}
                      </p>
                      <p className="text-sm text-muted-foreground">{available} available</p>
                    </div>
                  </div>

                  {isAvailable ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(tier, -1)}
                          disabled={selections[tier] === 0}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{selections[tier]}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(tier, 1)}
                          disabled={selections[tier] >= Math.min(10, available)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {selections[tier] > 0 && (
                        <p className="font-semibold">
                          {(selections[tier] * price).toFixed(3)} {event.currency}
                        </p>
                      )}
                    </div>
                  ) : (
                    <Badge variant="destructive" className="w-full justify-center">
                      Sold Out
                    </Badge>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </CardContent>
      </Card>

      {/* Promo Code */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <Label htmlFor="promo" className="flex items-center gap-2 font-serif">
              <Tag className="h-4 w-4" />
              Promo Code
            </Label>
            <div className="flex gap-2">
              <Input
                id="promo"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                disabled={promoApplied}
              />
              {promoApplied ? (
                <Button variant="outline" onClick={removePromoCode}>
                  Remove
                </Button>
              ) : (
                <Button variant="outline" onClick={applyPromoCode} disabled={!promoCode}>
                  Apply
                </Button>
              )}
            </div>
            {promoApplied && <p className="text-sm text-green-600">Promo code applied! {promoDiscount}% discount</p>}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      {totalTickets > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(selections)
              .filter(([, quantity]) => quantity > 0)
              .map(([tier, quantity]) => {
                const price = event.tierPrices[tier as keyof typeof event.tierPrices]
                return (
                  <div key={tier} className="flex justify-between">
                    <span className="font-serif">
                      {tierInfo[tier as TicketTier].name} × {quantity}
                    </span>
                    <span className="font-semibold">
                      {(quantity * price).toFixed(3)} {event.currency}
                    </span>
                  </div>
                )
              })}

            <Separator />

            <div className="flex justify-between">
              <span className="font-serif">Subtotal</span>
              <span className="font-semibold">
                {subtotal.toFixed(3)} {event.currency}
              </span>
            </div>

            {promoApplied && (
              <div className="flex justify-between text-green-600">
                <span className="font-serif">Discount ({promoDiscount}%)</span>
                <span className="font-semibold">
                  -{discountAmount.toFixed(3)} {event.currency}
                </span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span className="font-sans">Total</span>
              <span>
                {total.toFixed(3)} {event.currency}
              </span>
            </div>

            <p className="text-xs text-muted-foreground font-serif">* Gas fees will be calculated at checkout</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
