import React from 'react'
import { Avatar ,AvatarImage } from './avatar';

interface UserAvatarProps {
  url ?: string | null; 
}

const UserAvatar = ({url} : UserAvatarProps) => {
  return (
    <Avatar>
        <AvatarImage src={url ?? '/images/unknown.jpg'} />
    </Avatar>
  )
}

export default UserAvatar
