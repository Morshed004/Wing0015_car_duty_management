"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Bus,
  Car,
  LayoutDashboard,
  PieChart,
  TrendingUp,
  Map,
  MapPin,
  Building2,
  Copy,
  ChevronRight,
  Globe,
  LoaderCircle
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const entries = useQuery(api.entries.get);

  if (entries === undefined) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <LoaderCircle className="animate-spin text-emerald-500" size={40} />
        <p className="text-slate-500 font-bold animate-pulse tracking-wide">Loading dashboard insights...</p>
      </div>
    );
  }

  const totalFleet = entries.length;
  const busCount = entries.filter((e) => e.vehicle_type === 'Bus').length;
  const microbusCount = entries.filter((e) => e.vehicle_type === 'Microbus').length;
  const busProgress = totalFleet > 0 ? Math.round((busCount / totalFleet) * 100) : 0;
  const microProgress = totalFleet > 0 ? Math.round((microbusCount / totalFleet) * 100) : 0;

  const toBanglaDigit = (num: number | string) => num.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d as any]);

  const getAll = (key: 'division' | 'district' | 'thana') => {
    const counts = entries.reduce((acc: Record<string, number>, e) => {
      if (!e[key]) return acc;
      acc[e[key]] = (acc[e[key]] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  const allDivisions = getAll('division');
  const allDistricts = getAll('district');
  const allThanas = getAll('thana');

  const handleCopy = () => {

    let report = `📊 গাড়ীর সারাংশ রিপোর্ট\n\n`;
    report += `মোট গাড়ী: ${toBanglaDigit(totalFleet)}\n`;
    report += `বাস: ${toBanglaDigit(busCount)}\n`;
    report += `মাইক্রোবাস: ${toBanglaDigit(microbusCount)}\n\n`;

    report += `📍 বিভাগ অনুযায়ী:\n`;
    allDivisions.length > 0 
      ? allDivisions.forEach(([label, count]) => report += `- ${label}: ${toBanglaDigit(count)}\n`)
      : report += `- তথ্য নেই\n`;
    
    report += `\n📍 জেলা অনুযায়ী:\n`;
    allDistricts.length > 0 
      ? allDistricts.forEach(([label, count]) => report += `- ${label}: ${toBanglaDigit(count)}\n`)
      : report += `- তথ্য নেই\n`;

    report += `\n📍 থানা অনুযায়ী:\n`;
    allThanas.length > 0 
      ? allThanas.forEach(([label, count]) => report += `- ${label}: ${toBanglaDigit(count)}\n`)
      : report += `- তথ্য নেই\n`;

    navigator.clipboard.writeText(report).then(() => {
      toast.success("কপি সম্পন্ন", {
        description: "রিপোর্টটি সফলভাবে কপি করা হয়েছে।"
      });
    }).catch(() => {
      toast.error("কপি ব্যর্থ", {
        description: "রিপোর্টটি কপি করতে সমস্যা হয়েছে।"
      });
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 pt-10 antialiased font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* 1. HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700">
                <LayoutDashboard size={20} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics Dashboard</h1>
            </div>
            <p className="text-slate-500 font-medium">Real-time vehicle distribution and fleet insights</p>
          </div>

          <button onClick={handleCopy} className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all active:scale-95">
            <Copy size={18} />
            Copy Summary Report
          </button>
        </div>

        {/* 2. SUMMARY METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Fleet" value={totalFleet.toLocaleString()} icon={<Car />} trend="System active" color="slate" />
          <StatCard title="Buses" value={busCount.toLocaleString()} icon={<Bus />} progress={busProgress} color="emerald" />
          <StatCard title="Microbuses" value={microbusCount.toLocaleString()} icon={<Car className="rotate-12" />} progress={microProgress} color="teal" />
        </div>

        {/* 3. GEOGRAPHIC DISTRIBUTION (Division, Zila, Thana) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-100">
              <Globe size={20} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Geographic Origin</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Division Level */}
            <div className="bg-white rounded-4xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6 text-emerald-600">
                <Map size={18} />
                <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400">By Division</h3>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {allDivisions.length > 0 ? allDivisions.map(([label, count]) => (
                  <GeoItem key={label as string} label={label as string} count={count as number} color="emerald" />
                )) : <div className="text-slate-400 text-sm">No data available</div>}
              </div>
            </div>

            {/* Zila Level */}
            <div className="bg-white rounded-4xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6 text-teal-600">
                <MapPin size={18} />
                <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400">By District (Zila)</h3>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {allDistricts.length > 0 ? allDistricts.map(([label, count]) => (
                  <GeoItem key={label as string} label={label as string} count={count as number} color="teal" />
                )) : <div className="text-slate-400 text-sm">No data available</div>}
              </div>
            </div>

            {/* Thana Level */}
            <div className="bg-white rounded-4xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6 text-slate-500">
                <Building2 size={18} />
                <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400">By Thana</h3>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {allThanas.length > 0 ? allThanas.map(([label, count]) => (
                  <GeoItem key={label as string} label={label as string} count={count as number} color="slate" />
                )) : <div className="text-slate-400 text-sm">No data available</div>}
              </div>
            </div>
          </div>
        </div>

        {/* 4. BREAKDOWN & VISUALIZATION SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
          {/* List Breakdown */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="text-emerald-600" size={24} />
              <h2 className="text-xl font-bold text-slate-800">Vehicle Breakdown</h2>
            </div>
            <div className="space-y-4">
              <BreakdownItem label="Bus" count={busCount.toLocaleString()} percentage={busProgress} icon={<Bus />} color="emerald" />
              <BreakdownItem label="Microbus" count={microbusCount.toLocaleString()} percentage={microProgress} icon={<Car />} color="teal" />
            </div>
          </div>

          {/* Graphical Visualization Placeholder */}
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-center items-center relative overflow-hidden">
            <div className="relative z-10 text-center">
              <div className="w-44 h-44 rounded-full border-12 border-emerald-500/20 flex items-center justify-center">
                <div className="text-center">
                  <span className="block text-5xl font-black leading-none">{totalFleet > 999 ? (totalFleet / 1000).toFixed(1) + 'k' : totalFleet}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-400 opacity-80 mt-2">Total Units</span>
                </div>
              </div>
              <p className="mt-6 text-slate-400 text-sm font-medium">Fleet status: Optimal</p>
            </div>
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500 rounded-full blur-[80px] opacity-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const StatCard = ({ title, value, icon, progress, trend, color }: any) => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 group hover:shadow-md transition-all">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-4xl font-black text-slate-800 tracking-tight">{value}</h3>
      </div>
      <div className={`p-4 rounded-2xl transition-colors ${color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : color === 'teal' ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-600'}`}>
        {React.cloneElement(icon as React.ReactElement)}
      </div>
    </div>
    {progress ? (
      <div className="mt-6">
        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-2">
          <span>Ratio</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color === 'emerald' ? 'bg-emerald-500' : 'bg-teal-500'}`} style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    ) : (
      <div className="mt-6 text-emerald-600 font-bold text-sm flex items-center gap-1.5">
        <TrendingUp size={16} /> {trend}
      </div>
    )}
  </div>
);

const GeoItem = ({ label, count, color }: { label: string; count: number; color: string }) => (
  <div className="group flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-all cursor-default border border-transparent hover:border-slate-100">
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full transition-transform group-hover:scale-125 ${color === 'emerald' ? 'bg-emerald-500' : color === 'teal' ? 'bg-teal-500' : 'bg-slate-400'}`} />
      <span className="font-bold text-slate-700">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">{count}</span>
      <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
    </div>
  </div>
);

const BreakdownItem = ({ label, count, percentage, icon, color }: any) => (
  <div className="flex items-center justify-between p-5 rounded-3xl border border-slate-50 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all group">
    <div className="flex items-center gap-4">
      <div className={`p-3.5 rounded-2xl transition-all group-hover:scale-110 ${color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 'bg-teal-100 text-teal-700'}`}>
        {React.cloneElement(icon as React.ReactElement)}
      </div>
      <div>
        <p className="font-black text-slate-800 text-lg leading-tight">{label}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Vehicle Category</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-xl font-black text-slate-800">{count}</p>
      <p className="text-xs font-bold text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded-md inline-block mt-1">{percentage}%</p>
    </div>
  </div>
);