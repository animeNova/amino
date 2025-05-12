"use client"

import { useState } from "react"
import { Check, Search, UserPlus, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

interface FollowRequestsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FollowRequestsDialog({ open, onOpenChange }: FollowRequestsDialogProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [requests, setRequests] = useState(followRequests)

  const filteredRequests = requests.filter(
    (request) =>
      request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAccept = (id: string) => {
    setRequests(requests.filter((request) => request.id !== id))
    toast({
      title: "Follow request accepted",
      description: "You are now connected with this user.",
    })
  }

  const handleReject = (id: string) => {
    setRequests(requests.filter((request) => request.id !== id))
    toast({
      description: "Follow request rejected",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Follow Requests</DialogTitle>
          <DialogDescription>People who want to follow you. Accept to connect or reject to decline.</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ScrollArea className="h-[300px] rounded-md border p-4">
          {filteredRequests.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-4">
              {searchQuery ? (
                <>
                  <p className="text-sm text-muted-foreground">No results found for "{searchQuery}"</p>
                  <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
                </>
              ) : (
                <>
                  <UserPlus className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">No pending follow requests</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    When someone requests to follow you, it will appear here
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={request.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{request.name}</p>
                      <p className="text-xs text-muted-foreground">@{request.username}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleReject(request.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Reject</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                      onClick={() => handleAccept(request.id)}
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Accept</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

const followRequests = [
  {
    id: "1",
    name: "Olivia Martinez",
    username: "oliviam",
    avatar: "/diverse-person-portrait.png",
  },
  {
    id: "2",
    name: "Ethan Johnson",
    username: "ethanj",
    avatar: "/placeholder.svg?height=40&width=40&text=EJ",
  },
  {
    id: "3",
    name: "Sophia Williams",
    username: "sophiaw",
    avatar: "/placeholder.svg?height=40&width=40&text=SW",
  },
  {
    id: "4",
    name: "Noah Brown",
    username: "noahb",
    avatar: "/placeholder.svg?height=40&width=40&text=NB",
  },
  {
    id: "5",
    name: "Ava Davis",
    username: "avad",
    avatar: "/placeholder.svg?height=40&width=40&text=AD",
  },
  {
    id: "6",
    name: "Liam Miller",
    username: "liamm",
    avatar: "/placeholder.svg?height=40&width=40&text=LM",
  },
]
