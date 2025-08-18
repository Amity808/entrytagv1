import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, ArrowUpRight, ArrowDownLeft, ShoppingCart } from "lucide-react"
import { format } from "date-fns"
import type { TransferRecord } from "@/lib/mock-user-data"

interface TransactionHistoryProps {
  transactions: TransferRecord[]
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const getTransactionIcon = (type: TransferRecord["type"]) => {
    switch (type) {
      case "purchase":
        return ShoppingCart
      case "transfer":
        return ArrowUpRight
      case "resale":
        return ArrowDownLeft
      default:
        return ShoppingCart
    }
  }

  const getTransactionColor = (type: TransferRecord["type"]) => {
    switch (type) {
      case "purchase":
        return "text-blue-600"
      case "transfer":
        return "text-orange-600"
      case "resale":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const formatAddress = (address: string) => {
    if (address === "0x0000000000000000000000000000000000000000") {
      return "Mint"
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-sans">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground font-serif py-8">No transactions yet</p>
          ) : (
            transactions.map((transaction) => {
              const Icon = getTransactionIcon(transaction.type)
              return (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Icon className={`h-4 w-4 ${getTransactionColor(transaction.type)}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {transaction.type}
                        </Badge>
                        {transaction.price && <span className="text-sm font-semibold">{transaction.price} ETH</span>}
                      </div>
                      <p className="text-sm text-muted-foreground font-serif">
                        From {formatAddress(transaction.from)} to {formatAddress(transaction.to)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), "MMM dd, yyyy • h:mm a")}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="px-2">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
