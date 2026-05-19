"use client";

import {
  CheckCircle,
  FileSpreadsheet,
  LoaderCircle,
  Plus,
  Power,
  PowerOff,
  Settings,
  Trash2,
  XCircle
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type EntryStatus = "active" | "inactive";

interface DynamicField {
  id: string;
  value: string;
}

export default function AdminClient() {
  const [formStatus, setFormStatus] = useState<EntryStatus>("active");
  const [isToggling, setIsToggling] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Dynamic array inputs
  const [vehicleCategories, setVehicleCategories] = useState<DynamicField[]>([
    { id: "1", value: "" },
  ]);

  // Add new field
  const addField = (type: 'categories' | 'divisions' | 'emails') => {
    const newField = { id: Date.now().toString(), value: "" };
    
    switch(type) {
      case 'categories':
        setVehicleCategories([...vehicleCategories, newField]);
        break;
    }
  };

  // Remove field
  const removeField = (type: 'categories' | 'divisions' | 'emails', id: string) => {
    switch(type) {
      case 'categories':
        if (vehicleCategories.length > 1) {
          setVehicleCategories(vehicleCategories.filter(field => field.id !== id));
        } else {
          toast.error("কমপক্ষে একটি ক্যাটাগরি থাকতে হবে");
        }
        break;
    }
  };

  // Update field value
  const updateField = (type: 'categories' | 'divisions' | 'emails', id: string, value: string) => {
    switch(type) {
      case 'categories':
        setVehicleCategories(vehicleCategories.map(field => 
          field.id === id ? { ...field, value } : field
        ));
        break;
    }
  };

  // Toggle form status
  const handleToggleStatus = async () => {
    setIsToggling(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newStatus = formStatus === "active" ? "inactive" : "active";
      setFormStatus(newStatus);
      toast.success(`ফরম ${newStatus === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"} করা হয়েছে`);
    } catch {
      toast.error("স্ট্যাটাস পরিবর্তন করতে ব্যর্থ হয়েছে");
    } finally {
      setIsToggling(false);
    }
  };

  // Export data
  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate API call to fetch data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Prepare export data
      const exportData = {
        formStatus,
        vehicleCategories: vehicleCategories.map(c => c.value).filter(v => v),
        exportedAt: new Date().toISOString()
      };
      
      // Create CSV content
      const csvRows = [];
      csvRows.push(['Type', 'Value', 'Timestamp'].join(','));
      exportData.vehicleCategories.forEach(val => {
        csvRows.push(['Vehicle Category', val, exportData.exportedAt].join(','));
      });
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admin-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success("ডাটা এক্সপোর্ট সফল হয়েছে");
    } catch {
      toast.error("এক্সপোর্ট করতে ব্যর্থ হয়েছে");
    } finally {
      setIsExporting(false);
    }
  };

  // Save all settings
  const handleSaveSettings = async () => {
    const settings = {
      formStatus,
      vehicleCategories: vehicleCategories.map(c => c.value).filter(v => v)
    };
    
    console.log("Saving settings:", settings);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("সব সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে");
    } catch {
      toast.error("সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে");
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">অ্যাডমিন প্যানেল</h1>
              <p className="text-sm text-slate-500 mt-1">ভেহিকেল এন্ট্রি সিস্টেম ম্যানেজ করুন</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                {isExporting ? (
                  <LoaderCircle className="animate-spin" size={18} />
                ) : (
                  <FileSpreadsheet size={18} />
                )}
                এক্সপোর্ট
              </button>
              <button
                onClick={handleToggleStatus}
                disabled={isToggling}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                  formStatus === "active"
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-slate-600 text-white hover:bg-slate-700"
                } disabled:opacity-50`}
              >
                {isToggling ? (
                  <LoaderCircle className="animate-spin" size={18} />
                ) : formStatus === "active" ? (
                  <Power size={18} />
                ) : (
                  <PowerOff size={18} />
                )}
                {formStatus === "active" ? "ফরম সক্রিয়" : "ফরম নিষ্ক্রিয়"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        

        {/* Status Banner */}
        <div className={`mb-8 rounded-2xl p-4 border ${
          formStatus === "active" 
            ? "bg-emerald-50 border-emerald-200" 
            : "bg-red-50 border-red-200"
        }`}>
          <div className="flex items-center gap-3">
            {formStatus === "active" ? (
              <CheckCircle className="text-emerald-600" size={20} />
            ) : (
              <XCircle className="text-red-600" size={20} />
            )}
            <div>
              <p className={`font-semibold ${
                formStatus === "active" ? "text-emerald-800" : "text-red-800"
              }`}>
                ফরম বর্তমানে {formStatus === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
              </p>
              <p className={`text-sm ${
                formStatus === "active" ? "text-emerald-600" : "text-red-600"
              }`}>
                {formStatus === "active" 
                  ? "ইউজাররা নতুন এন্ট্রি করতে পারবেন" 
                  : "ইউজাররা নতুন এন্ট্রি করতে পারবেন না"}
              </p>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          <div className="bg-linear-to-br from-emerald-600 to-teal-700 p-6 text-white">
            <div className="flex items-center gap-3">
              <Settings className="text-white" size={24} />
              <div>
                <h2 className="text-xl font-bold">ফ্রম সেটিংস</h2>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            
            {/* Vehicle Categories */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">গাড়ীর পার্কিং এর স্থান</h3>
                  <p className="text-sm text-slate-500">এন্ট্রি ফরমে প্রদর্শিত গাড়ীর পার্কিং এর স্থান</p>
                </div>
                <button
                  onClick={() => addField('categories')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all text-sm"
                >
                  <Plus size={16} />
                  নতুন যোগ করুন
                </button>
              </div>
              <div className="space-y-3">
                {vehicleCategories.map((category) => (
                  <div key={category.id} className="flex gap-3">
                    <input
                      type="text"
                      value={category.value}
                      onChange={(e) => updateField('categories', category.id, e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                      placeholder="যেমন: শাপলা চত্বর, দিলকুশা"
                    />
                    <button
                      onClick={() => removeField('categories', category.id)}
                      className="px-3 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            

            {/* Save Button */}
            <div className="pt-6 border-t border-slate-100">
              <button
                onClick={handleSaveSettings}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <Settings size={20} />
                সেটিংস সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}