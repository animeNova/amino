import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Star, Trophy, Settings, Sparkles, Calendar } from "lucide-react"
import UserPosts from "./user-posts"
import FavoritesList from "./favorites-list"
import AchievementsList from "./achievements-list"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-primary/20 to-primary/40 relative">
        <img
          src="/placeholder.svg?height=400&width=1200"
          alt="Profile cover"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* Profile Header */}
      <div className="container max-w-6xl px-4">
        <div className="relative -mt-20 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="relative z-20">
              <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                <AvatarImage src="/placeholder.svg?height=128&width=128" alt="SakuraChan" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-2 py-0.5 rounded-md font-bold text-sm">
                Lv.85
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    SakuraChan
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                  </h1>
                  <p className="text-muted-foreground">Anime enthusiast & digital artist</p>
                </div>
                <div className="flex gap-2">
                  <Button className="gap-2">
                    <Users className="h-4 w-4" />
                    Follow
                  </Button>
                  <Button variant="outline">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-medium">2.4k</span>
                  <span className="text-muted-foreground">Followers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="font-medium">156</span>
                  <span className="text-muted-foreground">Following</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="font-medium">42</span>
                  <span className="text-muted-foreground">Achievements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Joined May 2023</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-primary/10">
                  🎨 Digital Artist
                </Badge>
                <Badge variant="secondary" className="bg-primary/10">
                  ✍️ Content Creator
                </Badge>
                <Badge variant="secondary" className="bg-primary/10">
                  🏆 Top Contributor
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b rounded-none">
            <TabsTrigger
              value="posts"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Favorites
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-8">
            <UserPosts />
          </TabsContent>

          <TabsContent value="favorites" className="space-y-8">
            <FavoritesList />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-8">
            <AchievementsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

