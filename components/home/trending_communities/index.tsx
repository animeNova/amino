import { BorderBeam } from '@/components/magicui/border-beam'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Heading from '@/components/ui/heading'
import Image from 'next/image'
import React from 'react'



const trendingCommunities = [
    {
      name: "Photography Enthusiasts",
      members: "15.2k",
      description: "Share your best shots, get feedback, and learn from fellow photographers.",
      image: "https://thumbs.dreamstime.com/b/anime-boy-aesthetic-image-wallpaper-cute-cartoon-anime-wallpaper-342273503.jpg",
    },
    {
      name: "Foodies United",
      members: "12.8k",
      description: "For people who love cooking, eating, and sharing culinary experiences.",
      image: "https://thumbs.dreamstime.com/b/anime-boy-aesthetic-image-wallpaper-cute-cartoon-anime-wallpaper-342273503.jpg",
    },
    {
      name: "Tech Innovators",
      members: "10.5k",
      description: "Discuss the latest in technology, coding, and digital innovation.",
      image: "https://thumbs.dreamstime.com/b/anime-boy-aesthetic-image-wallpaper-cute-cartoon-anime-wallpaper-342273503.jpg",
    },
  ]

const index = () => {
  return (
    <section className="container py-8 md:py-12">
        <Heading>
            Trending Communities
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingCommunities.map((community) => (
              <Card key={community.name} className="relative overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-48">
                    <Image
                      src={community.image || "/placeholder.svg"}
                      alt={community.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg">{community.name}</h3>
                      <Badge variant="secondary">{community.members} members</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{community.description}</p>
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
            ))}
          </div>
    </section>
  )
}

export default index
