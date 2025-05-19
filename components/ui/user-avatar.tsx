import React from 'react'
import { Avatar ,AvatarImage } from './avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  url ?: string | null; 
  className ?: string;
}

const UserAvatar = ({url,className} : UserAvatarProps) => {
  return (
    <Avatar className={cn(className)}>
        <AvatarImage src={url ?? '/images/unknown.jpg'} className='object-cover w-full' />
    </Avatar>
  )
}

export default UserAvatar
