"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  ChevronDown,
  Download,
  Filter,
  Mail,
  MoreHorizontal,
  PlusCircle,
  Search,
  Trash2,
  UserPlus,
  Users,
  Tag,
  Calendar,
  Globe,
  Star,
  Percent,
  BarChart3,
  FileText,
  Edit,
  Copy,
  Share2,
  AlertCircle,
} from "lucide-react"
import AnalyticsChart from "@/components/analytics-chart"

export default function RespondentsPage() {
  const [selectedRespondents, setSelectedRespondents] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRespondent, setSelectedRespondent] = useState<any | null>(null)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [segmentSearchQuery, setSegmentSearchQuery] = useState("")
  const [showCreateSegmentDialog, setShowCreateSegmentDialog] = useState(false)
  const [newSegmentName, setNewSegmentName] = useState("")
  const [newSegmentDescription, setNewSegmentDescription] = useState("")
  const [selectedSegment, setSelectedSegment] = useState<any | null>(null)

  // Mock data for respondents
  const respondents = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      avatar: "/diverse-person-portrait.png",
      location: "United States",
      surveys: 5,
      lastActive: "2 days ago",
      tags: ["Customer", "Premium"],
      completionRate: 92,
      surveyHistory: [
        {
          id: "s1",
          title: "Customer Satisfaction Survey",
          date: "Jun 12, 2023",
          status: "completed",
        },
        {
          id: "s2",
          title: "Product Feedback Survey",
          date: "May 28, 2023",
          status: "completed",
        },
        {
          id: "s3",
          title: "Website User Experience",
          date: "Apr 15, 2023",
          status: "completed",
        },
        {
          id: "s4",
          title: "Email Marketing Effectiveness",
          date: "Mar 10, 2023",
          status: "completed",
        },
        {
          id: "s5",
          title: "Brand Perception Study",
          date: "Feb 05, 2023",
          status: "completed",
        },
      ],
      responseData: {
        avgRating: 4.2,
        npsScore: 8,
        mostUsedFeatures: ["Feature A", "Feature C"],
        referralSource: "Social Media",
      },
    },
    {
      id: "2",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      avatar: "/sarah-williams-portrait.png",
      location: "United Kingdom",
      surveys: 3,
      lastActive: "1 week ago",
      tags: ["Customer"],
      completionRate: 100,
      surveyHistory: [
        {
          id: "s1",
          title: "Customer Satisfaction Survey",
          date: "Jun 11, 2023",
          status: "completed",
        },
        {
          id: "s2",
          title: "Product Feedback Survey",
          date: "May 20, 2023",
          status: "completed",
        },
        {
          id: "s3",
          title: "Website User Experience",
          date: "Apr 05, 2023",
          status: "completed",
        },
      ],
      responseData: {
        avgRating: 4.8,
        npsScore: 10,
        mostUsedFeatures: ["Feature A"],
        referralSource: "Friend/Family",
      },
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      avatar: "/michael-brown-memorial.png",
      location: "Canada",
      surveys: 4,
      lastActive: "3 days ago",
      tags: ["Customer", "Beta Tester"],
      completionRate: 75,
      surveyHistory: [
        {
          id: "s1",
          title: "Customer Satisfaction Survey",
          date: "Jun 10, 2023",
          status: "completed",
        },
        {
          id: "s2",
          title: "Product Feedback Survey",
          date: "May 15, 2023",
          status: "completed",
        },
        {
          id: "s3",
          title: "Website User Experience",
          date: "Apr 01, 2023",
          status: "abandoned",
        },
        {
          id: "s4",
          title: "Email Marketing Effectiveness",
          date: "Mar 05, 2023",
          status: "completed",
        },
      ],
      responseData: {
        avgRating: 3.5,
        npsScore: 6,
        mostUsedFeatures: ["Feature B"],
        referralSource: "Advertisement",
      },
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      avatar: "/emily-davis-portrait.png",
      location: "Australia",
      surveys: 2,
      lastActive: "5 days ago",
      tags: ["Customer"],
      completionRate: 100,
      surveyHistory: [
        {
          id: "s1",
          title: "Customer Satisfaction Survey",
          date: "Jun 09, 2023",
          status: "completed",
        },
        {
          id: "s2",
          title: "Product Feedback Survey",
          date: "May 10, 2023",
          status: "completed",
        },
      ],
      responseData: {
        avgRating: 4.0,
        npsScore: 9,
        mostUsedFeatures: ["Feature A"],
        referralSource: "Search Engine",
      },
    },
    {
      id: "5",
      name: "David Wilson",
      email: "david.wilson@example.com",
      avatar: "/david-wilson-portrait.png",
      location: "Germany",
      surveys: 5,
      lastActive: "1 day ago",
      tags: ["Customer", "Premium", "Beta Tester"],
      completionRate: 80,
      surveyHistory: [
        {
          id: "s1",
          title: "Customer Satisfaction Survey",
          date: "Jun 08, 2023",
          status: "completed",
        },
        {
          id: "s2",
          title: "Product Feedback Survey",
          date: "May 25, 2023",
          status: "completed",
        },
        {
          id: "s3",
          title: "Website User Experience",
          date: "Apr 20, 2023",
          status: "completed",
        },
        {
          id: "s4",
          title: "Email Marketing Effectiveness",
          date: "Mar 15, 2023",
          status: "abandoned",
        },
        {
          id: "s5",
          title: "Brand Perception Study",
          date: "Feb 10, 2023",
          status: "completed",
        },
      ],
      responseData: {
        avgRating: 4.5,
        npsScore: 10,
        mostUsedFeatures: ["Feature C"],
        referralSource: "Social Media",
      },
    },
    {
      id: "6",
      name: "Olivia Martinez",
      email: "olivia.martinez@example.com",
      avatar: "/olivia-martinez.png",
      location: "Spain",
      surveys: 3,
      lastActive: "4 days ago",
      tags: ["Customer"],
      completionRate: 67,
      surveyHistory: [
        {
          id: "s1",
          title: "Customer Satisfaction Survey",
          date: "Jun 07, 2023",
          status: "completed",
        },
        {
          id: "s2",
          title: "Product Feedback Survey",
          date: "May 18, 2023",
          status: "completed",
        },
        {
          id: "s3",
          title: "Website User Experience",
          date: "Apr 10, 2023",
          status: "abandoned",
        },
      ],
      responseData: {
        avgRating: 4.0,
        npsScore: 8,
        mostUsedFeatures: ["Feature B"],
        referralSource: "Friend/Family",
      },
    },
    {
      id: "7",
      name: "James Taylor",
      email: "james.taylor@example.com",
      avatar: "/singer-songwriter-acoustic-guitar.png",
      location: "France",
      surveys: 2,
      lastActive: "1 week ago",
      tags: ["Customer"],
      completionRate: 50,
      surveyHistory: [
        {
          id: "s1",
          title: "Customer Satisfaction Survey",
          date: "Jun 06, 2023",
          status: "completed",
        },
        {
          id: "s2",
          title: "Product Feedback Survey",
          date: "May 12, 2023",
          status: "abandoned",
        },
      ],
      responseData: {
        avgRating: 3.0,
        npsScore: 7,
        mostUsedFeatures: ["Feature A"],
        referralSource: "Advertisement",
      },
    },
    {
      id: "8",
      name: "Sophia Anderson",
      email: "sophia.anderson@example.com",
      avatar: "/sophia-anderson.png",
      location: "Italy",
      surveys: 4,
      lastActive: "2 days ago",
      tags: ["Customer", "Premium"],
      completionRate: 100,
      surveyHistory: [
        {
          id: "s1",
          title: "Customer Satisfaction Survey",
          date: "Jun 05, 2023",
          status: "completed",
        },
        {
          id: "s2",
          title: "Product Feedback Survey",
          date: "May 22, 2023",
          status: "completed",
        },
        {
          id: "s3",
          title: "Website User Experience",
          date: "Apr 18, 2023",
          status: "completed",
        },
        {
          id: "s4",
          title: "Email Marketing Effectiveness",
          date: "Mar 12, 2023",
          status: "completed",
        },
      ],
      responseData: {
        avgRating: 5.0,
        npsScore: 9,
        mostUsedFeatures: ["Feature C"],
        referralSource: "Search Engine",
      },
    },
    {
      id: "9",
      name: "Daniel Garcia",
      email: "daniel.garcia@example.com",
      avatar: "/daniel-garcia-portrait.png",
      location: "Mexico",
      surveys: 3,
      lastActive: "3 days ago",
      tags: ["Customer", "Beta Tester"],
      completionRate: 100,
      surveyHistory: [
        {
          id: "s1",
          title: "Customer Satisfaction Survey",
          date: "Jun 04, 2023",
          status: "completed",
        },
        {
          id: "s2",
          title: "Product Feedback Survey",
          date: "May 19, 2023",
          status: "completed",
        },
        {
          id: "s3",
          title: "Website User Experience",
          date: "Apr 14, 2023",
          status: "completed",
        },
      ],
      responseData: {
        avgRating: 4.0,
        npsScore: 8,
        mostUsedFeatures: ["Feature B"],
        referralSource: "Social Media",
      },
    },
    {
      id: "10",
      name: "Emma Thompson",
      email: "emma.thompson@example.com",
      avatar: "/emma-thompson-portrait.png",
      location: "United States",
      surveys: 5,
      lastActive: "1 day ago",
      tags: ["Customer", "Premium"],
      completionRate: 100,
      surveyHistory: [
        {
          id: "s1",
          title: "Customer Satisfaction Survey",
          date: "Jun 03, 2023",
          status: "completed",
        },
        {
          id: "s2",
          title: "Product Feedback Survey",
          date: "May 27, 2023",
          status: "completed",
        },
        {
          id: "s3",
          title: "Website User Experience",
          date: "Apr 22, 2023",
          status: "completed",
        },
        {
          id: "s4",
          title: "Email Marketing Effectiveness",
          date: "Mar 17, 2023",
          status: "completed",
        },
        {
          id: "s5",
          title: "Brand Perception Study",
          date: "Feb 12, 2023",
          status: "completed",
        },
      ],
      responseData: {
        avgRating: 5.0,
        npsScore: 10,
        mostUsedFeatures: ["Feature A"],
        referralSource: "Friend/Family",
      },
    },
  ]

  // Mock data for segments
  const segments = [
    {
      id: "seg1",
      name: "Premium Members",
      description: "All respondents with Premium tag",
      criteria: [{ field: "tags", operator: "contains", value: "Premium" }],
      count: 4,
      createdAt: "Jun 15, 2023",
      lastUpdated: "2 days ago",
      color: "#4f46e5",
      icon: "Star",
    },
    {
      id: "seg2",
      name: "High NPS Promoters",
      description: "Respondents with NPS score of 9 or 10",
      criteria: [{ field: "responseData.npsScore", operator: ">=", value: 9 }],
      count: 5,
      createdAt: "Jun 10, 2023",
      lastUpdated: "5 days ago",
      color: "#10b981",
      icon: "BarChart3",
    },
    {
      id: "seg3",
      name: "US Customers",
      description: "All respondents from the United States",
      criteria: [{ field: "location", operator: "equals", value: "United States" }],
      count: 3,
      createdAt: "May 28, 2023",
      lastUpdated: "1 week ago",
      color: "#3b82f6",
      icon: "Globe",
    },
    {
      id: "seg4",
      name: "Beta Testers",
      description: "All respondents with Beta Tester tag",
      criteria: [{ field: "tags", operator: "contains", value: "Beta Tester" }],
      count: 3,
      createdAt: "May 20, 2023",
      lastUpdated: "2 weeks ago",
      color: "#f59e0b",
      icon: "Tag",
    },
    {
      id: "seg5",
      name: "Recent Respondents",
      description: "Respondents active in the last 3 days",
      criteria: [{ field: "lastActive", operator: "contains", value: "day" }],
      count: 4,
      createdAt: "May 15, 2023",
      lastUpdated: "3 weeks ago",
      color: "#ec4899",
      icon: "Calendar",
    },
    {
      id: "seg6",
      name: "100% Completion Rate",
      description: "Respondents who complete all surveys",
      criteria: [{ field: "completionRate", operator: "equals", value: 100 }],
      count: 5,
      createdAt: "May 10, 2023",
      lastUpdated: "1 month ago",
      color: "#8b5cf6",
      icon: "Percent",
    },
    {
      id: "seg7",
      name: "Feature A Users",
      description: "Respondents who use Feature A",
      criteria: [{ field: "responseData.mostUsedFeatures", operator: "contains", value: "Feature A" }],
      count: 6,
      createdAt: "May 5, 2023",
      lastUpdated: "1 month ago",
      color: "#06b6d4",
      icon: "FileText",
    },
  ]

  const filteredRespondents = respondents.filter(
    (respondent) =>
      respondent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      respondent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      respondent.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredSegments = segments.filter(
    (segment) =>
      segment.name.toLowerCase().includes(segmentSearchQuery.toLowerCase()) ||
      segment.description.toLowerCase().includes(segmentSearchQuery.toLowerCase()),
  )

  const toggleSelectRespondent = (id: string) => {
    setSelectedRespondents((prev) =>
      prev.includes(id) ? prev.filter((respondentId) => respondentId !== id) : [...prev, id],
    )
  }

  const selectAllRespondents = () => {
    if (selectedRespondents.length === filteredRespondents.length) {
      setSelectedRespondents([])
    } else {
      setSelectedRespondents(filteredRespondents.map((respondent) => respondent.id))
    }
  }

  // Calculate statistics
  const totalRespondents = respondents.length
  const totalSurveys = respondents.reduce((acc, respondent) => acc + respondent.surveys, 0)
  const avgCompletionRate =
    respondents.reduce((acc, respondent) => acc + respondent.completionRate, 0) / respondents.length

  // Calculate NPS distribution
  const npsDistribution = {
    promoters: respondents.filter((r) => r.responseData.npsScore >= 9).length,
    passives: respondents.filter((r) => r.responseData.npsScore >= 7 && r.responseData.npsScore <= 8).length,
    detractors: respondents.filter((r) => r.responseData.npsScore <= 6).length,
  }

  // Calculate location distribution
  const locationData = respondents.reduce((acc: Record<string, number>, respondent) => {
    acc[respondent.location] = (acc[respondent.location] || 0) + 1
    return acc
  }, {})

  // Get icon component based on string name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Star":
        return <Star className="h-5 w-5" />
      case "BarChart3":
        return <BarChart3 className="h-5 w-5" />
      case "Globe":
        return <Globe className="h-5 w-5" />
      case "Tag":
        return <Tag className="h-5 w-5" />
      case "Calendar":
        return <Calendar className="h-5 w-5" />
      case "Percent":
        return <Percent className="h-5 w-5" />
      case "FileText":
        return <FileText className="h-5 w-5" />
      default:
        return <Users className="h-5 w-5" />
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Respondents</h1>
            <p className="text-muted-foreground">Manage and analyze your survey respondents</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Respondent
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Respondents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRespondents}</div>
            <p className="text-xs text-muted-foreground">+3 in the last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Surveys Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSurveys}</div>
            <p className="text-xs text-muted-foreground">+8 in the last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgCompletionRate)}%</div>
            <Progress value={avgCompletionRate} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Promoter Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                ((npsDistribution.promoters - npsDistribution.detractors) /
                  (npsDistribution.promoters + npsDistribution.passives + npsDistribution.detractors)) *
                  100,
              )}
            </div>
            <div className="flex h-2 mt-2 overflow-hidden rounded">
              <div
                className="bg-red-500"
                style={{
                  width: `${
                    (npsDistribution.detractors /
                      (npsDistribution.promoters + npsDistribution.passives + npsDistribution.detractors)) *
                    100
                  }%`,
                }}
              ></div>
              <div
                className="bg-yellow-500"
                style={{
                  width: `${
                    (npsDistribution.passives /
                      (npsDistribution.promoters + npsDistribution.passives + npsDistribution.detractors)) *
                    100
                  }%`,
                }}
              ></div>
              <div
                className="bg-green-500"
                style={{
                  width: `${
                    (npsDistribution.promoters /
                      (npsDistribution.promoters + npsDistribution.passives + npsDistribution.detractors)) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="list">Respondent List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search respondents..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Label htmlFor="tag-filter" className="text-xs">
                      Tag
                    </Label>
                    <Select>
                      <SelectTrigger id="tag-filter">
                        <SelectValue placeholder="Any tag" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any tag</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="beta">Beta Tester</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-2">
                    <Label htmlFor="location-filter" className="text-xs">
                      Location
                    </Label>
                    <Select>
                      <SelectTrigger id="location-filter">
                        <SelectValue placeholder="Any location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any location</SelectItem>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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

              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {selectedRespondents.length > 0 && (
            <div className="flex items-center justify-between bg-muted p-4 rounded-lg mb-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={selectedRespondents.length === filteredRespondents.length}
                  onCheckedChange={selectAllRespondents}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  {selectedRespondents.length} selected
                </label>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
                <Button variant="outline" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  Add to Segment
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={
                          selectedRespondents.length === filteredRespondents.length && filteredRespondents.length > 0
                        }
                        onCheckedChange={selectAllRespondents}
                      />
                      <span>Respondent</span>
                    </div>
                  </th>
                  <th className="text-left p-3 font-medium text-sm">Location</th>
                  <th className="text-left p-3 font-medium text-sm">Tags</th>
                  <th className="text-left p-3 font-medium text-sm">Surveys</th>
                  <th className="text-left p-3 font-medium text-sm">Completion Rate</th>
                  <th className="text-left p-3 font-medium text-sm">Last Active</th>
                  <th className="text-right p-3 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRespondents.map((respondent, index) => (
                  <tr key={respondent.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedRespondents.includes(respondent.id)}
                          onCheckedChange={() => toggleSelectRespondent(respondent.id)}
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={respondent.avatar || "/placeholder.svg"} alt={respondent.name} />
                          <AvatarFallback>
                            {respondent.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{respondent.name}</div>
                          <div className="text-xs text-muted-foreground">{respondent.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{respondent.location}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {respondent.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">{respondent.surveys}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Progress value={respondent.completionRate} className="h-2 w-16" />
                        <span className="text-sm">{respondent.completionRate}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm">{respondent.lastActive}</td>
                    <td className="p-3">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedRespondent(respondent)}>
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Send Email</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{filteredRespondents.length}</strong> of <strong>{respondents.length}</strong> respondents
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Respondent Locations</CardTitle>
                <CardDescription>Geographic distribution of respondents</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart
                  type="pie"
                  data={{
                    labels: Object.keys(locationData),
                    datasets: [
                      {
                        data: Object.values(locationData),
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.6)",
                          "rgba(54, 162, 235, 0.6)",
                          "rgba(255, 206, 86, 0.6)",
                          "rgba(75, 192, 192, 0.6)",
                          "rgba(153, 102, 255, 0.6)",
                          "rgba(255, 159, 64, 0.6)",
                          "rgba(201, 203, 207, 0.6)",
                        ],
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        position: "right",
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>NPS Distribution</CardTitle>
                <CardDescription>Net Promoter Score breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart
                  type="bar"
                  data={{
                    labels: ["Detractors (0-6)", "Passives (7-8)", "Promoters (9-10)"],
                    datasets: [
                      {
                        data: [npsDistribution.detractors, npsDistribution.passives, npsDistribution.promoters],
                        backgroundColor: ["rgba(239, 68, 68, 0.6)", "rgba(234, 179, 8, 0.6)", "rgba(34, 197, 94, 0.6)"],
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="segments">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search segments..."
                className="pl-8"
                value={segmentSearchQuery}
                onChange={(e) => setSegmentSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Dialog open={showCreateSegmentDialog} onOpenChange={setShowCreateSegmentDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Segment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Segment</DialogTitle>
                    <DialogDescription>
                      Create a segment to group respondents based on specific criteria.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="segment-name">Segment Name</Label>
                      <Input
                        id="segment-name"
                        placeholder="e.g., High Value Customers"
                        value={newSegmentName}
                        onChange={(e) => setNewSegmentName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="segment-description">Description</Label>
                      <Textarea
                        id="segment-description"
                        placeholder="Describe what this segment represents"
                        value={newSegmentDescription}
                        onChange={(e) => setNewSegmentDescription(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Segment Criteria</Label>
                      <Card className="p-4">
                        <div className="flex flex-col gap-3">
                          <div className="flex gap-2">
                            <Select defaultValue="tags">
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tags">Tags</SelectItem>
                                <SelectItem value="location">Location</SelectItem>
                                <SelectItem value="completionRate">Completion Rate</SelectItem>
                                <SelectItem value="npsScore">NPS Score</SelectItem>
                                <SelectItem value="lastActive">Last Active</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select defaultValue="contains">
                              <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Select operator" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="equals">Equals</SelectItem>
                                <SelectItem value="contains">Contains</SelectItem>
                                <SelectItem value="greaterThan">Greater than</SelectItem>
                                <SelectItem value="lessThan">Less than</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input placeholder="Value" className="flex-1" />
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Condition
                          </Button>
                        </div>
                      </Card>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateSegmentDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setShowCreateSegmentDialog(false)}>Create Segment</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSegments.map((segment) => (
              <Card key={segment.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-full"
                        style={{ backgroundColor: `${segment.color}20` }}
                      >
                        <div style={{ color: segment.color }}>{getIconComponent(segment.icon)}</div>
                      </div>
                      <CardTitle className="text-lg">{segment.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedSegment(segment)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>{segment.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-muted-foreground">Respondents</div>
                    <div className="font-medium">{segment.count}</div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-muted-foreground">Created</div>
                    <div className="text-sm">{segment.createdAt}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Last Updated</div>
                    <div className="text-sm">{segment.lastUpdated}</div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-3 border-t">
                  <Button variant="outline" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    View Respondents
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredSegments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <AlertCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No segments found</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                {segmentSearchQuery
                  ? `No segments match your search for "${segmentSearchQuery}"`
                  : "You haven't created any segments yet. Segments help you group respondents based on specific criteria."}
              </p>
              <Button onClick={() => setShowCreateSegmentDialog(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Segment
              </Button>
            </div>
          )}

          {filteredSegments.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing <strong>{filteredSegments.length}</strong> of <strong>{segments.length}</strong> segments
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
