"use client"
import { useState, useEffect, useRef } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  Star,
  CheckSquare,
  MessageSquare,
  Calendar,
  Smile,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample question bank data - in a real app, this would come from an API
const defaultQuestions = [
  // Customer Satisfaction & Feedback
  {
    id: "qb1",
    question: "How satisfied are you with your recent purchase?",
    type: "rating",
    category: "Customer Satisfaction",
    survey: "Post-Purchase Feedback",
    usageCount: 156,
  },
  {
    id: "qb2",
    question: "How likely are you to recommend our online store to a friend or colleague?",
    type: "nps",
    category: "Customer Satisfaction",
    survey: "Net Promoter Score",
    usageCount: 203,
  },
  {
    id: "qb3",
    question: "What was the main reason for your purchase today?",
    type: "single-choice",
    category: "Purchase Behavior",
    survey: "Purchase Motivation",
    usageCount: 142,
    options: ["Need", "Want", "Gift", "Recommendation", "Sale/Discount", "Other"],
  },
  {
    id: "qb4",
    question: "How would you rate the ease of finding what you were looking for?",
    type: "rating",
    category: "Website UX",
    survey: "Shopping Experience",
    usageCount: 178,
  },
  {
    id: "qb5",
    question: "How would you rate the checkout process?",
    type: "rating",
    category: "Website UX",
    survey: "Checkout Experience",
    usageCount: 165,
  },
  {
    id: "qb6",
    question: "What improvements would you suggest for our website?",
    type: "long-text",
    category: "Website UX",
    survey: "Website Improvement",
    usageCount: 89,
  },

  // Product Feedback
  {
    id: "qb7",
    question: "How would you rate the quality of the product(s) you received?",
    type: "rating",
    category: "Product Feedback",
    survey: "Product Quality",
    usageCount: 192,
  },
  {
    id: "qb8",
    question: "Did the product meet your expectations?",
    type: "single-choice",
    category: "Product Feedback",
    survey: "Product Satisfaction",
    usageCount: 167,
    options: ["Exceeded expectations", "Met expectations", "Somewhat met expectations", "Did not meet expectations"],
  },
  {
    id: "qb9",
    question: "What features do you like most about the product?",
    type: "multiple-choice",
    category: "Product Feedback",
    survey: "Product Features",
    usageCount: 134,
    options: ["Quality", "Design", "Functionality", "Price", "Durability", "Ease of use", "Other"],
  },
  {
    id: "qb10",
    question: "What features would you like to see improved?",
    type: "multiple-choice",
    category: "Product Feedback",
    survey: "Product Improvement",
    usageCount: 112,
    options: ["Quality", "Design", "Functionality", "Price", "Durability", "Ease of use", "Other"],
  },
  {
    id: "qb11",
    question: "How likely are you to purchase this product again?",
    type: "rating",
    category: "Product Feedback",
    survey: "Repurchase Intent",
    usageCount: 145,
  },

  // Shipping & Delivery
  {
    id: "qb12",
    question: "How satisfied are you with the delivery time?",
    type: "rating",
    category: "Shipping & Delivery",
    survey: "Delivery Experience",
    usageCount: 176,
  },
  {
    id: "qb13",
    question: "Was your order delivered in good condition?",
    type: "single-choice",
    category: "Shipping & Delivery",
    survey: "Packaging Quality",
    usageCount: 158,
    options: ["Yes, perfect condition", "Minor issues but acceptable", "Damaged but usable", "Severely damaged"],
  },
  {
    id: "qb14",
    question: "How would you rate our packaging?",
    type: "rating",
    category: "Shipping & Delivery",
    survey: "Packaging Quality",
    usageCount: 132,
  },
  {
    id: "qb15",
    question: "Which shipping option did you choose?",
    type: "single-choice",
    category: "Shipping & Delivery",
    survey: "Shipping Preferences",
    usageCount: 124,
    options: ["Standard", "Express", "Next-day", "Same-day", "Pick-up in store"],
  },

  // Customer Service
  {
    id: "qb16",
    question: "Did you contact our customer service team?",
    type: "single-choice",
    category: "Customer Service",
    survey: "Support Experience",
    usageCount: 98,
    options: ["Yes", "No"],
  },
  {
    id: "qb17",
    question: "How would you rate your customer service experience?",
    type: "rating",
    category: "Customer Service",
    survey: "Support Experience",
    usageCount: 87,
  },
  {
    id: "qb18",
    question: "How quickly was your issue resolved?",
    type: "single-choice",
    category: "Customer Service",
    survey: "Support Efficiency",
    usageCount: 76,
    options: ["Immediately", "Within hours", "Within a day", "Within a week", "Still not resolved"],
  },
  {
    id: "qb19",
    question: "What could we do to improve our customer service?",
    type: "long-text",
    category: "Customer Service",
    survey: "Support Improvement",
    usageCount: 65,
  },

  // Website Experience
  {
    id: "qb20",
    question: "How easy was it to navigate our website?",
    type: "rating",
    category: "Website UX",
    survey: "Navigation Experience",
    usageCount: 187,
  },
  {
    id: "qb21",
    question: "How would you rate the search functionality on our website?",
    type: "rating",
    category: "Website UX",
    survey: "Search Experience",
    usageCount: 156,
  },
  {
    id: "qb22",
    question: "Did you experience any technical issues while shopping?",
    type: "single-choice",
    category: "Website UX",
    survey: "Technical Issues",
    usageCount: 132,
    options: ["No issues", "Minor issues", "Significant issues", "Could not complete purchase"],
  },
  {
    id: "qb23",
    question: "How would you rate the product images and descriptions?",
    type: "rating",
    category: "Website UX",
    survey: "Product Information",
    usageCount: 143,
  },
  {
    id: "qb24",
    question: "What device did you use to make your purchase?",
    type: "single-choice",
    category: "Website UX",
    survey: "Device Usage",
    usageCount: 121,
    options: ["Desktop computer", "Laptop", "Tablet", "Smartphone", "Other"],
  },

  // Mobile App Experience
  {
    id: "qb25",
    question: "Have you used our mobile app?",
    type: "single-choice",
    category: "Mobile Experience",
    survey: "App Usage",
    usageCount: 98,
    options: [
      "Yes, regularly",
      "Yes, occasionally",
      "I've tried it once",
      "No, but I'm aware of it",
      "No, I didn't know about it",
    ],
  },
  {
    id: "qb26",
    question: "How would you rate our mobile app?",
    type: "rating",
    category: "Mobile Experience",
    survey: "App Satisfaction",
    usageCount: 87,
  },
  {
    id: "qb27",
    question: "What features would you like to see in our mobile app?",
    type: "multiple-choice",
    category: "Mobile Experience",
    survey: "App Features",
    usageCount: 76,
    options: [
      "Barcode scanner",
      "AR try-on",
      "Personalized recommendations",
      "Loyalty program",
      "In-app chat support",
      "Other",
    ],
  },

  // Pricing & Value
  {
    id: "qb28",
    question: "How would you rate the value for money of your purchase?",
    type: "rating",
    category: "Pricing & Value",
    survey: "Value Perception",
    usageCount: 167,
  },
  {
    id: "qb29",
    question: "How do our prices compare to similar retailers?",
    type: "single-choice",
    category: "Pricing & Value",
    survey: "Price Comparison",
    usageCount: 143,
    options: ["Much lower", "Somewhat lower", "About the same", "Somewhat higher", "Much higher"],
  },
  {
    id: "qb30",
    question: "Would you have completed your purchase without the discount/promotion?",
    type: "single-choice",
    category: "Pricing & Value",
    survey: "Promotion Impact",
    usageCount: 132,
    options: ["Definitely yes", "Probably yes", "Not sure", "Probably not", "Definitely not"],
  },

  // Shopping Cart & Checkout
  {
    id: "qb31",
    question: "How easy was it to add products to your cart?",
    type: "rating",
    category: "Shopping Cart",
    survey: "Cart Experience",
    usageCount: 154,
  },
  {
    id: "qb32",
    question: "Did you encounter any issues during checkout?",
    type: "single-choice",
    category: "Shopping Cart",
    survey: "Checkout Issues",
    usageCount: 143,
    options: [
      "No issues",
      "Minor issues but completed",
      "Significant issues but completed",
      "Could not complete checkout",
    ],
  },
  {
    id: "qb33",
    question: "Which payment method did you use?",
    type: "single-choice",
    category: "Shopping Cart",
    survey: "Payment Methods",
    usageCount: 132,
    options: ["Credit/Debit card", "PayPal", "Apple Pay", "Google Pay", "Buy now, pay later", "Gift card", "Other"],
  },
  {
    id: "qb34",
    question: "How satisfied are you with the available payment options?",
    type: "rating",
    category: "Shopping Cart",
    survey: "Payment Satisfaction",
    usageCount: 121,
  },

  // Demographics & Customer Profile
  {
    id: "qb35",
    question: "How often do you shop online?",
    type: "single-choice",
    category: "Demographics",
    survey: "Shopping Habits",
    usageCount: 176,
    options: ["Daily", "Weekly", "Monthly", "A few times a year", "Rarely"],
  },
  {
    id: "qb36",
    question: "What is your age group?",
    type: "single-choice",
    category: "Demographics",
    survey: "Customer Profile",
    usageCount: 165,
    options: ["Under 18", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
  },
  {
    id: "qb37",
    question: "How did you discover our online store?",
    type: "single-choice",
    category: "Demographics",
    survey: "Acquisition Channel",
    usageCount: 154,
    options: [
      "Search engine",
      "Social media",
      "Friend/family recommendation",
      "Online advertisement",
      "Email marketing",
      "Other",
    ],
  },

  // Marketing & Communication
  {
    id: "qb38",
    question: "Are you subscribed to our newsletter?",
    type: "single-choice",
    category: "Marketing",
    survey: "Email Subscription",
    usageCount: 132,
    options: ["Yes", "No", "Not sure"],
  },
  {
    id: "qb39",
    question: "How would you rate the relevance of our marketing emails?",
    type: "rating",
    category: "Marketing",
    survey: "Email Relevance",
    usageCount: 121,
  },
  {
    id: "qb40",
    question: "How often would you like to receive emails from us?",
    type: "single-choice",
    category: "Marketing",
    survey: "Email Frequency",
    usageCount: 110,
    options: ["Daily", "Weekly", "Bi-weekly", "Monthly", "Only for special promotions", "Never"],
  },

  // Loyalty & Retention
  {
    id: "qb41",
    question: "Are you a member of our loyalty program?",
    type: "single-choice",
    category: "Loyalty",
    survey: "Loyalty Program",
    usageCount: 143,
    options: ["Yes", "No", "Not sure"],
  },
  {
    id: "qb42",
    question: "How satisfied are you with our loyalty program benefits?",
    type: "rating",
    category: "Loyalty",
    survey: "Loyalty Satisfaction",
    usageCount: 132,
  },
  {
    id: "qb43",
    question: "What additional loyalty benefits would you like to see?",
    type: "multiple-choice",
    category: "Loyalty",
    survey: "Loyalty Benefits",
    usageCount: 121,
    options: [
      "More points per purchase",
      "Exclusive discounts",
      "Early access to sales",
      "Free shipping",
      "Birthday rewards",
      "Other",
    ],
  },

  // Competitive Analysis
  {
    id: "qb44",
    question: "Which other online stores do you regularly shop at?",
    type: "multiple-choice",
    category: "Competition",
    survey: "Competitor Analysis",
    usageCount: 132,
    options: ["Amazon", "eBay", "Walmart", "Target", "Etsy", "Specialized retailers", "Other"],
  },
  {
    id: "qb45",
    question: "How does our store compare to others you shop at?",
    type: "single-choice",
    category: "Competition",
    survey: "Competitive Position",
    usageCount: 121,
    options: ["Much better", "Somewhat better", "About the same", "Somewhat worse", "Much worse"],
  },
  {
    id: "qb46",
    question: "What do other stores offer that we don't?",
    type: "long-text",
    category: "Competition",
    survey: "Competitive Gap",
    usageCount: 110,
  },

  // Future Purchase Intent
  {
    id: "qb47",
    question: "How likely are you to shop with us again?",
    type: "rating",
    category: "Future Intent",
    survey: "Repurchase Intent",
    usageCount: 187,
  },
  {
    id: "qb48",
    question: "When do you expect to make your next purchase from us?",
    type: "single-choice",
    category: "Future Intent",
    survey: "Purchase Timeline",
    usageCount: 165,
    options: ["Within a week", "Within a month", "Within 3 months", "Within 6 months", "Within a year", "Not sure"],
  },
  {
    id: "qb49",
    question: "What products are you interested in purchasing in the future?",
    type: "multiple-choice",
    category: "Future Intent",
    survey: "Product Interest",
    usageCount: 154,
    options: ["Clothing", "Electronics", "Home goods", "Beauty products", "Food & beverages", "Other"],
  },

  // Overall Experience
  {
    id: "qb50",
    question: "What is the one thing we could do to improve your shopping experience?",
    type: "long-text",
    category: "Overall Experience",
    survey: "Improvement Suggestions",
    usageCount: 198,
  },
  {
    id: "qb51",
    question: "How would you rate your overall shopping experience?",
    type: "rating",
    category: "Overall Experience",
    survey: "Experience Rating",
    usageCount: 210,
  },
  {
    id: "qb52",
    question: "Would you like to share any additional feedback about your experience?",
    type: "long-text",
    category: "Overall Experience",
    survey: "Additional Feedback",
    usageCount: 176,
  },

  // Sustainability & Ethics
  {
    id: "qb53",
    question: "How important is sustainability to you when shopping?",
    type: "rating",
    category: "Sustainability",
    survey: "Sustainability Importance",
    usageCount: 143,
  },
  {
    id: "qb54",
    question: "How would you rate our commitment to sustainability?",
    type: "rating",
    category: "Sustainability",
    survey: "Sustainability Rating",
    usageCount: 132,
  },
  {
    id: "qb55",
    question: "Which sustainable practices are most important to you?",
    type: "multiple-choice",
    category: "Sustainability",
    survey: "Sustainable Practices",
    usageCount: 121,
    options: [
      "Eco-friendly packaging",
      "Sustainable materials",
      "Carbon-neutral shipping",
      "Fair labor practices",
      "Charitable giving",
      "Other",
    ],
  },
]

// Get icon for question type
const getQuestionTypeIcon = (type: string) => {
  switch (type) {
    case "rating":
      return <Star className="h-4 w-4" />
    case "single-choice":
    case "multiple-choice":
    case "dropdown":
      return <CheckSquare className="h-4 w-4" />
    case "long-text":
    case "short-text":
      return <MessageSquare className="h-4 w-4" />
    case "date":
      return <Calendar className="h-4 w-4" />
    case "emoji":
      return <Smile className="h-4 w-4" />
    default:
      return <CheckSquare className="h-4 w-4" />
  }
}

interface QuestionBankProps {
  onAddQuestion: (question: any) => void
}

export default function QuestionBank({ onAddQuestion }: QuestionBankProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [questions, setQuestions] = useState(defaultQuestions)
  const tabsListRef = useRef<HTMLDivElement>(null)

  // Load saved questions from localStorage on component mount
  useEffect(() => {
    const savedQuestions = localStorage.getItem("customQuestions")
    if (savedQuestions) {
      const parsedQuestions = JSON.parse(savedQuestions)
      setQuestions([...defaultQuestions, ...parsedQuestions])
    }
  }, [])

  // Get unique categories from questions
  const categories = ["all", ...Array.from(new Set(questions.map((q) => q.category)))].sort()

  // Filter questions based on search term and active category
  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || question.category === activeCategory
    return matchesSearch && matchesCategory
  })

  // Sort questions based on selected sort option
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sortBy === "popular") {
      return b.usageCount - a.usageCount
    } else if (sortBy === "az") {
      return a.question.localeCompare(b.question)
    } else if (sortBy === "za") {
      return b.question.localeCompare(a.question)
    }
    return 0
  })

  // Function to add a custom question to the question bank
  const addCustomQuestion = (question: any) => {
    const newQuestions = [...questions, question]
    setQuestions(newQuestions)

    // Save custom questions to localStorage
    const existingQuestions = JSON.parse(localStorage.getItem("customQuestions") || "[]")
    localStorage.setItem("customQuestions", JSON.stringify([...existingQuestions, question]))
  }

  // Function to scroll tabs left
  const scrollTabsLeft = () => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  // Function to scroll tabs right
  const scrollTabsRight = () => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  return (
    <Card className="h-full border-0 shadow-none flex flex-col">
      <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-white border-b shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Question Bank</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px]">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="az">A to Z</SelectItem>
                <SelectItem value="za">Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <Tabs
        defaultValue="all"
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="flex-1 flex flex-col"
      >
        {/* Category navigation with horizontal scrolling and scroll buttons */}
        <div className="px-2 bg-gray-50 shrink-0 border-b relative">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 absolute left-0 z-10 bg-gray-50/80"
              onClick={scrollTabsLeft}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div
              className="overflow-x-auto py-2 px-6 flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
              ref={tabsListRef}
              style={{ scrollbarWidth: "thin" }}
            >
              <TabsList className="bg-gray-100 inline-flex min-w-max">
                <TabsTrigger
                  key="all"
                  value="all"
                  className="data-[state=active]:bg-white font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  All Questions
                </TabsTrigger>
                {categories
                  .filter((cat) => cat !== "all")
                  .map((category) => (
                    <TabsTrigger key={category} value={category} className="capitalize data-[state=active]:bg-white">
                      {category}
                    </TabsTrigger>
                  ))}
              </TabsList>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 absolute right-10 z-10 bg-gray-50/80"
                onClick={scrollTabsRight}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Categories dropdown for vertical scrolling */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 absolute right-0 z-10 bg-gray-50/80 border-gray-200"
                  >
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Categories
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className={activeCategory === "all" ? "bg-gray-100 font-medium" : ""}
                      onClick={() => setActiveCategory("all")}
                    >
                      All Questions
                    </DropdownMenuItem>
                    {categories
                      .filter((cat) => cat !== "all")
                      .map((category) => (
                        <DropdownMenuItem
                          key={category}
                          className={activeCategory === category ? "bg-gray-100 font-medium" : ""}
                          onClick={() => setActiveCategory(category)}
                        >
                          {category}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Question list with vertical scrolling */}
        <div className="flex-1 overflow-hidden bg-white">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No questions found. Try a different search term or category.
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-4" style={{ maxHeight: "calc(100vh - 250px)" }}>
              <div className="space-y-3">
                {sortedQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="border rounded-md p-3 hover:bg-gray-50 transition-colors cursor-pointer group bg-white shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-gray-500 bg-gray-100 p-1 rounded-full">
                            {getQuestionTypeIcon(question.type)}
                          </div>
                          <span className="font-medium line-clamp-2 text-sm">{question.question}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {question.type.replace(/-/g, " ")}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {question.survey}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Used {question.usageCount} times</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onAddQuestion(question)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Tabs>
    </Card>
  )
}
