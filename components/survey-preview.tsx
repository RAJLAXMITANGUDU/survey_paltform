"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Upload } from "lucide-react"

interface SurveyPreviewProps {
  title: string
  description: string
  questions: any[]
}

export default function SurveyPreview({ title, description, questions }: SurveyPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const questionsPerPage = 3
  const totalPages = Math.ceil(questions.length / questionsPerPage)

  const currentQuestions = questions.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage)

  const renderQuestionPreview = (question: any, index: number) => {
    const questionNumber = currentPage * questionsPerPage + index + 1

    switch (question.type) {
      case "short-text":
      case "email":
      case "phone":
      case "url":
      case "number":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {question.question || `Question ${questionNumber}`}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input placeholder={`Enter your ${question.type.replace(/-/g, " ")}...`} disabled />
          </div>
        )

      case "long-text":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {question.question || `Question ${questionNumber}`}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea placeholder="Enter your answer..." disabled />
          </div>
        )

      case "single-choice":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {question.question || `Question ${questionNumber}`}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <RadioGroup disabled>
              {question.options?.map((option: string, i: number) => (
                <div key={i} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`q${question.id}-option-${i}`} />
                  <Label htmlFor={`q${question.id}-option-${i}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case "multiple-choice":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {question.question || `Question ${questionNumber}`}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {question.options?.map((option: string, i: number) => (
                <div key={i} className="flex items-center space-x-2">
                  <Checkbox id={`q${question.id}-option-${i}`} disabled />
                  <Label htmlFor={`q${question.id}-option-${i}`}>{option}</Label>
                </div>
              ))}
            </div>
          </div>
        )

      case "rating":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {question.question || `Question ${questionNumber}`}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="w-8 h-8 flex items-center justify-center border rounded-md cursor-not-allowed">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        )

      case "emoji":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {question.question || `Question ${questionNumber}`}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex justify-between">
              {["😞", "🙁", "😐", "🙂", "😀"].map((emoji, i) => (
                <div key={i} className="w-8 h-8 flex items-center justify-center border rounded-md cursor-not-allowed">
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        )

      case "nps":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {question.question || `Question ${questionNumber}`}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: 11 }, (_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 flex items-center justify-center border rounded-md cursor-not-allowed text-sm"
                >
                  {i}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Not likely</span>
              <span>Extremely likely</span>
            </div>
          </div>
        )

      case "slider":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {question.question || `Question ${questionNumber}`}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Slider disabled defaultValue={[50]} max={100} step={1} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{question.min || 0}</span>
              <span>{question.max || 100}</span>
            </div>
          </div>
        )

      case "date":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {question.question || `Question ${questionNumber}`}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex">
              <Input type="date" disabled />
            </div>
          </div>
        )

      case "file":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {question.question || `Question ${questionNumber}`}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="border rounded-md p-4 flex flex-col items-center justify-center bg-muted/30">
              <Upload className="h-6 w-6 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload</p>
            </div>
          </div>
        )

      case "image":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {question.question || `Question ${questionNumber}`}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="border rounded-md p-2 flex flex-col items-center justify-center h-20 cursor-not-allowed">
                <div className="text-xs text-muted-foreground">Image 1</div>
              </div>
              <div className="border rounded-md p-2 flex flex-col items-center justify-center h-20 cursor-not-allowed">
                <div className="text-xs text-muted-foreground">Image 2</div>
              </div>
            </div>
          </div>
        )

      case "matrix":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {question.question || `Question ${questionNumber}`}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead>
                  <tr>
                    <th className="border p-1 text-xs"></th>
                    <th className="border p-1 text-xs">Option 1</th>
                    <th className="border p-1 text-xs">Option 2</th>
                    <th className="border p-1 text-xs">Option 3</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-1 text-xs">Row 1</td>
                    <td className="border p-1 text-center">○</td>
                    <td className="border p-1 text-center">○</td>
                    <td className="border p-1 text-center">○</td>
                  </tr>
                  <tr>
                    <td className="border p-1 text-xs">Row 2</td>
                    <td className="border p-1 text-center">○</td>
                    <td className="border p-1 text-center">○</td>
                    <td className="border p-1 text-center">○</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )

      case "ranking":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {question.question || `Question ${questionNumber}`}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="space-y-1">
              {question.options?.map((option: string, i: number) => (
                <div key={i} className="flex items-center gap-2 border rounded-md p-1.5 bg-white">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-xs font-medium">
                    {i + 1}
                  </div>
                  <div className="text-sm">{option}</div>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {question.question || `Question ${questionNumber}`}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="border rounded-md p-3 bg-muted/30">
              <p className="text-sm text-muted-foreground">Question preview</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="p-4 border-b">
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      <div className="p-4 space-y-6">
        {currentQuestions.map((question, index) => (
          <div key={question.id} className="pb-4 border-b last:border-0 last:pb-0">
            {renderQuestionPreview(question, index)}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t bg-muted/30 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <div className="text-sm">
            Page {currentPage + 1} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
