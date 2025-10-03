interface PlatformBadgeProps {
  platform: string
}

export function PlatformBadge({ platform }: PlatformBadgeProps) {
  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      GitHub: "bg-slate-100 text-slate-700",
      LinkedIn: "bg-blue-100 text-blue-700",
      "Google Scholar": "bg-green-100 text-green-700",
      Facebook: "bg-indigo-100 text-indigo-700",
      Instagram: "bg-pink-100 text-pink-700",
      "Twitter/X": "bg-sky-100 text-sky-700",
    }

    return colors[platform] || "bg-gray-100 text-gray-700"
  }

  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${getPlatformColor(platform)}`}
    >
      {platform}
    </span>
  )
}
