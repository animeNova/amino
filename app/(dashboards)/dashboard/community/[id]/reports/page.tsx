"use client"

import { useState } from "react"
import {
  MoreHorizontal,
  ArrowUpDown,
  ChevronDown,
  Check,
  Filter,
  Eye,
  X,
  ShieldAlert,
  MessageSquare,
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
import { TakeActionDialog } from "./components/take-action-dialog"

export default function ReportsPage() {
  const { toast } = useToast()
  const [selectedReports, setSelectedReports] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [communityFilter, setCommunityFilter] = useState<string>("all")
  const [reportsData, setReportsData] = useState(reports)
  const [selectedReport, setSelectedReport] = useState<(typeof reports)[0] | null>(null)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)

  // Filter reports based on search query and filters
  const filteredReports = reportsData.filter((report) => {
    const matchesSearch =
      report.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedUser.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || report.type === typeFilter
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    const matchesCommunity = communityFilter === "all" || report.community === communityFilter

    return matchesSearch && matchesType && matchesStatus && matchesCommunity
  })

  const toggleReportSelection = (reportId: number) => {
    setSelectedReports((prev) => (prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]))
  }

  const toggleAllReports = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([])
    } else {
      setSelectedReports(filteredReports.map((report) => report.id))
    }
  }

  const handleTakeAction = (report: (typeof reports)[0]) => {
    setSelectedReport(report)
    setActionDialogOpen(true)
  }

  const handleActionTaken = (reportId: number, action: string, notes: string) => {
    // Update the report status based on the action
    setReportsData((prev) =>
      prev.map((report) =>
        report.id === reportId ? { ...report, status: action === "dismiss" ? "dismissed" : "resolved" } : report,
      ),
    )

    // Show a toast notification
    toast({
      title: action === "dismiss" ? "Report Dismissed" : "Action Taken",
      description:
        action === "dismiss"
          ? "The report has been dismissed without further action."
          : `Action "${action}" has been taken on the reported content.`,
      variant: "default",
    })
  }

  const handleBulkAction = (action: string) => {
    // Update all selected reports
    setReportsData((prev) =>
      prev.map((report) =>
        selectedReports.includes(report.id)
          ? { ...report, status: action === "dismiss" ? "dismissed" : "resolved" }
          : report,
      ),
    )

    // Show a toast notification
    toast({
      title: `Bulk Action: ${action === "dismiss" ? "Dismissed" : "Resolved"}`,
      description: `${selectedReports.length} reports have been ${action === "dismiss" ? "dismissed" : "resolved"}.`,
      variant: "default",
    })

    // Clear selection
    setSelectedReports([])
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
            Pending
          </Badge>
        )
      case "reviewing":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Reviewing
          </Badge>
        )
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>
      case "dismissed":
        return <Badge variant="secondary">Dismissed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "spam":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Spam
          </Badge>
        )
      case "harassment":
        return <Badge variant="destructive">Harassment</Badge>
      case "inappropriate":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
            Inappropriate
          </Badge>
        )
      case "misinformation":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
            Misinformation
          </Badge>
        )
      case "copyright":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Copyright
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  // Calculate report statistics
  const totalReports = reportsData.length
  const pendingReports = reportsData.filter((r) => r.status === "pending").length
  const resolvedReports = reportsData.filter((r) => r.status === "resolved").length
  const dismissedReports = reportsData.filter((r) => r.status === "dismissed").length

  const reportsByType = reportsData.reduce(
    (acc, report) => {
      acc[report.type] = (acc[report.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Reports Management</h1>
        <Button>
          <ShieldAlert className="mr-2 h-4 w-4" />
          Moderation Settings
        </Button>
      </div>

      <div className="grid gap-6 mb-6 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Total Reports</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold">{totalReports}</span>
              <Badge variant={pendingReports > 10 ? "destructive" : "outline"} className="ml-2">
                {pendingReports} pending
              </Badge>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Resolution Rate</span>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl font-bold">{Math.round((resolvedReports / totalReports) * 100)}%</span>
                <span className="text-sm text-muted-foreground">{resolvedReports} resolved</span>
              </div>
              <Progress value={(resolvedReports / totalReports) * 100} className="h-2" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Most Reported Type</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold capitalize">
                {Object.entries(reportsByType).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"}
              </span>
              <span className="text-sm text-muted-foreground">
                {Object.entries(reportsByType).sort((a, b) => b[1] - a[1])[0]?.[1] || 0} reports
              </span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">Average Response Time</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold">4.2h</span>
              <Badge variant={4.2 < 6 ? "outline" : "destructive"} className="ml-2">
                {4.2 < 6 ? "Good" : "Slow"}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Reports ({totalReports})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingReports})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedReports})</TabsTrigger>
          <TabsTrigger value="dismissed">Dismissed ({dismissedReports})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-6">
        <Card>
          <div className="p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80"
              />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="harassment">Harassment</SelectItem>
                  <SelectItem value="inappropriate">Inappropriate</SelectItem>
                  <SelectItem value="misinformation">Misinformation</SelectItem>
                  <SelectItem value="copyright">Copyright</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
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
              {selectedReports.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleBulkAction("resolve")}>
                      <Check className="mr-2 h-4 w-4" /> Mark as Resolved
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("dismiss")}>
                      <X className="mr-2 h-4 w-4" /> Dismiss Reports
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <ShieldAlert className="mr-2 h-4 w-4" /> Take Action on Content
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
                      checked={selectedReports.length === filteredReports.length && filteredReports.length > 0}
                      onCheckedChange={toggleAllReports}
                      aria-label="Select all reports"
                    />
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <span>Reported Content</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Reported User</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Community</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-2">
                      <span>Date</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No reports found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow
                      key={report.id}
                      className={
                        report.status === "pending" && report.severity === "high" ? "bg-red-500/60 dark:bg-red-950/10" : ""
                      }
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedReports.includes(report.id)}
                          onCheckedChange={() => toggleReportSelection(report.id)}
                          aria-label={`Select report ${report.id}`}
                        />
                      </TableCell>
                      <TableCell>{getTypeBadge(report.type)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium truncate max-w-[200px]">{report.content}</span>
                          {report.severity === "high" && (
                            <Badge variant="destructive" className="mt-1 w-fit">
                              High Severity
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={report.reportedUser.avatar} />
                            <AvatarFallback>{report.reportedUser.name[0]}</AvatarFallback>
                          </Avatar>
                          <span>{report.reportedUser.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={report.reporter.avatar} />
                            <AvatarFallback>{report.reporter.name[0]}</AvatarFallback>
                          </Avatar>
                          <span>{report.reporter.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{report.community}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="mr-2 h-4 w-4" /> Contact Reporter
                            </DropdownMenuItem>
                            {report.status === "pending" && (
                              <>
                                <DropdownMenuItem onClick={() => handleTakeAction(report)}>
                                  <ShieldAlert className="mr-2 h-4 w-4" /> Take Action
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleActionTaken(report.id, "dismiss", "Report dismissed")}
                                >
                                  <X className="mr-2 h-4 w-4" /> Dismiss
                                </DropdownMenuItem>
                              </>
                            )}
                            {report.status !== "pending" && (
                              <DropdownMenuItem
                                onClick={() => handleActionTaken(report.id, "resolve", "Marked as resolved")}
                              >
                                <Check className="mr-2 h-4 w-4" /> Mark as Resolved
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
              Showing <strong>{filteredReports.length}</strong> of <strong>{reportsData.length}</strong> reports
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

      <TakeActionDialog
        report={selectedReport}
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        onActionTaken={handleActionTaken}
      />
    </div>
  )
}

const reports = [
  {
    id: 1,
    type: "spam",
    content: "Check out my photography website!",
    reportedUser: {
      name: "Alex Kim",
      avatar: "/placeholder.svg?text=AK",
    },
    reporter: {
      name: "Maria Garcia",
      avatar: "/placeholder.svg?text=MG",
    },
    community: "Photography Club",
    status: "pending",
    date: "2 hours ago",
    severity: "low",
  },
  {
    id: 2,
    type: "inappropriate",
    content: "This comment contains offensive language",
    reportedUser: {
      name: "Tom Wilson",
      avatar: "/placeholder.svg?text=TW",
    },
    reporter: {
      name: "Emma Thompson",
      avatar: "/placeholder.svg?text=ET",
    },
    community: "Photography Club",
    status: "reviewing",
    date: "5 hours ago",
    severity: "medium",
  },
  {
    id: 3,
    type: "harassment",
    content: "User sending unwanted messages and threatening comments",
    reportedUser: {
      name: "Suspicious User",
      avatar: "/placeholder.svg?text=SU",
    },
    reporter: {
      name: "David Lee",
      avatar: "/placeholder.svg?text=DL",
    },
    community: "Photography Club",
    status: "pending",
    date: "1 day ago",
    severity: "high",
  },
  {
    id: 4,
    type: "copyright",
    content: "Using my photos without permission",
    reportedUser: {
      name: "Content Thief",
      avatar: "/placeholder.svg?text=CT",
    },
    reporter: {
      name: "Emma Thompson",
      avatar: "/placeholder.svg?text=ET",
    },
    community: "Photography Club",
    status: "resolved",
    date: "2 days ago",
    severity: "medium",
  },
  {
    id: 5,
    type: "misinformation",
    content: "Spreading false information about camera specifications",
    reportedUser: {
      name: "Misinformed User",
      avatar: "/placeholder.svg?text=MU",
    },
    reporter: {
      name: "Tech Expert",
      avatar: "/placeholder.svg?text=TE",
    },
    community: "Photography Club",
    status: "dismissed",
    date: "3 days ago",
    severity: "low",
  },
  {
    id: 6,
    type: "spam",
    content: "Check out my cooking channel!",
    reportedUser: {
      name: "Jamie Oliver",
      avatar: "/placeholder.svg?text=JO",
    },
    reporter: {
      name: "Gordon Ramsay",
      avatar: "/placeholder.svg?text=GR",
    },
    community: "Foodies United",
    status: "pending",
    date: "1 hour ago",
    severity: "low",
  },
  {
    id: 7,
    type: "inappropriate",
    content: "Offensive comment on food post",
    reportedUser: {
      name: "Rude Foodie",
      avatar: "/placeholder.svg?text=RF",
    },
    reporter: {
      name: "Nigella Lawson",
      avatar: "/placeholder.svg?text=NL",
    },
    community: "Foodies United",
    status: "resolved",
    date: "3 hours ago",
    severity: "medium",
  },
  {
    id: 8,
    type: "misinformation",
    content: "Dangerous cooking advice that could cause harm",
    reportedUser: {
      name: "Bad Cook",
      avatar: "/placeholder.svg?text=BC",
    },
    reporter: {
      name: "Professional Chef",
      avatar: "/placeholder.svg?text=PC",
    },
    community: "Foodies United",
    status: "pending",
    date: "6 hours ago",
    severity: "high",
  },
  {
    id: 9,
    type: "spam",
    content: "Repeated promotional content for restaurant",
    reportedUser: {
      name: "Restaurant Owner",
      avatar: "/placeholder.svg?text=RO",
    },
    reporter: {
      name: "Anthony Bourdain",
      avatar: "/placeholder.svg?text=AB",
    },
    community: "Foodies United",
    status: "dismissed",
    date: "1 day ago",
    severity: "low",
  },
  {
    id: 10,
    type: "harassment",
    content: "Targeting a specific restaurant with negative comments",
    reportedUser: {
      name: "Angry Customer",
      avatar: "/placeholder.svg?text=AC",
    },
    reporter: {
      name: "Restaurant Defender",
      avatar: "/placeholder.svg?text=RD",
    },
    community: "Foodies United",
    status: "reviewing",
    date: "2 days ago",
    severity: "medium",
  },
  {
    id: 11,
    type: "spam",
    content: "Promoting crypto scam in tech discussion",
    reportedUser: {
      name: "Crypto Scammer",
      avatar: "/placeholder.svg?text=CS",
    },
    reporter: {
      name: "Elon Musk",
      avatar: "/placeholder.svg?text=EM",
    },
    community: "Tech Innovators",
    status: "pending",
    date: "30 minutes ago",
    severity: "high",
  },
  {
    id: 12,
    type: "misinformation",
    content: "False tech news about upcoming product",
    reportedUser: {
      name: "Fake News Spreader",
      avatar: "/placeholder.svg?text=FN",
    },
    reporter: {
      name: "Bill Gates",
      avatar: "/placeholder.svg?text=BG",
    },
    community: "Tech Innovators",
    status: "resolved",
    date: "2 hours ago",
    severity: "medium",
  },
  {
    id: 13,
    type: "inappropriate",
    content: "Offensive meme in comments section",
    reportedUser: {
      name: "Meme Lord",
      avatar: "/placeholder.svg?text=ML",
    },
    reporter: {
      name: "Mark Zuckerberg",
      avatar: "/placeholder.svg?text=MZ",
    },
    community: "Tech Innovators",
    status: "dismissed",
    date: "4 hours ago",
    severity: "low",
  },
  {
    id: 14,
    type: "harassment",
    content: "Targeted harassment of new member",
    reportedUser: {
      name: "Tech Bully",
      avatar: "/placeholder.svg?text=TB",
    },
    reporter: {
      name: "New Member",
      avatar: "/placeholder.svg?text=NM",
    },
    community: "Tech Innovators",
    status: "pending",
    date: "12 hours ago",
    severity: "high",
  },
  {
    id: 15,
    type: "copyright",
    content: "Using proprietary code without permission",
    reportedUser: {
      name: "Code Stealer",
      avatar: "/placeholder.svg?text=CS",
    },
    reporter: {
      name: "Linus Torvalds",
      avatar: "/placeholder.svg?text=LT",
    },
    community: "Tech Innovators",
    status: "resolved",
    date: "1 day ago",
    severity: "medium",
  },
]

