import { AlertTriangle, Flag, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Report {
  id: number
  type: string
  content: string
  reporter: string
  time: string
}

interface RecentReportsProps {
  reports: Report[]
}

export function RecentReports({ reports }: RecentReportsProps) {
  const getReportIcon = (type: string) => {
    switch (type) {
      case "spam":
        return <MessageSquare className="h-4 w-4 text-yellow-500" />
      case "inappropriate":
        return <Flag className="h-4 w-4 text-orange-500" />
      case "harassment":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Flag className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="flex items-start space-x-4">
            <div className="mt-1">{getReportIcon(report.type)}</div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                <span className="capitalize">{report.type}</span> report
              </p>
              <p className="text-sm text-muted-foreground">{report.content}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Reported by {report.reporter} • {report.time}
                </p>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    Dismiss
                  </Button>
                  <Button variant="default" size="sm" className="h-7 px-2">
                    Review
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

