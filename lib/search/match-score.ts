export interface MatchCriteria {
  name: string
  organization?: string
  location?: string
  githubUrl?: string
  linkedinUrl?: string
}

export interface ScoredResult {
  url: string
  title: string
  description: string
  matchScore: number
  matchReasons: string[]
}

/**
 * Calculate match score for a result based on available criteria
 * Higher score = better match
 */
export function calculateMatchScore(
  result: {
    url: string
    title: string
    description: string
    username?: string
    location?: string
    organization?: string
  },
  criteria: MatchCriteria,
): ScoredResult {
  let score = 0
  const reasons: string[] = []

  // Name matching (most important)
  const nameParts = criteria.name.toLowerCase().split(" ")
  const resultText = `${result.title} ${result.description} ${result.username || ""}`.toLowerCase()

  let nameMatches = 0
  nameParts.forEach((part) => {
    if (resultText.includes(part)) {
      nameMatches++
    }
  })

  if (nameMatches === nameParts.length) {
    score += 50
    reasons.push("Full name match")
  } else if (nameMatches > 0) {
    score += 25 * (nameMatches / nameParts.length)
    reasons.push("Partial name match")
  }

  // Organization matching
  if (criteria.organization && result.organization) {
    if (result.organization.toLowerCase().includes(criteria.organization.toLowerCase())) {
      score += 20
      reasons.push("Organization match")
    }
  }

  // Location matching
  if (criteria.location && result.location) {
    if (result.location.toLowerCase().includes(criteria.location.toLowerCase())) {
      score += 15
      reasons.push("Location match")
    }
  }

  // Username consistency across platforms
  if (criteria.githubUrl || criteria.linkedinUrl) {
    const extractUsername = (url: string) => {
      const match = url.match(/(?:github\.com|linkedin\.com\/in)\/([^/?]+)/)
      return match ? match[1].toLowerCase() : null
    }

    const githubUsername = criteria.githubUrl ? extractUsername(criteria.githubUrl) : null
    const linkedinUsername = criteria.linkedinUrl ? extractUsername(criteria.linkedinUrl) : null
    const resultUsername = result.username?.toLowerCase()

    if (resultUsername) {
      if (githubUsername && resultUsername === githubUsername) {
        score += 15
        reasons.push("Matches GitHub username")
      }
      if (linkedinUsername && resultUsername.includes(linkedinUsername)) {
        score += 15
        reasons.push("Matches LinkedIn username")
      }
    }
  }

  return {
    url: result.url,
    title: result.title,
    description: result.description,
    matchScore: Math.min(100, score),
    matchReasons: reasons,
  }
}

/**
 * Generate username variations from a full name
 */
export function generateUsernameVariations(name: string): string[] {
  const variations: string[] = []
  const cleaned = name.toLowerCase().replace(/[^a-z\s]/g, "")
  const parts = cleaned.split(/\s+/).filter(Boolean)

  if (parts.length === 0) return variations

  // firstname.lastname
  if (parts.length >= 2) {
    variations.push(`${parts[0]}.${parts[parts.length - 1]}`)
    variations.push(`${parts[0]}${parts[parts.length - 1]}`)
    variations.push(`${parts[0]}_${parts[parts.length - 1]}`)
    variations.push(`${parts[0]}-${parts[parts.length - 1]}`)
  }

  // firstname
  variations.push(parts[0])

  // firstnamelastname (no separator)
  if (parts.length >= 2) {
    variations.push(parts.join(""))
  }

  // firstname + middle initial + lastname
  if (parts.length >= 3) {
    variations.push(`${parts[0]}${parts[1][0]}${parts[parts.length - 1]}`)
  }

  return [...new Set(variations)] // Remove duplicates
}
