import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import type { SearchResult } from "@/types/search"

export async function POST(request: NextRequest) {
  try {
    const { searchResult }: { searchResult: SearchResult } = await request.json()

    if (!searchResult || !searchResult.results || searchResult.results.length === 0) {
      return NextResponse.json({ error: "No search results provided" }, { status: 400 })
    }

    const platformData = searchResult.results
      .map((result) => {
        let info = `${result.platform}: ${result.title}`
        if (result.description) info += ` - ${result.description}`
        if (result.profileData) {
          if (result.profileData.bio) info += ` Bio: ${result.profileData.bio}`
          if (result.profileData.location) info += ` Location: ${result.profileData.location}`
          if (result.profileData.company) info += ` Company: ${result.profileData.company}`
          if (result.profileData.followers) info += ` Followers: ${result.profileData.followers}`
        }
        return info
      })
      .join("\n")

    const prompt = `Based on the following search results about a person, generate a comprehensive one-paragraph summary about them. Include their name, location (if available), date of birth (if mentioned), what they do professionally, and their interests or areas of expertise. If information is not available, don't make it up - just focus on what's provided.

Search Query:
- Name: ${searchResult.query.name}
- Organization: ${searchResult.query.organization || "Not specified"}
- Location: ${searchResult.query.location || "Not specified"}

Platform Results:
${platformData}

Generate a natural, informative paragraph about this person:`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      maxTokens: 300,
    })

    return NextResponse.json({ summary: text }, { status: 200 })
  } catch (error) {
    console.error("Summary generation error:", error)
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}
