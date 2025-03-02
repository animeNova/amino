import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Pencil, Heart, MessageCircle, Zap } from "lucide-react"

const achievements = [
  {
    id: 1,
    title: "Super Contributor",
    description: "Created over 100 high-quality posts",
    icon: Pencil,
    rarity: "Legendary",
    progress: 100,
    date: "Earned 2 months ago",
  },
  {
    id: 2,
    title: "Rising Star",
    description: "Received 1000+ likes on posts",
    icon: Star,
    rarity: "Epic",
    progress: 100,
    date: "Earned 3 months ago",
  },
  {
    id: 3,
    title: "Community Pillar",
    description: "Made 500+ meaningful comments",
    icon: MessageCircle,
    rarity: "Rare",
    progress: 85,
    date: "In progress",
  },
  {
    id: 4,
    title: "Fan Favorite",
    description: "Gained 1000+ followers",
    icon: Heart,
    rarity: "Epic",
    progress: 75,
    date: "In progress",
  },
  {
    id: 5,
    title: "Power User",
    description: "Logged in for 100 consecutive days",
    icon: Zap,
    rarity: "Rare",
    progress: 100,
    date: "Earned 1 month ago",
  },
]

const rarityColors = {
  Legendary: "text-yellow-500 bg-yellow-500/10",
  Epic: "text-purple-500 bg-purple-500/10",
  Rare: "text-blue-500 bg-blue-500/10",
}

export default function AchievementsList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Achievements</h3>
      </div>

      <div className="grid gap-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg `}>
                  <achievement.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                    <Badge variant="secondary" className={`shrink-0 `}>
                      {achievement.rarity}
                    </Badge>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{achievement.progress}%</span>
                      <span>{achievement.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

