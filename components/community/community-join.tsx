'use client';
import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button';
import { CreateJoinRequest } from '@/app/actions/join-requests/create';
import { hasUserRequestedToJoin, isCurrentUserCommunityMember } from '@/app/actions/join-requests/get';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth/client';
import useLoginDialogStore from '@/store/useLoginDialog';
import { deleteMember } from '@/app/actions/members/delete';

interface CommunityJoinProps {
  communityId: string;
  size ?: 'sm' | 'lg'
}

const CommunityJoin : React.FC<CommunityJoinProps> = ({communityId,size}) => {
    const {data} = useSession();
    const {openLogin} = useLoginDialogStore()

    const [isLoading, setIsLoading] = useState(false);
    const [hasRequested, setHasRequested] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [isMember, setIsMember] = useState(false);
    const [memberId, setMemberId] = useState<string | null>(null);
    const router = useRouter();
    
    useEffect(() => {
        const checkStatus = async () => {
            if (!data?.user) {
                setIsChecking(false);
                return;
            }
            
            try {
                // Check if user is already a member
                const memberStatus = await isCurrentUserCommunityMember(communityId);
                
                setIsMember(!!memberStatus);
                if (memberStatus) {
                    setMemberId(memberStatus.id);
                } else {
                    // If not a member, check if they have a pending request
                    const hasRequest = await hasUserRequestedToJoin(communityId);
                    setHasRequested(hasRequest);
                }
            } catch (error) {
                console.error("Error checking community status:", error);
            } finally {
                setIsChecking(false);
            }
        };

        checkStatus();
    }, [communityId, data?.user]);

    const handleJoin = async () => {
        if(!data?.user){
            openLogin();
        }
        else {
            setIsLoading(true);
            try {
                const result = await CreateJoinRequest(communityId);
                
                if (result.type === 'direct_join') {
                    setIsMember(true);
                    toast.success("You've joined the community!");
                } else {
                    setHasRequested(true);
                    toast.success("Join request sent successfully!");
                }
                
                router.refresh();
            } catch (error) {
                console.error("Failed to create join request:", error);
                toast.error(error instanceof Error ? error.message : "Failed to send join request");
            } finally {
                setIsLoading(false);
            }
        }
    }
    
    const handleLeave = async () => {
        if (!data?.user || !memberId) {
            return;
        }
        
        setIsLoading(true);
        try {
            const result = await deleteMember(memberId, communityId);
            
            if (result.success) {
                setIsMember(false);
                setMemberId(null);
                toast.success("You've left the community");
                router.refresh();
            } else {
                throw new Error(result.error || "Failed to leave community");
            }
        } catch (error) {
            console.error("Failed to leave community:", error);
            toast.error(error instanceof Error ? error.message : "Failed to leave community");
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
        <div>
            {isChecking ? (
                <Button variant="outline" size={size} disabled>Checking...</Button>
            ) : isMember ? (
                <Button 
                    variant="destructive" 
                    size={size}
                    onClick={handleLeave}
                    disabled={isLoading}
                >
                    {isLoading ? "Leaving..." : "Leave"}
                </Button>
            ) : hasRequested ? (
                <Button variant="outline" size={size} disabled>Request Sent</Button>
            ) : (
                <Button 
                    variant="default" 
                    size={size}
                    onClick={handleJoin} 
                    disabled={isLoading}
                >
                    {isLoading ? "Sending..." : "Join"}
                </Button>
            )}
        </div>
    )
}

export default CommunityJoin