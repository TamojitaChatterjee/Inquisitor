import type { SearchQuery, PlatformResult } from "@/types/search"
import { generateUsernameVariations } from "./match-score"

export async function searchInstagram(query: SearchQuery): Promise<PlatformResult[]> {
  const results: PlatformResult[] = []

  try {
    const usernameVariations = generateUsernameVariations(query.name)

    // Add direct profile links for top username variations
    usernameVariations.slice(0, 3).forEach((username) => {
      results.push({
        platform: "Instagram",
        url: `https://www.instagram.com/${username}/`,
        title: `@${username}`,
        description: `Potential Instagram profile for ${query.name}`,
        verified: false,
      })
    })

    // Instagram web search (opens in browser)
    const encodedQuery = encodeURIComponent(query.name)
    results.push({
      platform: "Instagram",
      url: `https://www.instagram.com/explore/search/keyword/?q=${encodedQuery}`,
      title: `Search "${query.name}" on Instagram`,
      description: "Browse all Instagram profiles and posts matching this name",
      verified: false,
    })
  } catch (error) {
    console.error("Instagram search error:", error)
  }

  return results
}
