'use client';
import { UpdateJoinRequest } from '@/app/actions/join-requests/update';
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';

interface ActionButtonsProps {
    id:string;
    type : 'accepted' | 'reject',
}

const ActionButtons : React.FC<ActionButtonsProps> = ({id,type}) => {
    const router = useRouter();
    const handleRequest = async (id : string) => {
        try {
            await UpdateJoinRequest(id, {
                status : type === 'accepted' ? 'accepted' : 'rejected',
            })
            router.refresh();
        } catch (error) {
            console.error("Failed to create update request:", error);
            toast.error(error instanceof Error ? error.message : "Failed to update join request");
        }
    }
  return (
    <div>
        {
            type === 'accepted' ?
            <Button
            variant="outline"
            size="sm"
            className="h-8 border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
            onClick={() => handleRequest(id)}
          >
            <Check className="mr-1 h-4 w-4" />
            Approve
          </Button> : (
             <Button
             variant="outline"
               size="sm"
               className="h-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
               onClick={() => handleRequest(id)}
             >
               <X className="mr-1 h-4 w-4" />
               Reject
        </Button>
          )
        }
               
                      
    </div>
  )
}

export default ActionButtons
