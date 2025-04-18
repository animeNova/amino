"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useGenres } from "@/hooks/actions/genres/useGenres"
import { GenreForm } from "../../../components/forms/genre-form"
import CreativeLoadingScreen from "@/components/ui/loading"

export default function UpdateGenrePage() {
  const router = useRouter()
  const params = useParams();
  const id = params.id as string;
  const {updateGenre,isUpdating,genreQuery,isLoadingGenre} = useGenres({
    genreId : id
  })
  if(isLoadingGenre){
    return <CreativeLoadingScreen showPercentage={false}/>
  }
  return (
        <div className="flex-1">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold">Update Genre Now</h1>
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Update Genre</h2>
              <p className="text-muted-foreground">
                Fill out the form below to update a genre on the platform.
              </p>
            </div>
            <Separator />
            <GenreForm
              onSubmit={(data) => {
                updateGenre(data)
                setTimeout(() => {
                  router.push("/dashboard/admin/genres")
                }, 1000)
              }}
              isEditMode={true}
              isLoading={isUpdating}
              initialData={{
               name : genreQuery?.name,
               description : genreQuery?.description,
               id : genreQuery?.id
              }}
            />
          </div>
        </div>
  )
}
