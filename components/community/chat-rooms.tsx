"use client"

import { useEffect, useState } from "react"
import { MessageSquarePlus, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateChatRoomDialog } from "../dialogs/chat-room/create-chat-room-dialog"
import { ScrollArea } from "../ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import { ChatRoomResult } from "@/app/actions/chat-rooms/get"
import { ChatRoomFormInput, chatRoomSchema } from "@/schemas/schema"
import { canCreateChatRoom } from "@/utils/permissions"
import { useSession } from "@/lib/auth/client"
import { createChatRoom } from "@/app/actions/chat-rooms/create";





interface ChatRoomsProps {
  rooms: ChatRoomResult[]
  communityId: string
}

export function ChatRooms({ rooms, communityId }: ChatRoomsProps) {
  const {data , isPending} = useSession()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [canManageRooms, setCanManageRooms] = useState(false)
  const router = useRouter()

  const handleJoinRoom = (roomId: string, roomName: string) => {
    // In a real implementation, this would call an API to join the room
    toast({
      title: "Joined chat room",
      description: `You've joined the ${roomName} chat room.`,
    })
    
    // Navigate to the chat room
    if (communityId) {
      router.push(`/community/${communityId}/chat/${roomId}`)
    }
  }

  const handleCreateRoom = async (data: ChatRoomFormInput) => {
    try {
      // Validate the data with the schema
      const validatedData = chatRoomSchema.parse(data);
      
      // Call the server action to create the chat room
      const result = await createChatRoom(validatedData);
      
      if (result.success) {
        toast({
          title: "Chat room created",
          description: result.message || `${validatedData.name} has been successfully created.`,
        });
        
        // Refresh the page to show the new room
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create chat room",
          variant: "destructive"
        });
      }
      
      // Close the dialog
      setCreateDialogOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errorMessage = error.errors.map(err => `${err.path}: ${err.message}`).join(', ');
        toast({
          title: "Invalid input",
          description: errorMessage,
          variant: "destructive"
        });
      } else {
        // Handle other errors
        console.error("Error creating chat room:", error);
        toast({
          title: "Error",
          description: "Failed to create chat room",
          variant: "destructive"
        });
      }
    }
  }
  useEffect(() => {
    // Check if the user is a moderator
    const isModerator =async () => {
      const CanManage = await canCreateChatRoom(data?.user.id!,communityId)
      setCanManageRooms(CanManage)

    }
    isModerator();
  },[!isPending])

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Chat Rooms</CardTitle>

        </CardHeader>
        <CardContent className="pb-3">
          <ScrollArea className="h-[200px]">
            <div className="space-y-3">
              {rooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[100px] text-center">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">No chat rooms available</p>
                </div>
              ) : (
                rooms.map((room) => (
                  <div 
                    key={room.id} 
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => handleJoinRoom(room.id, room.name)}
                  >
                    <div className="flex items-center gap-2">
                      {room.image ? (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={room.image} alt={room.name} />
                          <AvatarFallback className={room.image || "bg-primary/10"}>
                            {room.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className={`h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center`}>
                          <span className="text-xs">{room.name.charAt(0)}</span>
                        </div>
                      )}
                      <span className="text-sm font-medium">{room.name}</span>
                      {/* {room.isActive && (
                        <Badge variant="secondary" className="ml-2 bg-green-500/10 text-green-500 hover:bg-green-500/20">
                          Active
                        </Badge>
                      )} */}
                    </div>
                    <span className="text-xs text-muted-foreground">{room.memberCount} members</span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          {
            canManageRooms && (
              <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => setCreateDialogOpen(true)}>
              <MessageSquarePlus className="h-4 w-4 mr-2" />
              Create Chat Room
            </Button>
            )
          }

        </CardContent>
      </Card>

      <CreateChatRoomDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
        onSubmit={(data) => handleCreateRoom({
          name: data.name,
          description: data.description,
          image: data.image!,
          community_id : communityId,
          type : "public"
        })}
        communityId={communityId}
      />
    </>
  )
}
