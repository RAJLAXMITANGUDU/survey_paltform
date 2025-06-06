"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function RecentResponses() {
  const responses = [
    {
      id: 1,
      name: "Alex Johnson",
      survey: "Product Satisfaction",
      time: "5 minutes ago",
      type: "post-purchase",
    },
    {
      id: 2,
      name: "Sarah Williams",
      survey: "Website UX Feedback",
      time: "23 minutes ago",
      type: "pre-purchase",
    },
    {
      id: 3,
      name: "Michael Brown",
      survey: "Customer Support Rating",
      time: "1 hour ago",
      type: "post-purchase",
    },
    {
      id: 4,
      name: "Emily Davis",
      survey: "Product Feature Preferences",
      time: "2 hours ago",
      type: "pre-purchase",
    },
  ]

  return (
    <div className="space-y-4">
      {responses.map((response) => (
        <div key={response.id} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={`/abstract-geometric-shapes.png?height=36&width=36&query=${response.name}`}
              alt={response.name}
            />
            <AvatarFallback>
              {response.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">{response.name}</p>
              <Badge variant={response.type === "pre-purchase" ? "outline" : "secondary"} className="text-xs">
                {response.type === "pre-purchase" ? "Pre" : "Post"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{response.survey}</p>
          </div>
          <div className="text-xs text-muted-foreground">{response.time}</div>
        </div>
      ))}
    </div>
  )
}
