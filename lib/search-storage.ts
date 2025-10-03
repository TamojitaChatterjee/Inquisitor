import type { SearchResult } from "@/types/search"

// In-memory storage (replace with MongoDB in production)
const searchResults = new Map<string, SearchResult>()

export function storeSearchResult(result: SearchResult) {
  searchResults.set(result.searchId, result)
}

export function getSearchResult(searchId: string): SearchResult | undefined {
  return searchResults.get(searchId)
}

export function getSearchResults(): SearchResult[] {
  return Array.from(searchResults.values())
}

export { searchResults }
