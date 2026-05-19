import { redirect } from "next/navigation";
import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";
import AdminClient from "@/components/admin-client";

export default async function AdminPage() {
  const user = await fetchAuthQuery(api.auth.getCurrentUser);


  if (!user) {
    redirect("/loging");
  }

  return <AdminClient />;
}