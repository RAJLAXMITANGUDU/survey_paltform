"use client"

import { useState } from "react"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import HelpVideoModal from "@/components/help-video-modal"

export default function HelpButton() {
  const [showHelpModal, setShowHelpModal] = useState(false)

  return (
    <>
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50"
        onClick={() => setShowHelpModal(true)}
      >
        <HelpCircle className="h-6 w-6" />
        <span className="sr-only">Help</span>
      </Button>

      <HelpVideoModal open={showHelpModal} onOpenChange={setShowHelpModal} />
    </>
  )
}
