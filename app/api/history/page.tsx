"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { SearchResult } from "@/types/search"
import { SearchHistoryCard } from "@/components/search-history-card"
import { Button } from "@/components/ui/button"

export default function HistoryPage() {
  const router = useRouter()
  const [searches, setSearches] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/search/history")

        if (response.ok) {
          const data = await response.json()
          setSearches(data.searches)
        }
      } catch (error) {
        console.error("Error fetching history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600 text-lg">Loading history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="mb-4 text-slate-600 hover:text-slate-900"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Search
            </Button>

            <h1 className="text-4xl font-bold text-slate-900 mb-2">Search History</h1>
            <p className="text-slate-600">View and access your previous searches</p>
          </div>

          {/* History List */}
          {searches.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-12 text-center">
              <svg
                className="w-16 h-16 text-slate-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Search History</h3>
              <p className="text-slate-600 mb-6">Start by performing your first search</p>
              <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700">
                New Search
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {searches.map((search) => (
                <SearchHistoryCard key={search.searchId} search={search} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
