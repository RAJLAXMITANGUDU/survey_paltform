"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClipboardCheck, FileText, BarChart3, Settings } from "lucide-react"
import Image from "next/image"

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("welcome")

  // Check if this is the first visit
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore")
    if (!hasVisitedBefore) {
      setIsOpen(true)
      localStorage.setItem("hasVisitedBefore", "true")
    }
  }, [])

  const handleNext = () => {
    if (activeTab === "welcome") setActiveTab("features")
    else if (activeTab === "features") setActiveTab("help")
    else setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="welcome">Welcome</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>

          <TabsContent value="welcome" className="pt-6">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">Welcome to SurveyPro!</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center py-6">
              <div className="rounded-full bg-primary/10 p-6 mb-6">
                <ClipboardCheck className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Your survey platform is ready</h3>
              <p className="text-center text-muted-foreground mb-6 max-w-md">
                Create, distribute, and analyze surveys with our powerful and easy-to-use platform.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="features" className="pt-6">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">Key Features</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Create Surveys</h4>
                  <p className="text-muted-foreground">
                    Build custom surveys with our drag-and-drop editor or use templates.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Analyze Results</h4>
                  <p className="text-muted-foreground">Get insights with real-time analytics and detailed reports.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Customize Everything</h4>
                  <p className="text-muted-foreground">
                    Tailor the platform to your needs with extensive customization options.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="help" className="pt-6">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">Need Help?</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center py-6">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4">
                <Image
                  src="/surveypro-overview-thumbnail.png"
                  alt="Help video thumbnail"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
                    Watch Tutorial
                  </Button>
                </div>
              </div>
              <p className="text-center text-muted-foreground mb-4">
                Click the help button in the bottom right corner anytime to access tutorials and guides in My Survey
                Hub.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={handleNext}>{activeTab === "help" ? "Get Started" : "Next"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
