"use client";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import {
  Bus,
  Car,
  ChevronDown,
  FileX,
  Filter,
  LoaderCircle,
  Map,
  MapPin,
  Phone,
  Search,
  User,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type Entry = Doc<"entry">;

export default function EntriesPageUI() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // --- NEW STATE FOR FILTERS ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedThana, setSelectedThana] = useState("");
  const [selectedParkingPosition, setSelectedParkingPosition] = useState("");

  const entries = useQuery(api.entries.get);
  const isLoading = entries === undefined;

  // --- CLIENT-SIDE FILTERING LOGIC ---
  const displayEntries = useMemo(() => {
    if (!entries) return [];

    return entries.filter((entry: Entry) => {
      // Search matching (Vehicle #, Rep Name, or Phone)
      const matchesSearch =
        searchQuery === "" ||
        [
          entry.vehicle_number,
          entry.representative_name,
          entry.representative_mobile,
          entry.driver_mobile,
        ].some((field) =>
          field?.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      // Geography matching
      const matchesDivision =
        !selectedDivision || entry.division === selectedDivision;
      const matchesDistrict =
        !selectedDistrict || entry.district === selectedDistrict;
      const matchesThana = !selectedThana || entry.thana === selectedThana;
      const matchesParkingPosition =
        !selectedParkingPosition || entry.position === selectedParkingPosition;

      return (
        matchesSearch &&
        matchesDivision &&
        matchesDistrict &&
        matchesThana &&
        matchesParkingPosition
      );
    });
  }, [
    entries,
    searchQuery,
    selectedDivision,
    selectedDistrict,
    selectedThana,
    selectedParkingPosition,
  ]);

  // Generate unique options from the FULL dataset (entries), not the filtered one
  const uniqueDivisions = Array.from(
    new Set((entries || []).map((e: Entry) => e.division).filter(Boolean)),
  ).sort() as string[];
  const uniqueDistricts = Array.from(
    new Set((entries || []).map((e: Entry) => e.district).filter(Boolean)),
  ).sort() as string[];
  const uniqueThanas = Array.from(
    new Set((entries || []).map((e: Entry) => e.thana).filter(Boolean)),
  ).sort() as string[];
  const uniqueParkingPositions = Array.from(
    new Set((entries || []).map((e: Entry) => e.position).filter(Boolean)),
  ).sort() as string[];

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDivision("");
    setSelectedDistrict("");
    setSelectedThana("");
    setSelectedParkingPosition("");
  };

  // Count active filters
  const activeFiltersCount = [
    selectedDivision,
    selectedDistrict,
    selectedThana,
    selectedParkingPosition,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 p-4 md:p-8 font-sans antialiased text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* SEARCH & FILTERS SECTION */}
        <div className="bg-white/80 backdrop-blur-sm rounded-4xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 space-y-6 transition-all duration-300">
          {/* Search row - full width input */}
          <div className="w-full">
            <div className="relative group w-full">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-all duration-200"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by vehicle number, name, or phone..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none font-medium transition-all duration-200 hover:bg-slate-100/70 focus:bg-white"
              />
            </div>
          </div>

          {/* Mobile filter button - only visible on mobile, always there but minimal */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all duration-200 active:scale-95"
            >
              <Filter size={18} />
              <span className="text-sm font-medium">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center shadow-sm">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter section - hidden on mobile until toggled */}
          <div
            className={`${showMobileFilters ? "block" : "hidden"} lg:block space-y-4 pt-4 lg:pt-0 border-t border-slate-100 lg:border-t-0 transition-all duration-300`}
          >
            {/* Active filters indicator + clear button - only shows when filters are active */}
            {(selectedDivision ||
              selectedDistrict ||
              selectedThana ||
              selectedParkingPosition ||
              searchQuery) && (
              <div className="flex items-center justify-between lg:justify-start lg:gap-4 pb-3 lg:pb-0">
                <div className="flex items-center gap-2 text-slate-400">
                  <Map size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Active Filters:
                  </span>
                  <span className="text-xs text-slate-600 ml-1 bg-slate-100 px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                </div>
                <button
                  onClick={clearFilters}
                  className="text-xs font-medium text-red-500 flex items-center gap-1 hover:text-red-600 transition-all duration-200 hover:scale-105"
                >
                  <X size={14} /> Clear all
                </button>
              </div>
            )}

            {/* Filter dropdowns - responsive grid with Parking Position */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <GeoSelect
                label="Division"
                value={selectedDivision}
                onChange={setSelectedDivision}
                options={uniqueDivisions}
              />
              <GeoSelect
                label="District (Zila)"
                value={selectedDistrict}
                onChange={setSelectedDistrict}
                options={uniqueDistricts}
              />
              <GeoSelect
                label="Thana"
                value={selectedThana}
                onChange={setSelectedThana}
                options={uniqueThanas}
              />
              <GeoSelect
                label="Parking Position"
                value={selectedParkingPosition}
                onChange={setSelectedParkingPosition}
                options={uniqueParkingPositions}
              />
            </div>
          </div>
        </div>

        {/* TABLE (DESKTOP) - Updated with Parking Position column */}
        <div className="hidden md:block bg-white rounded-4xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-200">
              <thead>
                <tr className="bg-linear-to-r from-slate-50 to-white border-b-2 border-slate-100">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Vehicle
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Representative
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Driver
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Location
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Parking Position
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      <LoaderCircle
                        className="animate-spin mx-auto mb-2 text-emerald-500"
                        size={28}
                      />
                      <p className="font-medium text-sm">
                        Loading vehicle entries...
                      </p>
                    </td>
                  </tr>
                ) : displayEntries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400 shadow-inner">
                          <FileX size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-1 tracking-tight">
                          No Entries Found
                        </h3>
                        <p className="text-slate-500 text-sm font-medium">
                          No results match your search criteria.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayEntries.map((entry: Entry) => (
                    <tr
                      key={entry._id}
                      className="hover:bg-slate-50/80 transition-all duration-200 group cursor-pointer"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all duration-200">
                            {entry.vehicle_type === "Bus" ? <Bus size={20}/> : <Car size={20} />}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">
                              {entry.vehicle_number}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                              {entry.vehicle_type}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">
                            {entry.representative_name}
                          </span>
                          <span className="text-xs text-emerald-600 font-bold">
                            {entry.representative_mobile}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          {entry.driver_mobile ? (
                            <>
                              <div className="flex items-center gap-1">
                                <UserRound
                                  size={12}
                                  className="text-slate-400"
                                />
                                <span className="text-xs text-slate-500 font-medium">
                                  Driver
                                </span>
                              </div>
                              <span className="font-bold text-slate-700">
                                {entry.driver_mobile}
                              </span>
                            </>
                          ) : (
                            <div className="flex flex-col">
                              <span className="text-xs text-amber-600 font-medium">
                                No Driver Info
                              </span>
                              <span className="text-xs text-slate-400">─</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                        <div className="flex items-center gap-1 text-slate-600">
                          <MapPin size={14} className="text-emerald-500" />
                          {entry.division} • {entry.district} • {entry.thana}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span className="text-[14px] font-bold text-slate-700">
                            {entry.position || "Not assigned"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CARDS (MOBILE) - Updated with Parking Position */}
        <div className="md:hidden space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 text-center">
              <LoaderCircle
                className="animate-spin mx-auto mb-2 text-emerald-500"
                size={28}
              />
              <p className="font-medium text-sm text-slate-400">
                Loading entries...
              </p>
            </div>
          ) : displayEntries.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 shadow-inner">
                <FileX size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-1 tracking-tight">
                No Entries Found
              </h3>
              <p className="text-slate-500 text-sm font-medium">
                No results match your search criteria.
              </p>
            </div>
          ) : (
            displayEntries.map((entry: Entry) => (
              <div
                key={entry._id}
                className="bg-white rounded-3xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100 space-y-4 transition-all duration-200 hover:shadow-xl active:scale-98"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-br from-emerald-50 to-emerald-100 text-emerald-600 rounded-xl">
                      {entry.vehicle_type === "Bus" ? <Bus size={20}/> : <Car size={20} />}
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black text-slate-800">
                        {entry.vehicle_number}
                      </h3>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                        {entry.vehicle_type}
                      </p>
                    </div>
                  </div>
                  {/* Parking position badge on mobile */}
                  <div className="px-2 py-1 bg-emerald-50 rounded-lg">
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">
                      {entry.position || "No Position"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 bg-linear-to-br from-slate-50 to-white p-4 rounded-2xl">
                  <MobileInfo
                    icon={<User size={14} />}
                    label="Representative"
                    value={entry.representative_name}
                  />
                  <MobileInfo
                    icon={<Phone size={14} />}
                    label="Phone"
                    value={entry.representative_mobile}
                  />

                  {/* Driver Mobile Section */}
                  {entry.driver_mobile ? (
                    <MobileInfo
                      icon={<UserRound size={14} />}
                      label="Driver"
                      value={entry.driver_mobile}
                    />
                  ) : (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                        <UserRound size={14} /> DRIVER
                      </div>
                      <span className="text-xs text-amber-600 font-medium italic">
                        Not provided
                      </span>
                    </div>
                  )}

                  <MobileInfo
                    icon={<MapPin size={14} />}
                    label="Location"
                    value={`${entry.district}, ${entry.thana}`}
                  />
                  <MobileInfo
                    icon={<Map size={14} />}
                    label="Division"
                    value={entry.division}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Updated GeoSelect with improved visual feedback
const GeoSelect = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) => (
  <div className="relative w-full group">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none bg-slate-50 border-none px-4 py-3 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white outline-none cursor-pointer transition-all duration-200 pr-10 hover:bg-slate-100/70"
    >
      <option value="">All {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <ChevronDown
      size={16}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-emerald-500 transition-all duration-200"
    />
  </div>
);

const MobileInfo = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between text-sm py-1">
    <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
      {icon} {label}
    </div>
    <span className="font-bold text-slate-700 wrap-break-words max-w-[60%] text-right">
      {value}
    </span>
  </div>
);