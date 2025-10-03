"use client"

import { useRouter } from "next/navigation"
import type { SearchResult } from "@/types/search"

interface SearchHistoryCardProps {
  search: SearchResult
}

export function SearchHistoryCard({ search }: SearchHistoryCardProps) {
  const router = useRouter()

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date)
  }

  const handleClick = () => {
    router.push(`/results?id=${search.searchId}`)
  }

  return (
    <button
      onClick={handleClick}
      className="w-full bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200 text-left group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
              {search.query.name}
            </h3>

            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                search.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : search.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {search.status}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-3">
            {search.query.organization && (
              <div>
                <span className="text-slate-500">Organization:</span>
                <span className="ml-2 text-slate-900">{search.query.organization}</span>
              </div>
            )}

            {search.query.location && (
              <div>
                <span className="text-slate-500">Location:</span>
                <span className="ml-2 text-slate-900">{search.query.location}</span>
              </div>
            )}

            <div>
              <span className="text-slate-500">Results:</span>
              <span className="ml-2 text-slate-900 font-semibold">{search.results.length}</span>
            </div>

            <div>
              <span className="text-slate-500">Date:</span>
              <span className="ml-2 text-slate-900">{formatDate(search.timestamp)}</span>
            </div>
          </div>

          {/* Platform badges */}
          {search.results.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(search.results.map((r) => r.platform))).map((platform) => (
                <span key={platform} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                  {platform}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  )
}
