'use client';
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { GenreForm } from "../../components/forms/genre-form"
import { CreateGenreAction } from "@/app/actions/genre/create";
import { useTransition, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function CreateGenrePage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  return (
        <div className="flex-1">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold">Create New Community</h1>
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Create Community</h2>
              <p className="text-muted-foreground">
                Fill out the form below to create a new community on the platform.
              </p>
            </div>
            <Separator />
            {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md">{error}</div>}
            <GenreForm
              onSubmit={(data) => {
                setError(null);
                startTransition(async () => {
                  try {
                    await CreateGenreAction(data);
                    toast({title:"success" , description:"Community created successfully"});
                    router.push("/dashboard/admin/genres");
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Failed to create community");
                    toast({title:"error" , description:"Failed to create community"});                  }
                });
              }}
              isEditMode={false}
              isLoading={isPending}
            />
          </div>
        </div>
  )
}
