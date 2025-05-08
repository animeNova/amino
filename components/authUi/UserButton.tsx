'use client';
import React from 'react'
import { Avatar} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from 'next/image';
import { LogOutIcon, Settings, User } from 'lucide-react';
import { LuLayoutDashboard } from "react-icons/lu";

import { signOut } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';

interface UserButtonProps {
    id : string;
    name : string;
    image ?:string | null;
    role : string | null | undefined;
}
 
const UserButton: React.FC<UserButtonProps> = ({
    id,
    name,
    image,
    role
}) => {
  const router = useRouter();
  
  return (
    <DropdownMenu>
       <DropdownMenuTrigger className='pt-2'>
        <Avatar>
          <Image src={image ?? '/images/unknown.jpg'} width={100} height={100} alt={name} className='rounded-full object-cover' />
        </Avatar>
       </DropdownMenuTrigger>
       <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(`/profile/${id}`)}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        {
          role !== 'user' && (
          <DropdownMenuItem onClick={() => router.push('/dashboard/admin')}>
            <LuLayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          )
        }
    
        <DropdownMenuItem>
          <Settings className='hover:rotate-[30deg] transition-transform mr-2 h-4 w-4' />
          <span>Setting</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={async () => {
          await signOut();
          router.refresh();
        }}>
          <LogOutIcon color='#E50046' className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton
