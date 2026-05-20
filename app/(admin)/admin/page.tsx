import AdminClient from "@/components/admin-client";
import { isAuthenticated } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const auth = await isAuthenticated();

  if (!auth) {
    redirect("/login");
  }

  return <AdminClient />;
}
