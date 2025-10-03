import type { SearchQuery, PlatformResult } from "@/types/search"
import { generateUsernameVariations } from "./match-score"

export async function searchTwitter(query: SearchQuery): Promise<PlatformResult[]> {
  const results: PlatformResult[] = []

  try {
    const encodedQuery = encodeURIComponent(query.name)

    // Primary people search
    results.push({
      platform: "Twitter/X",
      url: `https://twitter.com/search?q=${encodedQuery}&f=user`,
      title: `${query.name} - Twitter/X People Search`,
      description: "Search results for matching Twitter/X profiles",
      verified: false,
    })

    // Generate potential direct profile URLs
    const usernameVariations = generateUsernameVariations(query.name)

    // Add top 2 username variations as direct profile links
    usernameVariations.slice(0, 2).forEach((username) => {
      results.push({
        platform: "Twitter/X",
        url: `https://twitter.com/${username}`,
        title: `@${username}`,
        description: `Potential Twitter/X profile for ${query.name}`,
        verified: false,
      })
    })
  } catch (error) {
    console.error("Twitter search error:", error)
  }

  return results
}
