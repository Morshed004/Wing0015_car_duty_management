"use client";
import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Car, 
  Trash2, 
  Search, 
  Download, 
  Filter, 
  User, 
  Phone, 
  MapPin, 
  ChevronDown,
  Eye,
  EyeOff,
  Map
} from "lucide-react";

export default function EntriesPageUI() {
  const [showForm, setShowForm] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Mock data for UI representation
  const mockEntries = [
    { id: 1, type: "Bus", number: "Dhaka-Metro-Ga-1234", name: "Rahim Ahmed", mobile: "01711000000", dMobile: "01811000000", div: "ঢাকা", dist: "গাজীপুর", thana: "সাভার" },
    { id: 2, type: "Microbus", number: "Chatto-Metro-Ka-5678", name: "Karim Uddin", mobile: "01911000000", dMobile: "01511000000", div: "চট্টগ্রাম", dist: "ফেনী", thana: "সদর" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans antialiased text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER & FORM TOGGLE */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 bg-white rounded-4xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="font-black text-2xl text-slate-800 tracking-tight">Entry Management</h1>
              <p className="text-sm text-slate-400 font-medium">Manage and monitor vehicle registrations</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-sm ${
              showForm 
              ? "bg-slate-900 text-white hover:bg-slate-800" 
              : "bg-emerald-500 text-white hover:bg-emerald-600"
            }`}
          >
            {showForm ? <EyeOff size={18} /> : <Eye size={18} />}
            {showForm ? "Hide Public Form" : "Show Public Form"}
          </button>
        </div>

        {/* SEARCH & FILTERS SECTION */}
        <div className="bg-white rounded-4xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search by vehicle number, name, or phone..." 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none font-medium transition-all"
              />
            </div>
            <div className="flex gap-2">
                <button className="grow flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-4 rounded-2xl font-bold text-sm hover:bg-emerald-100 transition-all">
                    <Download size={18} /> 
                    Export
                </button>
                <button 
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="lg:hidden p-4 bg-slate-100 text-slate-600 rounded-2xl"
                >
                    <Filter size={20} />
                </button>
            </div>
          </div>

          {/* GEOGRAPHIC FILTERS (Desktop Always Visible, Mobile Collapsable) */}
          <div className={`${showMobileFilters ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row items-center gap-4 pt-4 border-t border-slate-50`}>
            <div className="flex items-center gap-2 text-slate-400 mr-2">
                <Map size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Filters:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <GeoSelect label="Division" options={["Dhaka", "Chattogram", "Sylhet"]} />
                <GeoSelect label="District (Zila)" options={["Gazipur", "Feni", "Cumilla"]} />
                <GeoSelect label="Thana" options={["Savar", "Sadar", "Gulshan"]} />
            </div>
          </div>
        </div>

        {/* TABLE (DESKTOP) */}
        <div className="hidden md:block bg-white rounded-4xl overflow-hidden shadow-sm border border-slate-100">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Vehicle</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Representative</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Location Details</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                        <Car size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{entry.number}</span>
                        <span className="text-xs text-slate-400 font-medium">{entry.type}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">{entry.name}</span>
                      <span className="text-xs text-emerald-600 font-bold">{entry.mobile}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-1 text-slate-600">
                      <MapPin size={14} className="text-emerald-500" />
                      {entry.div} • {entry.dist} • {entry.thana}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CARDS (MOBILE) */}
        <div className="md:hidden space-y-4">
          {mockEntries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Car size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800">{entry.number}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{entry.type}</p>
                  </div>
                </div>
                <button className="p-3 bg-red-50 text-red-500 rounded-2xl active:bg-red-500 active:text-white transition-all">
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl">
                <MobileInfo icon={<User size={14}/>} label="Rep" value={entry.name} />
                <MobileInfo icon={<Phone size={14}/>} label="Phone" value={entry.mobile} />
                <MobileInfo icon={<MapPin size={14}/>} label="Loc" value={`${entry.dist}, ${entry.thana}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Custom Select Component for Geography
const GeoSelect = ({ label, options }: { label: string, options: string[] }) => (
  <div className="relative w-full group">
    <select className="w-full appearance-none bg-slate-50 border-none px-4 py-3 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer transition-all pr-10">
      <option value="">All {label}</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-emerald-500" />
  </div>
);

// Mobile Info Helper
const MobileInfo = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
      {icon} {label}
    </div>
    <span className="font-bold text-slate-700">{value}</span>
  </div>
);