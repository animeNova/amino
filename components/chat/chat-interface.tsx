"use client";

import { useEffect, useRef, useState } from 'react';
import { useChannel, usePresence } from '@ably-labs/react-hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Image as ImageIcon, Smile } from 'lucide-react';
import { ChatMessage, chatInputSchema } from '@/schemas/chat-message';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import UserAvatar from '../ui/user-avatar';
import { getChatMessages } from '@/app/actions/chat-messages/get';
import { saveMessage } from '@/app/actions/chat/save-message';

interface ChatInterfaceProps {
  roomId: string;
  communityId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
}

export function ChatInterface({ roomId, communityId, userId, userName, userAvatar }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Set up Ably channel for this chat room
  const channelName = `chat:${roomId}`;
  const [channel] = useChannel(channelName, (message) => {
    const receivedMessage = message.data as ChatMessage;
    setMessages((prev) => [...prev, receivedMessage]);
  });
  
  // Set up presence to show who's online
  const presenceResult = usePresence(channelName, {
    userId,
    userName,
    userAvatar,
    status: 'online',
  });
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Load previous messages when component mounts
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const { messages: dbMessages } = await getChatMessages(roomId);
        console.log(dbMessages);
        
        if (dbMessages && dbMessages.length > 0) {
          // Transform database message format to component message format
          const formattedMessages = dbMessages.map(msg => ({
            id: msg.id,
            roomId: msg.room_id,
            senderId: msg.user_id,
            senderName: msg.user_name,
            senderAvatar: msg.user_image,
            content: msg.content,
            timestamp: msg.created_at,
            type: msg.type as "text" | "image" | "system",
            attachments: msg.attachments ? JSON.parse(msg.attachments) : undefined,
          }));
          
          setMessages(formattedMessages);
        } else {
          // Add a welcome message if there are no messages
          const systemMessage: ChatMessage = {
            id: 'system-1',
            roomId,
            senderId: 'system',
            senderName: 'System',
            content: 'Welcome to the chat room! Be respectful and have fun!',
            timestamp: new Date(),
            type: 'system',
          };
          
          setMessages([systemMessage]);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        toast({
          title: 'Error',
          description: 'Failed to load chat messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
  }, [roomId]);
  
  const sendMessage = async () => {
    if (!messageInput.trim()) return;
    
    try {
      setIsLoading(true);
      
      // Validate the message
      const validatedData = chatInputSchema.parse({
        content: messageInput,
        roomId,
        type: 'text',
      });
      
      // Create the message object
      const newMessage: ChatMessage = {
        id: `temp-${Date.now()}-${userId}`,
        roomId,
        senderId: userId,
        senderName: userName,
        senderAvatar: userAvatar,
        content: validatedData.content,
        timestamp: new Date(),
        type: 'text',
      };
      
      // Clear the input
      setMessageInput('');
      
      // Publish the message to the Ably channel
      await channel.publish('message', newMessage);
      
      // Save the message to the database
      await saveMessage(newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-[70vh] border rounded-md">
      {/* Chat header with online users */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Chat</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {presenceResult[0].length} online
          </span>
          <div className="flex -space-x-2">
            {presenceResult[0].slice(0, 3).map((user) => (
              <Avatar key={user.data.userId} className="h-6 w-6 border-2 border-background">
                <UserAvatar url={user.data.userAvatar} className='w-full h-full' />
                <AvatarFallback className="text-xs">
                  {user.data.userName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
            {presenceResult[0].length > 3 && (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                +{presenceResult[0].length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Messages area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'system' ? (
                <div className="bg-muted py-2 px-4 rounded-md text-sm text-center w-full">
                  {message.content}
                </div>
              ) : (
                <div className="flex max-w-[70%]">
                  {message.senderId !== userId && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={message.senderAvatar} />
                      <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    {message.senderId !== userId && (
                      <div className="text-xs text-muted-foreground mb-1">
                        {message.senderName}
                      </div>
                    )}
                    <div
                      className={`py-2 px-3 rounded-lg ${
                        message.senderId === userId
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.content}
                      {message.timestamp && (
                        <div
                          className={`text-xs mt-1 ${
                            message.senderId === userId
                              ? 'text-primary-foreground/70'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Message input */}
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex space-x-2"
        >
  
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !messageInput.trim()}>
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}