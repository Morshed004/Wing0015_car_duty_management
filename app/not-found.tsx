"use client";
import {
    ArrowLeft,
    Bus,
    Car,
    Compass,
    HelpCircle,
    Home,
    LayoutDashboard,
    MapPin
} from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8 antialiased font-sans">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        
        {/* Animated illustration area */}
        <div className="relative">
          {/* Background decorative circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-20" />
          
          {/* Icon group */}
          <div className="relative flex items-center justify-center gap-4 mb-6">
            <div className="p-5 bg-slate-200 rounded-3xl shadow-inner">
              <Compass size={48} className="text-slate-400" strokeWidth={1.5} />
            </div>
            <div className="p-6 bg-emerald-500 rounded-3xl shadow-lg shadow-emerald-200 rotate-12">
              <Bus size={56} className="text-white" strokeWidth={1.5} />
            </div>
            <div className="p-5 bg-teal-500 rounded-3xl shadow-lg shadow-teal-200 -rotate-12">
              <Car size={48} className="text-white" strokeWidth={1.5} />
            </div>
          </div>

          {/* 404 Text */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-8xl md:text-9xl font-black tracking-tighter">
              <span className="text-slate-800">4</span>
              <div className="relative">
                <span className="text-emerald-500">0</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
              </div>
              <span className="text-slate-800">4</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Page Not Found
            </h1>
            
            <p className="text-slate-500 font-medium max-w-md mx-auto">
              Oops! The vehicle you're looking for seems to have taken a wrong turn. 
              This route doesn't exist in our navigation system.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all active:scale-95"
          >
            <LayoutDashboard size={18} />
            Return to Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        {/* Subtle footer hint */}
        <div className="pt-8">
          <p className="text-xs text-slate-400 font-mono tracking-wide">
            Error 404 · Resource not found in fleet database
          </p>
        </div>
      </div>
    </div>
  );
}