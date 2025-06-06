"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Filter, Share2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AnalyticsChart from "@/components/analytics-chart"
import ResponseTable from "@/components/response-table"
import DateRangePicker from "@/components/date-range-picker"

export default function AnalyticsPage() {
  const [selectedSurvey, setSelectedSurvey] = useState("1")
  const [dateRange, setDateRange] = useState({ from: new Date(2023, 4, 1), to: new Date() })
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for the selected survey
  const surveyData = {
    id: "1",
    title: "Customer Satisfaction Survey",
    description: "Measure how satisfied customers are with your product or service",
    totalResponses: 245,
    completionRate: 68,
    averageCompletionTime: "3m 42s",
    startDate: "May 12, 2023",
    endDate: "Ongoing",
    questions: [
      {
        id: "q1",
        question: "How satisfied are you with our product?",
        type: "rating",
        responses: [
          { value: 1, count: 12 },
          { value: 2, count: 18 },
          { value: 3, count: 45 },
          { value: 4, count: 98 },
          { value: 5, count: 72 },
        ],
      },
      {
        id: "q2",
        question: "How likely are you to recommend our product to others?",
        type: "nps",
        responses: [
          { value: "Detractors (0-6)", count: 35 },
          { value: "Passives (7-8)", count: 87 },
          { value: "Promoters (9-10)", count: 123 },
        ],
      },
      {
        id: "q3",
        question: "Which features do you use most often?",
        type: "multiple-choice",
        responses: [
          { value: "Feature A", count: 156 },
          { value: "Feature B", count: 98 },
          { value: "Feature C", count: 187 },
          { value: "Feature D", count: 76 },
          { value: "Feature E", count: 45 },
        ],
      },
      {
        id: "q4",
        question: "How did you hear about our product?",
        type: "multiple-choice",
        responses: [
          { value: "Social Media", count: 87 },
          { value: "Friend/Family", count: 65 },
          { value: "Search Engine", count: 45 },
          { value: "Advertisement", count: 32 },
          { value: "Other", count: 16 },
        ],
      },
    ],
    responsesByDay: [
      { date: "Jun 1", count: 12 },
      { date: "Jun 2", count: 18 },
      { date: "Jun 3", count: 15 },
      { date: "Jun 4", count: 22 },
      { date: "Jun 5", count: 28 },
      { date: "Jun 6", count: 32 },
      { date: "Jun 7", count: 24 },
      { date: "Jun 8", count: 19 },
      { date: "Jun 9", count: 26 },
      { date: "Jun 10", count: 31 },
      { date: "Jun 11", count: 18 },
      { date: "Jun 12", count: 20 },
    ],
    responsesByDevice: [
      { value: "Desktop", count: 145 },
      { value: "Mobile", count: 87 },
      { value: "Tablet", count: 13 },
    ],
    responsesByLocation: [
      { value: "United States", count: 120 },
      { value: "United Kingdom", count: 45 },
      { value: "Canada", count: 32 },
      { value: "Germany", count: 18 },
      { value: "France", count: 15 },
      { value: "Other", count: 15 },
    ],
  }

  // Calculate NPS score
  const npsQuestion = surveyData.questions.find((q) => q.type === "nps")
  const npsScore = npsQuestion
    ? Math.round(
        (((npsQuestion.responses.find((r) => r.value === "Promoters (9-10)")?.count || 0) -
          (npsQuestion.responses.find((r) => r.value === "Detractors (0-6)")?.count || 0)) /
          npsQuestion.responses.reduce((acc, curr) => acc + curr.count, 0)) *
          100,
      )
    : 0

  // Calculate average rating
  const ratingQuestion = surveyData.questions.find((q) => q.type === "rating")
  const averageRating = ratingQuestion
    ? (
        ratingQuestion.responses.reduce((acc, curr) => acc + curr.value * curr.count, 0) /
        ratingQuestion.responses.reduce((acc, curr) => acc + curr.count, 0)
      ).toFixed(1)
    : 0

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-2">
          <Link href="/surveys">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">View and analyze your survey responses</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a survey" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Customer Satisfaction Survey</SelectItem>
              <SelectItem value="2">Product Feedback Survey</SelectItem>
              <SelectItem value="3">Website User Experience</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as Excel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">{surveyData.title}</CardTitle>
            <CardDescription>{surveyData.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Start Date</p>
                <p className="font-medium">{surveyData.startDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">End Date</p>
                <p className="font-medium">{surveyData.endDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge className="mt-1 bg-green-500">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full md:w-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <DateRangePicker dateRange={dateRange} onChange={setDateRange} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{surveyData.totalResponses}</div>
            <p className="text-xs text-muted-foreground">+32 in the last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{surveyData.completionRate}%</div>
            <Progress value={surveyData.completionRate} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}/5</div>
            <div className="flex mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={Number(averageRating) >= star ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-4 w-4 ${Number(averageRating) >= star ? "text-yellow-500" : "text-muted-foreground"}`}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Promoter Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{npsScore}</div>
            <div className="flex justify-between mt-2 text-xs">
              <span className="text-red-500">Detractors</span>
              <span className="text-yellow-500">Passives</span>
              <span className="text-green-500">Promoters</span>
            </div>
            <div className="flex h-2 mt-1 overflow-hidden rounded">
              <div
                className="bg-red-500"
                style={{
                  width: `${
                    ((npsQuestion?.responses.find((r) => r.value === "Detractors (0-6)")?.count || 0) /
                      npsQuestion?.responses.reduce((acc, curr) => acc + curr.count, 0)) *
                    100
                  }%`,
                }}
              ></div>
              <div
                className="bg-yellow-500"
                style={{
                  width: `${
                    ((npsQuestion?.responses.find((r) => r.value === "Passives (7-8)")?.count || 0) /
                      npsQuestion?.responses.reduce((acc, curr) => acc + curr.count, 0)) *
                    100
                  }%`,
                }}
              ></div>
              <div
                className="bg-green-500"
                style={{
                  width: `${
                    ((npsQuestion?.responses.find((r) => r.value === "Promoters (9-10)")?.count || 0) /
                      npsQuestion?.responses.reduce((acc, curr) => acc + curr.count, 0)) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Response Trends</CardTitle>
                <CardDescription>Daily survey responses over time</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart
                  type="line"
                  data={{
                    labels: surveyData.responsesByDay.map((item) => item.date),
                    datasets: [
                      {
                        label: "Responses",
                        data: surveyData.responsesByDay.map((item) => item.count),
                        borderColor: "rgb(75, 192, 192)",
                        backgroundColor: "rgba(75, 192, 192, 0.5)",
                        tension: 0.3,
                      },
                    ],
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response by Device</CardTitle>
                <CardDescription>Distribution of responses by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart
                  type="doughnut"
                  data={{
                    labels: surveyData.responsesByDevice.map((item) => item.value),
                    datasets: [
                      {
                        data: surveyData.responsesByDevice.map((item) => item.count),
                        backgroundColor: [
                          "rgba(54, 162, 235, 0.6)",
                          "rgba(255, 99, 132, 0.6)",
                          "rgba(255, 206, 86, 0.6)",
                        ],
                        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)", "rgba(255, 206, 86, 1)"],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response by Location</CardTitle>
                <CardDescription>Top countries by number of responses</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart
                  type="bar"
                  data={{
                    labels: surveyData.responsesByLocation.map((item) => item.value),
                    datasets: [
                      {
                        label: "Responses",
                        data: surveyData.responsesByLocation.map((item) => item.count),
                        backgroundColor: "rgba(153, 102, 255, 0.6)",
                        borderColor: "rgba(153, 102, 255, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Used Features</CardTitle>
                <CardDescription>Features used most often by respondents</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart
                  type="horizontalBar"
                  data={{
                    labels: surveyData.questions.find((q) => q.id === "q3")?.responses.map((item) => item.value) || [],
                    datasets: [
                      {
                        label: "Responses",
                        data:
                          surveyData.questions.find((q) => q.id === "q3")?.responses.map((item) => item.count) || [],
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="questions">
          <div className="space-y-6">
            {surveyData.questions.map((question) => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle>{question.question}</CardTitle>
                  <CardDescription>
                    {question.type === "rating"
                      ? "Rating question (1-5)"
                      : question.type === "nps"
                        ? "Net Promoter Score (0-10)"
                        : "Multiple choice question"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      {question.type === "rating" && (
                        <div className="space-y-4">
                          {question.responses.map((response) => (
                            <div key={response.value} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="flex items-center">
                                  <span className="font-medium mr-2">{response.value}</span>
                                  {Array.from({ length: response.value }).map((_, i) => (
                                    <svg
                                      key={i}
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="h-4 w-4 text-yellow-500"
                                    >
                                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                  ))}
                                </span>
                                <span>
                                  {response.count} ({Math.round((response.count / surveyData.totalResponses) * 100)}%)
                                </span>
                              </div>
                              <Progress value={(response.count / surveyData.totalResponses) * 100} className="h-2" />
                            </div>
                          ))}
                        </div>
                      )}

                      {question.type === "nps" && (
                        <div className="space-y-4">
                          {question.responses.map((response) => (
                            <div key={response.value} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span
                                  className={`font-medium ${
                                    response.value === "Detractors (0-6)"
                                      ? "text-red-500"
                                      : response.value === "Passives (7-8)"
                                        ? "text-yellow-500"
                                        : "text-green-500"
                                  }`}
                                >
                                  {response.value}
                                </span>
                                <span>
                                  {response.count} ({Math.round((response.count / surveyData.totalResponses) * 100)}%)
                                </span>
                              </div>
                              <Progress
                                value={(response.count / surveyData.totalResponses) * 100}
                                className={`h-2 ${
                                  response.value === "Detractors (0-6)"
                                    ? "bg-red-500"
                                    : response.value === "Passives (7-8)"
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {question.type === "multiple-choice" && (
                        <div className="space-y-4">
                          {question.responses.map((response) => (
                            <div key={response.value} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium">{response.value}</span>
                                <span>
                                  {response.count} ({Math.round((response.count / surveyData.totalResponses) * 100)}%)
                                </span>
                              </div>
                              <Progress value={(response.count / surveyData.totalResponses) * 100} className="h-2" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <AnalyticsChart
                        type={question.type === "multiple-choice" ? "bar" : "pie"}
                        data={{
                          labels: question.responses.map((item) =>
                            typeof item.value === "number"
                              ? `${item.value} Star${item.value !== 1 ? "s" : ""}`
                              : item.value,
                          ),
                          datasets: [
                            {
                              label: "Responses",
                              data: question.responses.map((item) => item.count),
                              backgroundColor:
                                question.type === "nps"
                                  ? ["rgba(255, 99, 132, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(75, 192, 192, 0.6)"]
                                  : [
                                      "rgba(255, 99, 132, 0.6)",
                                      "rgba(54, 162, 235, 0.6)",
                                      "rgba(255, 206, 86, 0.6)",
                                      "rgba(75, 192, 192, 0.6)",
                                      "rgba(153, 102, 255, 0.6)",
                                    ],
                              borderColor:
                                question.type === "nps"
                                  ? ["rgba(255, 99, 132, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"]
                                  : [
                                      "rgba(255, 99, 132, 1)",
                                      "rgba(54, 162, 235, 1)",
                                      "rgba(255, 206, 86, 1)",
                                      "rgba(75, 192, 192, 1)",
                                      "rgba(153, 102, 255, 1)",
                                    ],
                              borderWidth: 1,
                            },
                          ],
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="responses">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Individual Responses</CardTitle>
                  <CardDescription>View and filter individual survey responses</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Input placeholder="Search responses..." className="pl-8 w-[250px]" />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="p-2">
                        <Label htmlFor="rating-filter" className="text-xs">
                          Rating
                        </Label>
                        <Select>
                          <SelectTrigger id="rating-filter">
                            <SelectValue placeholder="Any rating" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any rating</SelectItem>
                            <SelectItem value="5">5 stars</SelectItem>
                            <SelectItem value="4">4 stars</SelectItem>
                            <SelectItem value="3">3 stars</SelectItem>
                            <SelectItem value="2">2 stars</SelectItem>
                            <SelectItem value="1">1 star</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="p-2">
                        <Label htmlFor="device-filter" className="text-xs">
                          Device
                        </Label>
                        <Select>
                          <SelectTrigger id="device-filter">
                            <SelectValue placeholder="Any device" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any device</SelectItem>
                            <SelectItem value="desktop">Desktop</SelectItem>
                            <SelectItem value="mobile">Mobile</SelectItem>
                            <SelectItem value="tablet">Tablet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <DropdownMenuSeparator />
                      <div className="p-2">
                        <Button size="sm" className="w-full">
                          Apply Filters
                        </Button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponseTable />
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t px-6 py-3">
              <div className="text-sm text-muted-foreground">
                Showing <strong>10</strong> of <strong>{surveyData.totalResponses}</strong> responses
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="demographics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Response by Location</CardTitle>
                <CardDescription>Geographic distribution of responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Map visualization would appear here</p>
                </div>
                <Separator className="my-4" />
                <div className="space-y-4">
                  {surveyData.responsesByLocation.map((location) => (
                    <div key={location.value} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{location.value}</span>
                        <span>
                          {location.count} ({Math.round((location.count / surveyData.totalResponses) * 100)}%)
                        </span>
                      </div>
                      <Progress value={(location.count / surveyData.totalResponses) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response by Device</CardTitle>
                <CardDescription>Distribution of responses by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-6">
                  <AnalyticsChart
                    type="doughnut"
                    data={{
                      labels: surveyData.responsesByDevice.map((item) => item.value),
                      datasets: [
                        {
                          data: surveyData.responsesByDevice.map((item) => item.count),
                          backgroundColor: [
                            "rgba(54, 162, 235, 0.6)",
                            "rgba(255, 99, 132, 0.6)",
                            "rgba(255, 206, 86, 0.6)",
                          ],
                          borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)", "rgba(255, 206, 86, 1)"],
                          borderWidth: 1,
                        },
                      ],
                    }}
                  />
                </div>
                <div className="space-y-4">
                  {surveyData.responsesByDevice.map((device) => (
                    <div key={device.value} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{device.value}</span>
                        <span>
                          {device.count} ({Math.round((device.count / surveyData.totalResponses) * 100)}%)
                        </span>
                      </div>
                      <Progress value={(device.count / surveyData.totalResponses) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response by Time of Day</CardTitle>
                <CardDescription>When respondents are most active</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart
                  type="bar"
                  data={{
                    labels: ["Morning", "Afternoon", "Evening", "Night"],
                    datasets: [
                      {
                        label: "Responses",
                        data: [65, 92, 53, 35],
                        backgroundColor: "rgba(153, 102, 255, 0.6)",
                        borderColor: "rgba(153, 102, 255, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response by Browser</CardTitle>
                <CardDescription>Browser usage among respondents</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart
                  type="pie"
                  data={{
                    labels: ["Chrome", "Safari", "Firefox", "Edge", "Other"],
                    datasets: [
                      {
                        data: [125, 65, 30, 20, 5],
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.6)",
                          "rgba(54, 162, 235, 0.6)",
                          "rgba(255, 206, 86, 0.6)",
                          "rgba(75, 192, 192, 0.6)",
                          "rgba(153, 102, 255, 0.6)",
                        ],
                        borderColor: [
                          "rgba(255, 99, 132, 1)",
                          "rgba(54, 162, 235, 1)",
                          "rgba(255, 206, 86, 1)",
                          "rgba(75, 192, 192, 1)",
                          "rgba(153, 102, 255, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
