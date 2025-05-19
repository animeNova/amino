import { Ban, CheckCircle, MessageSquare, ShieldAlert, UserCheck, UserX } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ModeratorActions() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      <Button variant="outline" className="justify-start">
        <MessageSquare className="mr-2 h-4 w-4" />
        <span>Post Announcement</span>
      </Button>
      <Button variant="outline" className="justify-start">
        <CheckCircle className="mr-2 h-4 w-4" />
        <span>Approve Content</span>
      </Button>
      <Button variant="outline" className="justify-start">
        <UserCheck className="mr-2 h-4 w-4" />
        <span>Verify Members</span>
      </Button>
      <Button variant="outline" className="justify-start">
        <Ban className="mr-2 h-4 w-4" />
        <span>Mute Discussion</span>
      </Button>
      <Button variant="outline" className="justify-start">
        <ShieldAlert className="mr-2 h-4 w-4" />
        <span>Enable Auto-Mod</span>
      </Button>
      <Button variant="outline" className="justify-start">
        <UserX className="mr-2 h-4 w-4" />
        <span>Ban User</span>
      </Button>
    </div>
  )
}

