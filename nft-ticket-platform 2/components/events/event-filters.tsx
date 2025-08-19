"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface EventFiltersProps {
  onFiltersChange: (filters: any) => void
}

export function EventFilters({ onFiltersChange }: EventFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-sans">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Categories</Label>
          <div className="space-y-2">
            {["Concert", "Conference", "Sports", "Theater", "Festival", "Exhibition", "Other"].map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox id={category} />
                <Label htmlFor={category} className="text-sm font-serif">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Price Range (ZETA)</Label>
          <Slider defaultValue={[0, 100]} max={100} step={5} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0</span>
            <span>100+</span>
          </div>
        </div>

        {/* Date Range */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Date</Label>
          <div className="space-y-2">
            {["Today", "This Week", "This Month", "Next Month"].map((period) => (
              <div key={period} className="flex items-center space-x-2">
                <Checkbox id={period} />
                <Label htmlFor={period} className="text-sm font-serif">
                  {period}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button variant="outline" className="w-full bg-transparent">
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  )
}
