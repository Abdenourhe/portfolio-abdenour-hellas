import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="admin-mode flex min-h-screen bg-background">
      {session && <AdminSidebar />}
      <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
