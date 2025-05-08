'use client';
import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button';
import { CreateJoinRequest } from '@/app/actions/join-requests/create';
import { hasUserRequestedToJoin } from '@/app/actions/join-requests/get';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth/client';
import useLoginDialogStore from '@/store/useLoginDialog';

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
    const router = useRouter();
    
    useEffect(() => {
        const checkExistingRequest = async () => {
            try {
                const hasRequest = await hasUserRequestedToJoin(communityId);
                setHasRequested(hasRequest);
            } catch (error) {
                console.error("Error checking join request status:", error);
            } finally {
                setIsChecking(false);
            }
        };

        checkExistingRequest();
    }, [communityId]);

    const onClick = async () => {
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
    
    return (
        <div>
            {isChecking ? (
                <Button variant="outline" size={size} disabled>Checking...</Button>
            ) : isMember ? (
                <Button variant="outline" size={size} disabled>Joined</Button>
            ) : hasRequested ? (
                <Button variant="outline" size={size} disabled>Request Sent</Button>
            ) : (
                <Button 
                    variant="default" 
                    size={size}
                    onClick={onClick} 
                    disabled={isLoading}
                >
                    {isLoading ? "Sending..." : "Join"}
                </Button>
            )}
        </div>
    )
}

export default CommunityJoin