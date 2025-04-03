"use client"

import { useState } from "react"
import {
  MoreHorizontal,
  ArrowUpDown,
  ChevronDown,
  Filter,
  UserPlus,
  MessageSquare,
  Ban,
  Crown,
  Check,
  AlertTriangle,
  UserCog,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { MemberDetailsDialog } from "./components/member-details-dialog"

export default function MembersPage() {
  const { toast } = useToast()
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [communityFilter, setCommunityFilter] = useState<string>("all")
  const [membersData, setMembersData] = useState(members)
  const [selectedMember, setSelectedMember] = useState<(typeof members)[0] | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  // Filter members based on search query and filters
  const filteredMembers = membersData.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || member.role === roleFilter
    const matchesStatus = statusFilter === "all" || member.status === statusFilter
    const matchesCommunity = communityFilter === "all" || member.community === communityFilter

    return matchesSearch && matchesRole && matchesStatus && matchesCommunity
  })

  const toggleMemberSelection = (memberId: number) => {
    setSelectedMembers((prev) => (prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]))
  }

  const toggleAllMembers = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([])
    } else {
      setSelectedMembers(filteredMembers.map((member) => member.id))
    }
  }

  const handleViewDetails = (member: (typeof members)[0]) => {
    setSelectedMember(member)
    setDetailsDialogOpen(true)
  }

  const handleBulkAction = (action: string) => {
    // Update all selected members
    setMembersData((prev) =>
      prev.map((member) =>
        selectedMembers.includes(member.id)
          ? {
              ...member,
              status: action === "ban" ? "banned" : action === "verify" ? "verified" : member.status,
            }
          : member,
      ),
    )

    // Show a toast notification
    toast({
      title: `Bulk Action: ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      description: `${selectedMembers.length} members have been ${action === "ban" ? "banned" : action === "verify" ? "verified" : action}ed.`,
      variant: "default",
    })

    // Clear selection
    setSelectedMembers([])
  }

  const handleMemberAction = (memberId: number, action: string) => {
    // Update the member status based on the action
    setMembersData((prev) =>
      prev.map((member) =>
        member.id === memberId
          ? {
              ...member,
              status:
                action === "ban"
                  ? "banned"
                  : action === "verify"
                    ? "verified"
                    : action === "warn"
                      ? "warned"
                      : member.status,
              role: action === "promote" ? "moderator" : member.role,
            }
          : member,
      ),
    )

    // Show a toast notification
    toast({
      title: `Member ${action.charAt(0).toUpperCase() + action.slice(1)}ed`,
      description: `The member has been ${action}ed successfully.`,
      variant: "default",
    })
  }

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

  // Calculate member statistics
  const totalMembers = membersData.length
  const activeMembers = membersData.filter((m) => m.status === "active").length
  const verifiedMembers = membersData.filter((m) => m.status === "verified").length
  const bannedMembers = membersData.filter((m) => m.status === "banned").length
  const moderators = membersData.filter((m) => m.role === "moderator" || m.role === "admin").length

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Members Management</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Members
        </Button>
      </div>

      <div className="grid gap-6 mb-6 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Total Members</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold">{totalMembers}</span>
              <Badge variant="outline" className="ml-2">
                {activeMembers} active
              </Badge>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Verified Members</span>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-bold">{Math.round((verifiedMembers / totalMembers) * 100)}%</span>
                <span className="text-sm text-muted-foreground">{verifiedMembers} verified</span>
              </div>
              <Progress value={(verifiedMembers / totalMembers) * 100} className="h-2" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Moderation Team</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold">{moderators}</span>
              <span className="text-sm text-muted-foreground">
                {Math.round((moderators / totalMembers) * 100)}% of members
              </span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Banned Members</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold">{bannedMembers}</span>
              <Badge variant={bannedMembers < 5 ? "outline" : "destructive"} className="ml-2">
                {bannedMembers < 5 ? "Low" : "High"}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Members ({totalMembers})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeMembers})</TabsTrigger>
          <TabsTrigger value="moderators">Moderators ({moderators})</TabsTrigger>
          <TabsTrigger value="banned">Banned ({bannedMembers})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-6">
        <Card>
          <div className="p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80"
              />
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="contributor">Contributor</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="warned">Warned</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>
              <Select value={communityFilter} onValueChange={setCommunityFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Community" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Communities</SelectItem>
                  <SelectItem value="Photography Club">Photography Club</SelectItem>
                  <SelectItem value="Foodies United">Foodies United</SelectItem>
                  <SelectItem value="Tech Innovators">Tech Innovators</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              {selectedMembers.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleBulkAction("verify")}>
                      <Check className="mr-2 h-4 w-4" /> Verify Members
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("message")}>
                      <MessageSquare className="mr-2 h-4 w-4" /> Message Members
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkAction("ban")} className="text-red-600">
                      <Ban className="mr-2 h-4 w-4" /> Ban Members
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                      onCheckedChange={toggleAllMembers}
                      aria-label="Select all members"
                    />
                  </TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <span>Joined</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <span>Activity</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Community</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No members found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow
                      key={member.id}
                      className={member.status === "banned" ? "bg-red-500/60 dark:bg-red-950/10" : ""}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedMembers.includes(member.id)}
                          onCheckedChange={() => toggleMemberSelection(member.id)}
                          aria-label={`Select member ${member.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">@{member.username}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(member.role)}</TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
                      <TableCell>{member.joinDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-secondary rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                member.activityLevel > 70
                                  ? "bg-green-500"
                                  : member.activityLevel > 30
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${member.activityLevel}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground">{member.activityLevel}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{member.community}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewDetails(member)}>
                              <UserCog className="mr-2 h-4 w-4" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="mr-2 h-4 w-4" /> Message
                            </DropdownMenuItem>
                            {member.status !== "banned" && (
                              <>
                                {member.role !== "moderator" && member.role !== "admin" && (
                                  <DropdownMenuItem onClick={() => handleMemberAction(member.id, "promote")}>
                                    <Crown className="mr-2 h-4 w-4" /> Promote to Moderator
                                  </DropdownMenuItem>
                                )}
                                {member.status !== "verified" && (
                                  <DropdownMenuItem onClick={() => handleMemberAction(member.id, "verify")}>
                                    <Check className="mr-2 h-4 w-4" /> Verify Member
                                  </DropdownMenuItem>
                                )}
                                {member.status !== "warned" && (
                                  <DropdownMenuItem onClick={() => handleMemberAction(member.id, "warn")}>
                                    <AlertTriangle className="mr-2 h-4 w-4" /> Issue Warning
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleMemberAction(member.id, "ban")}
                                  className="text-red-600"
                                >
                                  <Ban className="mr-2 h-4 w-4" /> Ban Member
                                </DropdownMenuItem>
                              </>
                            )}
                            {member.status === "banned" && (
                              <DropdownMenuItem onClick={() => handleMemberAction(member.id, "unban")}>
                                <Check className="mr-2 h-4 w-4" /> Unban Member
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{filteredMembers.length}</strong> of <strong>{membersData.length}</strong> members
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {selectedMember && (
        <MemberDetailsDialog
          member={selectedMember}
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          onAction={(action) => {
            handleMemberAction(selectedMember.id, action)
            setDetailsDialogOpen(false)
          }}
        />
      )}
    </div>
  )
}

const members = [
  {
    id: 1,
    name: "Alex Kim",
    username: "alexkim",
    email: "alex.kim@example.com",
    avatar: "/placeholder.svg?text=AK",
    role: "member",
    status: "active",
    joinDate: "Jan 15, 2023",
    activityLevel: 85,
    community: "Photography Club",
    bio: "Passionate photographer specializing in landscape and wildlife photography.",
    location: "San Francisco, CA",
    posts: 47,
    comments: 128,
    followers: 215,
    following: 184,
    recentActivity: [
      { type: "post", content: "Just captured this amazing sunset at the beach!", date: "2 days ago" },
      { type: "comment", content: "Great composition! Love the lighting.", date: "3 days ago" },
      { type: "like", content: "Liked 'Mountain Photography Tips'", date: "4 days ago" },
    ],
  },
  {
    id: 2,
    name: "Maria Garcia",
    username: "mariagarcia",
    email: "maria.garcia@example.com",
    avatar: "/placeholder.svg?text=MG",
    role: "moderator",
    status: "verified",
    joinDate: "Nov 3, 2022",
    activityLevel: 92,
    community: "Photography Club",
    bio: "Professional photographer and educator. Workshop instructor and community moderator.",
    location: "New York, NY",
    posts: 86,
    comments: 342,
    followers: 578,
    following: 231,
    recentActivity: [
      { type: "post", content: "New photography workshop dates announced!", date: "1 day ago" },
      { type: "comment", content: "Try adjusting your aperture for better depth of field.", date: "2 days ago" },
      { type: "moderation", content: "Removed spam content", date: "3 days ago" },
    ],
  },
  {
    id: 3,
    name: "Tom Wilson",
    username: "tomwilson",
    email: "tom.wilson@example.com",
    avatar: "/placeholder.svg?text=TW",
    role: "member",
    status: "warned",
    joinDate: "Mar 22, 2023",
    activityLevel: 45,
    community: "Photography Club",
    bio: "Street photographer capturing urban life and architecture.",
    location: "Chicago, IL",
    posts: 23,
    comments: 67,
    followers: 89,
    following: 112,
    recentActivity: [
      { type: "post", content: "Check out this street photography series I've been working on!", date: "5 days ago" },
      {
        type: "warning",
        content: "Received warning for posting affiliate links without disclosure",
        date: "3 days ago",
      },
    ],
  },
  {
    id: 4,
    name: "Emma Thompson",
    username: "emmathompson",
    email: "emma.thompson@example.com",
    avatar: "/placeholder.svg?text=ET",
    role: "contributor",
    status: "active",
    joinDate: "Feb 8, 2023",
    activityLevel: 78,
    community: "Photography Club",
    bio: "Portrait photographer specializing in natural light photography.",
    location: "Los Angeles, CA",
    posts: 34,
    comments: 156,
    followers: 312,
    following: 98,
    recentActivity: [
      { type: "post", content: "Just upgraded my lens collection! Can't wait to test these out.", date: "1 day ago" },
      { type: "comment", content: "Beautiful portrait! The lighting is perfect.", date: "3 days ago" },
    ],
  },
  {
    id: 5,
    name: "David Lee",
    username: "davidlee",
    email: "david.lee@example.com",
    avatar: "/placeholder.svg?text=DL",
    role: "member",
    status: "inactive",
    joinDate: "Apr 17, 2023",
    activityLevel: 12,
    community: "Photography Club",
    bio: "Hobbyist photographer interested in macro photography.",
    location: "Seattle, WA",
    posts: 8,
    comments: 23,
    followers: 45,
    following: 67,
    recentActivity: [
      {
        type: "comment",
        content: "Anyone interested in joining a photography workshop this weekend?",
        date: "3 weeks ago",
      },
    ],
  },
  {
    id: 6,
    name: "Jamie Oliver",
    username: "jamieoliver",
    email: "jamie.oliver@example.com",
    avatar: "/placeholder.svg?text=JO",
    role: "contributor",
    status: "active",
    joinDate: "Dec 5, 2022",
    activityLevel: 88,
    community: "Foodies United",
    bio: "Food photographer and recipe developer. Passionate about sustainable cooking.",
    location: "Portland, OR",
    posts: 67,
    comments: 189,
    followers: 423,
    following: 156,
    recentActivity: [
      {
        type: "post",
        content: "My grandmother's secret pasta recipe that's been in our family for generations!",
        date: "2 days ago",
      },
      {
        type: "comment",
        content: "Try adding fresh herbs just before serving for the best flavor.",
        date: "3 days ago",
      },
    ],
  },
  {
    id: 7,
    name: "Gordon Ramsay",
    username: "gordonramsay",
    email: "gordon.ramsay@example.com",
    avatar: "/placeholder.svg?text=GR",
    role: "member",
    status: "banned",
    joinDate: "Jan 30, 2023",
    activityLevel: 0,
    community: "Foodies United",
    bio: "Food critic and restaurant reviewer.",
    location: "Miami, FL",
    posts: 12,
    comments: 78,
    followers: 56,
    following: 23,
    recentActivity: [
      { type: "ban", content: "Banned for repeated harassment and offensive language", date: "1 week ago" },
    ],
  },
  {
    id: 8,
    name: "Elon Musk",
    username: "elonmusk",
    email: "elon.musk@example.com",
    avatar: "/placeholder.svg?text=EM",
    role: "member",
    status: "active",
    joinDate: "May 12, 2023",
    activityLevel: 65,
    community: "Tech Innovators",
    bio: "Tech enthusiast interested in AI, space technology, and electric vehicles.",
    location: "Austin, TX",
    posts: 28,
    comments: 92,
    followers: 876,
    following: 34,
    recentActivity: [
      {
        type: "post",
        content: "Check out my new AI project that can generate realistic images from text descriptions!",
        date: "4 days ago",
      },
      {
        type: "comment",
        content: "Interesting approach to the problem. Have you considered using transformer models?",
        date: "5 days ago",
      },
    ],
  },
  {
    id: 9,
    name: "Bill Gates",
    username: "billgates",
    email: "bill.gates@example.com",
    avatar: "/placeholder.svg?text=BG",
    role: "admin",
    status: "verified",
    joinDate: "Oct 28, 2022",
    activityLevel: 72,
    community: "Tech Innovators",
    bio: "Technology advocate and philanthropist. Interested in global health and climate change solutions.",
    location: "Seattle, WA",
    posts: 45,
    comments: 134,
    followers: 1245,
    following: 87,
    recentActivity: [
      { type: "post", content: "Thoughts on the future of AI in healthcare", date: "3 days ago" },
      { type: "moderation", content: "Pinned community guidelines", date: "1 week ago" },
    ],
  },
  {
    id: 10,
    name: "Mark Zuckerberg",
    username: "markzuckerberg",
    email: "mark.zuckerberg@example.com",
    avatar: "/placeholder.svg?text=MZ",
    role: "member",
    status: "active",
    joinDate: "Feb 4, 2023",
    activityLevel: 58,
    community: "Tech Innovators",
    bio: "Social media and VR enthusiast. Building the metaverse one step at a time.",
    location: "Menlo Park, CA",
    posts: 19,
    comments: 67,
    followers: 934,
    following: 102,
    recentActivity: [
      { type: "post", content: "Virtual reality is the future of social interaction", date: "1 week ago" },
      { type: "comment", content: "Privacy is a core consideration in all our product designs.", date: "1 week ago" },
    ],
  },
  {
    id: 11,
    name: "Linus Torvalds",
    username: "linustorvalds",
    email: "linus.torvalds@example.com",
    avatar: "/placeholder.svg?text=LT",
    role: "moderator",
    status: "verified",
    joinDate: "Nov 15, 2022",
    activityLevel: 82,
    community: "Tech Innovators",
    bio: "Open source advocate and software developer. Git enthusiast.",
    location: "Helsinki, Finland",
    posts: 31,
    comments: 215,
    followers: 1567,
    following: 42,
    recentActivity: [
      { type: "post", content: "Thoughts on kernel development and collaboration", date: "5 days ago" },
      { type: "moderation", content: "Removed inappropriate content", date: "1 week ago" },
    ],
  },
  {
    id: 12,
    name: "Ada Lovelace",
    username: "adalovelace",
    email: "ada.lovelace@example.com",
    avatar: "/placeholder.svg?text=AL",
    role: "contributor",
    status: "active",
    joinDate: "Mar 8, 2023",
    activityLevel: 76,
    community: "Tech Innovators",
    bio: "Computer science historian and algorithm enthusiast.",
    location: "London, UK",
    posts: 24,
    comments: 98,
    followers: 345,
    following: 67,
    recentActivity: [
      {
        type: "post",
        content: "The history of computing: from analytical engines to quantum computers",
        date: "3 days ago",
      },
      { type: "comment", content: "Fascinating perspective on early programming concepts!", date: "4 days ago" },
    ],
  },
  {
    id: 13,
    name: "Nigella Lawson",
    username: "nigellalawson",
    email: "nigella.lawson@example.com",
    avatar: "/placeholder.svg?text=NL",
    role: "moderator",
    status: "verified",
    joinDate: "Dec 20, 2022",
    activityLevel: 89,
    community: "Foodies United",
    bio: "Food writer and culinary enthusiast. Passionate about making cooking accessible to everyone.",
    location: "London, UK",
    posts: 56,
    comments: 234,
    followers: 876,
    following: 124,
    recentActivity: [
      { type: "post", content: "Simple chocolate cake recipe that never fails", date: "2 days ago" },
      { type: "moderation", content: "Pinned community guidelines", date: "1 week ago" },
    ],
  },
  {
    id: 14,
    name: "Anthony Bourdain",
    username: "anthonybourdain",
    email: "anthony.bourdain@example.com",
    avatar: "/placeholder.svg?text=AB",
    role: "contributor",
    status: "active",
    joinDate: "Jan 5, 2023",
    activityLevel: 72,
    community: "Foodies United",
    bio: "Culinary explorer and travel enthusiast. Discovering food cultures around the world.",
    location: "New York, NY",
    posts: 43,
    comments: 187,
    followers: 765,
    following: 92,
    recentActivity: [
      { type: "post", content: "Street food discoveries from my recent trip to Thailand", date: "1 week ago" },
      {
        type: "comment",
        content: "The local markets are always the best place to find authentic cuisine.",
        date: "1 week ago",
      },
    ],
  },
  {
    id: 15,
    name: "Julia Child",
    username: "juliachild",
    email: "julia.child@example.com",
    avatar: "/placeholder.svg?text=JC",
    role: "member",
    status: "inactive",
    joinDate: "Feb 15, 2023",
    activityLevel: 23,
    community: "Foodies United",
    bio: "French cuisine enthusiast and cookbook collector.",
    location: "Boston, MA",
    posts: 12,
    comments: 45,
    followers: 234,
    following: 56,
    recentActivity: [{ type: "comment", content: "The key to perfect French bread is patience!", date: "3 weeks ago" }],
  },
]

