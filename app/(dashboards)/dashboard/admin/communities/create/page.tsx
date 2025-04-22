"use client"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CommunityForm } from "../../components/forms/community-form"
import { CreateCommunityAction } from "@/app/actions/community/create"
import { toast } from "@/hooks/use-toast"
import { useState, useTransition } from "react"

export default function CreateCommunityPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
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
            <CommunityForm
              onSubmit={(data) => {
                setError(null);
                startTransition(async () => {
                  try {
                    await CreateCommunityAction(data)
                    toast({title:"success" , description:"Community created successfully"});
                    router.push("/dashboard/admin/communities");
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
