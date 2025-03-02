import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, PlayCircle, BookMarked } from "lucide-react"

const favorites = {
  anime: [
    {
      id: 1,
      title: "Fullmetal Alchemist: Brotherhood",
      image: "/placeholder.svg?height=200&width=150",
      rating: 10,
      type: "TV",
      episodes: 64,
    },
    {
      id: 2,
      title: "Attack on Titan",
      image: "/placeholder.svg?height=200&width=150",
      rating: 9.5,
      type: "TV",
      episodes: 87,
    },
    {
      id: 3,
      title: "Demon Slayer",
      image: "/placeholder.svg?height=200&width=150",
      rating: 9,
      type: "TV",
      episodes: 44,
    },
  ],
  manga: [
    {
      id: 1,
      title: "Berserk",
      image: "/placeholder.svg?height=200&width=150",
      rating: 10,
      type: "Manga",
      volumes: 41,
    },
    {
      id: 2,
      title: "Chainsaw Man",
      image: "/placeholder.svg?height=200&width=150",
      rating: 9,
      type: "Manga",
      volumes: 14,
    },
  ],
}

export default function FavoritesList() {
  return (
    <div className="space-y-8">
      {/* Favorite Anime */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <PlayCircle className="h-5 w-5 text-primary" />
          Favorite Anime
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.anime.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[3/4] relative group">
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-center p-4">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-bold">{item.rating}</span>
                    </div>
                    <Badge variant="secondary" className="bg-primary/20">
                      {item.type} • {item.episodes} eps
                    </Badge>
                  </div>
                </div>
              </div>
              <CardContent className="p-3">
                <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Favorite Manga */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookMarked className="h-5 w-5 text-primary" />
          Favorite Manga
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.manga.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[3/4] relative group">
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-center p-4">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-bold">{item.rating}</span>
                    </div>
                    <Badge variant="secondary" className="bg-primary/20">
                      {item.type} • {item.volumes} vols
                    </Badge>
                  </div>
                </div>
              </div>
              <CardContent className="p-3">
                <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

