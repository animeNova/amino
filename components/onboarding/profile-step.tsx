"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Camera, X, ImageIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { OnboardingFormValues } from "./user-onboarding-form"
import { useUpload } from "@/hooks/useUpload"
import { toast } from "@/hooks/use-toast"

interface ProfileStepProps {
  form: UseFormReturn<OnboardingFormValues>
}

export function ProfileStep({ form }: ProfileStepProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewCover, setPreviewCover] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  // Add the upload hooks
  const imageUpload = useUpload()
  const coverUpload = useUpload()
  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleCoverClick = () => {
    coverInputRef.current?.click()
  }
    // Update the image upload handler
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "coverImage") => {
        const file = e.target.files?.[0]
        if (!file) return
    
        try {
          if (field === "image") {
            // Show local preview immediately
            const previewUrl = URL.createObjectURL(file)
            setPreviewImage(previewUrl)
            
            // Start upload to Pinata
            const result = await imageUpload.uploadAsync(file)
            
            // Set the actual IPFS URL to the form
            form.setValue("image", result.pinataUrl)
            toast({
              title: "Image uploaded",
              description: "Community image has been uploaded successfully.",
            })
          } else {
            // Show local preview immediately
            const previewUrl = URL.createObjectURL(file)
            setPreviewCover(previewUrl)
            
            // Start upload to Pinata
            const result = await coverUpload.uploadAsync(file)
            
            // Set the actual IPFS URL to the form
            form.setValue("coverImage", result.pinataUrl)
            toast({
              title: "Banner uploaded",
              description: "Community banner has been uploaded successfully.",
            })
          }
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
    setPreviewImage(null)
    form.setValue("image", "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeCover = () => {
    setPreviewCover(null)
    form.setValue("coverImage", "")
    if (coverInputRef.current) {
      coverInputRef.current.value = ""
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div className="space-y-3">
        <FormLabel>Cover Image</FormLabel>
        <div
          className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-dashed border-muted hover:border-primary transition-colors cursor-pointer group"
          onClick={handleCoverClick}
        >
          {previewCover || form.getValues("coverImage") ? (
            <img
              src={previewCover || form.getValues("coverImage") || ""}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-muted/20 text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-colors">
              <ImageIcon className="h-8 w-8 mb-2" />
              <span className="text-sm">Add a cover image</span>
            </div>
          )}

          {(previewCover || form.getValues("coverImage")) && (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="h-6 w-6 rounded-full absolute top-2 right-2 shadow-md"
              onClick={(e) => {
                e.stopPropagation()
                removeCover()
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e,'coverImage')} />
        <FormDescription>Add a banner image to personalize your profile (optional).</FormDescription>
      </div>

      {/* Profile Image */}
      <div className="flex flex-col items-center space-y-4 pt-2">
        <div className="relative">
          <Avatar
            className="w-24 h-24 cursor-pointer border-2 border-muted hover:border-primary transition-colors"
            onClick={handleImageClick}
          >
            <AvatarImage src={previewImage || form.getValues("image") || ""} />
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {form.watch("name") ? getInitials(form.watch("name")) : "U"}
            </AvatarFallback>
          </Avatar>

          <div className="absolute bottom-0 right-0">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full shadow-md"
              onClick={handleImageClick}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          {(previewImage || form.getValues("image")) && (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="h-6 w-6 rounded-full absolute top-0 right-0 shadow-md"
              onClick={removeImage}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <input type="file" ref={fileInputRef} className="hidden" accept="image/*"  onChange={(e) => handleImageUpload(e,'image')} />

        <span className="text-sm text-muted-foreground">Upload a profile picture (optional)</span>
      </div>

      {/* Username */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Username <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="Enter your username" {...field} />
            </FormControl>
            <FormDescription>This is your public display name.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />



      {/* Location */}
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="City, Country" {...field} />
            </FormControl>
            <FormDescription>Where you're based (optional).</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
