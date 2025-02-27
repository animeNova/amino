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
import { signOut } from '@/lib/auth/clinet';
interface UserButtonProps {
    id : string;
    name : string;
    image ?:string | null;
}
 
const UserButton : React.FC<UserButtonProps> = ({
    id,
    name,
    image
}) => {
  
  return (
    <DropdownMenu>
       <DropdownMenuTrigger>
        <Avatar>
          <Image src={image || '/images/unknown.jpg'} width={100} height={100} alt={name} className='rounded-full object-cover' />
          </Avatar>
       </DropdownMenuTrigger>
       <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User />
          Profile
          </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className='hover:rotate-[30deg] transition-transform' />
          Setting
          </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOutIcon color='#E50046' />
          Logout
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton
