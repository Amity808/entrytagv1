"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react"

interface TransactionStatusProps {
  status: "pending" | "success" | "error"
  hash?: string
  error?: string
  onRetry?: () => void
  onViewTransaction?: () => void
}

export function TransactionStatus({ status, hash, error, onRetry, onViewTransaction }: TransactionStatusProps) {
  if (status === "pending") {
    return (
      <Alert>
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertDescription>
          Transaction is being processed on the blockchain. This may take a few minutes.
        </AlertDescription>
      </Alert>
    )
  }

  if (status === "success") {
    return (
      <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          <div className="flex items-center justify-between">
            <span>Transaction successful! Your NFT tickets have been minted.</span>
            {hash && onViewTransaction && (
              <Button variant="outline" size="sm" onClick={onViewTransaction}>
                <ExternalLink className="h-3 w-3 mr-1" />
                View
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  if (status === "error") {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span>{error || "Transaction failed. Please try again."}</span>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                Retry
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
