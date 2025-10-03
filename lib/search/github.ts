import type { SearchQuery, PlatformResult } from "@/types/search"

export async function searchGitHub(query: SearchQuery): Promise<PlatformResult[]> {
  const results: PlatformResult[] = []

  try {
    // If GitHub URL is provided, fetch the actual profile
    if (query.githubUrl) {
      const username = extractGitHubUsername(query.githubUrl)
      if (username) {
        try {
          const response = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          })

          if (response.ok) {
            const data = await response.json()
            results.push({
              platform: "GitHub",
              url: data.html_url,
              title: data.name || data.login,
              description: data.bio || `GitHub profile for ${data.login}`,
              imageUrl: data.avatar_url,
              verified: true,
              profileData: {
                bio: data.bio,
                followers: data.followers,
                location: data.location,
                company: data.company,
                website: data.blog,
              },
            })
          }
        } catch (error) {
          console.error("Error fetching GitHub profile:", error)
        }
      }
    }

    const searchName = query.name.trim()
    if (searchName) {
      try {
        const response = await fetch(
          `https://api.github.com/search/users?q=${encodeURIComponent(searchName)}&per_page=5`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          },
        )

        if (response.ok) {
          const data = await response.json()
          for (const user of data.items || []) {
            // Avoid duplicates
            if (!results.find((r) => r.url === user.html_url)) {
              results.push({
                platform: "GitHub",
                url: user.html_url,
                title: user.login,
                description: `GitHub user matching "${query.name}"`,
                imageUrl: user.avatar_url,
                verified: false,
              })
            }
          }
        }
      } catch (error) {
        console.error("Error searching GitHub:", error)
      }
    }
  } catch (error) {
    console.error("GitHub search error:", error)
  }

  return results
}

function extractGitHubUsername(url: string): string | null {
  try {
    const match = url.match(/github\.com\/([^/?]+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}
