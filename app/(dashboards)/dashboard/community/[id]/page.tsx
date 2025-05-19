"use client"

import { useState } from "react"
import { Activity, Flag, MessageSquare, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModeratorSidebar } from "./components/moderator-sidebar"
import { StatsCard } from "./components/stats-card"
import { ActivityChart } from "./components/activity-chart"
import { RecentReports } from "./components/recent-reports"
import { ModeratorActions } from "./components/moderator-actions"

export default function ModeratorDashboard() {
  const [selectedCommunity, setSelectedCommunity] = useState(communities[0])

  return (

      <div className="flex min-h-screen bg-background">
        <div className="flex-1">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <div className="flex items-center space-x-2">
                <span
                  className={`h-2 w-2 rounded-full ${selectedCommunity.status === "healthy" ? "bg-green-500" : selectedCommunity.status === "warning" ? "bg-yellow-500" : "bg-red-500"}`}
                ></span>
                <span className="text-sm font-medium capitalize">{selectedCommunity.status} Status</span>
              </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <StatsCard
                    title="Total Members"
                    value={selectedCommunity.stats.members.toLocaleString()}
                    description={`+${selectedCommunity.stats.newMembers} this week`}
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                  />
                  <StatsCard
                    title="Active Posts"
                    value={selectedCommunity.stats.posts.toLocaleString()}
                    description={`+${selectedCommunity.stats.newPosts} today`}
                    icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
                  />
                  <StatsCard
                    title="Open Reports"
                    value={selectedCommunity.stats.reports.toString()}
                    description={selectedCommunity.stats.reports > 10 ? "Needs attention" : "All under control"}
                    icon={<Flag className="h-4 w-4 text-muted-foreground" />}
                    alert={selectedCommunity.stats.reports > 10}
                  />
                  <StatsCard
                    title="Engagement Rate"
                    value={`${selectedCommunity.stats.engagement}%`}
                    description={selectedCommunity.stats.engagement > 15 ? "Above average" : "Below average"}
                    icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Activity Overview</CardTitle>
                      <CardDescription>Community activity for the past 30 days</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <ActivityChart data={selectedCommunity.activityData} />
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Recent Reports</CardTitle>
                      <CardDescription>
                        {selectedCommunity.recentReports.length} reports requiring review
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentReports reports={selectedCommunity.recentReports} />
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Distribution</CardTitle>
                      <CardDescription>Types of content in your community</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <div className="h-[200px]">
                        <ActivityChart data={selectedCommunity.contentDistribution} type="pie" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Moderation Actions</CardTitle>
                      <CardDescription>Quick actions for community management</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ModeratorActions />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Health Metrics</CardTitle>
                      <CardDescription>Community health indicators</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(selectedCommunity.healthMetrics).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                            <div className="flex items-center">
                              <div className="h-2 w-24 rounded-full bg-secondary">
                                <div
                                  className={`h-2 rounded-full ${value >= 70 ? "bg-green-500" : value >= 40 ? "bg-yellow-500" : "bg-red-500"}`}
                                  style={{ width: `${value}%` }}
                                />
                              </div>
                              <span className="ml-2 text-sm text-muted-foreground">{value}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Reports</CardTitle>
                    <CardDescription>Manage reported content in your community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This tab would contain a detailed list of all reports with filtering options and action buttons.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="members" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Member Management</CardTitle>
                    <CardDescription>View and manage community members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This tab would contain a searchable, filterable list of community members with management options.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Community Settings</CardTitle>
                    <CardDescription>Configure moderation settings for {selectedCommunity.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This tab would contain settings for auto-moderation, content filters, and other community
                      configuration options.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

  )
}

const communities = [
  {
    id: 1,
    name: "Photography Club",
    handle: "photographyclub",
    avatar: "/placeholder.svg?text=PC",
    status: "healthy",
    stats: {
      members: 15243,
      newMembers: 124,
      posts: 3567,
      newPosts: 43,
      reports: 5,
      engagement: 18,
    },
    activityData: [
      { name: "Jan 1", posts: 40, members: 24, reports: 2 },
      { name: "Jan 5", posts: 30, members: 13, reports: 1 },
      { name: "Jan 10", posts: 45, members: 30, reports: 5 },
      { name: "Jan 15", posts: 50, members: 27, reports: 3 },
      { name: "Jan 20", posts: 65, members: 45, reports: 2 },
      { name: "Jan 25", posts: 70, members: 30, reports: 4 },
      { name: "Jan 30", posts: 60, members: 15, reports: 6 },
    ],
    contentDistribution: [
      { name: "Photos", value: 65 },
      { name: "Discussions", value: 20 },
      { name: "Questions", value: 10 },
      { name: "Events", value: 5 },
    ],
    recentReports: [
      { id: 1, type: "spam", content: "Check out my photography website!", reporter: "Alex Kim", time: "2 hours ago" },
      {
        id: 2,
        type: "inappropriate",
        content: "This comment contains offensive language",
        reporter: "Maria Garcia",
        time: "5 hours ago",
      },
      {
        id: 3,
        type: "harassment",
        content: "User sending unwanted messages",
        reporter: "Tom Wilson",
        time: "1 day ago",
      },
      {
        id: 4,
        type: "copyright",
        content: "Using my photos without permission",
        reporter: "Emma Thompson",
        time: "2 days ago",
      },
      { id: 5, type: "other", content: "Suspicious activity in comments", reporter: "David Lee", time: "3 days ago" },
    ],
    healthMetrics: {
      contentQuality: 85,
      memberActivity: 72,
      growthRate: 68,
      reportResolution: 95,
      toxicityLevel: 12,
    },
  },
  {
    id: 2,
    name: "Foodies United",
    handle: "foodiesunited",
    avatar: "/placeholder.svg?text=FU",
    status: "warning",
    stats: {
      members: 12876,
      newMembers: 87,
      posts: 4231,
      newPosts: 67,
      reports: 12,
      engagement: 22,
    },
    activityData: [
      { name: "Jan 1", posts: 50, members: 20, reports: 3 },
      { name: "Jan 5", posts: 45, members: 25, reports: 4 },
      { name: "Jan 10", posts: 60, members: 35, reports: 8 },
      { name: "Jan 15", posts: 75, members: 40, reports: 10 },
      { name: "Jan 20", posts: 85, members: 30, reports: 7 },
      { name: "Jan 25", posts: 70, members: 25, reports: 12 },
      { name: "Jan 30", posts: 65, members: 20, reports: 9 },
    ],
    contentDistribution: [
      { name: "Recipes", value: 45 },
      { name: "Restaurant Reviews", value: 30 },
      { name: "Food Photos", value: 20 },
      { name: "Events", value: 5 },
    ],
    recentReports: [
      { id: 1, type: "spam", content: "Check out my cooking channel!", reporter: "Jamie Oliver", time: "1 hour ago" },
      {
        id: 2,
        type: "inappropriate",
        content: "Offensive comment on food post",
        reporter: "Gordon Ramsay",
        time: "3 hours ago",
      },
      {
        id: 3,
        type: "misinformation",
        content: "Dangerous cooking advice",
        reporter: "Nigella Lawson",
        time: "6 hours ago",
      },
      { id: 4, type: "spam", content: "Repeated promotional content", reporter: "Anthony Bourdain", time: "1 day ago" },
      {
        id: 5,
        type: "harassment",
        content: "Targeting a specific restaurant",
        reporter: "Julia Child",
        time: "2 days ago",
      },
    ],
    healthMetrics: {
      contentQuality: 75,
      memberActivity: 82,
      growthRate: 58,
      reportResolution: 65,
      toxicityLevel: 25,
    },
  },
  {
    id: 3,
    name: "Tech Innovators",
    handle: "techinnovators",
    avatar: "/placeholder.svg?text=TI",
    status: "critical",
    stats: {
      members: 10543,
      newMembers: 56,
      posts: 2876,
      newPosts: 32,
      reports: 28,
      engagement: 14,
    },
    activityData: [
      { name: "Jan 1", posts: 35, members: 15, reports: 8 },
      { name: "Jan 5", posts: 40, members: 20, reports: 10 },
      { name: "Jan 10", posts: 50, members: 25, reports: 15 },
      { name: "Jan 15", posts: 45, members: 18, reports: 12 },
      { name: "Jan 20", posts: 55, members: 30, reports: 20 },
      { name: "Jan 25", posts: 60, members: 35, reports: 25 },
      { name: "Jan 30", posts: 50, members: 25, reports: 18 },
    ],
    contentDistribution: [
      { name: "Discussions", value: 40 },
      { name: "Tutorials", value: 25 },
      { name: "News", value: 20 },
      { name: "Projects", value: 15 },
    ],
    recentReports: [
      { id: 1, type: "spam", content: "Promoting crypto scam", reporter: "Elon Musk", time: "30 minutes ago" },
      { id: 2, type: "misinformation", content: "False tech news", reporter: "Bill Gates", time: "2 hours ago" },
      {
        id: 3,
        type: "inappropriate",
        content: "Offensive meme in comments",
        reporter: "Mark Zuckerberg",
        time: "4 hours ago",
      },
      {
        id: 4,
        type: "harassment",
        content: "Targeted harassment of new member",
        reporter: "Steve Jobs",
        time: "12 hours ago",
      },
      {
        id: 5,
        type: "copyright",
        content: "Using proprietary code without permission",
        reporter: "Linus Torvalds",
        time: "1 day ago",
      },
    ],
    healthMetrics: {
      contentQuality: 45,
      memberActivity: 62,
      growthRate: 38,
      reportResolution: 35,
      toxicityLevel: 48,
    },
  },
]

