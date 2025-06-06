"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Eye, Star } from "lucide-react"

export default function ResponseTable() {
  const [selectedResponse, setSelectedResponse] = useState<any | null>(null)

  // Mock data for responses
  const responses = [
    {
      id: "1",
      respondent: {
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        avatar: "/diverse-person-portrait.png",
      },
      date: "Jun 12, 2023",
      time: "10:23 AM",
      device: "Desktop",
      browser: "Chrome",
      location: "United States",
      completionTime: "4m 12s",
      answers: [
        {
          question: "How satisfied are you with our product?",
          answer: "4",
          type: "rating",
        },
        {
          question: "How likely are you to recommend our product to others?",
          answer: "8",
          type: "nps",
        },
        {
          question: "Which features do you use most often?",
          answer: "Feature C",
          type: "multiple-choice",
        },
        {
          question: "How did you hear about our product?",
          answer: "Social Media",
          type: "multiple-choice",
        },
        {
          question: "Any additional feedback?",
          answer: "Great product overall, but could use some improvements in the user interface.",
          type: "text",
        },
      ],
    },
    {
      id: "2",
      respondent: {
        name: "Sarah Williams",
        email: "sarah.williams@example.com",
        avatar: "/sarah-williams-portrait.png",
      },
      date: "Jun 11, 2023",
      time: "3:45 PM",
      device: "Mobile",
      browser: "Safari",
      location: "United Kingdom",
      completionTime: "3m 05s",
      answers: [
        {
          question: "How satisfied are you with our product?",
          answer: "5",
          type: "rating",
        },
        {
          question: "How likely are you to recommend our product to others?",
          answer: "10",
          type: "nps",
        },
        {
          question: "Which features do you use most often?",
          answer: "Feature A",
          type: "multiple-choice",
        },
        {
          question: "How did you hear about our product?",
          answer: "Friend/Family",
          type: "multiple-choice",
        },
        {
          question: "Any additional feedback?",
          answer: "Love the product! It has made my life so much easier.",
          type: "text",
        },
      ],
    },
    {
      id: "3",
      respondent: {
        name: "Michael Brown",
        email: "michael.brown@example.com",
        avatar: "/michael-brown-memorial.png",
      },
      date: "Jun 10, 2023",
      time: "9:12 AM",
      device: "Desktop",
      browser: "Firefox",
      location: "Canada",
      completionTime: "5m 30s",
      answers: [
        {
          question: "How satisfied are you with our product?",
          answer: "3",
          type: "rating",
        },
        {
          question: "How likely are you to recommend our product to others?",
          answer: "6",
          type: "nps",
        },
        {
          question: "Which features do you use most often?",
          answer: "Feature B",
          type: "multiple-choice",
        },
        {
          question: "How did you hear about our product?",
          answer: "Advertisement",
          type: "multiple-choice",
        },
        {
          question: "Any additional feedback?",
          answer: "The product is good but customer support could be better.",
          type: "text",
        },
      ],
    },
    {
      id: "4",
      respondent: {
        name: "Emily Davis",
        email: "emily.davis@example.com",
        avatar: "/emily-davis-portrait.png",
      },
      date: "Jun 9, 2023",
      time: "2:30 PM",
      device: "Tablet",
      browser: "Chrome",
      location: "Australia",
      completionTime: "2m 45s",
      answers: [
        {
          question: "How satisfied are you with our product?",
          answer: "4",
          type: "rating",
        },
        {
          question: "How likely are you to recommend our product to others?",
          answer: "9",
          type: "nps",
        },
        {
          question: "Which features do you use most often?",
          answer: "Feature A",
          type: "multiple-choice",
        },
        {
          question: "How did you hear about our product?",
          answer: "Search Engine",
          type: "multiple-choice",
        },
        {
          question: "Any additional feedback?",
          answer: "Very intuitive and easy to use. Would love to see more integrations.",
          type: "text",
        },
      ],
    },
    {
      id: "5",
      respondent: {
        name: "David Wilson",
        email: "david.wilson@example.com",
        avatar: "/david-wilson-portrait.png",
      },
      date: "Jun 8, 2023",
      time: "11:20 AM",
      device: "Mobile",
      browser: "Safari",
      location: "Germany",
      completionTime: "3m 15s",
      answers: [
        {
          question: "How satisfied are you with our product?",
          answer: "5",
          type: "rating",
        },
        {
          question: "How likely are you to recommend our product to others?",
          answer: "10",
          type: "nps",
        },
        {
          question: "Which features do you use most often?",
          answer: "Feature C",
          type: "multiple-choice",
        },
        {
          question: "How did you hear about our product?",
          answer: "Social Media",
          type: "multiple-choice",
        },
        {
          question: "Any additional feedback?",
          answer: "Excellent product! The customer service is outstanding.",
          type: "text",
        },
      ],
    },
    {
      id: "6",
      respondent: {
        name: "Olivia Martinez",
        email: "olivia.martinez@example.com",
        avatar: "/olivia-martinez.png",
      },
      date: "Jun 7, 2023",
      time: "4:05 PM",
      device: "Desktop",
      browser: "Edge",
      location: "Spain",
      completionTime: "4m 50s",
      answers: [
        {
          question: "How satisfied are you with our product?",
          answer: "4",
          type: "rating",
        },
        {
          question: "How likely are you to recommend our product to others?",
          answer: "8",
          type: "nps",
        },
        {
          question: "Which features do you use most often?",
          answer: "Feature B",
          type: "multiple-choice",
        },
        {
          question: "How did you hear about our product?",
          answer: "Friend/Family",
          type: "multiple-choice",
        },
        {
          question: "Any additional feedback?",
          answer: "Very good product. Would like to see more customization options.",
          type: "text",
        },
      ],
    },
    {
      id: "7",
      respondent: {
        name: "James Taylor",
        email: "james.taylor@example.com",
        avatar: "/placeholder.svg?height=40&width=40&query=James Taylor",
      },
      date: "Jun 6, 2023",
      time: "10:45 AM",
      device: "Mobile",
      browser: "Chrome",
      location: "France",
      completionTime: "3m 30s",
      answers: [
        {
          question: "How satisfied are you with our product?",
          answer: "3",
          type: "rating",
        },
        {
          question: "How likely are you to recommend our product to others?",
          answer: "7",
          type: "nps",
        },
        {
          question: "Which features do you use most often?",
          answer: "Feature A",
          type: "multiple-choice",
        },
        {
          question: "How did you hear about our product?",
          answer: "Advertisement",
          type: "multiple-choice",
        },
        {
          question: "Any additional feedback?",
          answer: "Good product but the mobile app needs improvement.",
          type: "text",
        },
      ],
    },
    {
      id: "8",
      respondent: {
        name: "Sophia Anderson",
        email: "sophia.anderson@example.com",
        avatar: "/placeholder.svg?height=40&width=40&query=Sophia Anderson",
      },
      date: "Jun 5, 2023",
      time: "1:15 PM",
      device: "Desktop",
      browser: "Chrome",
      location: "Italy",
      completionTime: "2m 55s",
      answers: [
        {
          question: "How satisfied are you with our product?",
          answer: "5",
          type: "rating",
        },
        {
          question: "How likely are you to recommend our product to others?",
          answer: "9",
          type: "nps",
        },
        {
          question: "Which features do you use most often?",
          answer: "Feature C",
          type: "multiple-choice",
        },
        {
          question: "How did you hear about our product?",
          answer: "Search Engine",
          type: "multiple-choice",
        },
        {
          question: "Any additional feedback?",
          answer: "Absolutely love this product! It has all the features I need.",
          type: "text",
        },
      ],
    },
    {
      id: "9",
      respondent: {
        name: "Daniel Garcia",
        email: "daniel.garcia@example.com",
        avatar: "/placeholder.svg?height=40&width=40&query=Daniel Garcia",
      },
      date: "Jun 4, 2023",
      time: "9:30 AM",
      device: "Tablet",
      browser: "Safari",
      location: "Mexico",
      completionTime: "4m 05s",
      answers: [
        {
          question: "How satisfied are you with our product?",
          answer: "4",
          type: "rating",
        },
        {
          question: "How likely are you to recommend our product to others?",
          answer: "8",
          type: "nps",
        },
        {
          question: "Which features do you use most often?",
          answer: "Feature B",
          type: "multiple-choice",
        },
        {
          question: "How did you hear about our product?",
          answer: "Social Media",
          type: "multiple-choice",
        },
        {
          question: "Any additional feedback?",
          answer: "Great product with excellent features. The interface is very intuitive.",
          type: "text",
        },
      ],
    },
    {
      id: "10",
      respondent: {
        name: "Emma Thompson",
        email: "emma.thompson@example.com",
        avatar: "/placeholder.svg?height=40&width=40&query=Emma Thompson",
      },
      date: "Jun 3, 2023",
      time: "3:50 PM",
      device: "Desktop",
      browser: "Firefox",
      location: "United States",
      completionTime: "3m 40s",
      answers: [
        {
          question: "How satisfied are you with our product?",
          answer: "5",
          type: "rating",
        },
        {
          question: "How likely are you to recommend our product to others?",
          answer: "10",
          type: "nps",
        },
        {
          question: "Which features do you use most often?",
          answer: "Feature A",
          type: "multiple-choice",
        },
        {
          question: "How did you hear about our product?",
          answer: "Friend/Family",
          type: "multiple-choice",
        },
        {
          question: "Any additional feedback?",
          answer: "This product has exceeded my expectations. The support team is also very helpful.",
          type: "text",
        },
      ],
    },
  ]

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-medium text-sm">Respondent</th>
              <th className="text-left p-3 font-medium text-sm">Date</th>
              <th className="text-left p-3 font-medium text-sm">Device</th>
              <th className="text-left p-3 font-medium text-sm">Location</th>
              <th className="text-left p-3 font-medium text-sm">Rating</th>
              <th className="text-right p-3 font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((response, index) => (
              <tr key={response.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={response.respondent.avatar || "/placeholder.svg"}
                        alt={response.respondent.name}
                      />
                      <AvatarFallback>
                        {response.respondent.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{response.respondent.name}</div>
                      <div className="text-xs text-muted-foreground">{response.respondent.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-sm">{response.date}</div>
                  <div className="text-xs text-muted-foreground">{response.time}</div>
                </td>
                <td className="p-3">
                  <div className="text-sm">{response.device}</div>
                  <div className="text-xs text-muted-foreground">{response.browser}</div>
                </td>
                <td className="p-3">
                  <div className="text-sm">{response.location}</div>
                  <div className="text-xs text-muted-foreground">{response.completionTime}</div>
                </td>
                <td className="p-3">
                  <div className="flex items-center">
                    <div className="font-medium mr-1">{response.answers[0].answer}</div>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                </td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedResponse(response)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selectedResponse} onOpenChange={() => setSelectedResponse(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Response Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedResponse?.date} at {selectedResponse?.time}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={selectedResponse?.respondent.avatar || "/placeholder.svg"}
                    alt={selectedResponse?.respondent.name}
                  />
                  <AvatarFallback>
                    {selectedResponse?.respondent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedResponse?.respondent.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedResponse?.respondent.email}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Device:</span>
                  <span className="font-medium">{selectedResponse?.device}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Browser:</span>
                  <span className="font-medium">{selectedResponse?.browser}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{selectedResponse?.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completion Time:</span>
                  <span className="font-medium">{selectedResponse?.completionTime}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Response Summary</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Satisfaction Rating:</span>
                  <span className="font-medium flex items-center">
                    {selectedResponse?.answers[0].answer}
                    <Star className="h-4 w-4 text-yellow-500 ml-1" />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">NPS Score:</span>
                  <Badge
                    className={
                      Number(selectedResponse?.answers[1].answer) >= 9
                        ? "bg-green-500"
                        : Number(selectedResponse?.answers[1].answer) >= 7
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }
                  >
                    {selectedResponse?.answers[1].answer}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Most Used Feature:</span>
                  <span className="font-medium">{selectedResponse?.answers[2].answer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Referral Source:</span>
                  <span className="font-medium">{selectedResponse?.answers[3].answer}</span>
                </div>
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-4 py-4">
            <div className="text-sm font-medium">Detailed Responses</div>
            {selectedResponse?.answers.map((answer, index) => (
              <div key={index} className="space-y-1">
                <div className="text-sm font-medium">{answer.question}</div>
                {answer.type === "rating" ? (
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Number(answer.answer) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm">{answer.answer} out of 5</span>
                  </div>
                ) : answer.type === "nps" ? (
                  <div>
                    <Badge
                      className={
                        Number(answer.answer) >= 9
                          ? "bg-green-500"
                          : Number(answer.answer) >= 7
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }
                    >
                      {answer.answer}
                    </Badge>
                    <span className="ml-2 text-sm">
                      {Number(answer.answer) >= 9 ? "Promoter" : Number(answer.answer) >= 7 ? "Passive" : "Detractor"}
                    </span>
                  </div>
                ) : answer.type === "text" ? (
                  <div className="p-3 bg-muted rounded-md text-sm">{answer.answer}</div>
                ) : (
                  <div className="text-sm">{answer.answer}</div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
