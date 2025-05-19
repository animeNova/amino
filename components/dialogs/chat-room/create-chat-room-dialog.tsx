"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ImagePlus, Loader2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import { useUpload } from "@/hooks/useUpload"

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Chat room name must be at least 3 characters.",
    })
    .max(50, {
      message: "Chat room name must not exceed 50 characters.",
    }),
  description: z
    .string()
    .max(500, {
      message: "Description must not exceed 500 characters.",
    })
    .optional(),
  image: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface CreateChatRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: FormValues) => void
  communityId?: string
}

export function CreateChatRoomDialog({ open, onOpenChange, onSubmit, communityId }: CreateChatRoomDialogProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Use the useUpload hook for image uploads
  const imageUpload = useUpload()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      image: undefined,
    },
  })

  // Update the image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "banner") => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
     
        // Show local preview immediately
        const previewUrl = URL.createObjectURL(file)
        setImagePreview(previewUrl)
        
        // Start upload to Pinata
        const result = await imageUpload.uploadAsync(file)
        
        // Set the actual IPFS URL to the form
        form.setValue("image", result.pinataUrl)
        toast({
          title: "Image uploaded",
          description: "Community image has been uploaded successfully.",
        })
      
    } catch (error) {
      console.error(`Error uploading ${field}:`, error)
      toast({
        title: "Upload failed",
        description: `Failed to upload ${field}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    form.setValue("image", undefined)
  }

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // If onSubmit prop is provided, call it with the form data
      if (onSubmit) {
        onSubmit(data)
      } else {
        // Default implementation if no onSubmit is provided
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))
        
        console.log("Chat room created:", data)
        
        toast({
          title: "Chat room created",
          description: `${data.name} has been successfully created.`,
        })
      }
      
      // Reset form and close dialog
      form.reset()
      setImagePreview(null)
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating chat room:", error)
      toast({
        title: "Error",
        description: "Failed to create chat room. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a new chat room</DialogTitle>
          <DialogDescription>Create a space for your community to chat in real-time.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {imagePreview ? (
                    <AvatarImage src={imagePreview || "/placeholder.svg"} alt="Chat room" />
                  ) : (
                    <AvatarFallback className="bg-muted flex items-center justify-center">
                      <ImagePlus className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>

                {imagePreview && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove image</span>
                  </Button>
                )}

                <FormLabel
                  htmlFor="image-upload"
                  className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
                >
                  {imageUpload.isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImagePlus className="h-4 w-4" />
                  )}
                  <span className="sr-only">Upload image</span>
                </FormLabel>

                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => handleImageUpload(e, "image")}
                  disabled={imageUpload.isUploading}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter chat room name" {...field} />
                  </FormControl>
                  <FormDescription>This is the name that will be displayed to all members.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe what this chat room is about" className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>Help members understand the purpose of this chat room.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || imageUpload.isUploading}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Chat Room"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
