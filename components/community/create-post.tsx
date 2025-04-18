"use client"

import * as React from "react"
import Image from "next/image"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import BlockNoteEditor  from "./editor/block-note-editor"

export function CreatePostDialog() {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [editor, setEditor] = React.useState<any>(null)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditorChange = (editor: any) => {
    setEditor(editor)
  }

  const handleSubmit = async () => {
    if (!editor) return

    setIsSubmitting(true)
    try {
      const blocks = await editor.getBlocks()
      ({
        title,
        content: blocks,
        image: selectedImage,
      })
      // Here you would typically send the data to your backend
      setOpen(false)
      setTitle("")
      setSelectedImage(null)
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Create Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
          <DialogDescription>Share your thoughts, images, and ideas with the community.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Give your post a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Image</Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file:bg-transparent"
              />
              {selectedImage && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full z-10"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="relative h-20 w-20 overflow-hidden rounded-md">
                    <Image src={selectedImage || "/placeholder.svg"} alt="Selected" fill className="object-cover" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Content</Label>
            <div className="rounded-md border">
              <BlockNoteEditor onChange={handleEditorChange} />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !editor}>
            {isSubmitting ? "Creating..." : "Create Post"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

