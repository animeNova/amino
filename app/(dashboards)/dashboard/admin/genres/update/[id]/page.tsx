"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { GenreForm } from "../../../components/forms/genre-form"
import { useState, useTransition, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { getGenreById } from "@/app/actions/genre/get"
import { UpdateGenreAction } from "@/app/actions/genre/update"
import { Genre } from "@/db/types"

export default function UpdateGenrePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [genreData, setGenreData] = useState<Genre>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const data = await getGenreById(id);
        setGenreData(data);
      } catch (err) {
        setError("Failed to load genre data");
        toast({
          title: "Error",
          description: "Failed to load genre data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenre();
  }, [id, toast]);

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center"><p>Loading genre data...</p></div>;
  }

  if (error || !genreData) {
    return <div className="flex-1 flex items-center justify-center"><p>Error loading genre: {error}</p></div>;
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
            setError(null);
            startTransition(async () => {
              try {
                await UpdateGenreAction(data);
                toast({
                  title: "Success",
                  description: "Genre updated successfully",
                });
                router.push("/dashboard/admin/genres");
              } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to update genre");
                toast({
                  title: "Error",
                  description: "Failed to update genre",
                  variant: "destructive",
                });
              }
            });
          }}
          isEditMode={true}
          isLoading={isPending}
          initialData={{
            name: genreData.name,
            description: genreData.description,
            id: genreData.id
          }}
        />
      </div>
    </div>
  );
}
