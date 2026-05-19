"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { CheckCircle, Power, PowerOff, Trash2, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type Entry = Doc<"entry">;

export default function AdminClient() {
  const isFormActive = useQuery(api.form_status.get);
  const formStatusUpdate = useMutation(api.form_status.toggle);
  // --- NEW STATE FOR FILTERS ---
  const [searchQuery] = useState("");
  const [selectedDivision] = useState("");
  const [selectedDistrict] = useState("");
  const [selectedThana] = useState("");

  const entries = useQuery(api.entries.get);

  const savedPositions = useQuery(
    api.parkingPosition.getPositions,
  ) as Doc<"parking_position">[];
  // Dynamic array inputs
  const [vehiclePosition, setVehiclePosition] = useState("");

  const savePositions = useMutation(api.parkingPosition.addPositions);
  const deletePosition = useMutation(api.parkingPosition.deletePosition);

  const formStatus = isFormActive ?? false;

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

      return (
        matchesSearch && matchesDivision && matchesDistrict && matchesThana
      );
    });
  }, [entries, searchQuery, selectedDivision, selectedDistrict, selectedThana]);

  // Export CSV
  const exportToCSV = () => {
    if (!displayEntries || displayEntries.length === 0) {
      toast.error("No data to export", {
        description: "There are no entries matching your filters.",
      });
      return;
    }

    const headers = [
      "Vehicle Type",
      "Vehicle Number",
      "Representative Name",
      "Representative Mobile",
      "Driver Mobile",
      "Division",
      "District",
      "Thana",
      "Creation Time",
    ];
    const rows = displayEntries.map((entry: Entry) => [
      entry.vehicle_type || "",
      entry.vehicle_number || "",
      entry.representative_name || "",
      entry.representative_mobile || "",
      entry.driver_mobile || "N/A",
      entry.division || "",
      entry.district || "",
      entry.thana || "",
      entry._creationTime ? new Date(entry._creationTime).toLocaleString() : "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `report-${new Date().toLocaleDateString()}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export Successful");
  };

  // Toggle form status
  const handleToggleStatus = async () => {
    try {
      await formStatusUpdate({
        show: !(isFormActive ?? false),
      });

      toast.success(
        `ফরম ${(isFormActive ?? false) ? "নিষ্ক্রিয়" : "সক্রিয়"} করা হয়েছে`,
      );
    } catch {
      toast.error("স্ট্যাটাস পরিবর্তন করতে ব্যর্থ হয়েছে");
    }
  };

  // Save all settings
  const handleSavePosition = async () => {
    if (!vehiclePosition.trim()) {
      toast.error("দয়া করে একটি পার্কিং স্থান লিখুন");
      return;
    }

    try {
      await savePositions({
        positions: vehiclePosition.trim(),
      });
      setVehiclePosition("");

      toast.success("পার্কিং স্থান সফলভাবে সংরক্ষণ করা হয়েছে");
    } catch {
      toast.error("পার্কিং স্থান সংরক্ষণ করতে ব্যর্থ হয়েছে");
    }
  };

  const handleDelete = async (id: Id<"parking_position">) => {
    const confirmDelete = window.confirm("Do you want to delete?");

    if (!confirmDelete) return;

    await deletePosition({ id });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                অ্যাডমিন প্যানেল
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                ভেহিকেল এন্ট্রি সিস্টেম ম্যানেজ করুন
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all disabled:opacity-50"
              onClick={exportToCSV}
              >
                এক্সপোর্ট
              </button>
              <button
                onClick={handleToggleStatus}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                  formStatus === true
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-slate-600 text-white hover:bg-slate-700"
                } disabled:opacity-50`}
              >
                {isFormActive === undefined ? (
                  <>Loading...</>
                ) : (
                  <>
                    {isFormActive ? (
                      <Power size={18} />
                    ) : (
                      <PowerOff size={18} />
                    )}

                    {isFormActive ? "ফরম সক্রিয়" : "ফরম নিষ্ক্রিয়"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        {isFormActive !== undefined && (
          <div
            className={`mb-8 rounded-2xl p-4 border ${
              isFormActive
                ? "bg-emerald-50 border-emerald-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {isFormActive ? (
                <CheckCircle className="text-emerald-600" size={20} />
              ) : (
                <XCircle className="text-red-600" size={20} />
              )}

              <div>
                <p
                  className={`font-semibold ${
                    isFormActive ? "text-emerald-800" : "text-red-800"
                  }`}
                >
                  ফরম বর্তমানে {isFormActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                </p>

                <p
                  className={`text-sm ${
                    isFormActive ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {isFormActive
                    ? "ইউজাররা নতুন এন্ট্রি করতে পারবেন"
                    : "ইউজাররা নতুন এন্ট্রি করতে পারবেন না"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Form */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          <div className="p-6 md:p-8 space-y-8">
            {/* Vehicle Categories */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    গাড়ীর পার্কিং এর স্থান
                  </h3>
                  <p className="text-sm text-slate-500">
                    এন্ট্রি ফরমে প্রদর্শিত গাড়ীর পার্কিং এর স্থান
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={vehiclePosition}
                    onChange={(e) => setVehiclePosition(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="যেমন: শাপলা চত্বর, দিলকুশা"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div>
              <button
                onClick={handleSavePosition}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                পার্কিং এর স্থান যোগ করুন
              </button>
            </div>

            {/* Display Positions Section */}
            {savedPositions && savedPositions.length > 0 && (
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      সংরক্ষিত পার্কিং স্থানসমূহ
                    </h3>
                    <p className="text-sm text-slate-500">
                      মোট {savedPositions.length} টি স্থান সংরক্ষিত আছে
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  {savedPositions.map((position) => (
                    <div
                      key={position._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
                        <span className="text-slate-700 font-medium truncate">
                          {position.position}
                        </span>
                      </div>

                      <button
                        className="self-end sm:self-center p-2 flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-500 active:bg-red-800 rounded-lg transition-all"
                        aria-label={`Delete position ${position.position}`}
                        onClick={() => {
                          handleDelete(position._id);
                        }}
                      >
                        <Trash2 size={18} />
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {savedPositions && savedPositions.length === 0 && (
              <div className="pt-6 border-t border-slate-100">
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-slate-500">
                    কোনো পার্কিং স্থান সংরক্ষিত নেই
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    উপরে একটি স্থান যোগ করুন
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
