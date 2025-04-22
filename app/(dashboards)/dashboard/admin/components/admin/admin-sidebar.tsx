"use client"

import Link from "next/link"
import {Shield} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { Badge } from "@/components/ui/badge"
import { AdminSideBarLinks } from "@/constants/admin-sidebar-links"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useSession } from "@/lib/auth/client"
import UserAvatar from "@/components/ui/user-avatar"


export function AdminSidebar() {
  const {data} = useSession()
  const path = usePathname()
  return (
    <Sidebar className="overflow-hidden" >
      <SidebarHeader className="border-b px-6 py-3">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Super Admin</span>
          <Badge className="ml-2 bg-primary">v1.0</Badge>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <SidebarMenu>

            {
              AdminSideBarLinks.map((link) => {
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
