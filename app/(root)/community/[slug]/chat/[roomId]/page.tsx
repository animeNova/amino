import { Suspense } from 'react';
import { notFound, redirect , unauthorized } from 'next/navigation';
import { getChatRoomById } from '@/app/actions/chat-rooms/get';
import { ChatInterface } from '@/components/chat/chat-interface';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Container from '@/components/ui/container';
import { isCommunityMember } from '@/utils/permissions';
import { getCommunityByHandle, getCommunityById } from '@/app/actions/community/get';

interface ChatRoomPageProps {
  params: {
    slug: string;
    roomId: string;
  };
}

export default async function ChatRoomPage({ params }: ChatRoomPageProps) {
  const { roomId, slug } = params;
  
  // Get the current user
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user) {
    return notFound();
  }
  
 
    const community = await getCommunityById(slug);
    if (!community) {
      return notFound();
    }

    // Check if user has permission to access this chat room
     const isMember = await isCommunityMember(session?.user.id, community.id);
        
      if (!isMember) {
        return unauthorized();
      }

    // Get the chat room details
    const room = await getChatRoomById(roomId);
    
    if (!room) {
      return notFound();
    }  
    return (
      <Container>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">{room.name}</h1>
        <Suspense fallback={<div>Loading chat...</div>}>
          <ChatInterface 
            roomId={roomId} 
            communityId={room.community_id} 
            userId={session.user.id}
            userName={session.user.name || 'Anonymous'}
            userAvatar={session.user.image!}
          />
        </Suspense>
      </div>
      </Container>
    );
  }
