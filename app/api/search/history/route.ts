import { NextResponse } from "next/server"

// Import the searchResults Map from the main search route
// In production, this would be replaced with database queries
import { getSearchResults } from "@/lib/search-storage"

export async function GET() {
  try {
    const searches = getSearchResults()

    // Sort by timestamp (newest first)
    const sortedSearches = searches.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

    return NextResponse.json({ searches: sortedSearches }, { status: 200 })
  } catch (error) {
    console.error("Error fetching search history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
