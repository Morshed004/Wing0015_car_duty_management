"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Car,
  ChevronDown,
  Download,
  FileX,
  Filter,
  LoaderCircle,
  Map,
  MapPin,
  Phone,
  Search,
  User,
  X
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export default function EntriesPageUI() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // --- NEW STATE FOR FILTERS ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedThana, setSelectedThana] = useState("");

  const entries = useQuery(api.entries.get);
  const isLoading = entries === undefined;

  // --- CLIENT-SIDE FILTERING LOGIC ---
  const displayEntries = useMemo(() => {
    if (!entries) return [];

    return entries.filter((entry: any) => {
      // Search matching (Vehicle #, Rep Name, or Phone)
      const matchesSearch = 
        searchQuery === "" || 
        [entry.vehicle_number, entry.representative_name, entry.representative_mobile, entry.driver_mobile]
          .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()));

      // Geography matching
      const matchesDivision = !selectedDivision || entry.division === selectedDivision;
      const matchesDistrict = !selectedDistrict || entry.district === selectedDistrict;
      const matchesThana = !selectedThana || entry.thana === selectedThana;

      return matchesSearch && matchesDivision && matchesDistrict && matchesThana;
    });
  }, [entries, searchQuery, selectedDivision, selectedDistrict, selectedThana]);

  const exportToCSV = () => {
    if (!displayEntries || displayEntries.length === 0) {
      toast.error("No data to export", { description: "There are no entries matching your filters." });
      return;
    }

    const headers = ["Vehicle Type", "Vehicle Number", "Representative Name", "Representative Mobile", "Driver Mobile", "Division", "District", "Thana", "Creation Time"];
    const rows = displayEntries.map((entry: any) => [
      entry.vehicle_type || "",
      entry.vehicle_number || "",
      entry.representative_name || "",
      entry.representative_mobile || "",
      entry.driver_mobile || "",
      entry.division || "",
      entry.district || "",
      entry.thana || "",
      entry._creationTime ? new Date(entry._creationTime).toLocaleString() : ""
    ]);

    const csvContent = [headers.join(","), ...rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `report-${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export Successful");
  };

  // Generate unique options from the FULL dataset (entries), not the filtered one
  const uniqueDivisions = Array.from(new Set((entries || []).map((e: any) => e.division).filter(Boolean))).sort() as string[];
  const uniqueDistricts = Array.from(new Set((entries || []).map((e: any) => e.district).filter(Boolean))).sort() as string[];
  const uniqueThanas = Array.from(new Set((entries || []).map((e: any) => e.thana).filter(Boolean))).sort() as string[];

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDivision("");
    setSelectedDistrict("");
    setSelectedThana("");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans antialiased text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* SEARCH & FILTERS SECTION */}
        <div className="bg-white rounded-4xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by vehicle number, name, or phone..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 outline-none font-medium transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={exportToCSV}
                className="grow flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-4 rounded-2xl font-bold text-sm hover:bg-emerald-100 transition-all"
              >
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

          <div className={`${showMobileFilters ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row items-center gap-4 pt-4 border-t border-slate-50`}>
            <div className="flex items-center justify-between w-full lg:w-auto">
                <div className="flex items-center gap-2 text-slate-400 mr-2">
                    <Map size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Filters:</span>
                </div>
                {(selectedDivision || selectedDistrict || selectedThana || searchQuery) && (
                    <button onClick={clearFilters} className="lg:hidden text-[10px] font-bold text-red-500 flex items-center gap-1">
                        <X size={12}/> CLEAR
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <GeoSelect label="Division" value={selectedDivision} onChange={setSelectedDivision} options={uniqueDivisions} />
              <GeoSelect label="District (Zila)" value={selectedDistrict} onChange={setSelectedDistrict} options={uniqueDistricts} />
              <GeoSelect label="Thana" value={selectedThana} onChange={setSelectedThana} options={uniqueThanas} />
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                    <LoaderCircle className="animate-spin mx-auto mb-2 text-emerald-500" size={28} />
                    <p className="font-medium text-sm">Loading vehicle entries...</p>
                  </td>
                </tr>
              ) : displayEntries.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400 shadow-inner">
                        <FileX size={32} />
                      </div>
                      <h3 className="text-xl font-black text-slate-800 mb-1 tracking-tight">No Entries Found</h3>
                      <p className="text-slate-500 text-sm font-medium">No results match your search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayEntries.map((entry: any) => (
                  <tr key={entry._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                          <Car size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{entry.vehicle_number}</span>
                          <span className="text-xs text-slate-400 font-medium">{entry.vehicle_type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{entry.representative_name}</span>
                        <span className="text-xs text-emerald-600 font-bold">{entry.representative_mobile}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin size={14} className="text-emerald-500" />
                        {entry.division} • {entry.district} • {entry.thana}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* CARDS (MOBILE) */}
        <div className="md:hidden space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center">
              <LoaderCircle className="animate-spin mx-auto mb-2 text-emerald-500" size={28} />
              <p className="font-medium text-sm text-slate-400">Loading entries...</p>
            </div>
          ) : displayEntries.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 shadow-inner">
                <FileX size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-1 tracking-tight">No Entries Found</h3>
              <p className="text-slate-500 text-sm font-medium">No results match your search criteria.</p>
            </div>
          ) : (
            displayEntries.map((entry: any) => (
              <div key={entry._id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                      <Car size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800">{entry.vehicle_number}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{entry.vehicle_type}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl">
                  <MobileInfo icon={<User size={14} />} label="Rep" value={entry.representative_name} />
                  <MobileInfo icon={<Phone size={14} />} label="Phone" value={entry.representative_mobile} />
                  <MobileInfo icon={<MapPin size={14} />} label="Loc" value={`${entry.district}, ${entry.thana}`} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Updated GeoSelect to handle state
const GeoSelect = ({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (val: string) => void }) => (
  <div className="relative w-full group">
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none bg-slate-50 border-none px-4 py-3 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer transition-all pr-10"
    >
      <option value="">All {label}</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-emerald-500" />
  </div>
);

const MobileInfo = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
      {icon} {label}
    </div>
    <span className="font-bold text-slate-700">{value}</span>
  </div>
);