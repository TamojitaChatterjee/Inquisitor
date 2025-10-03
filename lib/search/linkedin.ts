import type { SearchQuery, PlatformResult } from "@/types/search"
import { generateUsernameVariations } from "./match-score"

export async function searchLinkedIn(query: SearchQuery): Promise<PlatformResult[]> {
  const results: PlatformResult[] = []

  try {
    if (query.linkedinUrl) {
      const profileId = extractLinkedInProfile(query.linkedinUrl)
      results.push({
        platform: "LinkedIn",
        url: query.linkedinUrl,
        title: `${query.name} on LinkedIn`,
        description: query.organization
          ? `${query.name} at ${query.organization}`
          : `Professional profile for ${query.name}`,
        verified: true,
        profileData: {
          company: query.organization,
          location: query.location,
        },
      })
    }

    const searchParams = new URLSearchParams()
    searchParams.append("keywords", query.name)

    results.push({
      platform: "LinkedIn",
      url: `https://www.linkedin.com/search/results/people/?${searchParams.toString()}`,
      title: `${query.name} - LinkedIn People Search`,
      description: `Search results for ${query.name} on LinkedIn`,
      verified: false,
    })

    const usernameVariations = generateUsernameVariations(query.name)

    usernameVariations.slice(0, 2).forEach((username) => {
      results.push({
        platform: "LinkedIn",
        url: `https://www.linkedin.com/in/${username}`,
        title: `${query.name} (${username})`,
        description: `Potential LinkedIn profile`,
        verified: false,
      })
    })
  } catch (error) {
    console.error("LinkedIn search error:", error)
  }

  return results
}

function extractLinkedInProfile(url: string): string | null {
  try {
    const match = url.match(/linkedin\.com\/in\/([^/?]+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}
