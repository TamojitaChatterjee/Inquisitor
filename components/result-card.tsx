import type { PlatformResult } from "@/types/search"
import { PlatformBadge } from "@/components/platform-badge"

interface ResultCardProps {
  result: PlatformResult
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <PlatformBadge platform={result.platform} />

            {result.verified && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
            {result.title}
          </h3>

          {result.description && <p className="text-sm text-slate-600 line-clamp-2">{result.description}</p>}

          <p className="text-xs text-slate-400 mt-2 truncate">{result.url}</p>
        </div>

        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </div>
      </div>
    </a>
  )
}
