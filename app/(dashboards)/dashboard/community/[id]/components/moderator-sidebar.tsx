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

export function ModeratorSidebar() {
  const path = usePathname()
  const params = useParams()
  const communityId = params.id as string
  const sidebarLinks = getCommunitySideBarLinks(communityId)

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
                      <Link href={link.href} className={cn(isActive ? 'bg-secondary rounded-md' : '')}>
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
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg?text=SC" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Sarah Chen</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

