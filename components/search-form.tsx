"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SearchQuery } from "@/types/search"

export function SearchForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<SearchQuery>({
    name: "",
    organization: "",
    location: "",
    githubUrl: "",
    linkedinUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Store search ID and navigate to results
        router.push(`/results?id=${data.searchId}`)
      } else {
        console.error("Search failed:", data.error)
        alert("Search failed. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting search:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof SearchQuery, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700 font-medium">
              Full Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              className="border-slate-300"
            />
          </div>

          {/* Organization */}
          <div className="space-y-2">
            <Label htmlFor="organization" className="text-slate-700 font-medium">
              University / Organization
            </Label>
            <Input
              id="organization"
              type="text"
              placeholder="Stanford University"
              value={formData.organization}
              onChange={(e) => handleChange("organization", e.target.value)}
              className="border-slate-300"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-slate-700 font-medium">
              Location
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="San Francisco, CA"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="border-slate-300"
            />
          </div>

          {/* GitHub URL */}
          <div className="space-y-2">
            <Label htmlFor="github" className="text-slate-700 font-medium">
              GitHub Profile URL
            </Label>
            <Input
              id="github"
              type="url"
              placeholder="https://github.com/username"
              value={formData.githubUrl}
              onChange={(e) => handleChange("githubUrl", e.target.value)}
              className="border-slate-300"
            />
          </div>

          {/* LinkedIn URL */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="linkedin" className="text-slate-700 font-medium">
              LinkedIn Profile URL
            </Label>
            <Input
              id="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/username"
              value={formData.linkedinUrl}
              onChange={(e) => handleChange("linkedinUrl", e.target.value)}
              className="border-slate-300"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isLoading || !formData.name}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 text-base"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Searching...
              </span>
            ) : (
              "Search Platforms"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
