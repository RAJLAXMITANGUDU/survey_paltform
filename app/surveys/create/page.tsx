"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react"

export default function CreateSurveyPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [titleError, setTitleError] = useState(false)

  const handleContinue = () => {
    if (!title.trim()) {
      setTitleError(true)
      return
    }

    // Encode the title and description for URL parameters
    const encodedTitle = encodeURIComponent(title)
    const encodedDescription = encodeURIComponent(description)

    // Navigate to the editor with the title and description as query parameters
    router.push(`/surveys/editor?title=${encodedTitle}&description=${encodedDescription}`)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create New Survey</h1>
      </div>

      <Tabs defaultValue="scratch" className="w-full">
        <TabsList className="mb-8 w-full max-w-md mx-auto bg-gray-100">
          <TabsTrigger value="scratch" className="flex-1 data-[state=active]:bg-white">
            Start from Scratch
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex-1 data-[state=active]:bg-white">
            Use a Template
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scratch">
          <Card className="max-w-2xl mx-auto bg-gradient-to-b from-white to-gray-50 border-gray-200 shadow-sm">
            <CardHeader className="bg-white border-b border-gray-100">
              <CardTitle className="text-xl">Create a Custom Survey</CardTitle>
              <CardDescription>Start with a blank canvas and build your survey from scratch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Survey Title <span className="text-red-500">*</span>
                  </Label>
                  {titleError && (
                    <div className="text-xs text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Title is required
                    </div>
                  )}
                </div>
                <Input
                  id="title"
                  placeholder="Enter survey title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    if (e.target.value.trim()) setTitleError(false)
                  }}
                  className={`${titleError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter survey description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t border-gray-100">
              <Button onClick={handleContinue} className="w-full">
                Continue to Question Editor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="overflow-hidden bg-gradient-to-b from-white to-gray-50 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="bg-white border-b border-gray-100">
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription className="text-sm">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    <div>Questions: {template.questions}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Includes:</div>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      {template.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-gray-50 px-6 py-4">
                  <Button
                    onClick={() => {
                      // Use the template title and description
                      const encodedTitle = encodeURIComponent(template.title)
                      const encodedDescription = encodeURIComponent(template.description)
                      router.push(
                        `/surveys/editor?title=${encodedTitle}&description=${encodedDescription}&template=${template.id}`,
                      )
                    }}
                    className="w-full"
                  >
                    Use This Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

const templates = [
  {
    id: "customer-satisfaction",
    title: "Customer Satisfaction",
    description: "Measure how satisfied customers are with your product or service",
    questions: 10,
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
    features: [
      "Overall event satisfaction",
      "Speaker/content quality ratings",
      "Venue and logistics feedback",
      "Future topic interests",
      "Improvement suggestions",
    ],
  },
]
