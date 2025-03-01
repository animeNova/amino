import { ChevronRight, Hash, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface ChatRoomsProps {
  rooms: {
    name: string
    members: string
    iconBg: string
  }[]
}

export function ChatRooms({ rooms }: ChatRoomsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h4 className="text-sm font-medium">Chat Rooms</h4>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rooms.map((room) => (
            <div key={room.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`rounded-md p-2 ${room.iconBg}`}>
                  <Hash className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{room.name}</p>
                  <p className="text-xs text-muted-foreground">{room.members} members</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

