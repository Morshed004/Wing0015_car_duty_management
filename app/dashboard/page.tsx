import React from "react";
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
  Globe
} from "lucide-react";

export default function DashboardPage() {
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
          
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all active:scale-95">
            <Copy size={18} />
            Copy Summary Report
          </button>
        </div>

        {/* 2. SUMMARY METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Fleet" value="1,248" icon={<Car />} trend="System active" color="slate" />
          <StatCard title="Buses" value="842" icon={<Bus />} progress={65} color="emerald" />
          <StatCard title="Microbuses" value="406" icon={<Car className="rotate-12" />} progress={35} color="teal" />
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
              <div className="space-y-2">
                <GeoItem label="Dhaka" count={512} color="emerald" />
                <GeoItem label="Chittagong" count={324} color="emerald" />
                <GeoItem label="Sylhet" count={128} color="emerald" />
              </div>
            </div>

            {/* Zila Level */}
            <div className="bg-white rounded-4xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6 text-teal-600">
                <MapPin size={18} />
                <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400">By District (Zila)</h3>
              </div>
              <div className="space-y-2">
                <GeoItem label="Gazipur" count={142} color="teal" />
                <GeoItem label="Narayanganj" count={98} color="teal" />
                <GeoItem label="Cumilla" count={76} color="teal" />
              </div>
            </div>

            {/* Thana Level */}
            <div className="bg-white rounded-4xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6 text-slate-500">
                <Building2 size={18} />
                <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400">By Thana</h3>
              </div>
              <div className="space-y-2">
                <GeoItem label="Savar" count={64} color="slate" />
                <GeoItem label="Tongi" count={42} color="slate" />
                <GeoItem label="Gulshan" count={38} color="slate" />
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
              <BreakdownItem label="Bus" count="842" percentage={65} icon={<Bus />} color="emerald" />
              <BreakdownItem label="Microbus" count="406" percentage={35} icon={<Car />} color="teal" />
            </div>
          </div>

          {/* Graphical Visualization Placeholder */}
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-center items-center relative overflow-hidden">
            <div className="relative z-10 text-center">
               <div className="w-44 h-44 rounded-full border-12 border-emerald-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <span className="block text-5xl font-black leading-none">1.2k</span>
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