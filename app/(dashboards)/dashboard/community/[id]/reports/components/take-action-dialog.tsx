"use client"

import { useState } from "react"
import { AlertTriangle, Ban, Check, ShieldAlert, UserMinus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Report {
  id: number
  type: string
  content: string
  reportedUser: {
    name: string
    avatar: string
  }
  reporter: {
    name: string
    avatar: string
  }
  community: string
  status: string
  date: string
  severity: string
}

interface TakeActionDialogProps {
  report: Report | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onActionTaken: (reportId: number, action: string, notes: string) => void
}

export function TakeActionDialog({ report, open, onOpenChange, onActionTaken }: TakeActionDialogProps) {
  const [selectedAction, setSelectedAction] = useState<string>("removeContent")
  const [notifyReporter, setNotifyReporter] = useState<boolean>(true)
  const [notifyReportedUser, setNotifyReportedUser] = useState<boolean>(true)
  const [notes, setNotes] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("action")

  const handleSubmit = () => {
    if (report) {
      onActionTaken(report.id, selectedAction, notes)
      resetForm()
      onOpenChange(false)
    }
  }

  const resetForm = () => {
    setSelectedAction("removeContent")
    setNotifyReporter(true)
    setNotifyReportedUser(true)
    setNotes("")
    setActiveTab("action")
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

  if (!report) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            Take Moderation Action
          </DialogTitle>
          <DialogDescription>Review the report and select appropriate action to take.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={report.reportedUser.avatar} />
              <AvatarFallback>{report.reportedUser.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{report.reportedUser.name}</span>
                <span className="text-sm text-muted-foreground">in {report.community}</span>
                {report.severity === "high" && (
                  <Badge variant="destructive" className="ml-auto">
                    High Severity
                  </Badge>
                )}
              </div>
              <p className="text-sm mb-2">{report.content}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Reported as {getTypeBadge(report.type)}</span>
                <span>•</span>
                <span>by {report.reporter.name}</span>
                <span>•</span>
                <span>{report.date}</span>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="action">Action</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="action" className="space-y-4 pt-4">
              <div>
                <Label className="text-base">Select Action</Label>
                <RadioGroup value={selectedAction} onValueChange={setSelectedAction} className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="removeContent" id="removeContent" />
                    <Label htmlFor="removeContent" className="flex items-center gap-2 font-normal cursor-pointer">
                      <X className="h-4 w-4 text-destructive" />
                      <div>
                        <p>Remove Content</p>
                        <p className="text-sm text-muted-foreground">Delete the reported content only</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="warnUser" id="warnUser" />
                    <Label htmlFor="warnUser" className="flex items-center gap-2 font-normal cursor-pointer">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <div>
                        <p>Warn User</p>
                        <p className="text-sm text-muted-foreground">Send a warning to the user</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="restrictUser" id="restrictUser" />
                    <Label htmlFor="restrictUser" className="flex items-center gap-2 font-normal cursor-pointer">
                      <UserMinus className="h-4 w-4 text-orange-500" />
                      <div>
                        <p>Restrict User</p>
                        <p className="text-sm text-muted-foreground">Temporarily restrict posting privileges</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="banUser" id="banUser" />
                    <Label htmlFor="banUser" className="flex items-center gap-2 font-normal cursor-pointer">
                      <Ban className="h-4 w-4 text-red-500" />
                      <div>
                        <p>Ban User</p>
                        <p className="text-sm text-muted-foreground">Permanently ban user from the community</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="notes">Moderation Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about this moderation action..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2"
                />
              </div>
            </TabsContent>
            <TabsContent value="notifications" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notifyReporter"
                      checked={notifyReporter}
                      onCheckedChange={(checked) => setNotifyReporter(checked as boolean)}
                    />
                    <Label htmlFor="notifyReporter" className="font-normal cursor-pointer">
                      Notify reporter about action taken
                    </Label>
                  </div>
                  {notifyReporter && (
                    <div className="ml-6 p-3 border rounded-md bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-2">Preview of message to reporter:</p>
                      <p className="text-sm">
                        Thank you for your report. We've reviewed the content and taken appropriate action according to
                        our community guidelines.
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notifyReportedUser"
                      checked={notifyReportedUser}
                      onCheckedChange={(checked) => setNotifyReportedUser(checked as boolean)}
                    />
                    <Label htmlFor="notifyReportedUser" className="font-normal cursor-pointer">
                      Notify reported user about action taken
                    </Label>
                  </div>
                  {notifyReportedUser && (
                    <div className="ml-6 p-3 border rounded-md bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-2">Preview of message to reported user:</p>
                      <p className="text-sm">
                        {selectedAction === "removeContent" &&
                          "Your content has been removed for violating our community guidelines."}
                        {selectedAction === "warnUser" &&
                          "This is a warning regarding content that violates our community guidelines."}
                        {selectedAction === "restrictUser" &&
                          "Your posting privileges have been temporarily restricted due to violations of our community guidelines."}
                        {selectedAction === "banUser" &&
                          "Your account has been banned from this community due to serious violations of our community guidelines."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onActionTaken(report.id, "dismiss", "Report dismissed without action")
                onOpenChange(false)
              }}
            >
              Dismiss Report
            </Button>
            <Button onClick={handleSubmit}>
              <Check className="mr-2 h-4 w-4" />
              Confirm Action
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

