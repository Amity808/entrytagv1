"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, ArrowUpRight, ArrowDownLeft } from "lucide-react"

// Mock transaction data
const mockTransactions = [
  {
    id: "tx-1",
    hash: "0x1234567890abcdef1234567890abcdef12345678",
    type: "Purchase",
    eventName: "Summer Music Festival",
    amount: 50,
    date: "2024-06-01T10:30:00Z",
    status: "Confirmed",
    blockNumber: 12345678,
  },
  {
    id: "tx-2",
    hash: "0xabcdef1234567890abcdef1234567890abcdef12",
    type: "Purchase",
    eventName: "Blockchain Summit 2024",
    amount: 25,
    date: "2024-06-15T14:20:00Z",
    status: "Confirmed",
    blockNumber: 12345679,
  },
  {
    id: "tx-3",
    hash: "0x567890abcdef1234567890abcdef1234567890ab",
    type: "Transfer",
    eventName: "Tech Startup Pitch Night",
    amount: 0,
    date: "2024-06-25T16:45:00Z",
    status: "Confirmed",
    blockNumber: 12345680,
  },
]

export function TransactionHistory() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Purchase":
        return <ArrowUpRight className="h-4 w-4 text-green-600" />
      case "Transfer":
        return <ArrowDownLeft className="h-4 w-4 text-blue-600" />
      default:
        return <ArrowUpRight className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Purchase":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Transfer":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const openTransaction = (hash: string) => {
    // This would be dynamic based on the current chain
    window.open(`https://athens.explorer.zetachain.com/tx/${hash}`, "_blank")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-sans">Recent Transactions</CardTitle>
        <CardDescription className="font-serif">Your blockchain transaction history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-4">
                {getTypeIcon(tx.type)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{tx.eventName}</span>
                    <Badge className={getTypeColor(tx.type)} variant="secondary">
                      {tx.type}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(tx.date)} • Block #{tx.blockNumber.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">{formatHash(tx.hash)}</div>
                </div>
              </div>

              <div className="text-right">
                {tx.amount > 0 && <div className="font-semibold">{tx.amount} ZETA</div>}
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {tx.status}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => openTransaction(tx.hash)}>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {mockTransactions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No transactions yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
