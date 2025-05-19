import type { Metadata } from "next";
import AdminProvider from "@/providers/admin_provider";
import { getUserIdSafe } from "@/app/actions/helpers/get-userId";
import { isSystemAdmin } from "@/utils/permissions";
import { redirect } from "next/navigation";

// Mark the layout as dynamic
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Admin Dashboard",
    description: "Amino Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    const userId = await getUserIdSafe();
    
    if (!userId) {
      return redirect('/unauthorized');
    }
    
    const hasPermission = await isSystemAdmin(userId);
    
    if (!hasPermission) {
      return redirect('/unauthorized');
    }
    
    return (
      <div>
        <AdminProvider>
          {children}
        </AdminProvider>
      </div>
    );
  } catch (error) {
    console.error("Error in admin layout:", error);
    return redirect('/unauthorized');
  }
}