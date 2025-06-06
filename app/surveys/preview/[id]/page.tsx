import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Share2 } from "lucide-react"

export default function SurveyPreviewPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Link href="/surveys">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Survey Preview</h1>
            <p className="text-muted-foreground">Preview how your survey will appear to respondents</p>
          </div>
        </div>
        <Button>
          <Share2 className="mr-2 h-4 w-4" />
          Share Survey
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Customer Satisfaction Survey</CardTitle>
            <CardDescription>Help us improve our products and services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">How did you hear about our product?</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="option-1" name="hear-about" className="h-4 w-4" />
                  <label htmlFor="option-1">Social Media</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="option-2" name="hear-about" className="h-4 w-4" />
                  <label htmlFor="option-2">Friend/Family</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="option-3" name="hear-about" className="h-4 w-4" />
                  <label htmlFor="option-3">Search Engine</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="option-4" name="hear-about" className="h-4 w-4" />
                  <label htmlFor="option-4">Advertisement</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="option-5" name="hear-about" className="h-4 w-4" />
                  <label htmlFor="option-5">Other</label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button>Next</Button>
          </CardFooter>
        </Card>

        <div className="mt-8 flex justify-between">
          <Link href={`/surveys/edit/${params.id}`}>
            <Button variant="outline">Edit Survey</Button>
          </Link>
          <Button>Publish Survey</Button>
        </div>
      </div>
    </div>
  )
}
