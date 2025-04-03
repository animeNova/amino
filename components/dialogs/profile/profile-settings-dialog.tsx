"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Globe, LinkIcon, Lock, MapPin, Save, User, X } from "lucide-react"

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
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

interface UserType {
  id: number
  username: string
  name: string
  bio: string
  avatar: string
  coverImage: string
  location?: string
  website?: string
  joinDate: string
  isVerified: boolean
  role: string
}

interface ProfileSettingsDialogProps {
  user: UserType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileSettingsDialog({ user, open, onOpenChange }: ProfileSettingsDialogProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("profile")

  // Form state
  const [profileData, setProfileData] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio,
    location: user.location || "",
    website: user.website || "",
    displayEmail: true,
    displayLocation: true,
    displayWebsite: true,
    allowMessages: true,
    allowComments: true,
    notifyOnComment: true,
    notifyOnFollow: true,
    notifyOnMessage: true,
    profileVisibility: "public",
    language: "en",
    theme: "system",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setProfileData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // In a real app, we would save the data to the server
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
      variant: "default",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription>Update your profile information and preferences</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button variant="secondary" size="icon" className="absolute bottom-0 right-0 h-6 w-6 rounded-full">
                      <Camera className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Upload a square image for best results.</p>
                    <p>Recommended size: 400x400 pixels.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="relative h-32 w-full rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                  <div className="absolute inset-0">
                    <img
                      src={user.coverImage || "/placeholder.svg"}
                      alt="Cover"
                      className="h-full w-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Cover
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input id="name" name="name" value={profileData.name} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" value={profileData.username} onChange={handleInputChange} />
                  <p className="text-xs text-muted-foreground">
                    This will be used in your profile URL: commune.io/{profileData.username}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" rows={4} value={profileData.bio} onChange={handleInputChange} />
                <p className="text-xs text-muted-foreground">
                  Brief description about yourself. Maximum 160 characters.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="location"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      className="rounded-l-none"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-1">
                    <Switch
                      id="displayLocation"
                      checked={profileData.displayLocation}
                      onCheckedChange={(checked) => handleSwitchChange("displayLocation", checked)}
                    />
                    <Label htmlFor="displayLocation" className="font-normal cursor-pointer">
                      Display location on profile
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="website"
                      name="website"
                      value={profileData.website}
                      onChange={handleInputChange}
                      className="rounded-l-none"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-1">
                    <Switch
                      id="displayWebsite"
                      checked={profileData.displayWebsite}
                      onCheckedChange={(checked) => handleSwitchChange("displayWebsite", checked)}
                    />
                    <Label htmlFor="displayWebsite" className="font-normal cursor-pointer">
                      Display website on profile
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-4">
                <Label>Profile Visibility</Label>
                <RadioGroup
                  value={profileData.profileVisibility}
                  onValueChange={(value) => handleSelectChange("profileVisibility", value)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="visibility-public" />
                    <Label htmlFor="visibility-public" className="font-normal cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <div>
                          <p>Public</p>
                          <p className="text-sm text-muted-foreground">Anyone can view your profile</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="followers" id="visibility-followers" />
                    <Label htmlFor="visibility-followers" className="font-normal cursor-pointer">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <div>
                          <p>Followers Only</p>
                          <p className="text-sm text-muted-foreground">Only your followers can view your profile</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="visibility-private" />
                    <Label htmlFor="visibility-private" className="font-normal cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-primary" />
                        <div>
                          <p>Private</p>
                          <p className="text-sm text-muted-foreground">Only you can view your profile</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowMessages" className="font-medium">
                    Allow Direct Messages
                  </Label>
                  <p className="text-sm text-muted-foreground">Control who can send you direct messages</p>
                </div>
                <Switch
                  id="allowMessages"
                  checked={profileData.allowMessages}
                  onCheckedChange={(checked) => handleSwitchChange("allowMessages", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowComments" className="font-medium">
                    Allow Comments
                  </Label>
                  <p className="text-sm text-muted-foreground">Allow others to comment on your posts</p>
                </div>
                <Switch
                  id="allowComments"
                  checked={profileData.allowComments}
                  onCheckedChange={(checked) => handleSwitchChange("allowComments", checked)}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={profileData.language} onValueChange={(value) => handleSelectChange("language", value)}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={profileData.theme} onValueChange={(value) => handleSelectChange("theme", value)}>
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="font-medium">Notification Preferences</h3>

              <div className="flex items-center justify-between">
                <Label htmlFor="notifyOnComment" className="cursor-pointer">
                  Notify me when someone comments on my posts
                </Label>
                <Switch
                  id="notifyOnComment"
                  checked={profileData.notifyOnComment}
                  onCheckedChange={(checked) => handleSwitchChange("notifyOnComment", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notifyOnFollow" className="cursor-pointer">
                  Notify me when someone follows me
                </Label>
                <Switch
                  id="notifyOnFollow"
                  checked={profileData.notifyOnFollow}
                  onCheckedChange={(checked) => handleSwitchChange("notifyOnFollow", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notifyOnMessage" className="cursor-pointer">
                  Notify me when I receive a message
                </Label>
                <Switch
                  id="notifyOnMessage"
                  checked={profileData.notifyOnMessage}
                  onCheckedChange={(checked) => handleSwitchChange("notifyOnMessage", checked)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="emailNotifications">Email Notification Frequency</Label>
                <Select defaultValue="daily" onValueChange={(value) => handleSelectChange("emailFrequency", value)}>
                  <SelectTrigger id="emailNotifications">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                    <SelectItem value="none">Don't send emails</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

