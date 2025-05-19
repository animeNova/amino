'use client';
import { FollowersDialog } from '@/components/dialogs/profile/followers-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useState } from 'react'
import { useParams } from 'next/navigation'; // Import useParams

interface UserStatsProps {
    followers : number;
    following : number;
    posts : number;
    likes : number;
}

const UserStats : React.FC<UserStatsProps> = ({followers,following,likes,posts}) => {
    const [followersDialogOpen, setFollowersDialogOpen] = useState(false)
    const [activeFollowTab, setActiveFollowTab] = useState<"followers" | "following">("followers")
    const params = useParams(); // Get URL parameters
    const slug = params.slug as string; // This is the username/profile ID from the slug

  return (
    <div>
             <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stats</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="text-center cursor-pointer hover:bg-muted rounded-md p-2 transition-colors"
                    onClick={() => {
                      setActiveFollowTab("followers")
                      setFollowersDialogOpen(true)
                    }}
                  >
                    <p className="text-2xl font-bold">{followers}</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div
                    className="text-center cursor-pointer hover:bg-muted rounded-md p-2 transition-colors"
                    onClick={() => {
                      setActiveFollowTab("following")
                      setFollowersDialogOpen(true)
                    }}
                  >
                    <p className="text-2xl font-bold">{following}</p>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{posts}</p>
                    <p className="text-sm text-muted-foreground">Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{likes}</p>
                    <p className="text-sm text-muted-foreground">Likes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <FollowersDialog
                open={followersDialogOpen}
                onOpenChange={setFollowersDialogOpen}
                defaultTab={activeFollowTab}
                profileUsername={slug} // Pass the slug (username) as profileUsername
            />
    </div>
  )
}

export default UserStats
