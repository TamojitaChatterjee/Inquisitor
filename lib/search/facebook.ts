import type { SearchQuery, PlatformResult } from "@/types/search"
import { generateUsernameVariations } from "./match-score"

export async function searchFacebook(query: SearchQuery): Promise<PlatformResult[]> {
  const results: PlatformResult[] = []

  try {
    const encodedName = encodeURIComponent(query.name)

    // Primary search result - Facebook people search
    results.push({
      platform: "Facebook",
      url: `https://www.facebook.com/search/people/?q=${encodedName}`,
      title: `${query.name} - Facebook People Search`,
      description: `Search results for ${query.name} on Facebook. Click to view all matching profiles.`,
      verified: false,
    })

    // Generate potential direct profile URLs based on name variations
    const usernameVariations = generateUsernameVariations(query.name)

    // Add top 3 most likely username variations as direct profile links
    usernameVariations.slice(0, 3).forEach((username, index) => {
      results.push({
        platform: "Facebook",
        url: `https://www.facebook.com/${username}`,
        title: `${query.name} (@${username})`,
        description: `Potential Facebook profile - try this direct link`,
        verified: false,
      })
    })

    // If organization is provided, add a search with organization context
    if (query.organization) {
      const orgQuery = encodeURIComponent(`${query.name} ${query.organization}`)
      results.push({
        platform: "Facebook",
        url: `https://www.facebook.com/search/people/?q=${orgQuery}`,
        title: `${query.name} at ${query.organization}`,
        description: `Facebook search filtered by organization affiliation`,
        verified: false,
      })
    }
  } catch (error) {
    console.error("Facebook search error:", error)
  }

  return results
}
