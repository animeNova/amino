"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function PlatformHealthCard() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">User Retention Rate</span>
          <div className="flex items-center">
            <span className="text-sm font-medium">78%</span>
            <Badge variant="outline" className="ml-2 text-green-500 border-green-500">
              +2.4%
            </Badge>
          </div>
        </div>
        <Progress value={78} className="h-2" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Community Engagement</span>
          <div className="flex items-center">
            <span className="text-sm font-medium">65%</span>
            <Badge variant="outline" className="ml-2 text-green-500 border-green-500">
              +5.7%
            </Badge>
          </div>
        </div>
        <Progress value={65} className="h-2" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Content Quality Score</span>
          <div className="flex items-center">
            <span className="text-sm font-medium">82%</span>
            <Badge variant="outline" className="ml-2 text-green-500 border-green-500">
              +1.2%
            </Badge>
          </div>
        </div>
        <Progress value={82} className="h-2" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Moderation Effectiveness</span>
          <div className="flex items-center">
            <span className="text-sm font-medium">94%</span>
            <Badge variant="outline" className="ml-2 text-green-500 border-green-500">
              +3.1%
            </Badge>
          </div>
        </div>
        <Progress value={94} className="h-2" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">System Performance</span>
          <div className="flex items-center">
            <span className="text-sm font-medium">99.8%</span>
            <Badge variant="outline" className="ml-2 text-yellow-500 border-yellow-500">
              -0.1%
            </Badge>
          </div>
        </div>
        <Progress value={99.8} className="h-2" />
      </div>
    </div>
  )
}
