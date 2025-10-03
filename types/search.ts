export interface SearchQuery {
  name: string
  organization?: string
  location?: string
  githubUrl?: string
  linkedinUrl?: string
}

export interface PlatformResult {
  platform: string
  url: string
  title: string
  description?: string
  imageUrl?: string
  verified?: boolean
  profileData?: {
    bio?: string
    followers?: number
    location?: string
    company?: string
    website?: string
  }
}

export interface SearchResult {
  searchId: string
  query: SearchQuery
  results: PlatformResult[]
  timestamp: string
  status: "pending" | "completed" | "failed"
  summary?: string
}
