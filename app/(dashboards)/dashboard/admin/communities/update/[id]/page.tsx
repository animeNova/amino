'use client';
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCommunitys } from "@/hooks/actions/communitys/useCommunitys"
import React from "react"
import { CommunityForm } from "../../../components/forms/community-form"



export default function CreateCommunityPage(){
  const router = useRouter()
  const params = useParams();
  const id = params.id as string;
  const {updateCommunity,isUpdating} = useCommunitys()
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
                ("Community created:", data)
                updateCommunity(data)
                // // In a real app, you would create the community and then redirect
                setTimeout(() => {
                  router.push("dashboard/admin/communities")
                }, 1000)
              }}
              isEditMode={true}
              initialData={{
              name : "test",
              description : "test",
              image : "https://sapphire-changing-rodent-630.mypinata.cloud/ipfs/bafkreihlywkqmqntzb7yj2oc3hsgqvzbrbmncko7bdca744zawy22ychky",
              genre_id : "tech",
              banner : "https://sapphire-changing-rodent-630.mypinata.cloud/ipfs/bafkreihlywkqmqntzb7yj2oc3hsgqvzbrbmncko7bdca744zawy22ychky",
              handle: "test",
              id : id,
              language:"ar"  ,
              visibility : 'private'        
              }}
              isLoading={isUpdating}
            />
          </div>
        </div>
  )
}
