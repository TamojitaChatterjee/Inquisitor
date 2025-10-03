import { type NextRequest, NextResponse } from "next/server"
import type { SearchQuery, SearchResult, PlatformResult } from "@/types/search"
import { searchGitHub } from "@/lib/search/github"
import { searchLinkedIn } from "@/lib/search/linkedin"
import { searchGoogleScholar } from "@/lib/search/google-scholar"
import { searchFacebook } from "@/lib/search/facebook"
import { searchInstagram } from "@/lib/search/instagram"
import { searchTwitter } from "@/lib/search/twitter"
import { storeSearchResult, getSearchResult } from "@/lib/search-storage"

export async function POST(request: NextRequest) {
  try {
    const query: SearchQuery = await request.json()

    if (!query.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const searchId = `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const searchResult: SearchResult = {
      searchId,
      query,
      results: [],
      timestamp: new Date().toISOString(),
      status: "pending",
    }

    storeSearchResult(searchResult)

    const searchPromises: Promise<PlatformResult[]>[] = [
      searchGitHub(query),
      searchLinkedIn(query),
      searchGoogleScholar(query),
      searchFacebook(query),
      searchInstagram(query),
      searchTwitter(query),
    ]

    const results = await Promise.allSettled(searchPromises)

    const allResults: PlatformResult[] = []
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        allResults.push(...result.value)
      }
    })

    searchResult.results = allResults
    searchResult.status = "completed"

    try {
      const summaryResponse = await fetch(`${request.nextUrl.origin}/api/search/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchResult }),
      })

      if (summaryResponse.ok) {
        const { summary } = await summaryResponse.json()
        searchResult.summary = summary
      }
    } catch (error) {
      console.error("Failed to generate summary:", error)
    }

    storeSearchResult(searchResult)

    return NextResponse.json({ searchId, resultsCount: allResults.length }, { status: 200 })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const searchId = searchParams.get("id")

  if (!searchId) {
    return NextResponse.json({ error: "Search ID is required" }, { status: 400 })
  }

  const result = getSearchResult(searchId)

  if (!result) {
    return NextResponse.json({ error: "Search not found" }, { status: 404 })
  }

  return NextResponse.json(result, { status: 200 })
}
