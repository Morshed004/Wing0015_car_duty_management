import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-server";

export default async function DashboardPage() {
  const auth = await isAuthenticated();
    console.log(auth)
  if (!auth) {
    redirect("/signup");
  }

  return <div>Protected Dashboard</div>;
}