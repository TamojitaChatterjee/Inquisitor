"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { SearchResult } from "@/types/search"
import { ResultCard } from "@/components/result-card"
import { Button } from "@/components/ui/button"

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchId = searchParams.get("id")

  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!searchId) {
      setError("No search ID provided")
      setIsLoading(false)
      return
    }

    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/search?id=${searchId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch results")
        }

        const data: SearchResult = await response.json()
        setSearchResult(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [searchId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading results...</p>
        </div>
      </div>
    )
  }

  if (error || !searchResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-4">
            <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
            <p className="text-destructive/80">{error || "Search results not found"}</p>
          </div>
          <Button onClick={() => router.push("/")} className="bg-primary hover:bg-primary/90">
            Back to Search
          </Button>
        </div>
      </div>
    )
  }

  const resultsByPlatform = searchResult.results.reduce(
    (acc, result) => {
      if (!acc[result.platform]) {
        acc[result.platform] = []
      }
      acc[result.platform].push(result)
      return acc
    },
    {} as Record<string, typeof searchResult.results>,
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="mb-4 text-muted-foreground hover:text-foreground"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              New Search
            </Button>

            <div className="bg-card rounded-xl border border-border p-6 mb-6">
              <h1 className="text-3xl font-bold text-card-foreground mb-4">Search Results</h1>

              <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-muted-foreground font-medium">Name:</span>
                  <span className="ml-2 text-card-foreground">{searchResult.query.name}</span>
                </div>

                {searchResult.query.organization && (
                  <div>
                    <span className="text-muted-foreground font-medium">Organization:</span>
                    <span className="ml-2 text-card-foreground">{searchResult.query.organization}</span>
                  </div>
                )}

                {searchResult.query.location && (
                  <div>
                    <span className="text-muted-foreground font-medium">Location:</span>
                    <span className="ml-2 text-card-foreground">{searchResult.query.location}</span>
                  </div>
                )}

                <div>
                  <span className="text-muted-foreground font-medium">Results Found:</span>
                  <span className="ml-2 text-card-foreground font-semibold">{searchResult.results.length}</span>
                </div>
              </div>
            </div>

            {searchResult.summary && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-foreground mb-2">AI-Generated Summary</h2>
                    <p className="text-muted-foreground leading-relaxed">{searchResult.summary}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {searchResult.results.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <svg
                className="w-16 h-16 text-muted-foreground mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">No Results Found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(resultsByPlatform).map(([platform, results]) => (
                <div key={platform}>
                  <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                    <span>{platform}</span>
                    <span className="text-sm font-normal text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {results.length} {results.length === 1 ? "result" : "results"}
                    </span>
                  </h2>

                  <div className="grid gap-4">
                    {results.map((result, index) => (
                      <ResultCard key={`${platform}-${index}`} result={result} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground text-lg">Loading results...</p>
          </div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  )
}
