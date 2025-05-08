import React from 'react'
import { Card, CardContent } from '../ui/card'
import Image from 'next/image'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Button } from '../ui/button'
import { BorderBeam } from '../ui/border-beam'
import { Badge } from '../ui/badge'
import Link from 'next/link'
import { isCommunityMember } from '@/utils/permissions'
import { getUserId } from '@/app/actions/helpers/get-userId'
import CommunityJoin from './community-join'

interface CommunityProps {
  id : string; 
  handle : string;
  name: string;
  image?: string;
  memberCount: string | number | bigint | null;
  description: string;
}

const CommunityCard : React.FC<CommunityProps> =async ({description,id,memberCount,name,image,handle}) => {
  let userId;
  try {
    userId = await getUserId();
  } catch (error) {
    // User is not logged in, continue without userId
    userId = null;
  }
  
  // Only check membership if we have a userId
  const isMember = userId ? await isCommunityMember(userId, id) : false;
  return (
    <div>
        <Card key={name} className="relative overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-48">
                    <Image
                      src={image ?? "/placeholder.svg"}
                      alt={name}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Link href={`/community/${handle}`}>
                      <h3 className="font-bold text-lg">{name}</h3>
                      </Link>
                 
                      <Badge variant="secondary">{memberCount} members</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <Avatar key={i} className="border-2 border-background w-8 h-8">
                            <AvatarImage src={`/placeholder.svg?text=M${i}`} />
                            <AvatarFallback>M{i}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                        {
                          isMember ? 
                          <Button variant="outline">Joined</Button>
                          : 
                          <CommunityJoin communityId={id} />
                        }
                    </div>
                  </div>
                </CardContent>
                <BorderBeam duration={8} size={300} />
              </Card>
    </div>
  )
}

export default CommunityCard
