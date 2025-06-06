"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, ArrowUpRight, Users, FileText, CheckCircle2, Zap, Target, BookOpen } from "lucide-react"
import OnboardingModal from "@/components/onboarding-modal"
import { useToast } from "@/hooks/use-toast"
import BestPracticesModal from "@/components/best-practices-modal"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [bestPracticesOpen, setBestPracticesOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Function to handle quick action clicks
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "create-survey":
        router.push("/surveys/create")
        break
      case "templates":
        router.push("/surveys/templates")
        break
      case "analytics":
        router.push("/analytics")
        break
      case "best-practices":
        // Open the best practices modal
        setBestPracticesOpen(true)
        break
      default:
        break
    }
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-background to-muted/10 min-h-screen">
      <div className="container py-6">
        <div className="grid gap-6 md:grid-cols-7">
          {/* Main Content Area */}
          <div className="md:col-span-5 space-y-6">
            {/* Analytics Overview */}
            <Card className="bg-white shadow-sm border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl text-gray-900">Analytics Overview</CardTitle>
                  <CardDescription className="text-gray-600">Survey performance metrics</CardDescription>
                </div>
                <Link href="/analytics">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View Detailed Analytics
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="responses">Responses</TabsTrigger>
                    <TabsTrigger value="engagement">Engagement</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Total Surveys</p>
                              <p className="text-2xl font-bold">24</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-gray-500" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Total Responses</p>
                              <p className="text-2xl font-bold">1,248</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-500" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="h-[240px] rounded-lg border bg-gray-50 flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Response trend chart</span>
                    </div>
                  </TabsContent>
                  <TabsContent value="responses" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Today</p>
                              <p className="text-2xl font-bold">42</p>
                            </div>
                            <Badge>+12%</Badge>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">This Week</p>
                              <p className="text-2xl font-bold">284</p>
                            </div>
                            <Badge>+8%</Badge>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">This Month</p>
                              <p className="text-2xl font-bold">1,024</p>
                            </div>
                            <Badge>+15%</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="h-[240px] rounded-lg border bg-gray-50 flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Response distribution chart</span>
                    </div>
                  </TabsContent>
                  <TabsContent value="engagement" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                              <p className="text-2xl font-bold">78%</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <CheckCircle2 className="h-5 w-5 text-gray-500" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="h-[240px] rounded-lg border bg-gray-50 flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Engagement metrics chart</span>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-2 space-y-6">
            {/* Active Surveys */}
            <Card className="bg-white shadow-sm border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-900">Active Surveys</CardTitle>
                <CardDescription className="text-gray-600">Currently running surveys</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Customer Satisfaction", responses: 245, status: "active" },
                  { name: "Product Feedback", responses: 189, status: "active" },
                  { name: "Website Experience", responses: 312, status: "active" },
                ].map((survey, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-100"
                    onClick={() => router.push(`/surveys/preview/${i + 1}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          survey.status === "active" ? "bg-green-500" : "bg-amber-500"
                        }`}
                      />
                      <span className="font-medium text-gray-900">{survey.name}</span>
                    </div>
                    <Badge variant="secondary">{survey.responses}</Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/surveys">View All Surveys</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Survey Health */}
            <Card className="bg-white shadow-sm border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-900">Survey Health</CardTitle>
                <CardDescription className="text-gray-600">Performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Customer Satisfaction</span>
                    <span className="text-sm font-medium text-gray-900">Healthy</span>
                  </div>
                  <Progress value={92} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>92% completion rate</span>
                    <span>245 responses</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Product Feedback</span>
                    <span className="text-sm font-medium text-gray-900">Needs Attention</span>
                  </div>
                  <Progress value={58} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>58% completion rate</span>
                    <span>189 responses</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Website Experience</span>
                    <span className="text-sm font-medium text-gray-900">Healthy</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>85% completion rate</span>
                    <span>312 responses</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Create Survey Button */}
            <Card
              className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-200 transition-colors cursor-pointer shadow-sm"
              onClick={() => handleQuickAction("create-survey")}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-gray-200 p-3 mb-3">
                  <Zap className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="font-medium mb-1 text-gray-900">Create Survey</h3>
                <p className="text-sm text-gray-600">Build a new survey from scratch</p>
              </CardContent>
            </Card>

            {/* Templates Button */}
            <Card
              className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-200 transition-colors cursor-pointer shadow-sm"
              onClick={() => handleQuickAction("templates")}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-gray-200 p-3 mb-3">
                  <Target className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="font-medium mb-1 text-gray-900">Templates</h3>
                <p className="text-sm text-gray-600">Use pre-built survey templates</p>
              </CardContent>
            </Card>

            {/* View Analytics Button */}
            <Card
              className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-200 transition-colors cursor-pointer shadow-sm"
              onClick={() => handleQuickAction("analytics")}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-gray-200 p-3 mb-3">
                  <BarChart3 className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="font-medium mb-1 text-gray-900">View Analytics</h3>
                <p className="text-sm text-gray-600">Check your survey performance</p>
              </CardContent>
            </Card>

            {/* Best Practices Button */}
            <Card
              className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-200 transition-colors cursor-pointer shadow-sm"
              onClick={() => handleQuickAction("best-practices")}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-gray-200 p-3 mb-3">
                  <BookOpen className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="font-medium mb-1 text-gray-900">Best Practices</h3>
                <p className="text-sm text-gray-600">Learn survey optimization tips</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <OnboardingModal />
      <BestPracticesModal open={bestPracticesOpen} onOpenChange={setBestPracticesOpen} />
    </div>
  )
}
