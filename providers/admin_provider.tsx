import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from '@/app/(dashboards)/dashboard/admin/components/admin/admin-sidebar'

const AdminProvider = ({
    children
}: {children :Readonly<React.ReactNode>}) => {
  return (
    <SidebarProvider>
        <div className='flex min-h-screen bg-background w-full'>
        <AdminSidebar />
            <main className='space-y-4 w-full' >
                <SidebarTrigger />
                <div className='flex-1'>
                        {children}
                </div>
            </main>
        </div>

    </SidebarProvider>
  )
}

export default AdminProvider