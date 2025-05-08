"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Twitter, Facebook, Instagram, Copy, Mail, QrCode, Share2, Check } from "lucide-react"
import { toast } from "sonner"

interface ShareDialogProps {
  postTitle: string
  postUrl: string
}

export default function ShareDialog({
  postTitle = "The Evolution of Anime: From Astro Boy to Modern Masterpieces",
  postUrl = "https://anishare.com/posts/evolution-of-anime",
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl)
    setCopied(true)
    toast.success("Link copied to clipboard!")

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const shareToTwitter = () => {
    const text = encodeURIComponent(`Check out this post: ${postTitle}`)
    const url = encodeURIComponent(postUrl)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank")
  }

  const shareToFacebook = () => {
    const url = encodeURIComponent(postUrl)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank")
  }

  const shareByEmail = () => {
    const subject = encodeURIComponent(`Check out this post: ${postTitle}`)
    const body = encodeURIComponent(`I thought you might enjoy this post: ${postTitle}\n\n${postUrl}`)
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Share2 className="h-5 w-5" />
          <span>Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Share this post</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="social" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 hover:bg-primary/5"
                onClick={shareToTwitter}
              >
                <Twitter className="h-6 w-6 text-[#1DA1F2]" />
                <span>Twitter</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 hover:bg-primary/5"
                onClick={shareToFacebook}
              >
                <Facebook className="h-6 w-6 text-[#4267B2]" />
                <span>Facebook</span>
              </Button>

              <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-primary/5">
                <Instagram className="h-6 w-6 text-[#E1306C]" />
                <span>Instagram</span>
              </Button>

              <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-primary/5" onClick={shareByEmail}>
                <Mail className="h-6 w-6 text-primary" />
                <span>Email</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="link" className="mt-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Input value={postUrl} readOnly className="flex-1" />
              <Button variant="outline" size="icon" onClick={handleCopyLink} className="shrink-0">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">Copy the link to share this post directly</p>
            </div>
          </TabsContent>

          <TabsContent value="qr" className="mt-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <QrCode className="h-40 w-40 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Scan this QR code with your phone camera</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4">
          <p className="text-xs text-center text-muted-foreground">
            By sharing this content, you agree to our community guidelines
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
