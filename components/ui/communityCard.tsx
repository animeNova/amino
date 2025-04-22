import React from 'react'
import { Card, CardContent } from './card'
import Image from 'next/image'
import { Avatar, AvatarFallback } from './avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Button } from './button'
import { BorderBeam } from './border-beam'
import { Badge } from './badge'
import Link from 'next/link'

interface CommunityProps {
  id : string; 
  handle : string;
  name: string;
  image?: string;
  memberCount: string | number | bigint; 
  description: string;
}

const CommunityCard : React.FC<CommunityProps> = ({description,id,memberCount,name,image,handle}) => {
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
                      <Button variant="outline" size="sm">
                        Join
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <BorderBeam duration={8} size={300} />
              </Card>
    </div>
  )
}

export default CommunityCard
