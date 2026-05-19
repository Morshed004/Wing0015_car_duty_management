import LoginForm from "@/components/login-form";
import { isAuthenticated } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function Login(){
  const auth = await isAuthenticated();
    if (auth) {
      redirect("/admin");
    }


    return <LoginForm />
} 