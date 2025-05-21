"use client"

import Link from "next/link"
import { BarChart3, Flag, Home, MessageSquare, Settings, ShieldAlert, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { getCommunitySideBarLinks } from "@/constants/community-dashboard-links"
import { useParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/auth/client"
import UserAvatar from "@/components/ui/user-avatar"

export function ModeratorSidebar() {
  const {data} = useSession()
  const path = usePathname()
  const params = useParams()
  const communityId = params.id as string
  const sidebarLinks = getCommunitySideBarLinks
  
  return (
    <Sidebar >
      <SidebarHeader className="border-b px-6 py-3 ">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Mod Dashboard</span>
        </div>
      </SidebarHeader>
      <SidebarContent  >
        <SidebarMenu>
        {
              sidebarLinks.map((link) => {
                const isActive = path.endsWith(link.href);
                return (
                  <SidebarMenuItem className="space-y-3" key={link.href}>
                    <SidebarMenuButton asChild>
                      <Link href={`/dashboard/community/${communityId}/${link.href}`} className={cn(isActive ? 'bg-secondary rounded-md' : '')}>
                        {link.icon}
                        <span>{link.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })
        }
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="flex items-center gap-2">
          <UserAvatar url={data?.user.image} />
          <div className="flex flex-col">
            <span className="text-[.8rem] font-medium">{data?.user.name}</span>
            <span className="text-xs text-muted-foreground">{data?.user.role}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

