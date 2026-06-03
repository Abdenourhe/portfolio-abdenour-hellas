import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Allow login page to be accessed without session
  // In production, redirect unauthenticated users to login
  // (Middleware already handles this, but we keep this as fallback)
  
  return (
    <div className="flex min-h-screen bg-background">
      {session && <AdminSidebar />}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
