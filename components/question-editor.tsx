"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Upload, Info, Save } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

interface QuestionEditorProps {
  question: {
    id: string
    type: string
    question: string
    options?: string[]
    required?: boolean
    min?: number
    max?: number
  }
  onChange: (question: any) => void
}

export default function QuestionEditor({ question, onChange }: QuestionEditorProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { toast } = useToast()

  const updateQuestion = (value: string) => {
    onChange({
      ...question,
      question: value,
    })
  }

  const toggleRequired = () => {
    onChange({
      ...question,
      required: !question.required,
    })
  }

  const addOption = () => {
    if (!question.options) return
    onChange({
      ...question,
      options: [...question.options, `Option ${question.options.length + 1}`],
    })
  }

  const updateOption = (index: number, value: string) => {
    if (!question.options) return
    const newOptions = [...question.options]
    newOptions[index] = value
    onChange({
      ...question,
      options: newOptions,
    })
  }

  const removeOption = (index: number) => {
    if (!question.options) return
    const newOptions = [...question.options]
    newOptions.splice(index, 1)
    onChange({
      ...question,
      options: newOptions,
    })
  }

  const updateRange = (values: number[]) => {
    onChange({
      ...question,
      min: values[0],
      max: values[1] || 100,
    })
  }

  const saveToQuestionBank = () => {
    if (!question.question.trim()) {
      toast({
        title: "Question text is required",
        description: "Please enter a question before saving to the question bank.",
        variant: "destructive",
      })
      return
    }

    // Create a new question object for the question bank
    const newBankQuestion = {
      id: `custom_${Date.now()}`,
      question: question.question,
      type: question.type,
      category: "Custom Questions",
      survey: "My Surveys",
      usageCount: 1,
      options: question.options,
    }

    // Save to localStorage
    const existingQuestions = JSON.parse(localStorage.getItem("customQuestions") || "[]")
    localStorage.setItem("customQuestions", JSON.stringify([...existingQuestions, newBankQuestion]))

    toast({
      title: "Question saved",
      description: "Your question has been added to the question bank.",
    })
  }

  // Helper to render the appropriate editor based on question type
  const renderQuestionTypeEditor = () => {
    // Text-based questions
    if (["short-text", "email", "phone", "url", "number"].includes(question.type)) {
      return (
        <div className="border rounded-md p-3 bg-muted/30">
          <p className="text-sm text-muted-foreground capitalize">{question.type.replace(/-/g, " ")} input field</p>
          <Input disabled placeholder={`Enter your ${question.type.replace(/-/g, " ")}...`} className="mt-2 bg-white" />
        </div>
      )
    }

    // Long text
    if (question.type === "long-text") {
      return (
        <div className="border rounded-md p-3 bg-muted/30">
          <p className="text-sm text-muted-foreground">Long text input field</p>
          <Textarea disabled placeholder="Enter your answer..." className="mt-2 bg-white" />
        </div>
      )
    }

    // Choice-based questions
    if (["single-choice", "multiple-choice", "dropdown"].includes(question.type)) {
      return (
        <div className="space-y-2">
          {question.options?.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeOption(index)}
                disabled={question.options!.length <= 2}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addOption} className="mt-2">
            <Plus className="mr-2 h-4 w-4" />
            Add Option
          </Button>
        </div>
      )
    }

    // Rating scale
    if (question.type === "rating") {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 py-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="w-8 h-8 flex items-center justify-center border rounded-md bg-white">
                  {rating}
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-2">Rating scale (1-5)</span>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="min-rating" className="text-sm">
              Scale Size:
            </Label>
            <Select
              defaultValue="5"
              onValueChange={(value) => {
                const count = Number.parseInt(value)
                onChange({
                  ...question,
                  options: Array.from({ length: count }, (_, i) => (i + 1).toString()),
                })
              }}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="5" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="7">7</SelectItem>
                <SelectItem value="10">10</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    }

    // NPS (Net Promoter Score)
    if (question.type === "nps") {
      return (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1 py-2">
            {Array.from({ length: 11 }, (_, i) => i).map((rating) => (
              <div key={rating} className="w-8 h-8 flex items-center justify-center border rounded-md bg-white">
                {rating}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Not likely at all</span>
            <span>Extremely likely</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Info className="h-4 w-4 mr-1" />
                  Net Promoter Score
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  NPS measures customer loyalty by asking how likely they are to recommend your product/service on a
                  scale from 0-10.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    }

    // Emoji scale
    if (question.type === "emoji") {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2">
            {["😞", "🙁", "😐", "🙂", "😀"].map((emoji, index) => (
              <div
                key={index}
                className="w-10 h-10 flex items-center justify-center border rounded-md bg-white text-xl"
              >
                {emoji}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Very Dissatisfied</span>
            <span>Very Satisfied</span>
          </div>
        </div>
      )
    }

    // Slider
    if (question.type === "slider") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Min: {question.min || 0}</span>
              <span>Max: {question.max || 100}</span>
            </div>
            <Slider
              defaultValue={[question.min || 0, question.max || 100]}
              max={100}
              step={1}
              onValueChange={updateRange}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="min-value" className="text-sm">
              Min Value:
            </Label>
            <Input
              id="min-value"
              type="number"
              className="w-20"
              value={question.min || 0}
              onChange={(e) => onChange({ ...question, min: Number.parseInt(e.target.value) })}
            />
            <Label htmlFor="max-value" className="text-sm ml-4">
              Max Value:
            </Label>
            <Input
              id="max-value"
              type="number"
              className="w-20"
              value={question.max || 100}
              onChange={(e) => onChange({ ...question, max: Number.parseInt(e.target.value) })}
            />
          </div>
        </div>
      )
    }

    // Date
    if (question.type === "date") {
      return (
        <div className="border rounded-md p-3 bg-muted/30">
          <p className="text-sm text-muted-foreground">Date picker field</p>
          <Input type="date" disabled className="mt-2 bg-white" />
        </div>
      )
    }

    // File upload
    if (question.type === "file") {
      return (
        <div className="border rounded-md p-4 bg-muted/30 flex flex-col items-center justify-center">
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">File upload field</p>
          <p className="text-xs text-muted-foreground mt-1">Allows respondents to upload files</p>
          <div className="mt-3 w-full">
            <Select defaultValue="any">
              <SelectTrigger>
                <SelectValue placeholder="File types allowed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any file type</SelectItem>
                <SelectItem value="image">Images only</SelectItem>
                <SelectItem value="document">Documents only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    }

    // Image choice
    if (question.type === "image") {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="border rounded-md p-3 flex flex-col items-center justify-center h-24 bg-white">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">Upload Image 1</p>
            </div>
            <div className="border rounded-md p-3 flex flex-col items-center justify-center h-24 bg-white">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">Upload Image 2</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Another Image
          </Button>
          <div className="text-sm text-muted-foreground">Respondents will select one of the images as their answer</div>
        </div>
      )
    }

    // Matrix/Grid
    if (question.type === "matrix") {
      return (
        <div className="space-y-3">
          <div className="border rounded-md p-3 bg-muted/30">
            <p className="text-sm text-muted-foreground mb-2">Matrix/Grid Question</p>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="border p-2"></th>
                    <th className="border p-2 text-sm">Option 1</th>
                    <th className="border p-2 text-sm">Option 2</th>
                    <th className="border p-2 text-sm">Option 3</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2 text-sm">Row 1</td>
                    <td className="border p-2 text-center">○</td>
                    <td className="border p-2 text-center">○</td>
                    <td className="border p-2 text-center">○</td>
                  </tr>
                  <tr>
                    <td className="border p-2 text-sm">Row 2</td>
                    <td className="border p-2 text-center">○</td>
                    <td className="border p-2 text-center">○</td>
                    <td className="border p-2 text-center">○</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Row
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Column
            </Button>
          </div>
        </div>
      )
    }

    // Ranking
    if (question.type === "ranking") {
      return (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground mb-2">
            Respondents will drag to rank these items in order of preference
          </div>
          {question.options?.map((option, index) => (
            <div key={index} className="flex items-center gap-2 bg-white border rounded-md p-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-sm font-medium">
                {index + 1}
              </div>
              <Input
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Item ${index + 1}`}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeOption(index)}
                disabled={question.options!.length <= 2}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addOption} className="mt-2">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      )
    }

    // Default fallback
    return (
      <div className="border rounded-md p-3 bg-muted/30">
        <p className="text-sm text-muted-foreground capitalize">{question.type.replace(/-/g, " ")} question</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <Input
          value={question.question}
          onChange={(e) => updateQuestion(e.target.value)}
          placeholder="Enter your question"
          className="font-medium"
        />
      </div>

      {renderQuestionTypeEditor()}

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2">
          <Switch id={`required-${question.id}`} checked={question.required} onCheckedChange={toggleRequired} />
          <Label htmlFor={`required-${question.id}`}>Required question</Label>
        </div>
        <Button variant="outline" size="sm" onClick={saveToQuestionBank}>
          <Save className="mr-2 h-4 w-4" />
          Save to Question Bank
        </Button>
      </div>
    </div>
  )
}
