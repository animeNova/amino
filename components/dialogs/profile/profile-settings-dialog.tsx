"use client"

import { useState, useEffect, useTransition } from "react"
import { Camera, LinkIcon, MapPin, Save, X } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "@/lib/auth/client"

import { getUserById } from "@/app/actions/users/get"
import { updateUser } from "@/app/actions/users/update"
import { updateUserSchema } from "@/schemas/schema"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useUpload } from "@/hooks/useUpload"

interface ProfileSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileSettingsDialog({ open, onOpenChange }: ProfileSettingsDialogProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("profile")
  const { data: sessionData, isPending: isSessionPending } = useSession()
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)
  const imageUpload = useUpload()
  const coverUpload = useUpload()

  // Form setup with zod resolver
  const form = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      image: "",
      coverImage: "",
      bio: "",
      location: "",
      website: ""
    }
  })

  // Image preview states
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  // Fetch user data when dialog opens
  useEffect(() => {
    if (open && sessionData?.user?.id) {
      setIsLoading(true)
      
      const fetchUserData = async () => {
        try {
          const userData = await getUserById(sessionData.user.id)
          
          // Set form values
          form.reset({
            name: userData.name || "",
            image: userData.image || "",
            coverImage: userData.coverImage || "",
            bio: userData.bio || "",
            location: userData.location || "",
            website: userData.website || ""
          })
          
          // Set image previews
          setImagePreview(userData.image || null)
          setCoverPreview(userData.coverImage || null)
        } catch (error) {
          console.error("Error fetching user data:", error)
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive"
          })
        } finally {
          setIsLoading(false)
        }
      }
      
      fetchUserData()
    }
  }, [open, sessionData?.user?.id, form, toast])

  // Handle image uploads
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "coverImage") => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      if (field === "image") {
        // Show local preview immediately
        const previewUrl = URL.createObjectURL(file)
        setImagePreview(previewUrl)
        
        // Start upload
        const result = await imageUpload.uploadAsync(file)
        
        // Set the URL to the form
        form.setValue("image", result.pinataUrl)
        toast({
          title: "Image uploaded",
          description: "Profile image has been uploaded successfully.",
        })
      } else {
        // Show local preview immediately
        const previewUrl = URL.createObjectURL(file)
        setCoverPreview(previewUrl)
        
        // Start upload
        const result = await coverUpload.uploadAsync(file)
        
        // Set the URL to the form
        form.setValue("coverImage", result.pinataUrl)
        toast({
          title: "Cover image uploaded",
          description: "Cover image has been uploaded successfully.",
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

  // Handle form submission
  const onSubmit = (data: any) => {
    if (!sessionData?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive"
      })
      return
    }
    
    startTransition(async () => {
      try {
        const result = await updateUser(sessionData.user.id, data)
        
        if (result.success) {
          toast({
            title: "Profile Updated",
            description: "Your profile has been updated successfully.",
            variant: "default",
          })
          onOpenChange(false)
        } else {
          toast({
            title: "Update Failed",
            description: result.error || "Failed to update profile",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error updating profile:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      }
    })
  }

  if (isSessionPending) {
    return <div>Loading session...</div>
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription>Update your profile information and preferences</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList className="grid grid-cols-1 w-full">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    {/* Profile Picture */}
                    <div className="space-y-2">
                      <Label>Profile Picture</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={imagePreview || ""} alt={form.getValues("name")} />
                            <AvatarFallback>{form.getValues("name")?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <Button 
                            type="button"
                            variant="secondary" 
                            size="icon" 
                            className="absolute bottom-0 right-0 h-6 w-6 rounded-full"
                            onClick={() => document.getElementById("profile-image-upload")?.click()}
                          >
                            <Camera className="h-3 w-3" />
                          </Button>
                          <input
                            id="profile-image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, "image")}
                          />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Upload a square image for best results.</p>
                          <p>Recommended size: 400x400 pixels.</p>
                        </div>
                      </div>
                    </div>

                    {/* Cover Image */}
                    <div className="space-y-2">
                      <Label>Cover Image</Label>
                      <div className="relative h-32 w-full rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                        {coverPreview ? (
                          <div className="absolute inset-0">
                            <img
                              src={coverPreview}
                              alt="Cover"
                              className="h-full w-full object-cover rounded-lg"
                            />
                          </div>
                        ) : (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => document.getElementById("cover-image-upload")?.click()}
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Upload Cover Image
                          </Button>
                        )}
                        {coverPreview && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Button 
                              type="button" 
                              variant="secondary" 
                              size="sm"
                              onClick={() => document.getElementById("cover-image-upload")?.click()}
                            >
                              <Camera className="h-4 w-4 mr-2" />
                              Change Cover
                            </Button>
                          </div>
                        )}
                        <input
                          id="cover-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, "coverImage")}
                        />
                      </div>
                    </div>

                    {/* Name Field */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            This is your public display name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Bio Field */}
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={4} 
                              placeholder="Tell us about yourself"
                            />
                          </FormControl>
                          <FormDescription>
                            Brief description about yourself. Maximum 160 characters.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Location Field */}
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <div className="flex">
                                <div className="flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Input
                                  {...field}
                                  className="rounded-l-none"
                                  placeholder="Your location"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Website Field */}
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <div className="flex">
                                <div className="flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Input
                                  {...field}
                                  className="rounded-l-none"
                                  placeholder="https://example.com"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}

