"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from "lucide-react"
import Image from "next/image"

interface HelpVideoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function HelpVideoModal({ open, onOpenChange }: HelpVideoModalProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const videos = [
    {
      id: "overview",
      title: "Platform Overview",
      description: "Learn the basics of the SurveyPro platform and how to navigate it.",
      thumbnail: "/surveypro-overview-thumbnail.png",
      duration: "3:45",
    },
    {
      id: "creating",
      title: "Creating Surveys",
      description: "Step-by-step guide to creating effective surveys.",
      thumbnail: "/creating-surveys-thumbnail.png",
      duration: "5:20",
    },
    {
      id: "templates",
      title: "Survey Templates",
      description: "How to use and customize pre-built survey templates.",
      thumbnail: "/survey-templates-thumbnail.png",
      duration: "2:15",
    },
    {
      id: "analytics",
      title: "Survey Analytics",
      description: "Understanding and using the analytics dashboard.",
      thumbnail: "/survey-analytics-thumbnail.png",
      duration: "4:30",
    },
    {
      id: "settings",
      title: "Platform Settings",
      description: "Configuring your account and platform settings.",
      thumbnail: "/platform-settings-thumbnail.png",
      duration: "3:10",
    },
  ]

  const currentVideoIndex = videos.findIndex((video) => video.id === activeTab)
  const currentVideo = videos[currentVideoIndex]

  const handlePrevVideo = () => {
    const prevIndex = (currentVideoIndex - 1 + videos.length) % videos.length
    setActiveTab(videos[prevIndex].id)
  }

  const handleNextVideo = () => {
    const nextIndex = (currentVideoIndex + 1) % videos.length
    setActiveTab(videos[nextIndex].id)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] md:max-w-[90vw] lg:max-w-[1000px] p-0 overflow-hidden max-h-[90vh]">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl">Help & Tutorials</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-2">
            <TabsList className="w-full justify-start overflow-x-auto">
              {videos.map((video) => (
                <TabsTrigger key={video.id} value={video.id} className="px-4 py-2">
                  {video.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {videos.map((video) => (
            <TabsContent key={video.id} value={video.id} className="mt-0">
              <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  fill
                  className="object-contain"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-16 w-16 rounded-full bg-background/80 backdrop-blur-sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="text-white">
                    <div className="font-medium">{video.title}</div>
                    <div className="text-sm opacity-80">{video.duration}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-white" onClick={() => setIsMuted(!isMuted)}>
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-medium mb-2">{video.title}</h3>
                <p className="text-muted-foreground mb-6">{video.description}</p>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevVideo}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous Video
                  </Button>
                  <Button variant="outline" onClick={handleNextVideo}>
                    Next Video
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
