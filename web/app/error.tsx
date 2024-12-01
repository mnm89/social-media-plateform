"use client"

// Error boundaries must be Client Components
import { useEffect } from "react"
import { redirect, usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const path = usePathname()
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  if (error.message === "Access denied" || error.name === "Access denied")
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="p-6 shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Unauthorized</h2>
          <p className="text-gray-600 mt-2">
            You must be logged in to view this page.
          </p>
          <Button
            variant="default"
            onClick={() => redirect("/login?redirectTo=" + path)}
            className="mt-4"
          >
            Go to Login
          </Button>
        </Card>
      </div>
    )
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="p-6 shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Something went wrong:
          <span className="ml-2 text-destructive font-light text-xl">
            {error.digest}
          </span>
        </h2>

        {error.message.includes("<!DOCTYPE html>") ? (
          <div dangerouslySetInnerHTML={{ __html: error.message }}></div>
        ) : (
          <p className="text-gray-600 mt-2">{error.message}</p>
        )}
        <p className="text-gray-600 mt-2">
          Please try again or reload the page
        </p>
        <div className="flex justify-between">
          <Button variant="default" onClick={() => reset()} className="mt-4">
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            reload
          </Button>
        </div>
      </Card>
    </div>
  )
}
