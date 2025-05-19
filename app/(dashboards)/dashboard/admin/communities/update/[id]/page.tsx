'use client';
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import React, { useEffect, useState, useTransition } from "react"
import { CommunityForm } from "../../../components/forms/community-form"
import { toast } from "@/hooks/use-toast";
import { CommunityResult, getCommunityById } from "@/app/actions/community/get";
import { UpdateCommunityAction } from "@/app/actions/community/update";



export default function CreateCommunityPage(){
  const router = useRouter()
  const params = useParams();
  const id = params.id as string;
  const [isPending, startTransition] = useTransition();
  const [communityQuery, setCommunityQuery] = useState<CommunityResult>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const data = await getCommunityById(id);
        setCommunityQuery(data);
      } catch (err) {
        setError("Failed to load Community data");
        toast({
          title: "Error",
          description: "Failed to load Community data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenre();
  }, [id, toast]);

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center"><p>Loading Community data...</p></div>;
  }
  if(error){
    toast({title:"error", description:error});
  }
  return (
        <div className="flex-1">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold">Update your Community</h1>
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Update Community</h2>
              <p className="text-muted-foreground">
                Fill out the form below to update a community on the platform.
              </p>
            </div>
            <Separator />
            <CommunityForm
              onSubmit={(data) => {
                setError(null);
                startTransition(async () => {
                  try {
                    await UpdateCommunityAction({
                      id: id,
                      name: data.name,
                      description: data.description,
                      image: data.image,
                      banner: data.banner,
                      visibility: data.visibility,
                      genre_id: data.genre_id,
                      handle:data.handle,
                      language:data.language,
                    });
                    toast({title:"success" , description:"Community updated successfully"});
                    router.push("/dashboard/admin/communities");
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Failed to update community");
                    toast({title:"error" , description:"Failed to updated community"});                  
                  }
                });
              }}
              isEditMode={true}
              initialData={{
                name: communityQuery?.name,
                description: communityQuery?.description,
                image: communityQuery?.image,
                banner: communityQuery?.banner,
                visibility: communityQuery?.visibility,
                genre_id: communityQuery?.genre_id,
                handle:communityQuery?.handle,
                language:communityQuery?.language,
              }}
              isLoading={isPending}
            />
          </div>
        </div>
  )
}
