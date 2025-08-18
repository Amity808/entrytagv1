"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { EventCreationWizard } from "@/components/event-creation-wizard"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Zap, Shield, Globe, TrendingUp } from "lucide-react"
import { useWallet } from "@/lib/wallet-context"

export default function CreateEventPage() {
  const router = useRouter()
  const { isConnected } = useWallet()
  const [showWizard, setShowWizard] = useState(false)

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container py-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold font-sans">Connect Your Wallet</h1>
            <p className="text-muted-foreground font-serif">Please connect your wallet to create and manage events.</p>
          </div>
        </main>
      </div>
    )
  }

  if (showWizard) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container py-8">
          <EventCreationWizard
            onSubmit={(data) => {
              console.log("Event created:", data)
              // Handle event creation
              router.push("/dashboard")
            }}
            onCancel={() => setShowWizard(false)}
          />
        </main>
      </div>
    )
  }

  const features = [
    {
      icon: Zap,
      title: "NFT Tickets",
      description: "Tickets are minted as unique NFTs with built-in authenticity and ownership verification",
    },
    {
      icon: Globe,
      title: "Cross-Chain Support",
      description: "Deploy your event across multiple blockchain networks to reach a wider audience",
    },
    {
      icon: Shield,
      title: "Secure & Transparent",
      description: "Blockchain technology ensures secure transactions and transparent ticket sales",
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Track sales, monitor attendance, and analyze your event performance in real-time",
    },
    {
      icon: Users,
      title: "Flexible Pricing",
      description: "Create multiple ticket tiers with different pricing and capacity limits",
    },
    {
      icon: Calendar,
      title: "Easy Management",
      description: "Intuitive tools to manage your events, tickets, and attendee communications",
    },
  ]

  const benefits = [
    "No upfront costs - only pay when tickets sell",
    "2.5% platform fee (industry leading)",
    "Instant payouts in cryptocurrency",
    "Built-in secondary market for resales",
    "24/7 customer support",
    "Mobile-optimized ticket validation",
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container py-8">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit mx-auto">
                For Event Organizers
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold font-sans">
                Create Your Next
                <span className="text-primary block">NFT Event</span>
              </h1>
              <p className="text-xl text-muted-foreground font-serif max-w-2xl mx-auto leading-relaxed">
                Launch your event on the blockchain with secure NFT tickets, cross-chain support, and powerful
                analytics. Join the future of event ticketing.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => setShowWizard(true)} className="text-lg px-8">
                Create Event
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                View Examples
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-sans mb-4">Why Choose ZetaTickets?</h2>
              <p className="text-muted-foreground font-serif max-w-2xl mx-auto">
                Everything you need to create, manage, and sell tickets for your events with blockchain technology
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card key={index} className="text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold font-sans mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground font-serif">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold font-sans mb-4">Organizer Benefits</h2>
                <p className="text-muted-foreground font-serif">
                  Join thousands of event organizers who trust ZetaTickets for their blockchain-powered events
                </p>
              </div>

              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                    <p className="font-serif">{benefit}</p>
                  </div>
                ))}
              </div>

              <Button size="lg" onClick={() => setShowWizard(true)}>
                Get Started Now
              </Button>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold font-sans mb-2">Ready to Launch?</h3>
                    <p className="text-muted-foreground font-serif">Create your first event in just a few minutes</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                        1
                      </div>
                      <p className="font-serif">Set up event details and venue information</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                        2
                      </div>
                      <p className="font-serif">Configure ticket tiers and pricing</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                        3
                      </div>
                      <p className="font-serif">Deploy to blockchain and start selling</p>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" onClick={() => setShowWizard(true)}>
                    Create Your Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
