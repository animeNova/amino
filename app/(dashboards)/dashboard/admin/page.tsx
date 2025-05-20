"use client"
import { Activity, Calendar, Globe, MessageSquare, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "../community/[id]/components/stats-card"
import { ActivityChart } from "../community/[id]/components/activity-chart"
import { PlatformHealthCard } from "./components/admin/platform-health-card"
import { UserAcquisitionChart } from "./components/admin/user-acquisition-chart"
import { ContentDistributionChart } from "./components/admin/content-distribution-chart"
import { TopCommunitiesTable } from "./components/admin/top-communities-table"
import { RecentUsersTable } from "./components/admin/recent-users-table"


export default function AdminDashboard() {
  return (
          <>
          <div className="border-b">
            <div className="flex h-16 items-center px-4 justify-between">
              <h1 className="text-lg font-semibold">Super Admin Dashboard</h1>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Platform Overview</h2>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-500">System Status: Healthy</Badge>
              </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="communities">Communities</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Key Metrics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <StatsCard
                    title="Total Communities"
                    value="2,845"
                    description="+124 this month"
                    icon={<Globe className="h-4 w-4 text-muted-foreground" />}
                  />
                  <StatsCard
                    title="Total Users"
                    value="156,287"
                    description="+2,345 this month"
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                  />
                  <StatsCard
                    title="Total Posts"
                    value="1.2M"
                    description="+43.2K this month"
                    icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
                  />
                  <StatsCard
                    title="Daily Active Users"
                    value="32,456"
                    description="+12% from last month"
                    icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                  />
                </div>

                {/* Platform Health */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Platform Growth</CardTitle>
                      <CardDescription>User and community growth over time</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <ActivityChart data={platformGrowthData} />
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Platform Health</CardTitle>
                      <CardDescription>Key performance indicators</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PlatformHealthCard />
                    </CardContent>
                  </Card>
                </div>

                {/* User Acquisition & Content Distribution */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Acquisition</CardTitle>
                      <CardDescription>How users are finding the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <UserAcquisitionChart />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Distribution</CardTitle>
                      <CardDescription>Types of content across the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ContentDistributionChart />
                    </CardContent>
                  </Card>
                </div>

                {/* Top Communities & Recent Users */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Communities</CardTitle>
                      <CardDescription>Most active communities by engagement</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TopCommunitiesTable />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Users</CardTitle>
                      <CardDescription>Latest user registrations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentUsersTable />
                    </CardContent>
                  </Card>
                </div>

                {/* System Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>System Status</CardTitle>
                    <CardDescription>Current platform performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Server Load</span>
                            <span className="text-sm text-muted-foreground">24%</span>
                          </div>
                          <Progress value={24} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Database Performance</span>
                            <span className="text-sm text-muted-foreground">92%</span>
                          </div>
                          <Progress value={92} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">API Response Time</span>
                            <span className="text-sm text-muted-foreground">120ms</span>
                          </div>
                          <Progress value={80} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Storage Usage</span>
                            <span className="text-sm text-muted-foreground">68%</span>
                          </div>
                          <Progress value={68} className="h-2" />
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="font-medium">Last Incident:</p>
                          <p className="text-muted-foreground">Database slowdown - 5 days ago</p>
                        </div>
                        <div>
                          <p className="font-medium">Uptime:</p>
                          <p className="text-muted-foreground">99.98% (last 30 days)</p>
                        </div>
                        <div>
                          <p className="font-medium">Active Services:</p>
                          <p className="text-muted-foreground">12/12 operational</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="communities" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Communities Management</CardTitle>
                    <CardDescription>Detailed view and management of all platform communities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This tab would contain a comprehensive communities management interface with filtering, detailed
                      metrics, and administrative actions.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Comprehensive user management and analytics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This tab would contain detailed user management tools, including user search, filtering, role
                      management, and activity tracking.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Management</CardTitle>
                    <CardDescription>Platform-wide content monitoring and moderation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This tab would provide tools for monitoring and managing content across all communities, including
                      trending content, flagged content, and content moderation tools.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Reports</CardTitle>
                    <CardDescription>Detailed analytics and reporting tools</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This tab would contain advanced reporting tools, including custom report generation, data export
                      options, and scheduled reports.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          </>
  )
}

const platformGrowthData = [
  { name: "Jan", users: 95000, communities: 1800, posts: 580000 },
  { name: "Feb", users: 102000, communities: 1950, posts: 620000 },
  { name: "Mar", users: 108000, communities: 2050, posts: 690000 },
  { name: "Apr", users: 115000, communities: 2200, posts: 750000 },
  { name: "May", users: 124000, communities: 2350, posts: 820000 },
  { name: "Jun", users: 135000, communities: 2500, posts: 900000 },
  { name: "Jul", users: 143000, communities: 2650, posts: 980000 },
  { name: "Aug", users: 156287, communities: 2845, posts: 1200000 },
]
