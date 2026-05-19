"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { LogIn, Mail, Lock, LoaderCircle, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";

// Define the validation schema with Zod
const loginSchema = z.object({
  email: z.email("সঠিক ইমেইল ঠিকানা দিন"),
  password: z.string()
    .min(1, "পাসওয়ার্ড প্রয়োজন")
    .min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const res = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        // Handle specific error cases
        if (res.error.message?.toLowerCase().includes("invalid") || 
            res.error.message?.toLowerCase().includes("credential")) {
          setError("root", {
            type: "manual",
            message: "ইমেইল বা পাসওয়ার্ড ভুল। অনুগ্রহ করে সঠিক তথ্য দিন।",
          });
        } else {
          setError("root", {
            type: "manual",
            message: res.error.message || "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
          });
        }
        return;
      }

      toast.success("সফলভাবে লগইন করেছেন!");
      router.push("/admin");
      router.refresh();
    } catch {
      setError("root", {
        type: "manual",
        message: "কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans antialiased">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 w-full max-w-md overflow-hidden border border-slate-100">
        
        {/* Header Section */}
        <div className="bg-linear-to-br from-emerald-600 to-teal-700 p-8 text-white relative overflow-hidden">
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm">
              <User className="text-white" size={32} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">স্বাগতম</h1>
            <p className="text-emerald-50 text-sm font-medium uppercase tracking-widest opacity-80">
              অ্যাডমিন প্যানেল
            </p>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-900/20 rounded-full blur-3xl"></div>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                ইমেইল ঠিকানা *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="email"
                  {...register("email")}
                  className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50 text-slate-900 border rounded-xl outline-none transition-all ${
                    errors.email 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-slate-200 focus:border-emerald-500"
                  }`}
                  placeholder="admin@example.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                পাসওয়ার্ড *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="password"
                  {...register("password")}
                  className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50 text-slate-900 border rounded-xl outline-none transition-all ${
                    errors.password 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-slate-200 focus:border-emerald-500"
                  }`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Root Error Message */}
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm text-center">
                  {errors.root.message}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isDirty || !isValid}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin" size={22} />
                  লগইন হচ্ছে...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  লগইন করুন
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}