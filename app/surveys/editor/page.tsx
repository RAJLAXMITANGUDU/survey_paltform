"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  AlignLeft,
  FileQuestion,
  ImageIcon,
  Calendar,
  Phone,
  Mail,
  Link2,
  List,
  FileText,
  Sliders,
  Star,
  CheckSquare,
  MessageSquare,
  BarChart4,
  ListOrdered,
  Smile,
  Menu,
  Grid,
  Hash,
  BookOpen,
  X,
  ChevronDown,
  Globe,
  Save,
} from "lucide-react"
import SurveyPreview from "@/components/survey-preview"
import QuestionEditor from "@/components/question-editor"
import QuestionBank from "@/components/question-bank"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"

export default function SurveyEditorPage() {
  const searchParams = useSearchParams()
  const titleParam = searchParams.get("title")
  const descriptionParam = searchParams.get("description")
  const templateParam = searchParams.get("template")

  const [surveyTitle, setSurveyTitle] = useState(
    titleParam ? decodeURIComponent(titleParam) : "Customer Feedback Survey",
  )
  const [surveyDescription, setSurveyDescription] = useState(
    descriptionParam ? decodeURIComponent(descriptionParam) : "Help us improve our products and services",
  )
  const [questions, setQuestions] = useState([
    {
      id: "q1",
      type: "single-choice",
      question: "How did you hear about our product?",
      options: ["Social Media", "Friend/Family", "Search Engine", "Advertisement", "Other"],
      required: true,
    },
  ])
  const [showQuestionBank, setShowQuestionBank] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [newQuestionId, setNewQuestionId] = useState<string | null>(null)
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  const [saveAsDraftDialogOpen, setSaveAsDraftDialogOpen] = useState(false)
  const [publishOptions, setPublishOptions] = useState({
    shopifyStore: true,
    shopifyCheckout: false,
    shopifyOrderConfirmation: false,
    shopifyAccountPage: false,
  })

  const questionsEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Load template questions if a template was selected
  useEffect(() => {
    if (templateParam) {
      // Find the template in the templates array (you would need to import this)
      // For now, we'll just simulate loading template questions
      const templateQuestions = getTemplateQuestions(templateParam)
      if (templateQuestions.length > 0) {
        setQuestions(templateQuestions)
      }
    }
  }, [templateParam])

  // Scroll to the newly added question
  useEffect(() => {
    if (newQuestionId && questionsEndRef.current) {
      const element = document.getElementById(newQuestionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
        // Highlight effect
        element.classList.add("highlight-pulse")
        setTimeout(() => {
          element.classList.remove("highlight-pulse")
          setNewQuestionId(null)
        }, 1500)
      }
    }
  }, [newQuestionId])

  const addQuestion = (type: string) => {
    const newId = `q${Date.now()}`
    const newQuestion = {
      id: newId,
      type,
      question: "",
      options: ["Option 1", "Option 2"],
      required: false,
    }

    // Set default options based on question type
    if (
      type === "short-text" ||
      type === "long-text" ||
      type === "email" ||
      type === "phone" ||
      type === "url" ||
      type === "file"
    ) {
      newQuestion.options = []
    } else if (type === "rating") {
      newQuestion.options = ["1", "2", "3", "4", "5"]
    } else if (type === "emoji") {
      newQuestion.options = ["😀", "🙂", "😐", "🙁", "😞"]
    } else if (type === "nps") {
      newQuestion.options = Array.from({ length: 11 }, (_, i) => i.toString())
    }

    setQuestions([...questions, newQuestion])
    setNewQuestionId(newId)
    setActiveCategory(null) // Close the dropdown after selection
  }

  const addFromQuestionBank = (bankQuestion: any) => {
    const newId = `q${Date.now()}`
    const newQuestion = {
      id: newId,
      type: bankQuestion.type,
      question: bankQuestion.question,
      options: bankQuestion.options || [],
      required: false,
    }
    setQuestions([...questions, newQuestion])
    setNewQuestionId(newId)
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setQuestions(items)
  }

  const handlePublish = () => {
    // Save the survey to localStorage
    const surveys = JSON.parse(localStorage.getItem("surveys") || "[]")
    const newSurvey = {
      id: `survey-${Date.now()}`,
      title: surveyTitle,
      description: surveyDescription,
      questions,
      status: "active",
      responses: 0,
      completionRate: 0,
      created: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
    }

    surveys.push(newSurvey)
    localStorage.setItem("surveys", JSON.stringify(surveys))

    toast({
      title: "Survey Published!",
      description: `Your survey has been published to the selected Shopify locations.`,
    })
    setPublishDialogOpen(false)
    router.push("/surveys")
  }

  const handleSaveAsDraft = () => {
    // Save the survey as draft to localStorage
    const surveys = JSON.parse(localStorage.getItem("surveys") || "[]")
    const newSurvey = {
      id: `survey-${Date.now()}`,
      title: surveyTitle,
      description: surveyDescription,
      questions,
      status: "draft",
      responses: 0,
      completionRate: 0,
      created: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
    }

    surveys.push(newSurvey)
    localStorage.setItem("surveys", JSON.stringify(surveys))

    toast({
      title: "Survey Saved as Draft",
      description: `Your survey has been saved as a draft and can be edited later.`,
    })
    setSaveAsDraftDialogOpen(false)
    router.push("/surveys")
  }

  // Group question types by category
  const questionTypes = {
    text: [
      { id: "short-text", name: "Short Text", icon: AlignLeft },
      { id: "long-text", name: "Long Text", icon: MessageSquare },
      { id: "email", name: "Email", icon: Mail },
      { id: "phone", name: "Phone", icon: Phone },
      { id: "url", name: "Website", icon: Link2 },
    ],
    choice: [
      { id: "single-choice", name: "Single Choice", icon: CheckSquare },
      { id: "multiple-choice", name: "Multiple Choice", icon: List },
      { id: "dropdown", name: "Dropdown", icon: Menu },
      { id: "ranking", name: "Ranking", icon: ListOrdered },
    ],
    scale: [
      { id: "rating", name: "Rating Scale", icon: Star },
      { id: "slider", name: "Slider", icon: Sliders },
      { id: "nps", name: "NPS", icon: BarChart4 },
      { id: "emoji", name: "Emoji Scale", icon: Smile },
    ],
    advanced: [
      { id: "image", name: "Image Choice", icon: ImageIcon },
      { id: "date", name: "Date", icon: Calendar },
      { id: "matrix", name: "Matrix", icon: Grid },
      { id: "file", name: "File Upload", icon: FileText },
      { id: "number", name: "Number", icon: Hash },
    ],
  }

  const getQuestionIcon = (type: string) => {
    for (const category in questionTypes) {
      const found = questionTypes[category as keyof typeof questionTypes].find((q) => q.id === type)
      if (found) return found.icon
    }
    return FileQuestion
  }

  // Categories for the dropdown
  const categories = [
    { id: "text", name: "Text Questions", icon: MessageSquare },
    { id: "choice", name: "Choice Questions", icon: CheckSquare },
    { id: "scale", name: "Scale Questions", icon: Star },
    { id: "advanced", name: "Advanced Questions", icon: FileQuestion },
  ]

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-8">
        <Link href="/surveys/create">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Survey Editor</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-white shadow-sm border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <CardTitle>Survey Details</CardTitle>
              <CardDescription>Set up the basic information for your survey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="title">Survey Title</Label>
                <Input
                  id="title"
                  placeholder="Enter survey title"
                  value={surveyTitle}
                  onChange={(e) => setSurveyTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter survey description"
                  value={surveyDescription}
                  onChange={(e) => setSurveyDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Survey Questions</h2>
            <Button
              variant="outline"
              onClick={() => setShowQuestionBank(!showQuestionBank)}
              className="flex items-center gap-1"
            >
              {showQuestionBank ? (
                <>
                  <X className="h-4 w-4" />
                  Close Question Bank
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4" />
                  Open Question Bank
                </>
              )}
            </Button>
          </div>

          <Collapsible open={showQuestionBank} onOpenChange={setShowQuestionBank} className="mb-6">
            <CollapsibleContent className="mt-2">
              <div className="border rounded-lg overflow-hidden bg-gradient-to-b from-gray-50 to-white shadow-sm">
                <div className="h-[400px]">
                  <QuestionBank onAddQuestion={addFromQuestionBank} />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Card className="bg-white shadow-sm border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <div>
                <CardTitle>Survey Questions</CardTitle>
                <CardDescription>Add and arrange your survey questions</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Popover
                  open={activeCategory === "text"}
                  onOpenChange={(open) => setActiveCategory(open ? "text" : null)}
                >
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      Text
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2" align="end">
                    <div className="grid gap-1">
                      {questionTypes.text.map((type) => (
                        <Button
                          key={type.id}
                          variant="ghost"
                          size="sm"
                          onClick={() => addQuestion(type.id)}
                          className="justify-start font-normal"
                        >
                          <type.icon className="mr-2 h-4 w-4" />
                          {type.name}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover
                  open={activeCategory === "choice"}
                  onOpenChange={(open) => setActiveCategory(open ? "choice" : null)}
                >
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <CheckSquare className="h-4 w-4" />
                      Choice
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2" align="end">
                    <div className="grid gap-1">
                      {questionTypes.choice.map((type) => (
                        <Button
                          key={type.id}
                          variant="ghost"
                          size="sm"
                          onClick={() => addQuestion(type.id)}
                          className="justify-start font-normal"
                        >
                          <type.icon className="mr-2 h-4 w-4" />
                          {type.name}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover
                  open={activeCategory === "scale"}
                  onOpenChange={(open) => setActiveCategory(open ? "scale" : null)}
                >
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      Scale
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2" align="end">
                    <div className="grid gap-1">
                      {questionTypes.scale.map((type) => (
                        <Button
                          key={type.id}
                          variant="ghost"
                          size="sm"
                          onClick={() => addQuestion(type.id)}
                          className="justify-start font-normal"
                        >
                          <type.icon className="mr-2 h-4 w-4" />
                          {type.name}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover
                  open={activeCategory === "advanced"}
                  onOpenChange={(open) => setActiveCategory(open ? "advanced" : null)}
                >
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <FileQuestion className="h-4 w-4" />
                      Advanced
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2" align="end">
                    <div className="grid gap-1">
                      {questionTypes.advanced.map((type) => (
                        <Button
                          key={type.id}
                          variant="ghost"
                          size="sm"
                          onClick={() => addQuestion(type.id)}
                          className="justify-start font-normal"
                        >
                          <type.icon className="mr-2 h-4 w-4" />
                          {type.name}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="questions">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="p-6">
                      <ScrollArea className="max-h-[600px] pr-4 bg-gray-50 rounded-md">
                        <div className="space-y-4 p-4">
                          {questions.map((question, index) => (
                            <Draggable key={question.id} draggableId={question.id} index={index}>
                              {(provided) => (
                                <div
                                  id={question.id}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={cn(
                                    "border rounded-lg p-4 bg-white shadow-sm transition-all duration-300",
                                    question.id === newQuestionId && "border-primary",
                                  )}
                                >
                                  <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                      <div {...provided.dragHandleProps} className="mr-2">
                                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                                      </div>
                                      <div>
                                        <div className="flex items-center">
                                          {(() => {
                                            const Icon = getQuestionIcon(question.type)
                                            return <Icon className="h-4 w-4 mr-2 text-muted-foreground" />
                                          })()}
                                          <span className="font-medium">Question {index + 1}</span>
                                        </div>
                                        <span className="text-sm text-muted-foreground capitalize">
                                          {question.type.replace(/-/g, " ")}
                                        </span>
                                      </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeQuestion(question.id)}>
                                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                  </div>

                                  <QuestionEditor
                                    question={question}
                                    onChange={(updatedQuestion) => {
                                      const newQuestions = [...questions]
                                      newQuestions[index] = updatedQuestion
                                      setQuestions(newQuestions)
                                    }}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                        {provided.placeholder}
                        <div ref={questionsEndRef} />
                      </ScrollArea>

                      {questions.length === 0 && (
                        <div className="border border-dashed rounded-lg p-8 text-center">
                          <FileQuestion className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <h3 className="font-medium mb-1">No questions added</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Add questions to your survey using the buttons above or from the Question Bank
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2 justify-center">
                            <Button onClick={() => addQuestion("single-choice")}>
                              <Plus className="mr-2 h-4 w-4" />
                              Add First Question
                            </Button>
                            <Button variant="outline" onClick={() => setShowQuestionBank(true)}>
                              <BookOpen className="mr-2 h-4 w-4" />
                              Browse Question Bank
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
            <CardFooter className="border-t bg-gradient-to-r from-gray-50 to-white px-6 py-4">
              <div className="flex justify-between w-full">
                <Dialog open={saveAsDraftDialogOpen} onOpenChange={setSaveAsDraftDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Save className="mr-2 h-4 w-4" />
                      Save as Draft
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Save Survey as Draft</DialogTitle>
                      <DialogDescription>
                        Your survey will be saved as a draft and can be edited later.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p>
                        Survey Title: <strong>{surveyTitle}</strong>
                      </p>
                      <p className="mt-2">
                        Questions: <strong>{questions.length}</strong>
                      </p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setSaveAsDraftDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveAsDraft}>
                        <Save className="mr-2 h-4 w-4" />
                        Save as Draft
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Publish Survey</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Publish Survey</DialogTitle>
                      <DialogDescription>Choose where to display your survey on your Shopify store</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="shopify-store"
                          checked={publishOptions.shopifyStore}
                          onCheckedChange={(checked) =>
                            setPublishOptions({ ...publishOptions, shopifyStore: checked as boolean })
                          }
                        />
                        <label
                          htmlFor="shopify-store"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Shopify Store Page
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="shopify-checkout"
                          checked={publishOptions.shopifyCheckout}
                          onCheckedChange={(checked) =>
                            setPublishOptions({ ...publishOptions, shopifyCheckout: checked as boolean })
                          }
                        />
                        <label
                          htmlFor="shopify-checkout"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Shopify Checkout Page
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="shopify-order"
                          checked={publishOptions.shopifyOrderConfirmation}
                          onCheckedChange={(checked) =>
                            setPublishOptions({ ...publishOptions, shopifyOrderConfirmation: checked as boolean })
                          }
                        />
                        <label
                          htmlFor="shopify-order"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Order Confirmation Page
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="shopify-account"
                          checked={publishOptions.shopifyAccountPage}
                          onCheckedChange={(checked) =>
                            setPublishOptions({ ...publishOptions, shopifyAccountPage: checked as boolean })
                          }
                        />
                        <label
                          htmlFor="shopify-account"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Customer Account Page
                        </label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setPublishDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handlePublish} className="gap-2">
                        <Globe className="h-4 w-4" />
                        Publish
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6 bg-white shadow-sm border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <CardTitle>Survey Preview</CardTitle>
              <CardDescription>See how your survey will appear to respondents</CardDescription>
            </CardHeader>
            <CardContent className="bg-white">
              <SurveyPreview
                title={surveyTitle || "Untitled Survey"}
                description={surveyDescription || "No description provided"}
                questions={questions}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        .highlight-pulse {
          animation: pulse 1.5s ease-in-out;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
          }
        }
      `}</style>
    </div>
  )
}

// Helper function to get template questions
function getTemplateQuestions(templateId: string) {
  // This would typically come from a database or API
  // For now, we'll just return some sample questions based on the template ID

  const templates: Record<string, any[]> = {
    "customer-satisfaction": [
      {
        id: "q1",
        type: "rating",
        question: "How would you rate your overall satisfaction with our product/service?",
        options: ["1", "2", "3", "4", "5"],
        required: true,
      },
      {
        id: "q2",
        type: "single-choice",
        question: "How likely are you to recommend our product/service to others?",
        options: ["Very unlikely", "Unlikely", "Neutral", "Likely", "Very likely"],
        required: true,
      },
      {
        id: "q3",
        type: "long-text",
        question: "What aspects of our product/service do you like the most?",
        options: [],
        required: false,
      },
      {
        id: "q4",
        type: "long-text",
        question: "What aspects of our product/service could be improved?",
        options: [],
        required: false,
      },
    ],
    "product-feedback": [
      {
        id: "q1",
        type: "multiple-choice",
        question: "Which features do you use most frequently?",
        options: ["Feature A", "Feature B", "Feature C", "Feature D", "Feature E"],
        required: true,
      },
      {
        id: "q2",
        type: "rating",
        question: "How would you rate the ease of use of our product?",
        options: ["1", "2", "3", "4", "5"],
        required: true,
      },
      {
        id: "q3",
        type: "long-text",
        question: "What features would you like to see added to our product?",
        options: [],
        required: false,
      },
    ],
    // Add more templates as needed
  }

  return templates[templateId] || []
}
