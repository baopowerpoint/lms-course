import AdminSidebar from "@/components/admin/AdminSidebar";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get current user
  const user = await currentUser();

  // Check if user is admin (You might want to add this field to your User model)
  const isAdmin = user?.publicMetadata?.role === "admin";

  // If not admin, redirect to homepage
  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6 md:p-10 bg-gray-50">{children}</div>
    </div>
  );
}
