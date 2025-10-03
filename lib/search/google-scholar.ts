import type { SearchQuery, PlatformResult } from "@/types/search"

export async function searchGoogleScholar(query: SearchQuery): Promise<PlatformResult[]> {
  const results: PlatformResult[] = []

  try {
    const encodedQuery = encodeURIComponent(query.name)

    results.push({
      platform: "Google Scholar",
      url: `https://scholar.google.com/scholar?q=${encodedQuery}`,
      title: `Publications by ${query.name}`,
      description: `Academic publications and papers by ${query.name}`,
      verified: false,
    })

    // Author profile search
    results.push({
      platform: "Google Scholar",
      url: `https://scholar.google.com/citations?view_op=search_authors&mauthors=${encodedQuery}`,
      title: `${query.name} - Author Profile`,
      description: "Google Scholar author profile and citation metrics",
      verified: false,
    })
  } catch (error) {
    console.error("Google Scholar search error:", error)
  }

  return results
}
