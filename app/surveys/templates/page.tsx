"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function TemplatesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filteredTemplates, setFilteredTemplates] = useState(templates)

  // Define the popular template IDs
  const popularTemplateIds = ["nps-survey", "customer-satisfaction", "product-feedback"]

  // Filter templates based on search query and active tab
  useEffect(() => {
    let filtered = templates

    // Filter by tab
    if (activeTab === "pre-purchase") {
      filtered = filtered.filter((template) => template.type === "Pre-Purchase")
    } else if (activeTab === "post-purchase") {
      filtered = filtered.filter((template) => template.type === "Post-Purchase")
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (template) =>
          template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredTemplates(filtered)
  }, [searchQuery, activeTab])

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Survey Templates</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search templates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-white">
              All
            </TabsTrigger>
            <TabsTrigger value="pre-purchase" className="data-[state=active]:bg-white">
              Pre-Purchase
            </TabsTrigger>
            <TabsTrigger value="post-purchase" className="data-[state=active]:bg-white">
              Post-Purchase
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Most Popular Templates Section */}
      <div className="mb-10">
        <div className="flex items-center mb-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Most Frequently Used Templates</h2>
            <p className="text-sm text-muted-foreground">Our most popular templates chosen by survey creators</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {popularTemplateIds.map((id) => {
            const template = templates.find((t) => t.id === id)
            if (!template) return null

            return (
              <Card
                key={template.id}
                className="overflow-hidden bg-gradient-to-b from-white to-gray-50 border-gray-200 shadow-sm hover:shadow-md transition-shadow relative"
              >
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl-md">
                  Popular
                </div>
                <CardHeader className="bg-white border-b border-gray-100 pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{template.title}</CardTitle>
                    <Badge variant="outline">{template.type}</Badge>
                  </div>
                  <CardDescription className="text-xs">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-xs text-muted-foreground mb-4">
                    <div>Questions: {template.questions}</div>
                    <div>Estimated completion time: {template.time}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium">Includes:</div>
                    <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-1">
                      {template.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-gray-50 px-6 py-3">
                  <Button
                    onClick={() => router.push(`/surveys/editor?template=${template.id}`)}
                    className="w-full text-sm"
                  >
                    Use This Template
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>

      {/* All Templates Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-4">All Templates</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We couldn't find any templates matching your search criteria. Try adjusting your filters or search
                terms.
              </p>
            </div>
          ) : (
            filteredTemplates
              .filter((template) => !popularTemplateIds.includes(template.id))
              .map((template) => (
                <Card
                  key={template.id}
                  className="overflow-hidden bg-gradient-to-b from-white to-gray-50 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader className="bg-white border-b border-gray-100 pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{template.title}</CardTitle>
                      <Badge variant="outline">{template.type}</Badge>
                    </div>
                    <CardDescription className="text-xs">{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-xs text-muted-foreground mb-4">
                      <div>Questions: {template.questions}</div>
                      <div>Estimated completion time: {template.time}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-medium">Includes:</div>
                      <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-1">
                        {template.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-gray-50 px-6 py-3">
                    <Button
                      onClick={() => router.push(`/surveys/editor?template=${template.id}`)}
                      className="w-full text-sm"
                    >
                      Use This Template
                    </Button>
                  </CardFooter>
                </Card>
              ))
          )}
        </div>
      </div>
    </div>
  )
}

const templates = [
  {
    id: "customer-satisfaction",
    title: "Customer Satisfaction",
    description: "Measure how satisfied customers are with your product or service",
    questions: 10,
    time: "3-5 minutes",
    type: "Post-Purchase",
    features: [
      "Overall satisfaction rating",
      "Product quality assessment",
      "Customer service evaluation",
      "Likelihood to recommend",
      "Open-ended feedback",
    ],
  },
  {
    id: "product-feedback",
    title: "Product Feedback",
    description: "Collect detailed feedback about your product features",
    questions: 12,
    time: "4-6 minutes",
    type: "Post-Purchase",
    features: [
      "Feature satisfaction ratings",
      "Feature importance assessment",
      "Missing features identification",
      "Usability evaluation",
      "Improvement suggestions",
    ],
  },
  {
    id: "market-research",
    title: "Market Research",
    description: "Understand customer preferences before launching a product",
    questions: 15,
    time: "5-7 minutes",
    type: "Pre-Purchase",
    features: [
      "Demographic questions",
      "Purchase intent measurement",
      "Competitor analysis",
      "Price sensitivity testing",
      "Feature prioritization",
    ],
  },
  {
    id: "website-ux",
    title: "Website User Experience",
    description: "Evaluate the usability of your website",
    questions: 8,
    time: "2-4 minutes",
    type: "Pre-Purchase",
    features: [
      "Navigation ease assessment",
      "Content clarity rating",
      "Visual design feedback",
      "Task completion success",
      "Website speed perception",
    ],
  },
  {
    id: "nps-survey",
    title: "Net Promoter Score (NPS)",
    description: "Measure customer loyalty and likelihood to recommend",
    questions: 5,
    time: "1-2 minutes",
    type: "Post-Purchase",
    features: [
      "Standard NPS question",
      "Reason for score",
      "Areas for improvement",
      "Follow-up permission",
      "Customer testimonial opportunity",
    ],
  },
  {
    id: "event-feedback",
    title: "Event Feedback",
    description: "Gather attendee feedback after hosting an event",
    questions: 10,
    time: "3-5 minutes",
    type: "Post-Purchase",
    features: [
      "Overall event satisfaction",
      "Speaker/content quality ratings",
      "Venue and logistics feedback",
      "Future topic interests",
      "Improvement suggestions",
    ],
  },
  {
    id: "product-concept-testing",
    title: "Product Concept Testing",
    description: "Test new product concepts before development",
    questions: 12,
    time: "4-6 minutes",
    type: "Pre-Purchase",
    features: [
      "Concept appeal rating",
      "Purchase intent measurement",
      "Price point evaluation",
      "Competitive comparison",
      "Feature importance ranking",
    ],
  },
  {
    id: "customer-onboarding",
    title: "Customer Onboarding Experience",
    description: "Evaluate the effectiveness of your onboarding process",
    questions: 8,
    time: "2-4 minutes",
    type: "Post-Purchase",
    features: [
      "Ease of getting started",
      "Documentation clarity",
      "Support availability",
      "Time to value measurement",
      "Initial roadblocks identification",
    ],
  },
  {
    id: "brand-perception",
    title: "Brand Perception",
    description: "Understand how customers perceive your brand",
    questions: 10,
    time: "3-5 minutes",
    type: "Pre-Purchase",
    features: [
      "Brand attribute associations",
      "Brand comparison",
      "Brand loyalty measurement",
      "Brand value perception",
      "Brand message clarity",
    ],
  },
]
