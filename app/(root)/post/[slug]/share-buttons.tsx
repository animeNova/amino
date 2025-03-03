"use client"

import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Link2, Send } from "lucide-react"
import { toast } from "sonner"

export default function ShareButtons() {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copied to clipboard!")
  }

  return (
    <div className="flex flex-col items-center gap-4 py-6 border-y">
      <p className="font-semibold">Share this post</p>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" className="rounded-full">
          <Twitter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <Facebook className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full" onClick={handleCopyLink}>
          <Link2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

