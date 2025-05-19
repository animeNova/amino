"use client"

import { useState } from "react"
import { AlertTriangle, Ban, Check, Clock, Crown, MessageSquare, Shield, Star, UserCog } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Member {
  id: number
  name: string
  username: string
  email: string
  avatar: string
  role: string
  status: string
  joinDate: string
  activityLevel: number
  community: string
  bio: string
  location: string
  posts: number
  comments: number
  followers: number
  following: number
  recentActivity: {
    type: string
    content: string
    date: string
  }[]
}

interface MemberDetailsDialogProps {
  member: Member | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAction: (action: string) => void
}

export function MemberDetailsDialog({ member, open, onOpenChange, onAction }: MemberDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState<string>("profile")

  if (!member) return null

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500">Admin</Badge>
      case "moderator":
        return <Badge className="bg-blue-500">Moderator</Badge>
      case "contributor":
        return <Badge className="bg-green-500">Contributor</Badge>
      default:
        return <Badge variant="outline">Member</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "verified":
        return <Badge className="bg-blue-500">Verified</Badge>
      case "warned":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Warned
          </Badge>
        )
      case "banned":
        return <Badge variant="destructive">Banned</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "post":
        return <Star className="h-4 w-4 text-blue-500" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case "like":
        return <Check className="h-4 w-4 text-purple-500" />
      case "moderation":
        return <Shield className="h-4 w-4 text-orange-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "ban":
        return <Ban className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-primary" />
            Member Profile
          </DialogTitle>
          <DialogDescription>View and manage member details and activity.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={member.avatar} />
              <AvatarFallback>{member.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold">{member.name}</h3>
                {getRoleBadge(member.role)}
                {getStatusBadge(member.status)}
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                @{member.username} • {member.email}
              </div>
              <div className="text-sm mb-1">{member.bio}</div>
              <div className="text-sm text-muted-foreground">
                <span className="inline-flex items-center">
                  <Shield className="h-3 w-3 mr-1" /> {member.community}
                </span>
                {member.location && (
                  <span className="inline-flex items-center ml-3">
                    <span>📍</span> {member.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-2 bg-muted/50 rounded-md">
              <div className="text-lg font-semibold">{member.posts}</div>
              <div className="text-xs text-muted-foreground">Posts</div>
            </div>
            <div className="p-2 bg-muted/50 rounded-md">
              <div className="text-lg font-semibold">{member.comments}</div>
              <div className="text-xs text-muted-foreground">Comments</div>
            </div>
            <div className="p-2 bg-muted/50 rounded-md">
              <div className="text-lg font-semibold">{member.followers}</div>
              <div className="text-xs text-muted-foreground">Followers</div>
            </div>
            <div className="p-2 bg-muted/50 rounded-md">
              <div className="text-lg font-semibold">{member.following}</div>
              <div className="text-xs text-muted-foreground">Following</div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="moderation">Moderation</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Member Since</span>
                  <span className="text-sm">{member.joinDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Activity Level</span>
                  <span className="text-sm">{member.activityLevel}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <span className="text-sm capitalize">{member.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Role</span>
                  <span className="text-sm capitalize">{member.role}</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="activity" className="space-y-4 pt-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Recent Activity</h4>
                {member.recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {member.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.content}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="capitalize">{activity.type}</span> • {activity.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No recent activity found.</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="moderation" className="space-y-4 pt-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Moderation Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  {member.status !== "banned" && (
                    <>
                      {member.role !== "moderator" && member.role !== "admin" && (
                        <Button variant="outline" className="justify-start" onClick={() => onAction("promote")}>
                          <Crown className="mr-2 h-4 w-4 text-yellow-500" />
                          <span>Promote to Moderator</span>
                        </Button>
                      )}
                      {member.status !== "verified" && (
                        <Button variant="outline" className="justify-start" onClick={() => onAction("verify")}>
                          <Check className="mr-2 h-4 w-4 text-green-500" />
                          <span>Verify Member</span>
                        </Button>
                      )}
                      {member.status !== "warned" && (
                        <Button variant="outline" className="justify-start" onClick={() => onAction("warn")}>
                          <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                          <span>Issue Warning</span>
                        </Button>
                      )}
                      <Button variant="outline" className="justify-start text-red-600" onClick={() => onAction("ban")}>
                        <Ban className="mr-2 h-4 w-4" />
                        <span>Ban Member</span>
                      </Button>
                    </>
                  )}
                  {member.status === "banned" && (
                    <Button variant="outline" className="justify-start" onClick={() => onAction("unban")}>
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span>Unban Member</span>
                    </Button>
                  )}
                  <Button variant="outline" className="justify-start">
                    <MessageSquare className="mr-2 h-4 w-4 text-blue-500" />
                    <span>Send Message</span>
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    {member.status === "warned" && "Member has been warned for policy violations."}
                    {member.status === "banned" && "Member has been banned for serious policy violations."}
                    {member.status !== "warned" &&
                      member.status !== "banned" &&
                      "No moderation notes available for this member."}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

