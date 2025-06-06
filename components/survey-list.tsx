"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Copy, Trash, Eye, BarChart3, ShoppingCart, ShoppingBag } from "lucide-react"

type SurveyType = "all" | "pre-purchase" | "post-purchase" | "draft"

interface SurveyListProps {
  type?: SurveyType
  limit?: number
}

export default function SurveyList({ type = "all", limit }: SurveyListProps) {
  // Mock data for surveys
  const [surveys, setSurveys] = useState([
    {
      id: "1",
      title: "Product Satisfaction Survey",
      description: "Collect feedback after customers use our product",
      responses: 245,
      status: "active",
      type: "post-purchase",
      created: "2023-05-12",
    },
    {
      id: "2",
      title: "Customer Expectations Survey",
      description: "Understand what customers expect before buying",
      responses: 189,
      status: "active",
      type: "pre-purchase",
      created: "2023-06-03",
    },
    {
      id: "3",
      title: "Website User Experience",
      description: "Gather feedback about our website experience",
      responses: 312,
      status: "active",
      type: "pre-purchase",
      created: "2023-04-28",
    },
    {
      id: "4",
      title: "Product Feature Preferences",
      description: "Learn which features customers value most",
      responses: 0,
      status: "draft",
      type: "pre-purchase",
      created: "2023-07-01",
    },
    {
      id: "5",
      title: "Delivery Experience Survey",
      description: "Feedback on our delivery process",
      responses: 178,
      status: "active",
      type: "post-purchase",
      created: "2023-05-20",
    },
    {
      id: "6",
      title: "Customer Support Satisfaction",
      description: "Rate our customer support experience",
      responses: 203,
      status: "active",
      type: "post-purchase",
      created: "2023-06-15",
    },
  ])

  let filteredSurveys =
    type === "all"
      ? surveys
      : surveys.filter((survey) =>
          type === "draft" ? survey.status === "draft" : survey.type === type && survey.status !== "draft",
        )

  // Apply limit if provided
  if (limit) {
    filteredSurveys = filteredSurveys.slice(0, limit)
  }

  const deleteSurvey = (id: string) => {
    setSurveys(surveys.filter((survey) => survey.id !== id))
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredSurveys.map((survey) => (
        <Card key={survey.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {survey.type === "pre-purchase" ? (
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                )}
                <Badge variant={survey.status === "active" ? "default" : "secondary"}>
                  {survey.status === "active" ? "Active" : "Draft"}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Duplicate</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    <span>Preview</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Analytics</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => deleteSurvey(survey.id)}>
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardTitle className="mt-2">{survey.title}</CardTitle>
            <CardDescription>{survey.description}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="flex justify-between text-muted-foreground">
              <div>Responses: {survey.responses}</div>
              <div>Created: {survey.created}</div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 px-6 py-3">
            <div className="flex justify-between w-full">
              <Button variant="ghost" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Link href={`/surveys/edit/${survey.id}`}>
                <Button size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
