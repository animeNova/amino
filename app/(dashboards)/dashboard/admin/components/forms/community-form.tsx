"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Globe, Lock, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useUpload } from "@/hooks/useUpload"
import Image from "next/image"
// Import the base schema instead of the discriminated union
import { CommunityFormInput, communitySchema} from "@/schemas/schema"
import { useGenres } from "@/hooks/actions/genres/useGenres"





// Sample languages for the dropdown
const languages = [
  { code: "en", name: "English" },
  { code: "ar", name: "Arabic" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
]

interface CommunityFormProps {
  initialData?: Partial<CommunityFormInput>, 
  onSubmit: (data: CommunityFormInput) => void,
  isEditMode?: boolean,
  isLoading : boolean,
}

export function CommunityForm({ 
  onSubmit, 
  initialData,
  isEditMode = false,
  isLoading,
}: Readonly<CommunityFormProps>) {
  const {results} = useGenres();
  const { toast } = useToast()
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image ?? null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(initialData?.banner ?? null)
  
  // Add the upload hooks
  const imageUpload = useUpload()
  const bannerUpload = useUpload()

  // Initialize the form with the correct schema based on type
  const defaultValues: CommunityFormInput = {
    id: initialData?.id ?? undefined,
    name: initialData?.name ?? "",
    handle: initialData?.handle ?? "",
    description: initialData?.description ?? "",
    image: initialData?.image ?? "",
    banner: initialData?.banner ?? "",
    language: initialData?.language ?? "en",
    visibility: initialData?.visibility ?? "public",
    genre_id: initialData?.genre_id ?? "",
  };

  const form = useForm<CommunityFormInput>({
    resolver: zodResolver(communitySchema),
    defaultValues,
  });
  // Handle form submission
  const handleSubmit = (data: CommunityFormInput) => {
    if (isEditMode) {
      // For update operations, only include changed fields
      const changedFields = Object.entries(data).reduce((acc, [key, value]) => {
        // @ts-ignore - This is a safe operation since we're checking key existence
        if (value !== defaultValues[key]) {
          // @ts-ignore
          acc[key] = value;
        }
        return acc;
      }, {} as Partial<CommunityFormInput>);
      
      // If no fields changed, include the ID at minimum for API identification
      if (Object.keys(changedFields).length === 0 && initialData?.id) {
        // @ts-ignore - id might not be in the schema but needed for API
        changedFields.id = initialData.id;
      }
      

      
      // Only pass changed fields to the parent onSubmit handler
      onSubmit(data);
    } else {
      // For create, pass all fields
      onSubmit(data);
    }
  };
  // Update the image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "banner") => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      if (field === "image") {
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
      } else {
        // Show local preview immediately
        const previewUrl = URL.createObjectURL(file)
        setBannerPreview(previewUrl)
        
        // Start upload to Pinata
        const result = await bannerUpload.uploadAsync(file)
        
        // Set the actual IPFS URL to the form
        form.setValue("banner", result.pinataUrl)
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

  // Generate a handle from the name
  const generateHandle = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^a-z0-9-_]/g, "") // Remove invalid characters
      .substring(0, 50) // Limit to 50 characters
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter community name"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        // Auto-generate handle if the handle field is empty
                        if (!form.getValues("handle")) {
                          form.setValue("handle", generateHandle(e.target.value))
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>The name of your community (max 50 characters)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="handle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Handle</FormLabel>
                  <FormControl>
                    <Input placeholder="community-handle" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be used in your community URL: commune.io/{field.value || "your-handle"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your community..." className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>A brief description of your community (max 200 characters)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
            <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language.code} value={language.code}>
                            {language.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="genre_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {results?.genres.map((genre) => (
                          <SelectItem key={genre.id} value={genre.id}>
                            {genre.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Visibility</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="public" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer flex items-center gap-2">
                          <Globe className="h-4 w-4 text-primary" />
                          <div>
                            <span className="font-medium">Public</span>
                            <p className="text-sm text-muted-foreground">Anyone can find and join your community</p>
                          </div>
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="private" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer flex items-center gap-2">
                          <Lock className="h-4 w-4 text-primary" />
                          <div>
                            <span className="font-medium">Private</span>
                            <p className="text-sm text-muted-foreground">
                              Only invited members can join your community
                            </p>
                          </div>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="community-image"
                          onChange={(e) => handleImageUpload(e, "image")}
                          disabled={imageUpload.isUploading}
                        />
                        <label
                          htmlFor="community-image"
                          className={`flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${imageUpload.isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {imageUpload.isUploading ? `Uploading ${imageUpload.progress}%` : "Upload Image"}
                        </label>
                        <Input
                          {...field}
                          placeholder="Or enter image URL"
                          onChange={(e) => {
                            field.onChange(e)
                            setImagePreview(e.target.value)
                          }}
                          disabled={imageUpload.isUploading}
                        />
                      </div>
                      {imageUpload.isUploading && (
                        <div className="w-full bg-secondary rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${imageUpload.progress}%` }}
                          ></div>
                        </div>
                      )}
                      {(imagePreview || field.value) && (
                        <Card className="overflow-hidden w-[12rem] h-[16rem]">
                          <CardContent className="p-3">
                            <div className="overflow-hidden rounded-[10px]">
                              <Image
                                src={imagePreview ?? field.value}
                                alt="Community image preview"
                                className="h-full w-full object-cover"
                                width={1000}
                                height={1000}
                                onError={() => setImagePreview("/placeholder.svg?text=Invalid+Image")}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>Upload a square image for your community profile</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

<FormField
          control={form.control}
          name="banner"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Community Banner</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="community-banner"
                      onChange={(e) => handleImageUpload(e, "banner")}
                      disabled={bannerUpload.isUploading}
                    />
                    <label
                      htmlFor="community-banner"
                      className={`flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${bannerUpload.isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {bannerUpload.isUploading ? `Uploading ${bannerUpload.progress}%` : "Upload Banner"}
                    </label>
                    <Input
                      {...field}
                      placeholder="Or enter banner URL"
                      onChange={(e) => {
                        field.onChange(e)
                        setBannerPreview(e.target.value)
                      }}
                      disabled={bannerUpload.isUploading}
                    />
                  </div>
                  {bannerUpload.isUploading && (
                    <div className="w-full bg-secondary rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${bannerUpload.progress}%` }}
                      ></div>
                    </div>
                  )}
                  {(bannerPreview || field.value) && (
                    <Card className="overflow-hidden w-[12rem] h-[16rem] ">
                      <CardContent className="p-3">
                        <div className="overflow-hidden rounded-[10px]">
                          <img
                            src={bannerPreview ?? field.value}
                            alt="Community banner preview"
                            className="h-full w-full object-cover"
                            onError={() => setBannerPreview("/placeholder.svg?text=Invalid+Banner")}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Upload a banner image for your community page (recommended ratio 3:1)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
            </div>
            <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading 
              ? (!isEditMode ? "Creating..." : "Updating...") 
              : (!isEditMode ? "Create Community" : "Update Community")}
          </Button>
        </div>
          </div>
        </form>
 

    </Form>   
  

  )
}
