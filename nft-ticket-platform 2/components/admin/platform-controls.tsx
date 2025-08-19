"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Pause, Play, Shield, DollarSign, AlertTriangle, CheckCircle, Wallet } from "lucide-react"

export function PlatformControls() {
  const [platformPaused, setPlatformPaused] = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [platformFee, setPlatformFee] = useState("5")
  const [maxTicketsPerTx, setMaxTicketsPerTx] = useState("10")

  return (
    <div className="space-y-6">
      {/* Platform Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sans">
            <Shield className="h-5 w-5" />
            Platform Status
          </CardTitle>
          <CardDescription className="font-serif">Control platform operations and availability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">Platform Operations</Label>
              <p className="text-sm text-muted-foreground">
                {platformPaused ? "Platform is currently paused" : "Platform is operational"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={
                  platformPaused
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                }
                variant="secondary"
              >
                {platformPaused ? "Paused" : "Active"}
              </Badge>
              <Button
                variant={platformPaused ? "default" : "destructive"}
                size="sm"
                onClick={() => setPlatformPaused(!platformPaused)}
              >
                {platformPaused ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Resume Platform
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Platform
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">Enable for system updates and maintenance</p>
            </div>
            <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
          </div>

          {(platformPaused || maintenanceMode) && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {platformPaused && "Platform operations are paused. Users cannot purchase tickets."}
                {maintenanceMode && " Maintenance mode is enabled. Platform may be unavailable."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Platform Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sans">
            <Settings className="h-5 w-5" />
            Platform Settings
          </CardTitle>
          <CardDescription className="font-serif">Configure platform parameters and fees</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="platformFee">Platform Fee (%)</Label>
              <Input
                id="platformFee"
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={platformFee}
                onChange={(e) => setPlatformFee(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Current fee: {platformFee}% of ticket price</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxTickets">Max Tickets Per Transaction</Label>
              <Input
                id="maxTickets"
                type="number"
                min="1"
                max="50"
                value={maxTicketsPerTx}
                onChange={(e) => setMaxTicketsPerTx(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Maximum tickets users can buy in one transaction</p>
            </div>
          </div>

          <Button>
            <CheckCircle className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* Financial Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sans">
            <DollarSign className="h-5 w-5" />
            Financial Controls
          </CardTitle>
          <CardDescription className="font-serif">Manage platform finances and payouts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold">4,280 ZETA</div>
              <div className="text-sm text-muted-foreground">Platform Fees Collected</div>
            </div>
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold">2,150 ZETA</div>
              <div className="text-sm text-muted-foreground">Pending Payouts</div>
            </div>
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold">81,320 ZETA</div>
              <div className="text-sm text-muted-foreground">Total Processed</div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button>
              <Wallet className="h-4 w-4 mr-2" />
              Process Payouts
            </Button>
            <Button variant="outline" className="bg-transparent">
              <DollarSign className="h-4 w-4 mr-2" />
              Withdraw Fees
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sans text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Emergency Controls
          </CardTitle>
          <CardDescription className="font-serif">Use only in case of security issues or emergencies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              These actions will immediately affect all platform operations. Use with extreme caution.
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button variant="destructive">Emergency Pause All Events</Button>
            <Button variant="destructive">Freeze All Transactions</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
