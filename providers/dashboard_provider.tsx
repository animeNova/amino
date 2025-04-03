import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from '@/components/ui/button'
import { ModeratorSidebar } from '../app/(dashboards)/dashboard/community/[id]/components/moderator-sidebar'

const Provider = ({
    children
}: {children : React.ReactNode}) => {
  return (
    <SidebarProvider>
      <ModeratorSidebar />
      <main className='space-y-4 w-full' >
        <SidebarTrigger />
        <div className=''>
                  {children}
        </div>
      </main>
    </SidebarProvider>
  )
}

export default Provider